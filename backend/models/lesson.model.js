const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const LessonSchema = new Schema({
    course : { course_name : { type : String, required : true}, course_id : { type : String, required : true} },
    date : { type: Date, required : true },
    teacher : { teacher_id : {type : String,  required : true }, teacher_name :  {type : String,  required : true }},
    student :{ student_id : {type : String,  required : true }, student_name :  {type : String,  required : true }},
    status : { type : String, required : true },
}, { timestamps:true }, );
// should make the Date as an index
module.exports = mongoose.model('Lessons', LessonSchema);