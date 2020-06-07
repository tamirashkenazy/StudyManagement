const mongoose = require("mongoose");
//https://stackoverflow.com/questions/34546272/cannot-find-module-bcrypt/41878322
//npm install -g windows-build-tools, npm install -g node-gyp
//npm install bcrypt
var bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const genders = 'male female'.split(' ')
password_validate = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z!@#$%^&*]{8,}$/
onlyNumbers = /^[0-9\b]+$/;
validEmailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
onlyEnglishAndHebrew = /^[A-Za-z\u0590-\u05fe]+$/i

const UserSchema = new Schema({
    _id :  {type : String, default : '', required : true, match: onlyNumbers, minlength: 9, maxlength: 9},
    password : {type : String, required : true, minlength: 4},
    email : { type: String, required : true, unique: true, match: validEmailRegex},
    first_name : {type : String,  required : true, match: onlyEnglishAndHebrew},
    last_name : {type : String, required : true, match: onlyEnglishAndHebrew},
    tel_number : { type : String, required : true, match:  onlyNumbers, minlength: 10, maxlength: 10},
    gender : { type : String , required : true, enum: genders},
    isTeacher : { type : Boolean, required : true},
    isStudent : { type : Boolean, required : true},
    isAdmin: { type : Boolean, required : true },
    study_year : {type : String, required : true},
}, { timestamps:true }, 
);

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.checkPassword = function(password) {
    return password_validate.test(password)
};

module.exports = mongoose.model('User', UserSchema);