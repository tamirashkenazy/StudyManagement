const router = require('express').Router();
let User = require('../models/user.model');
//https://stackoverflow.com/questions/34546272/cannot-find-module-bcrypt/41878322
//npm install -g windows-build-tools, npm install -g node-gyp
//npm install bcrypt
var bcrypt = require('bcrypt')

router.route('/').get((req, res) => {
    //mongoose method to find all the users
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/:id').get((req,res) => {
    User.findById((req.params.id), (err,user) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (user) {
            // const user = users[0]
            return res.send({success : true, message:"The user is: " + JSON.stringify(user), user: user})
        }
    })
})

// should see this, validation in the backend, https://medium.com/@Keithweaver_/building-a-log-in-system-for-a-mern-stack-39411e9513bd
router.route('/add').post((req, res) => {
    const { body } = req;
    const { _id, first_name, last_name, tel_number, gender, isStudent, isTeacher, isAdmin, study_year } = body
    let {email, password} = body
    email = email.toLowerCase()
    email = email.trim()
    User.find({ $or:[{_id : _id}, {email : email}] }, (err, previousUser)=>{
        if(err) {
            return res.send({success : false, message:"Error: Server Error"})
        } else if (previousUser && previousUser.length > 0) {
            return res.send({success : false, message:"Error: Account Already Exist"})
        }
        const newUser = new User({
            email,
            first_name,
            last_name,
            tel_number,
            gender,
            isTeacher,
            isStudent,
            isAdmin,
            study_year, 
        })
        newUser._id = _id
        newUser.password = newUser.generateHash(password)
        console.log(newUser)
        newUser.save((err, user)=> {
            if (err) {
                return res.send({success:false, message:"Error: Couldn't Save " + err})
            }
            return res.send({success:true, message:"Success: Signed Up, " + JSON.stringify(newUser)})
        })
    });
})



router.route('/:id').delete((req,res) => {
    User.deleteOne(filter_id(req))
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req,res) => {
    User.findById((req.params.id)).then((user) => {
        if (!user) {
            return res.send({
                success : false,
                message : "Error: no such user"
            })
        }
        user._id = req.body._id.trim();
        user.password = generateHash(req.body.password)
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
                return res.send({
                    success : false, message : err.errmsg
                });
            }
            return res.send({
                success : true, message : 'Updated successfuly',
            });
        })
    }); 
});
module.exports = router;