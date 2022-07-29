import otpGenerator from "otp-generator";

let otp = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false});

console.log(otp)