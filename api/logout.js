export default function handler(req, res) {

    const secure = process.env.NODE_ENV === "production"
        ? " Secure;"
        : "";

    res.setHeader(
        "Set-Cookie",
        `refresh_token=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax;${secure}`
    );

    return res.status(200).json({
        success: true
    });
}
