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
// should see this, validation in the backend, https://medium.com/@Keithweaver_/building-a-log-in-system-for-a-mern-stack-39411e9513bd
router.route('/add').post((req, res) => {
    const { body } = req;
    const { id_number, first_name, last_name,tel_number, gender, isStudent, isTeacher, isAdmin, study_year } = body
    let {email, password} = body
    email = email.toLowerCase()
    email = email.trim()
    User.find({ $or:[{_id : id_number}, {email : email}] }, (err, previousUser)=>{
        if(err) {
            return res.send({success:false, message:"Error: Server Error"})
        } else if (previousUser && previousUser.length > 0) {
            return res.send({success:false, message:"Error: Account Already Exist"})
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
        newUser._id = id_number
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

// the /:id is like a variable
router.route('/:id').get((req,res) => {
    User.find(filter_id(req))
    .then(user => {
        res.json(user)
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').delete((req,res) => {
    User.deleteOne(filter_id(req))
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err))
})

// router.route('/update/:id').post((req,res) => {
//     User.find(filter_id(req), function(err, user) {
//         if(!user) {
//             console.log("No user found")
//             // return res.redirect('/')
//         }
//         var id_number = req.body.id_number.trim();
//         var first_name = req.body.first_name.trim();
//         var last_name = req.body.last_name.trim();
//         var isAdmin = req.body.isAdmin.trim();
//         var isTeacher = req.body.isTeacher.trim();
//         var isStudent = req.body.isStudent.trim();
//         user.id_number = id_number;
//         user.first_name = first_name;
//         user.last_name = last_name;
//         user.isAdmin = isAdmin;
//         user.isTeacher = isTeacher;
//         user.isStudent = isStudent;
//         user.save(function(err) {
//             console.log(err)
//         })

//     }); 
// });
module.exports = router;