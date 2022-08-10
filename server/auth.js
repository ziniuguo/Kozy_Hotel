import {Router} from "express";
import UserSchema from "./models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import withAuth from "./WithAuth.js";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import axios from "axios";
import rateLimit from "express-rate-limit";


const secret = 'mySecret';
// should not be hardcoded. irl should use env variable

const mongo_auth_uri = 'mongodb://127.0.0.1:27017/auth';
const authConn = mongoose.createConnection(mongo_auth_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        throw err;
    } else {
        console.log(`Successfully connected to ${mongo_auth_uri}`);
    }
});

const User = authConn.model('Users', UserSchema)

const router = Router();
router.use(cookieParser());

router.get('/manage', withAuth, function (req, res) {
    // withAuth first, if not pass res 401.
    let bookingInfo = [];

    axios.get('http://localhost:5000/getbookings/' + req.email)
        .then(response => {
            console.log('get booking: requested data received!')
            bookingInfo = response.data;
            res.status(200).send(bookingInfo);
        })
        .catch((error) => {
            console.log('internal error @ getBooking in Manage ' + error);
            res.sendStatus(500);
        });
});

// POST route to register a user
// this is a testing function, users are not expected to use it to register.
router.post('/register', function (req, res) {
    const {email, password} = req.body;
    const user = new User({email, password});
    user.save(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send("Error registering");
        } else {
            res.status(200).send("register success");
        }
    });
});

// create limiter for OTP
const OtpLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 secs
    max: 1, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message:
        'Too many accounts created from this IP, please try again later',
    statusCode: 429, // this is actually by default
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/OTP', OtpLimiter, async function (req, res) {
    const {email} = req.body;
    const transporter = nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "smtp.gmail.com",
        auth: {
            user: 'sprcatroll@gmail.com',
            pass: 'dlmlgufzngomfqof', // I believe this should not be hardcoded. Not to mention UPLOAD IT TO GITHUB!
            // However, I will still just leave it here.
        },
        secure: true,
    });
    const OTP_password = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
    const mailOptions = {
        from: 'sprcatroll@gmail.com',
        to: email,
        subject: 'Your one time password for login',
        text: '[Expiring in 3 minutes] Your one time password is: ' + OTP_password
    };

    // delete if it exists already
    User.deleteOne({email: email}, function (err) {
        console.log("deleting existing OTP email: " + email + "...")
        if (err) {
            res.status(500).json({error: 'Error deleting {email, otp}'});
        } else {
            // add to database
            const user = new User({email: email, password: OTP_password});
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
                        expiresIn: "2h"
                        // Eg: 60, "2 days", "10h", "7d".
                        // A numeric value is interpreted as a seconds count.
                        // If you use a string be sure you provide the time units (days, hours, etc),
                        // otherwise milliseconds unit is used by default ("120" is equal to "120ms").
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