const mongoose = require("mongoose");
const onlyNumbers = /^[-0-9\b]+$/;

const Schema = mongoose.Schema;
const ConstantsSchema = new Schema({
    uniqe : {type : String, default: "constants", unique: true},
    lesson_price : { type : String, match: onlyNumbers },
    annual_budget : { type : String, match: onlyNumbers }
}, { timestamps:true }, );


module.exports = mongoose.model('Constants', ConstantsSchema);