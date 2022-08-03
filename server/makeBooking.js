import {Router} from "express";
import mongoose from "mongoose";
import BookingSchema from "./models/BookingData.js";


const bookings_uri = 'mongodb://localhost:27017/hotelBookingSystem';
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
        // .then(() => console.log(newBooking))
        .catch(err => console.log(err));

    // let bookInfo = [];

    // axios.get('http://localhost:5000/getbookings/' + 'testing.out@gmail.com')
    // .then(response => {
    //     console.log('requested data received!')
    //     bookInfo = response.data
    //     console.log(bookInfo);
    // })
    // .catch((error) => {
    //     console.log(error);
    // });


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