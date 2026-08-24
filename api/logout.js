```javascript
export default function handler(req, res) {

    const secure = process.env.NODE_ENV === "production"
        ? " Secure;"
        : "";

    // =====================================================
    // BELANGRIJK:
    //
    // We verwijderen de refresh_token NIET.
    //
    // Google geeft bij een volgende OAuth-login namelijk
    // niet gegarandeerd opnieuw een refresh token.
    //
    // We markeren de gebruiker lokaal als uitgelogd.
    // =====================================================

    res.setHeader(
        "Set-Cookie",
        `logged_out=true; Max-Age=31536000; Path=/; SameSite=Lax;${secure}`
    );

    return res.status(200).json({
        success: true
    });
}
```
