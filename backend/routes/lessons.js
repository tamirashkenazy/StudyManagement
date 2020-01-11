const router = require('express').Router();
let Lesson = require('../models/lesson.model');

router.route('/').get((req, res) => {
    //mongoose method to find all the lessons
    Lesson.find()
    .then(lessons => res.send({success : true, message:lessons}))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route('/byStatus/:status').get((req,res) => {
    Lesson.find({ "status" : req.params.status }, (err,lessons) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (lessons && lessons.length > 0) {
            return res.send({success : true, message: lessons})
        } else {
            return res.send({success : false, message: "השיעורים המבוקשים אינם קיימים במערכת"})
        }
    })
})


router.route('/byCourseId/:courseId').get((req,res) => {
    Lesson.find({ "course.course_id" : req.params.courseId }, (err,lessons) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (lessons && lessons.length > 0) {
            return res.send({success : true, message: lessons})
        } else {
            return res.send({success : true, message: "השיעורים המבוקשים אינם קיימים במערכת"})
        }
    })
})


router.route('/byTeacherId/:teacherId').get((req,res) => {
    Lesson.find({ "teacher.teacher_id" : req.params.teacherId }, (err,lessons) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (lessons && lessons.length > 0) {
            return res.send({success : true, message: lessons})
        } else {
            return res.send({success : true, message: "השיעורים המבוקשים אינם קיימים במערכת"})
        }
    })
})


router.route('/byStudentId/:studentId').get((req,res) => {
    Lesson.find({ "student.student_id" : req.params.studentId }, (err,lessons) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (lessons && lessons.length > 0) {
            return res.send({success : true, message: lessons})
        } else {
            return res.send({success : true, message: "השיעורים המבוקשים אינם קיימים במערכת"})
        }
    })
})


router.route('/add').post((req, res) => {
    // change to req.body
    const { body } = req;
    const { course, date, teacher, student, status } = body
    if (student.student_id == teacher.teacher_id){
        return res.send({success : false, message:"Student cannot be the teacher of himself"})
    }
    Lesson.find({ date: date, status: "waiting", $or:[{"student.student_id" : student.student_id}, {"teacher.teacher_id" : teacher.teacher_id}] }, (err, lessons)=>{
        if(err) {
            return res.send({success : false, message:"Error: Server Error"})
        } else if (lessons && lessons.length > 0) {
            return res.send({success : false, message:"לסטודנט או המורה נקבע שיעור אחר בזמן זה, אנא נסה שוב במועד שונה"})
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
            return res.send({success : true, message: newLesson})
        })
    });
})


router.route('/update').post((req,res) => {
    const {date, student, teacher} = req.body
    console.log(date, student, teacher)  
    Lesson.find({"date": date, "student": student, "teacher": teacher}).
    then((lesson) => {
        if (!lesson || lesson.length != 1) {
            return res.send({success : false,message : "!השיעור המבוקש אינו קיים"})}
        if (lesson.length == 1){
            lesson = lesson[0]
            console.log(lesson)
            lesson.teacher = req.body.teacher
            lesson.student = req.body.student
            lesson.date = req.body.date
            lesson.course = req.body.course
            lesson.status = req.body.status
            lesson.save((err, doc)=> {
                if(err) {
                    console.log('Error: ' + err);
                    return res.send({
                        success : false, message : err.message
                    });
                }
                return res.send({success : true, message : "!השיעור עודכן בהצלחה"});
            })
        }
    }); 
});


router.route('/delete').post((req,res) => {
    const {date, student_id, teacher_id} = req.body
    console.log(date, student_id, teacher_id)   
    Lesson.deleteOne({date : date, "student.student_id" : student_id, "teacher.teacher_id" : teacher_id}, (err, lesson)=>{
        if (err) {
            return res.send({
                success : false, message : 'Error in delete: ' + err,
            });
        }
        if (lesson.deletedCount > 0) {
            return res.send({success : true, message : "!השיעור נמחק בהצלחה",});
        } else if (lesson.deletedCount == 0) {
            return res.send({success : true, message : '!השיעור המבוקש אינו קיים במערכת',});
        }
    })
})


router.route('/findOne').post((req,res) => {
    const {date, student_id, teacher_id} = req.body
    console.log(date, student_id, teacher_id)   
    Lesson.find({date : date    , "student.student_id" : student_id, "teacher.teacher_id" : teacher_id}, (err, lessons)=>{
        if (err) {
            res.status(400).json('Error: ' + err)
            return res.send({
                success : false, message : 'Error on finג lesson: ' + err,
            });
        }
        if (lessons && lessons.length > 0) {
            console.log(lessons);
            return res.send({success : true, message : lessons[0]});
        } else {
            return res.send({success : true, message : "!השיעור המבוקש אינו קיים במערכת"});
        }
    })
})


module.exports = router;