import {Router} from "express";
import UserSchema from "./models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import withAuth from "./middleware.js";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import axios from "axios";
import {MongoClient} from "mongodb";


const secret = 'mySecret';
// should not be hardcoded. irl should use env variable

<<<<<<< HEAD


const mongo_auth_uri = 'mongodb://127.0.0.1:27017/auth';
mongoose.connect(mongo_auth_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {

=======
const mongo_auth_uri = 'mongodb://localhost:27017/auth';
const authConn = mongoose.createConnection(mongo_auth_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
>>>>>>> main
    if (err) {
        throw err;
    } else {
        console.log(`Successfully connected to ${mongo_auth_uri}`);
    }
});

const router = Router();

router.use(cookieParser());


router.get('/manage', withAuth, function (req, res) {
    // 先withAuth，不通过直接给401
    // const client = new MongoClient("mongodb://localhost:27017/")
    // let bookingInfo = [];
    // async function run() {
    //     try {
    //         function myFunc (obj) {
    //             if (obj["emailAddress"] === req.email) {
    //                 delete obj["creditCardNumber"];
    //                 delete obj["_id"];
    //                 delete obj["billingAddress"];
    //                 delete obj["CVV_CVC"];
    //                 delete obj["cardExpiry"];
    //                 delete obj["emailAddress"];
    //                 delete obj["creditCardNumber"];
    //                 bookingInfo.push(obj);
    //             }
    //         }
    //         await client.connect();
    //         // database and collection code goes here
    //         const db = client.db("hotelBookingSystem");
    //         const coll = db.collection("bookings");
    //         // find code goes here
    //         const cursor = coll.find();
    //         // iterate code goes here
    //         await cursor.forEach(myFunc);
    //     } finally {
    //         // Ensures that the client will close when you finish/error
    //         await client.close();
    //     }
    // }
    // run().catch(console.dir).then(
    //     () => {
    //         res.send(bookingInfo);
    //     }
    // );


    // currently a hardcoded email, do replace it with the queried email.
    let bookingInfo = [];

    axios.get('http://localhost:5000/getbookings/' + 'testing.out@gmail.com')
    .then(response => {
        console.log('requested data received!')
        bookingInfo = response.data
        console.log(bookingInfo);
    })
    .catch((error) => {
        console.log(error);
    });


})

router.get('/login', function (req, res) {
    res.send('welcome!');
});

// POST route to register a user
// this is a testing function
router.post('/register', function (req, res) {
    const {email, password} = req.body;
    const User = authConn.model('Users', UserSchema)
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
            pass: 'ItsHiddenNow', // I believe this should not be hardcoded. Not to mention UPLOAD IT TO GITHUB!
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
                        expiresIn: 60 * 3 * 2000
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