const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.body.token;
    if (!token) {
        return res.status(401).send({ message: "No has pasado un token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(403).send({ message: "Token invalido o vencido, revisa si el .env tiene el secreto" });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;