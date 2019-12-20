const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const genders = 'male female'.split(' ')
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

/** https://mongoosejs.com/docs/schematypes.html - example for validation
var numberSchema = new Schema({
  integerOnly: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i'
  }
});
var doc = new Number();
doc.integerOnly = 2.001;
doc.integerOnly; // 2
doc.i; // 2
doc.i = 3.001;
doc.integerOnly; // 3
doc.i; // 3
 */



UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.checkPassword = function(password) {
  return password.length >= 4;
};

module.exports = mongoose.model('User', UserSchema);