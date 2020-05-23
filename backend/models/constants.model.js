const mongoose = require("mongoose");
const onlyNumbers = /^[-0-9\b]+$/;
const validEmailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

const Schema = mongoose.Schema;
const ConstantsSchema = new Schema({
    unique : {type : String, default: "constants", unique: true},
    lesson_price : { type : String, match: onlyNumbers, default: "50" },
    student_fee : { type : String, match: onlyNumbers, default: "30" },
    admin_mail : { type: String, required : true, unique: true, match: validEmailRegex, default: "studymng@gmail.com" },
    annual_budget : { type : String, match: onlyNumbers, default: "5000" }
}, { timestamps:true }, );


module.exports = mongoose.model('Constants', ConstantsSchema);