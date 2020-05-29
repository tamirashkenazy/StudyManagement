const router = require('express').Router();
const nodemailer = require('nodemailer');
const mail_pass = process.env.mail_pass
const mail_user = process.env.mail_user

let User = require('../models/user.model');
let Constants = require('../models/constants.model');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mail_user,
      pass: mail_pass
    }
  });




//https://stackoverflow.com/questions/34546272/cannot-find-module-bcrypt/41878322
//npm install -g windows-build-tools, npm install -g node-gyp
//npm install bcrypt
var bcrypt = require('bcrypt')

router.route('/').get((req, res) => {
    //mongoose method to find all the users
    User.find()
    .then(users => res.send({success : true, message: users}))
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get user name by id
 * request parameters:
 *      /<user_id>/fullName
 */
router.route('/:id/fullName').get((req,res) => {
    User.findById((req.params.id), (err,user) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!user || user.length === 0) {
            return res.send({success : false, message:"!המשתמש אינו קיים במערכת"})
        } else {
            var full_name = [user.first_name, user.last_name]
            full_name = full_name.join(" ");
            return res.send({success : true, message: full_name})
        }
    })
})


/**
 * Send a qeustion to admin by mail.
 * request parameters:
 *      /mailToAdmin
 * request body:
 *      None
 */
router.route('/mailToAdmin').post((req, res) => {
    let user = req.body.user
    let message = req.body.message
    Constants.find({}).then((constant) => {
        let admin_mail_for_qa = constant[0].admin_mail_for_qa
        let QA_mail = constant[0].QA_mail
        let mailDetails = {
            from: QA_mail,
            to: admin_mail_for_qa,
            subject: `שאלה מאת ${user.first_name} ${user.last_name}`,
            html: `<!DOCTYPE html>
            <html>
                    <body direction="rtl">
                        <h1>פרטי הסטודנט:</h1>
                        <div>
                        תז: ${user._id}
                        <br>טלפון: ${user.tel_number}
                        <br>מייל: ${user.email}
                        </div>
                        <hr></hr>
                        <h2>תוכן ההודעה:</h2>
                        <div>${message}</div>
                        <a href="mailto:${user.email}?subject= לכבוד ${user.first_name} ${user.last_name}  &cc=${admin_mail_for_qa}"><h2><b>להשבה לשולח לחץ כאן</b><h2/></a>
                    </body>
            </html>
            `
          };
        transporter.sendMail(mailDetails, function(error, info){
            if (error) {
                return res.send({success : false, message: error})
            } else {
                return res.send({success : true, message: "ההודעה נשלחה בהצלחה"})
            }
        })
    })
});

// the /:id is like a variable
router.route('/:id').get((req,res) => {
    User.findById((req.params.id), (err,user) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (user && !Array.isArray(user)) {
            return res.send({success : true, message:user})
        } else {
            return res.send({success : false, message:"!המשתמש אינו קיים במערכת"})
        }
    })
})

// should see this, validation in the backend, https://medium.com/@Keithweaver_/building-a-log-in-system-for-a-mern-stack-39411e9513bd
router.route('/add').post((req, res) => {
    const { body } = req;
    const { _id, first_name, last_name, tel_number, gender, isStudent, isTeacher, isAdmin, study_year } = body
    let {email, password} = body
   //  User.find({ $or:[{_id : _id}, {email : email}] }, (err, previousUser)=>{
    //    if(err) {
    //        return res.send({success : false, message:"Error: Server Error"})
    //    } else if (previousUser && previousUser.length > 0) {
    //        return res.send({success : false, message:"Error: Account Already Exist"})
     //  }
    const newUser = new User({
        _id,
        first_name,
        last_name,
        tel_number,
        gender,
        isTeacher,
        isStudent,
        isAdmin,
        study_year,
        password
    })
    //newUser._id = _id
    email = email.toLowerCase()
    email = email.trim()
    newUser.email = email
    if (newUser.checkPassword(password)){
        newUser.password = newUser.generateHash(password)
    }else{
        return res.send({success : false, message:"Error: password is too short!"})
    }
    newUser.save((err, user)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message:"Success: Signed Up, " + JSON.stringify(newUser)})
    })
})

router.route('/:id').delete((req,res) => {
    User.deleteOne({_id: req.params.id})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req,res) => {
    User.findById((req.params.id)).then((user) => {
        if (!user) {
            return res.send({success : false,message : "!המשתמש אינו קיים במערכת"})}
        if (!user.checkPassword(req.body.password)){
            return res.send({success : false,message : "שגיאה: הסיסמא שהוזנה קצרה מדי"})
        }
        user._id = req.body._id.trim();
        user.password = user.generateHash(req.body.password)
        user.email = req.body.email.trim();
        user.first_name = req.body.first_name.trim();
        user.last_name = req.body.last_name.trim();
        user.tel_number = req.body.tel_number;
        user.gender = req.body.gender;
        user.isTeacher = req.body.isTeacher;
        user.isStudent = req.body.isStudent;
        user.isAdmin = req.body.isAdmin;
        user.study_year = req.body.study_year.trim();
        user.save((err, doc)=> {
            if(err) {
                console.log('Error: ' + err);
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({success : true, message : "המשתמש עודכן בהצלחה"});
        })
    }); 
});

module.exports = router;