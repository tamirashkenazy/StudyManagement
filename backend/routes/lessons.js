const router = require('express').Router();
let Lesson = require('../models/lesson.model');
let Constants = require('../models/constants.model');


/**
 * get list of all the lessons.
 */
router.route('/').get((req, res) => {
    Lesson.find()
    .then(lessons => res.send({success : true, message:lessons}))
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get all the lessons with same status.
 * request parameters:
 *      /byStatus/<status>
 */
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


/**
 * get the number of approved lessons.
 * request parameters:
 *      /sumLessons
 */
router.route('/sumLessons').get((req,res) => {

    Lesson.find({$or:[{ "status" : "waiting" },{ "status" : "done" }]}, (err,lessons) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (lessons && lessons.length > 0) {
            return res.send({success : true, message: lessons.length})
        } else {
            return res.send({success : false, message: "השיעורים המבוקשים אינם קיימים במערכת"})
        }
    })
})


/**
 * get the money paid so far.
 * request parameters:
 *      /paidMoney
 */
router.route('/paidMoney').get((req,res) => {

    Lesson.find({"status" : "done" }, (err,lessons) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (lessons && lessons.length > 0) {
            Constants.find({}, (err,constant) => {
            constant = constant[0]  
            sum_money = lessons.length * Number(constant.lesson_price)
            return res.send({success : true, message: sum_money})
            })
        } else {
            return res.send({success : false, message: "השיעורים המבוקשים אינם קיימים במערכת"})
        }
    })
    
})


/**
 * get all the lessons in specific course.
 * request parameters:
 *     /byCourseId/<course_id>
 */
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


/**
 * get all the lessons with a specific teacher.
 * request parameters:
 *     /byTeacherId/<teacher_id>
 */
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

/**
 * get all the lessons with a specific teacher.
 * request parameters:
 *     /byStudentId/<student_id>
 */
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


/**
 * Add new lesson.
 * request parameters:
 *      /add
 * request body:
 *      "course"  : <course_id>, <course_name>
 *      "date"    : <date>
 *      "teacher" : <teacher_id>, <teacher_name> 
 *      "student" : <student_id>, <student_name>
 *      "status" : <status>
 */
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

/**
 * update lesson status by id and course_id.
 * request parameters:
 *     /updateStatus
 * request body:
 *      "teacher_id" : <teacher_id> 
 *      "student_id" : <student_id>
 *      "date"       : <date>
 *       "status"    : <status>
 */
router.route('/updateStatus').post((req,res) => {
    const {date, student_id, teacher_id, status} = req.body
    Lesson.find({"date": date, "student.student_id": student_id, "teacher.teacher_id": teacher_id}).
    then((lesson) => {
        if (!lesson || lesson.length != 1) {
            return res.send({success : false,message : "!השיעור המבוקש אינו קיים"})}
        if (lesson.length == 1){
            lesson = lesson[0]
            console.log(lesson)
            lesson.status = status
            lesson.save((err, doc)=> {
                if(err) {
                    console.log('Error: ' + err);
                    return res.send({
                        success : false, message : err.message
                    });
                }
                return res.send({success : true, message : "!סטטוס השיעור עודכן בהצלחה"});
            })
        }
    }); 
});


/**
 * update lesson.
 * request parameters:
 *      /update
 * request body:
 *      "course"  : <course_id>, <course_name>
 *      "date"    : <date>
 *      "teacher" : <teacher_id>, <teacher_name> 
 *      "student" : <student_id>, <student_name>
 *      "status" : <status>
 */
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


/**
 * Delete student by date, teacher_id and student_id.
 * request parameters:
 *      /delete
 * request body:
 *      "teacher_id" : <teacher_id> 
 *      "student_id" : <student_id>
 *      "date" : <date>
 */
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

/**
 * get lesson info by date, student_id and teacher_id.
 * request parameters:
 *      /findOne
 * request body:
 *      "teacher_id" : <teacher_id> 
 *      "student_id" : <student_id>
 *      "date" : <date>
 */
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