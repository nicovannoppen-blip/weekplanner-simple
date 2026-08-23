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

    // =========================
    // CALLBACK
    // =========================

    if (req.query.code) {

        const code = req.query.code;

        // State controleren
        const cookies = parseCookies(req);
        const savedState = cookies.oauth_state;

        if (!savedState || savedState !== req.query.state) {
            return res.status(400).send("Ongeldige OAuth state.");
        }

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

        if (!tokenResponse.ok || !tokens.refresh_token) {

            console.error(tokens);

            return res.status(500).send(
                "Google gaf geen refresh token terug. Controleer de OAuth instellingen."
            );
        }

        // Refresh token veilig bewaren in httpOnly cookie
        const secure = process.env.NODE_ENV === "production"
            ? " Secure;"
            : "";

        res.setHeader("Set-Cookie", [
            `refresh_token=${encodeURIComponent(tokens.refresh_token)}; HttpOnly; Path=/; SameSite=Lax;${secure}`,
            `oauth_state=; Max-Age=0; Path=/; SameSite=Lax;${secure}`
        ]);

        return res.redirect("/");
    }

    // =========================
    // START LOGIN
    // =========================

    const state = crypto.randomUUID();

    const secure = process.env.NODE_ENV === "production"
        ? " Secure;"
        : "";

    res.setHeader("Set-Cookie",
        `oauth_state=${state}; HttpOnly; Max-Age=600; Path=/; SameSite=Lax;${secure}`
    );

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/calendar.readonly",
        access_type: "offline",
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
