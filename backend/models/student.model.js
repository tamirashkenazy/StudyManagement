const mongoose = require("mongoose");

const status = 'waiting payed approved declined'.split(' ')
const onlyNumbers = /^[-0-9\b]+$/;

const Schema = mongoose.Schema;
const StudentSchema = new Schema({
    _id :  {type : String, default : '', required : true, match: onlyNumbers, minlength: 9, maxlength: 9},
    name : {type : String, required : true},
    group : {name: {type : String, default : 'כללי'},
            approved_hours : {type: String, match: onlyNumbers, default : '4'}},   
    requests : [{course_id : {type : String,  required : true, match: onlyNumbers },
                 course_name : { type : String, required : true, minlength: 2},
                 updated_at : {type : Date,  required : true, default: Date.now()},
                 number_of_hours : {type : String,  required : true, match: onlyNumbers},
                 status : { type : String, required : true, enum: status, default: 'waiting'}}],
    courses : [{course_id : {type : String,  required : true, match: onlyNumbers },
                course_name : { type : String, required : true, minlength: 2 },
                approved_hours : {type : String,  required : true, match: onlyNumbers},
                wating_hours : {type : String,  required : true, match: onlyNumbers},
                hours_able_to_book : {type : String,  required : true, match: onlyNumbers},
                hours_already_done : {type : String,  required : true, match: onlyNumbers, default: '0'}}] 
}, { timestamps:true }, );


module.exports = mongoose.model('Student', StudentSchema);