const jwt = require('jsonwebtoken');

// Check for jwt to see if user is logged in
module.exports = function(req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Acces Denied!');

    try {
        const verified = jwt.verify(token, process.env.SEC);

        req.account = veried;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}