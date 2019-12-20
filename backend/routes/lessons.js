const router = require('express').Router();
let Lesson = require('../models/lesson.model');

router.route('/').get((req, res) => {
    //mongoose method to find all the lessons
    Lesson.find()
    .then(lessons => res.json(lessons))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/:status').get((req,res) => {
    Lesson.find({ "status" : req.params.status }, (err,lessons) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (lessons && lessons.length > 0) {
            // const user = users[0]
            return res.send({success : true, message:"The lessons of status: " + lesson.status + "are: " + JSON.stringify(lessons)})
        } else {
            return res.send({success : true, message: "no lessons"})
        }
    })
})

// should see this, validation in the backend, https://medium.com/@Keithweaver_/building-a-log-in-system-for-a-mern-stack-39411e9513bd
router.route('/add').post((req, res) => {
    const { body } = req;
    const { course, date, teacher, student, status } = body
    Lesson.find({ date: date, $or:[{student : {student_id : student.student_id}}, {teacher : {teacher_id : teacher.teacher_id}}] }, (err, lessons)=>{
        if(err) {
            return res.send({success : false, message:"Error: Server Error"})
        } else if (lessons && lessons.length > 0) {
            return res.send({success : false, message:"The student or the teacher are already in a lesson at this exact hour"})
        }
        const newLesson = new Lesson({
            course,
            date,
            teacher,
            student,
            status,
        })
        console.log(newLesson)
        newLesson.save((err, lesson)=> {
            if (err) {
                return res.send({success : false, message:"Error: Couldn't Save " + err})
            }
            return res.send({success : true, message:"Success: Lesson added, " + JSON.stringify(newLesson)})
        })
    });
})





router.route('/:date/:student_id/:teacher_id').delete((req,res) => {
    const { body } = req;
    const {date, student_id, teacher_id} = body
    console.log((req.body.json))
    Lesson.find({date : date, student : {student_id : student_id}},(err, lesson)=>{
        res.send(lesson)
    })
    // Lesson.deleteOne({date : date, student : {student_id : student_id}, teacher : {teacher_id : teacher_id}},(err, lessons)=>{
    //     console.log(JSON.stringify(err))
    //     console.log(lessons)
    // })
    // .then(user => {res.json(user); console.log("ok")})
    // .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req,res) => {
    Lesson.findById((req.params.id)).then((lesson) => {
        if (!lesson) {
            return res.send({
                success : false,
                message : "Error: no such lesson"
            })
        }
        lesson._id = req.body._id.trim();
        lesson.password = generateHash(req.body.password)
        lesson.email = req.body.email.trim();
        lesson.first_name = req.body.first_name.trim();
        lesson.last_name = req.body.last_name.trim();
        lesson.tel_number = req.body.tel_number;
        lesson.gender = req.body.gender;
        lesson.isTeacher = req.body.isTeacher;
        lesson.isStudent = req.body.isStudent;
        lesson.isAdmin = req.body.isAdmin;
        lesson.study_year = req.body.study_year.trim();
        lesson.save((err, doc)=> {
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