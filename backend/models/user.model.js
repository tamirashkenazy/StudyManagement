const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    _id :  {type : String, default : '', required : true},
    password : {type : String, required : true},
    email : { type: String, required : true },
    first_name : {type : String,  required : true },
    last_name : {type : String, required : true },
    tel_number : { type : String, required : true },
    gender : { type : String , required : true },
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

module.exports = mongoose.model('User', UserSchema);