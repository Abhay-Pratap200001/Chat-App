import JWT from "jsonwebtoken"

export const genrateToken = (userId, res) => {
    const token = JWT.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    res.cookie("jwt", token, {
       maxAge: 7 * 24 * 60 * 1000,
       httpOnly: true,  //prevent XXS attacks cross-site scripting attack
       sameSite: "strict",  // CSRF attacks cross-site request forgery attacks
       secure: process.env.NODE_ENV !== "development"
    })

    return token
}