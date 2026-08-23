export default async function handler(req, res) {

    const cookies = parseCookies(req);
    const refreshToken = cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({
            error: "not_logged_in"
        });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    const response = await fetch(
        "https://oauth2.googleapis.com/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
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

    if (!response.ok) {

        console.error(data);

        return res.status(401).json({
            error: "refresh_failed"
        });
    }

    return res.status(200).json({
        access_token: data.access_token,
        expires_in: data.expires_in
    });
}


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
