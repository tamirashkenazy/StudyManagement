const mongoose = require("mongoose");

const status = 'waiting should_pay approved declined '.split(' ')
const onlyEnglishAndHebrew = /^[ -A-Za-z\u0590-\u05fe]+$/i
const onlyNumbers = /^[-0-9\b]+$/;

const Schema = mongoose.Schema;
const StudentSchema = new Schema({
    _id : {type : String, required : true, match: onlyNumbers, minlength: 9, maxlength: 9},
    group: {type : String, default : 'normal', required : true},
    requests : {type : [{course_id : {type : String,  required : true, match: onlyNumbers },
                 course_name : {type : String,  required : true, match: onlyEnglishAndHebrew},
                 number_of_hours : {type : String,  required : true, match: onlyNumbers},
                 updated_at : {type : Date,  required : true, default: Date.now()},
                 status : { type : String, required : true, enum: status, default: 'waiting'}}], default : []}
}, { timestamps:true }, );

// defult status
// only approved courses
// messege of errors in hebrew
// all the return will be in same format 
// all the aviable teacher by status - lessons schema
// equal === instead of ==
// remove console.log 

module.exports = mongoose.model('Student', StudentSchema);