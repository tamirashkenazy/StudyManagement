const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TeacherRequestsSchema = new Schema({
   // course : 
   // status : 
}, { timestamps:true }, );

module.exports = mongoose.model('TeacherRequests', TeacherRequestsSchema);