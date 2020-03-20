const router = require('express').Router();
let Course = require('../models/course.model');

/**
 * get list of all the courses.
 */
router.route('/').get((req, res) => {
    //mongoose method to find all the courses
    Course.find()
    .then(courses => res.send({success : true, message: courses}))
    .catch(err => res.status(400).send({success:false, message: "Error: " + err}));
});

/**
 * get course info by course number.
 * request parameters:
 *      /<course_id>
 */
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

/**
 * Add new course.
 * request parameters:
 *      /add
 * request body:
 *      "_id" : <course_id>
 *       "name" : <course name>
 */
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

/**
 * Delete course by id.
 * request parameters:
 *      /<course_id>
 * request body:
 *     None
 */
router.route('/:_id').delete((req,res) => {
    Course.deleteOne({_id: req.params._id})
    .then(course => res.send({success:true, message: "!הקורס נמחק בהצלחה"}))
    .catch(err => res.status(400).send({success:false, message: "Error: " + err}))
})

module.exports = router;