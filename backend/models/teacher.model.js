const mongoose = require("mongoose");

const status = 'waiting approved declined'.split(' ')
const onlyNumbers = /^[-0-9\b]+$/;
const onlyEnglishAndHebrew = /^[A-Za-z\u0590-\u05fe]+$/i

const Schema = mongoose.Schema;
const TeacherSchema = new Schema({
    _id :  {type : String, required : true, match: onlyNumbers, minlength: 9, maxlength: 9},
    name : {type : String, required : true},
    // list of course number
    teaching_courses : [{course_id : {type : String,  required : true, match: onlyNumbers },
                        course_name : { type : String, required : true, minlength: 2 },
                        hours_already_done : {type : String,  required : true, match: onlyNumbers, default: '0'}}],
    hours_available : {type: [Date], default:[]},
    hours_per_week : [{week : {type : String, required : true},
                        booked_hours : {type : Number, required : true, default : 0}}],
    // list of course number
    teaching_requests : [{course_id : {type : String,  required : true, match: onlyNumbers },
                        course_name : {type : String,  required : true},
                        updated_at : {type : Date,  required : true, default: Date.now()},
                        status : { type : String, required : true, enum: status, default: 'waiting'}}],
    grades_file : {name : {type : String, minlength: 2, default : null},
                    data :{type : Buffer, default : null}},
}, { timestamps:true }, );


module.exports = mongoose.model('Teachers', TeacherSchema);
