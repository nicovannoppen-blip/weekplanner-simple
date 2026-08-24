import crypto from "crypto";

export default async function handler(req, res) {

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({
            error: "Google OAuth instellingen ontbreken"
        });
    }

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const redirectUri = protocol + "://" + host + "/api/auth";

    const cookies = parseCookies(req);

    // ==========================================
    // GOOGLE CALLBACK
    // ==========================================

    if (req.query.code) {

        const code = req.query.code;

        // OAuth state controleren
        const savedState = cookies.oauth_state;

        if (!savedState || savedState !== req.query.state) {
            return res.status(400).send("Ongeldige OAuth state.");
        }

        // Code omwisselen voor Google tokens
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: new URLSearchParams({
                    code: code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code"
                })
            }
        );

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {

            console.error(
                "Google token fout:",
                tokens
            );

            return res.status(500).send(
                "Google kon de login niet voltooien."
            );
        }

        console.log(
            "Google token antwoord:",
            {
                access_token: !!tokens.access_token,
                refresh_token: !!tokens.refresh_token,
                expires_in: tokens.expires_in
            }
        );

        // ==========================================
        // REFRESH TOKEN
        // ==========================================

        let refreshToken = tokens.refresh_token;

        // Google geeft soms geen nieuwe refresh token.
        // Als er al één bestaat in de cookie, behouden we die.
        if (!refreshToken && cookies.refresh_token) {
            refreshToken = cookies.refresh_token;

            console.log(
                "Bestaande refresh token behouden."
            );
        }

        // Als er helemaal geen refresh token beschikbaar is,
        // kunnen we de agenda niet langdurig blijven gebruiken.
        if (!refreshToken) {

            console.error(
                "Geen refresh token ontvangen en geen bestaande refresh token beschikbaar."
            );

            return res.status(500).send(
                "Google gaf geen refresh token terug. De Google-autorisatie moet één keer opnieuw worden verleend."
            );
        }

        // ==========================================
        // LOGIN COOKIE INSTELLEN
        // ==========================================

        const secure =
            process.env.NODE_ENV === "production"
                ? " Secure;"
                : "";

        const refreshCookie =
            "refresh_token=" +
            encodeURIComponent(refreshToken) +
            "; HttpOnly; Path=/; SameSite=Lax;" +
            secure;

        const stateCookie =
            "oauth_state=; Max-Age=0; Path=/; SameSite=Lax;" +
            secure;

        res.setHeader(
            "Set-Cookie",
            [
                refreshCookie,
                stateCookie
            ]
        );

        return res.redirect("/");
    }

    // ==========================================
    // START LOGIN
    // ==========================================

    const state = crypto.randomUUID();

    const secure =
        process.env.NODE_ENV === "production"
            ? " Secure;"
            : "";

    const stateCookie =
        "oauth_state=" +
        state +
        "; HttpOnly; Max-Age=600; Path=/; SameSite=Lax;" +
        secure;

    res.setHeader(
        "Set-Cookie",
        stateCookie
    );

    const params = new URLSearchParams({

        client_id: clientId,

        redirect_uri: redirectUri,

        response_type: "code",

        scope:
            "https://www.googleapis.com/auth/calendar.readonly",

        access_type: "offline",

        // Google moet opnieuw toestemming vragen.
        // Dit is belangrijk om een refresh token te kunnen verkrijgen.
        prompt: "consent",

        state: state
    });

    const googleUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        params.toString();

    return res.redirect(googleUrl);
}


// ==========================================
// COOKIE PARSER
// ==========================================

function parseCookies(req) {

    const header = req.headers.cookie || "";

    const cookies = {};

    header.split(";").forEach(function(cookie) {

        const index = cookie.indexOf("=");

        if (index === -1) {
            return;
        }

        const key =
            cookie.substring(0, index).trim();

        const value =
            cookie.substring(index + 1).trim();

        cookies[key] =
            decodeURIComponent(value);
    });

    return cookies;
}
