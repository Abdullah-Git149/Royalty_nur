const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(400).json({ status: 0, msg: "Unautorized" })
    }

    const token = req.headers['authorization'].split(' ')[1]
    
    jwt.verify(token, process.env.KEY, (err, user) => {
        if (err) {
            const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
            return res.status(400).json({ status: 0, message: message })
        }
        req.payload = user
      
        next()
    })
}

module.exports = auth