const mongoose = require("mongoose");
const onlyNumbers = /^[0-9\b]+$/;

const Schema = mongoose.Schema;
const CoursesSchema = new Schema({
    name : { type : String, required : true, minlength: 2, unique: true },
    number : { type : String, required : true, match: onlyNumbers, unique: true },
}, { timestamps:true }, );


module.exports = mongoose.model('Courses', CoursesSchema);