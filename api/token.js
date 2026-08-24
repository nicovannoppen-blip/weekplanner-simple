```javascript
export default async function handler(req, res) {

    const cookies = parseCookies(req);

    // =====================================================
    // Als de gebruiker bewust heeft uitgelogd:
    // geen automatisch opnieuw inloggen.
    // =====================================================

    if (cookies.logged_out === "true") {

        return res.status(401).json({
            error: "logged_out"
        });
    }

    // =========================
    // Refresh token ophalen
    // =========================

    const refreshToken = cookies.refresh_token;

    if (!refreshToken) {

        return res.status(401).json({
            error: "not_logged_in"
        });
    }

    // =========================
    // Google instellingen
    // =========================

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {

        return res.status(500).json({
            error: "Google OAuth instellingen ontbreken"
        });
    }

    // =========================
    // Nieuw access token ophalen
    // =========================

    const response = await fetch(
        "https://oauth2.googleapis.com/token",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body: new URLSearchParams({

                client_id: clientId,

                client_secret: clientSecret,

                refresh_token: refreshToken,

                grant_type: "refresh_token"
            })
        }
    );

    const data = await response.json();

    // =========================
    // Google fout
    // =========================

    if (!response.ok) {

        console.error(
            "Google refresh token fout:",
            data
        );

        // Als Google zegt dat de refresh token ongeldig
        // of ingetrokken is, is opnieuw aanmelden nodig.

        return res.status(401).json({
            error: "refresh_failed"
        });
    }

    // =====================================================
    // Google kan eventueel een nieuwe refresh token
    // terugsturen. Als dat gebeurt, bewaren we die.
    // =====================================================

    if (data.refresh_token) {

        const secure = process.env.NODE_ENV === "production"
            ? " Secure;"
            : "";

        res.setHeader(
            "Set-Cookie",
            `refresh_token=${encodeURIComponent(data.refresh_token)}; HttpOnly; Path=/; SameSite=Lax;${secure}`
        );
    }

    // =========================
    // Access token teruggeven
    // =========================

    return res.status(200).json({

        access_token: data.access_token,

        expires_in: data.expires_in
    });
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

        const value =
            cookie.substring(index + 1).trim();

        cookies[key] =
            decodeURIComponent(value);
    });

    return cookies;
}
```
