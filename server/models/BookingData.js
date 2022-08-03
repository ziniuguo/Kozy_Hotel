import mongoose from "mongoose";
import Cryptr from "cryptr";


const cryptr = new Cryptr('bookingSecret');

const BookingSchema = new mongoose.Schema({
    imgUri: {type: String},
    hotelName: {type: String, required: true},
    destinationID: {type: String, required: true},
    hotelID: {type: String, required: true},
    checkinDate: {type: String, required: true},
    checkoutDate: {type: String, required: true},
    guests: {type: String, required: true},
    salutation: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    emailAddress: {type: String, required: true},
    specialRequests: {type: String},
    creditCardNumber: {type: String, required: true},
    cardExpiry: {type: String, required: true},
    CVV_CVC: {type: String, required: true},
    billingAddress: {type: String, required: true}
});

BookingSchema.post('find', function (result) {

    result.forEach(function (doc) {
        doc.firstName = cryptr.decrypt(doc.firstName);
        doc.lastName = cryptr.decrypt(doc.lastName);
        doc.phoneNumber = cryptr.decrypt(doc.phoneNumber);
        doc.creditCardNumber = cryptr.decrypt(doc.creditCardNumber);
        doc.cardExpiry = cryptr.decrypt(doc.cardExpiry);
        doc.CVV_CVC = cryptr.decrypt(doc.CVV_CVC);
        doc.billingAddress = cryptr.decrypt(doc.billingAddress);
    });

})


BookingSchema.pre('save', function (next) {
    const doc = this;


    const firstName = doc.firstName;
    doc.firstName = cryptr.encrypt(firstName);

    const lastName = doc.lastName;
    doc.lastName = cryptr.encrypt(lastName);

    const phoneNumber = doc.phoneNumber;
    doc.phoneNumber = cryptr.encrypt(phoneNumber);

    // const emailAddress = doc.emailAddress;
    // doc.emailAddress = cryptr.encrypt(emailAddress);

    const creditCardNumber = doc.creditCardNumber;
    doc.creditCardNumber = cryptr.encrypt(creditCardNumber);

    const cardExpiry = doc.cardExpiry;
    doc.cardExpiry = cryptr.encrypt(cardExpiry);

    const CVV_CVC = doc.CVV_CVC;
    doc.CVV_CVC = cryptr.encrypt(CVV_CVC);

    const billingAddress = doc.billingAddress;
    doc.billingAddress = cryptr.encrypt(billingAddress);

    next();

});


export default BookingSchema;
