const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/sutd";

MongoClient.connect(url, function (err, db) {
    const dbo = db.db("sutd");
    dbo.createCollection("students")

    const myobj = [{student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    }, {student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0}, {
        student_id: 1004890, average_grade: 0, full_name: "sprCoder", grades: [], term: 0
    },];
    dbo.collection("students").insertMany(myobj)
});