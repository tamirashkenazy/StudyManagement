const mongoose = require("mongoose");
const onlyNumbers = /^[-0-9\b]+$/;

const Schema = mongoose.Schema;
const CoursesSchema = new Schema({
    name : { type : String, required : true, minlength: 2, unique: true },
    _id : { type : String, required : true, match: onlyNumbers },
}, { timestamps:true }, );


module.exports = mongoose.model('Courses', CoursesSchema);