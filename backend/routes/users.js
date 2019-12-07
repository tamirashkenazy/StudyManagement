const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    //mongoose method to find all the users
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route('/add').post((req, res) => {
    const id_number = req.body.id_number;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const isTeacher = req.body.isTeacher;
    const isStudent = req.body.isStudent;
    const isAdmin = req.body.isAdmin;
    const newUser = new User({
        id_number,
        first_name,
        last_name,
        isTeacher,
        isStudent,
        isAdmin,
    })
    newUser.save().then(()=>res.json("user added!")).catch(err=>res.status(400).json('Error: ' + err))
})
const filter_id = (req)=> { 
    return({"id_number" : req.params.id})
}

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