import {Router} from "express";
import mongoose from "mongoose";
import BookingSchema from "./models/BookingData.js";


const bookings_uri = 'mongodb://127.0.0.1:27017/hotelBookingSystem';
const bookingsConn = mongoose.createConnection(bookings_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        throw err;
    } else {
        console.log(`Successfully connected to ${bookings_uri}`);
    }
});

const Booking = bookingsConn.model('Bookings', BookingSchema);
const router = Router();

router.post('/booking', function (req, res) {
    let newBooking = req.body;
    newBooking.emailChecking = newBooking.emailAddress;
    console.log('received!');

    async function addBooking(booking) {

        const nextBooking = new Booking(booking);
        await nextBooking.save().then(() => console.log("New booking added!"));
        console.log(nextBooking);
    }

    addBooking(newBooking)
        .then(() => res.send(newBooking))
        .catch(err => console.log(err));
});

router.post('/cancelBooking', function (req, res) {
    const {bookingID} = req.body
    Booking.deleteOne({_id: bookingID}, function (err) {
        console.log("deleting booking: " + bookingID + "...")
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get('/getbookings/:email', function (req, res) {
    let userEmail = req.params.email;
    let retrievedBookings = [];
    console.log(userEmail);

    async function findBooking(email) {

        console.log(email)
        const cursor = await Booking.find({'emailAddress': email});
        cursor.forEach(function (doc) {
            retrievedBookings.push(doc);
        });
    }

    findBooking(userEmail)
        .then(() => res.json(retrievedBookings))
        .catch(err => console.log(err));

})

export default router;