const mongoose = require("mongoose");

const status = 'waiting pay approved'.split(' ')

const onlyNumbers = /^[-0-9\b]+$/;

const Schema = mongoose.Schema;
const StudentSchema = new Schema({
    _id :  {type : String, default : '', required : true, match: onlyNumbers, minlength: 9, maxlength: 9},
    requests : [{course_id : {type : String,  required : true, match: onlyNumbers },
                 number_of_hours : {type : String,  required : true, match: onlyNumbers},
                 status : { type : String, required : true, enum: status}}]
}, { timestamps:true }, );


module.exports = mongoose.model('Student', StudentSchema);