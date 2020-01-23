const router = require('express').Router();
let Course = require('../models/course.model');


router.route('/').get((req, res) => {
    //mongoose method to find all the courses
    Course.find()
    .then(courses => res.send({success : true, message: courses}))
    .catch(err => res.status(400).send({success:false, message: "Error: " + err}));
});

// the /:id is like a variable
router.route('/:_id').get((req,res) => {
    console.log(req.params._id)
    Course.find({ _id : req.params._id }, (err,course) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (course && course.length > 0) {
            return res.send({success : true, message: course})
        }else{
            return res.send({success : false, message:"!הקורס אינו קיים"})
        }
    })
})

// should see this, validation in the backend, https://medium.com/@Keithweaver_/building-a-log-in-system-for-a-mern-stack-39411e9513bd
router.route('/add').post((req, res) => {
    const { body } = req;
    const { name, _id } = body
    const newCourse = new Course({
        name,
        _id
    })
    newCourse.save((err, course)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message: course})
    })
})

router.route('/:_id').delete((req,res) => {
    Course.deleteOne({_id: req.params._id})
    .then(course => res.send({success:true, message: "!הקורס נמחק בהצלחה"}))
    .catch(err => res.status(400).send({success:false, message: "Error: " + err}))
})

module.exports = router;