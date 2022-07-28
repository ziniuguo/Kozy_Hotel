import {Router} from "express";
import User from "./models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import withAuth from "./middleware.js";
import cookieParser from "cookie-parser";

const secret = 'mySecret';
// should not be hardcoded. irl should use env variable

const mongo_uri = 'mongodb://localhost:27017/auth';
mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (err) {
        throw err;
    } else {
        console.log(`Successfully connected to ${mongo_uri}`);
    }
});

const router = Router();

router.use(cookieParser());

router.get('/manage', withAuth, function (req, res) {
    // 先withAuth，不通过直接给401
    res.send('ni deng lu le. zai zhe li chu li database de stuff.');
})

router.get('/checkToken', withAuth, function (req, res) {
    res.sendStatus(200);
})

router.get('/login', function (req, res) {
    res.send('welcome!');
});

// POST route to register a user
router.post('/register', function (req, res) {
    const {email, password} = req.body;
    const user = new User({email, password});
    user.save(function (err) {
        console.log(err)
        if (err) {
            res.status(500)
                .send("Error registering");
        } else {
            res.status(200).send("register success");
        }
    });
});

router.post('/authenticate', function (req, res) {
    const {email, password} = req.body;
    User.findOne({email}, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'error User.findOne'});
        } else if (!user) {
            // no existence of user
            res.status(401).json({error: 'Incorrect email or password'});
        } else {
            // success find user
            user.isCorrectPassword(password, function (err, same) {
                if (err) {
                    res.status(500).json({error: 'error user.isCorrectPassword'})
                } else if (!same) {
                    // incorrect pwd
                    res.status(401).json({error: 'Incorrect email or password'})
                } else {
                    // Issue token
                    const payload = {email};
                    const token = jwt.sign(payload, secret, {
                        expiresIn: 60 * 3
                    });
                    // use cookie
                    res.cookie('token', token, {
                        // httpOnly cookie helps secure the client from
                        // certain vulnerabilities such as XSS.
                        httpOnly: true
                    }).sendStatus(200);
                }
            })
        }
    })
})

export default router;