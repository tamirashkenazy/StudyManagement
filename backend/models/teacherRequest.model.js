const mongoose = require("mongoose");

let Course = require('../models/course.model').schema;
const state = 'waiting approved rejected'.split(' ')
const onlyNumbers = /^[0-9\b]+$/;

const Schema = mongoose.Schema;
const TeacherRequestsSchema = new Schema({
   teacherId :  {type : String, default : '', required : true, match: onlyNumbers, minlength: 9, maxlength: 9},
   courseNumber : { type : String, required : true, match: onlyNumbers },
   status : { type : String , required : true, enum: state},
}, { timestamps:true }, );

module.exports = mongoose.model('TeacherRequests', TeacherRequestsSchema);