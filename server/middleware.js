import jwt from "jsonwebtoken";
const secret = 'mySecret';

const withAuth = function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        // auth以后会有cookie，如果没cookie就send这个
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.email = decoded.email;
                next();
            }
        })
    }
}

export default withAuth;