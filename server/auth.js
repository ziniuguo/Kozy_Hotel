import {Router} from "express";
import User from "./models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import withAuth from "./middleware.js";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";


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
// this is a testing function
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

router.post('/OTP', async function (req, res) {
    const {email} = req.body;
    const transporter = nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "smtp.gmail.com",
        auth: {
            user: 'sprcatroll@gmail.com',
            pass: 'dlmlgufzngomfqof', // I believe this should not be hardcoded. Not to mention UPLOAD IT TO GITHUB!
        },
        secure: true,
    });
    const password = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
    const mailOptions = {
        from: 'sprcatroll@gmail.com',
        to: email,
        subject: 'Your one time password for login',
        text: '[Expiring in 3 minutes] Your one time password is: ' + password
    };

    // delete if it exists already
    await User.deleteOne({email});
    // add to database
    const user = new User({email, password});
    user.save(function (err) {
        if (err) {
            console.log(err)
            res.status(500).json({error: 'Error saving {email, otp}'});
        } else {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).json({error: 'error sending email, internal server err'});
                } else {
                    console.log('Email sent: ' + info.response);
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.post('/authenticate', function (req, res) {
    const {email, password} = req.body;
    User.findOne({email}, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'error User.findOne @Auth'});
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
                        // login status expire after 3 min
                        // cookie
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