export default function handler(req, res) {

    // We verwijderen bewust NIET de refresh_token.
    //
    // Google geeft bij een volgende login niet gegarandeerd
    // opnieuw een refresh token.
    //
    // De bestaande refresh token moet daarom behouden blijven.

    return res.status(200).json({
        success: true
    });
}
