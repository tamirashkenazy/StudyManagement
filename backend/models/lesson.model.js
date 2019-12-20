const mongoose = require("mongoose");

const onlyNumbers = /^[0-9\b]+$/;
const onlyEnglishAndHebrew = /^[A-Za-z\u0590-\u05fe]+$/i
const status = 'report done cancel'.split(' ')

const Schema = mongoose.Schema;
const LessonSchema = new Schema({
    course : { course_name : { type : String, required : true, match: onlyEnglishAndHebrew },
               course_id : { type : String, required : true, match:  onlyNumbers} },
    date : { type: Date, required : true },
    teacher : { teacher_id : {type : String,  required : true, match: onlyNumbers, minlength: 9, maxlength: 9 },
                teacher_name :  {type : String,  required : true,  match: onlyEnglishAndHebrew }},
    student :{ student_id : {type : String,  required : true, match: onlyNumbers, minlength: 9, maxlength: 9 }, 
               student_name :  {type : String,  required : true,  match: onlyEnglishAndHebrew }},
    status : { type : String, required : true, enum: status},
}, { timestamps:true }, );
// should make the Date as an index
module.exports = mongoose.model('Lessons', LessonSchema);