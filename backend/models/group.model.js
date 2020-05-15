const mongoose = require("mongoose");
const onlyNumbers = /^[-0-9\b]+$/;

const Schema = mongoose.Schema;
const GroupsSchema = new Schema({
    name : { type : String, required : true, minlength: 2, unique: true },
    approved_hours : { type : String, required : true, match: onlyNumbers },
}, { timestamps:true }, );


module.exports = mongoose.model('groups', GroupsSchema);