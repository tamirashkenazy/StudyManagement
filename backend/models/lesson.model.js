const mongoose = require("mongoose");

const onlyNumbers = /^[-0-9\b]+$/;
const onlyEnglishAndHebrew = /^[ A-Za-z\u0590-\u05fe]+$/i
const status = 'waiting done canceled'.split(' ')

const Schema = mongoose.Schema;
const LessonSchema = new Schema({
    date : { type: Date, required : true },
    teacher : { teacher_id : {type : String,  required : true, match: onlyNumbers, minlength: 9, maxlength: 9 },
                teacher_name :  {type : String,  required : true,  match: onlyEnglishAndHebrew }},
    student :{ student_id : {type : String,  required : true, match: onlyNumbers, minlength: 9, maxlength: 9 }, 
               student_name :  {type : String,  required : true,  match: onlyEnglishAndHebrew }},
    status : { type : String, required : true, enum: status, default: 'waiting'},
    course : {course_id: {type : String, required : true, match: onlyNumbers},
                course_name: {type : String, required : true, minlength: 2}},
    teacher_reported :  { type : Boolean,  default: false}
}, { timestamps:true }, );


module.exports = mongoose.model('Lessons', LessonSchema);