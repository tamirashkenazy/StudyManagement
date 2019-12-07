const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id_number : { type: Number, unique : true, required : true, minlength : 9, },
    first_name : {type : String,  required : true },
    last_name : {type : String, required : true },
    isTeacher : { type : Boolean, required : true},
    isStudent : { type : Boolean, required : true},
    isAdmin: { type : Boolean, required : true }
}, {
    timestamps : true ,
},
);

const User = mongoose.model('User', userSchema);

module.exports = User;