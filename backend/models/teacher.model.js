const mongoose = require("mongoose");
let Course = require('../models/course.model').schema;
let Lessons = require('../models/lesson.model').schema;
let TeacherRequest = require('../models/teacherRequest.model').schema;

const onlyNumbers = /^[0-9\b]+$/;
const onlyEnglishAndHebrew = /^[A-Za-z\u0590-\u05fe]+$/i

const Schema = mongoose.Schema;
const TeacherSchema = new Schema({
    _id :  {type : String, default : '', required : true, match: onlyNumbers, minlength: 9, maxlength: 9},
    bank_name : {type : String, required : true },
    bank_branch :  {type : String, required : true },
    bank_account_number : {type : String,  required : true, match: onlyNumbers},
    bank_account_name : {type : String, required : true, match: onlyEnglishAndHebrew},
    teaching_courses :[Course],
    hours_available : [Date],
    teaching_requests : [TeacherRequest],
    lessons : [Lessons],
    grades_file : {type : String, required : false },
}, { timestamps:true }, );


module.exports = mongoose.model('Teachers', TeacherSchema);