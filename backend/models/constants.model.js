const mongoose = require("mongoose");
const onlyNumbers = /^[-0-9\b]+$/;
const validEmailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

const Schema = mongoose.Schema;
const ConstantsSchema = new Schema({
    unique : {type : String, default: "constants", unique: true},
    lesson_price : { type : String, match: onlyNumbers },
    admin_mail : { type: String, required : true, unique: true, match: validEmailRegex },
    annual_budget : { type : String, match: onlyNumbers }
}, { timestamps:true }, );


module.exports = mongoose.model('Constants', ConstantsSchema);