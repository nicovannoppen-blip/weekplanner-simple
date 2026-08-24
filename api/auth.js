```javascript
import crypto from "crypto";

export default async function handler(req, res) {

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({
            error: "Google OAuth instellingen ontbreken"
        });
    }

    const redirectUri =
        `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/api/auth`;

    const cookies = parseCookies(req);

    // =========================
    // CALLBACK VAN GOOGLE
    // =========================

    if (req.query.code) {

        const code = req.query.code;

        // -------------------------
        // State controleren
        // -------------------------

        const savedState = cookies.oauth_state;

        if (!savedState || savedState !== req.query.state) {
            return res.status(400).send("Ongeldige OAuth state.");
        }

        // -------------------------
        // Code omwisselen voor tokens
        // -------------------------

        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code"
                })
            }
        );

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {

            console.error("Google token fout:", tokens);

            return res.status(500).send(
                "Google kon de login niet voltooien."
            );
        }

        // =====================================================
        // BELANGRIJK:
        // Google geeft niet altijd opnieuw een refresh_token.
        //
        // Als er al een bestaande refresh token is,
        // behouden we die.
        // =====================================================

        let refreshToken = tokens.refresh_token;

        if (!refreshToken && cookies.refresh_token) {
            refreshToken = cookies.refresh_token;
        }

        if (!refreshToken) {

            console.error(
                "Google gaf geen refresh token en er is geen bestaande refresh token."
            );

            return res.status(500).send(
                "Google gaf geen refresh token terug. Meld de app eventueel opnieuw aan via Google."
            );
        }

        // =========================
        // COOKIES INSTELLEN
        // =========================

        const secure = process.env.NODE_ENV === "production"
            ? " Secure;"
            : "";

        const cookieHeaders = [

            // Refresh token bewaren
            `refresh_token=${encodeURIComponent(refreshToken)}; HttpOnly; Path=/; SameSite=Lax;${secure}`,

            // OAuth state verwijderen
            `oauth_state=; Max-Age=0; Path=/; SameSite=Lax;${secure}`,

            // Eventuele lokale logout-status verwijderen
            `logged_out=; Max-Age=0; Path=/; SameSite=Lax;${secure}`
        ];

        res.setHeader("Set-Cookie", cookieHeaders);

        console.log(
            tokens.refresh_token
                ? "Nieuwe Google refresh token ontvangen."
                : "Bestaande Google refresh token behouden."
        );

        return res.redirect("/");
    }

    // =========================
    // START LOGIN
    // =========================

    const state = crypto.randomUUID();

    const secure = process.env.NODE_ENV === "production"
        ? " Secure;"
        : "";

    // Bij opnieuw inloggen mag de lokale logout-status verdwijnen.
    res.setHeader(
        "Set-Cookie",
        [
            `oauth_state=${state}; HttpOnly; Max-Age=600; Path=/; SameSite=Lax;${secure}`,
            `logged_out=; Max-Age=0; Path=/; SameSite=Lax;${secure}`
        ]
    );

    const params = new URLSearchParams({

        client_id: clientId,

        redirect_uri: redirectUri,

        response_type: "code",

        scope:
            "https://www.googleapis.com/auth/calendar.readonly",

        // Wij willen een refresh token kunnen gebruiken
        // wanneer de gebruiker niet aanwezig is.
        access_type: "offline",

        // Google toont opnieuw toestemming wanneer nodig.
        prompt: "consent",

        state
    });

    const googleUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        params.toString();

    return res.redirect(googleUrl);
}


// =========================
// COOKIE PARSER
// =========================

function parseCookies(req) {

    const header = req.headers.cookie || "";

    const cookies = {};

    header.split(";").forEach(cookie => {

        const index = cookie.indexOf("=");

        if (index === -1) return;

        const key = cookie.substring(0, index).trim();
        const value = cookie.substring(index + 1).trim();

        cookies[key] = decodeURIComponent(value);
    });

    return cookies;
}
```
