const router = require('express').Router();
let Course = require('../models/course.model');


router.route('/').get((req, res) => {
    //mongoose method to find all the courses
    Course.find()
    .then(courses => res.json(courses))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/:number').get((req,res) => {
    console.log(req.params.number)
    Course.find({ number : req.params.number }, (err,course) => {
        console.log(course)
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (course.length > 0) {
            return res.send({success : true, message:"course exists: " + JSON.stringify({course} ), course: course})
        }else{
            return res.send({success : false, message:"course does no exist! "})
        }
    })
})

// should see this, validation in the backend, https://medium.com/@Keithweaver_/building-a-log-in-system-for-a-mern-stack-39411e9513bd
router.route('/add').post((req, res) => {
    const { body } = req;
    const { name, number } = body
    const newCourse = new Course({
        name,
        number
    })
    console.log(newCourse)
    newCourse.save((err, course)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message:"Success: course added, " + JSON.stringify(course)})
    })
})

router.route('/:number').delete((req,res) => {
    Course.deleteOne({number: req.params.number})
    .then(course => res.json(course))
    .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router;