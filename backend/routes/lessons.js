const router = require('express').Router();
let Lesson = require('../models/lesson.model');
let Constants = require('../models/constants.model');
let Courses = require('../models/course.model');
let User = require('../models/user.model');


/**
 * get list of all the lessons.
 */
router.route('/').get((req, res) => {
    Lesson.find()
        .then(lessons => res.send({ success: true, message: lessons, count: lessons.length }))
        .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get all the lessons with same status.
 * request parameters:
 *      /byStatus/<status>
 */
router.route('/byStatus/:status').get((req, res) => {
    Lesson.find({ "status": req.params.status }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons) {
            return res.send({ success: true, message: lessons, count: lessons.length })
        } else {
            return res.send({ success: false, message: "השיעורים המבוקשים אינם קיימים במערכת" })
        }
    })
})


/**
 * get all the lessons that done in a specific course.
 * request parameters:
 *      /ByStatusAndCourse/<status_id>/<course_id>
 */
router.route('/doneLessons/:status_id/:course_id').get((req, res) => {
    Lesson.find({ "status": req.params.status_id }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons && lessons.length > 0) {
            lessons = lessons.filter(lesson => lesson.course.course_id === req.params.course_id)
            return res.send({ success: true, message: lessons, count: lessons.length })
        } else if (lessons.length === 0) {
            return res.send({ success: true, message: lessons, count: 0 })
        } else {
            return res.send({ success: false, message: "השיעורים המבוקשים אינם קיימים במערכת" })
        }
    })
})


/**
 * get all the lessons by status, course_id and student_id.
 * request parameters:
 *      /ByStatusCourseAndStudent/
 * request body:
 *      "status" : <status> 
 *      "course_id" : <course_id>
 *      "student_id" : <student_id>
 **/
router.route('/ByStatusCourseAndStudent').post((req, res) => {
    let status = req.body.status
    let course_id = req.body.course_id
    let student_id = req.body.student_id
    Lesson.find({ $and: [{ "status": status }, { "course.course_id": course_id }, { "student.student_id": student_id }] }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons && lessons.length > 0) {
            return res.send({ success: true, message: lessons, count: lessons })
        } else {
            return res.send({ success: false, message: "השיעורים המבוקשים אינם קיימים במערכת" })
        }
    })
})


/**
 * get the number of approved lessons.
 * request parameters:
 *      /sumLessons
 */
router.route('/sumLessons').get((req, res) => {

    Lesson.find({ $or: [{ "status": "waiting" }, { "status": "done" }] }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons) {
            return res.send({ success: true, message: lessons.length })
        } else {
            return res.send({ success: false, message: "השיעורים המבוקשים אינם קיימים במערכת" })
        }
    })
})


/**
 * get teachers report.
 * request parameters:
 *      /teacherReport/<year>/<month>
 */
router.route('/teachersReport/:year/:month').get((req, res) => {
    let report = []
    let year = req.params.year
    let month = req.params.month
    let fromDate = new Date(year, month, 1);
    fromDate.setMonth(fromDate.getMonth() - 1)
    let toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1);
    Lesson.find({ $and: [{ "status": "done" }, { "date": { '$gte': fromDate, '$lt': toDate } }] }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons && lessons.length > 0) {
            Constants.find({}, (err, constant) => {
                let lesson_price = constant[0].lesson_price
                while (lessons.length > 0) {
                    let teacher = lessons[0].teacher
                    let teacher_lessons = lessons.filter(lesson => lesson.teacher.teacher_id === teacher.teacher_id)
                    report.push(
                        {
                            id: teacher.teacher_id,
                            name: teacher.teacher_name,
                            number_of_lessons: teacher_lessons.length,
                            amount: (Number(lesson_price) * teacher_lessons.length)
                        })
                    lessons = lessons.filter(lesson => lesson.teacher.teacher_id != teacher.teacher_id)
                }
                return res.send({ success: true, message: report })
            })
        } else {
            return res.send({ success: true, message: [] })
        }
    })
})


/**
 * get students report.
 * request parameters:
 *      /studentsReport/<year>/<month>
 */
router.route('/studentsReport/:year/:month').get((req, res) => {
    let report = []
    let year = req.params.year
    let month = req.params.month
    let fromDate = new Date(year, month, 1);
    fromDate.setMonth(fromDate.getMonth() - 1)
    let toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1);
    Lesson.find({ $and: [{ "status": "done" }, { "date": { '$gte': fromDate, '$lt': toDate } }] }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons && lessons.length > 0) {
            Constants.find({}, (err, constant) => {
                let student_fee = constant[0].student_fee
                while (lessons.length > 0) {
                    let student = lessons[0].student
                    let student_lessons = lessons.filter(lesson => lesson.student.student_id === student.student_id)
                    report.push(
                        {
                            id: student.student_id,
                            name: student.student_name,
                            number_of_lessons: student_lessons.length,
                            amount: (Number(student_fee) * student_lessons.length)
                        })
                    lessons = lessons.filter(lesson => lesson.student.student_id != student.student_id)
                }
                return res.send({ success: true, message: report })
            })
        } else {
            return res.send({ success: true, message: [] })
        }
    })
})


/**
 * get the money paid so far.
 * request parameters:
 *      /paidMoney
 */
router.route('/paidMoney').get((req, res) => {
    Lesson.find({ "status": "done" }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons && lessons.length > 0) {
            Constants.find({}, (err, constant) => {
                constant = constant[0]
                let sum_money = lessons.length * Number(constant.lesson_price)
                return res.send({ success: true, message: sum_money })
            })
        } else {
            return res.send({ success: true, message: 0 })
        }
    })
})


/**
 * get all the lessons in specific course.
 * request parameters:
 *     /byCourseId/<course_id>
 */
router.route('/byCourseId/:courseId').get((req, res) => {
    Lesson.find({ "course.course_id": req.params.courseId }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons) {
            return res.send({ success: true, message: lessons, count: lessons.length })
        } else {
            return res.send({ success: true, message: "השיעורים המבוקשים אינם קיימים במערכת" })
        }
    })
})


/**
 * get all the lessons with a specific teacher.
 * request parameters:
 *     /byTeacherId/<teacher_id>
 */
router.route('/byTeacherId/:teacherId').get((req, res) => {
    Lesson.find({ "teacher.teacher_id": req.params.teacherId }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons) {
            return res.send({ success: true, message: lessons, count: lessons.length })
        } else {
            return res.send({ success: true, message: "השיעורים המבוקשים אינם קיימים במערכת" })
        }
    })
})


/**
 * get all the lessons with a specific student.
 * request parameters:
 *     /byStudentId/<student_id>
 */
router.route('/byStudentId/:studentId').get((req, res) => {
    Lesson.find({ "student.student_id": req.params.studentId }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: " + err })
        } else if (lessons) {
            return res.send({ success: true, message: lessons, count: lessons.length })
        } else {
            return res.send({ success: true, message: "השיעורים המבוקשים אינם קיימים במערכת" })
        }
    })
})


/**
 * get number of lessons devided by course_id.
 * request parameters:
 *     /numOfLessonsByCourse/
 */
router.route('/numOfLessonsByCourse').get((req, res) => {
    var num_of_lessons = []
    function wait(num_of_lessons) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(num_of_lessons);
            }, 4000);
        });
    }
    Courses.find().
        then(async function (courses) {
            courses.forEach(course => {
                Lesson.find({ "course.course_id": course._id }, (err, lessons) => {
                    num_of_lessons.push({ name: course.name, sum: lessons.length })
                })
            })
            num_of_lessons = await wait(num_of_lessons)
            return res.send({ success: true, message: num_of_lessons })
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
router.route('/findOne').post((req, res) => {
    const { date, student_id, teacher_id } = req.body
    Lesson.find({ date: date, "student.student_id": student_id, "teacher.teacher_id": teacher_id }, (err, lessons) => {
        if (err) {
            res.status(400).json('Error: ' + err)
            return res.send({
                success: false, message: 'Error on finג lesson: ' + err,
            });
        }
        if (lessons && lessons.length > 0) {
            return res.send({ success: true, message: lessons[0] });
        } else {
            return res.send({ success: true, message: "!השיעור המבוקש אינו קיים במערכת" });
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
 *      "status"  : <status>
 */
router.route('/add').post((req, res) => {
    // change to req.body
    const { body } = req;
    const { course, date, teacher, student, status } = body
    let teacher_reported =  false
    if (student.student_id === teacher.teacher_id) {
        return res.send({ success: false, message: "Student cannot be the teacher of himself" })
    }
    Lesson.find({ date: date, status: "waiting", $or: [{ "student.student_id": student.student_id }, { "teacher.teacher_id": teacher.teacher_id }] }, (err, lessons) => {
        if (err) {
            return res.send({ success: false, message: "Error: Server Error" })
        } else if (lessons && lessons.length > 0) {
            return res.send({ success: false, message: "לסטודנט או המורה נקבע שיעור אחר בזמן זה, אנא נסה שוב במועד שונה" })
        }
        const newLesson = new Lesson({
            course,
            date,
            teacher,
            student,
            status,
            teacher_reported
        })
        newLesson.save((err, lesson) => {
            if (err) {
                return res.send({ success: false, message: "Error: Couldn't Save " + err })
            }
            return res.send({ success: true, message: newLesson })
        })
    });
})


/**
 * teacher report on lesson
 * request parameters:
 *     /teacherReport
 * request body:
 *      "teacher_id" : <teacher_id> 
 *      "student_id" : <student_id>
 *      "date"       : <date>
 */
router.route('/teacherReport').post((req, res) => {
    const { date, student_id, teacher_id } = req.body
    Lesson.find({ "date": date, "student.student_id": student_id, "teacher.teacher_id": teacher_id }).
        then((lesson) => {
            if (!lesson || lesson.length != 1) {
                return res.send({ success: false, message: "!השיעור המבוקש אינו קיים" })
            }
            if (lesson.length == 1) {
                lesson = lesson[0]
                lesson.teacher_reported = true
                lesson.save((err, doc) => {
                    if (err) {
                        return res.send({
                            success: false, message: err.message
                        });
                    }
                    return res.send({ success: true, message: "השיעור דווח בהצלחה" });
                })
            }
        });
});


/**
 * update lesson status by id and course_id.
 * request parameters:
 *     /updateStatus
 * request body:
 *      "teacher_id" : <teacher_id> 
 *      "student_id" : <student_id>
 *      "date"       : <date>
 *      "status"    : <status>
 */
router.route('/updateStatus').post((req, res) => {
    const { date, student_id, teacher_id, status } = req.body
    Lesson.find({ "date": date, "student.student_id": student_id, "teacher.teacher_id": teacher_id }).
        then((lesson) => {
            if (!lesson || lesson.length != 1) {
                return res.send({ success: false, message: "!השיעור המבוקש אינו קיים" })
            }
            if (lesson.length == 1) {
                lesson = lesson[0]
                lesson.status = status
                lesson.save((err, doc) => {
                    if (err) {
                        return res.send({
                            success: false, message: err.message
                        });
                    }
                    return res.send({ success: true, message: "!סטטוס השיעור עודכן בהצלחה" });
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
router.route('/update').post((req, res) => {
    const { date, student, teacher } = req.body
    Lesson.find({ "date": date, "student": student, "teacher": teacher }).
        then((lesson) => {
            if (!lesson || lesson.length != 1) {
                return res.send({ success: false, message: "!השיעור המבוקש אינו קיים" })
            }
            if (lesson.length == 1) {
                lesson = lesson[0]
                lesson.teacher = req.body.teacher
                lesson.student = req.body.student
                lesson.date = req.body.date
                lesson.course = req.body.course
                lesson.status = req.body.status
                lesson.teacher_reported = req.body.teacher_reported
                lesson.save((err, doc) => {
                    if (err) {
                        return res.send({
                            success: false, message: err.message
                        });
                    }
                    return res.send({ success: true, message: "!השיעור עודכן בהצלחה" });
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
router.route('/delete').post((req, res) => {
    const { date, student_id, teacher_id } = req.body
    Lesson.deleteOne({ date: date, "student.student_id": student_id, "teacher.teacher_id": teacher_id }, (err, lesson) => {
        if (err) {
            return res.send({
                success: false, message: 'Error in delete: ' + err,
            });
        }
        if (lesson.deletedCount > 0) {
            return res.send({ success: true, message: "!השיעור נמחק בהצלחה", });
        } else if (lesson.deletedCount == 0) {
            return res.send({ success: false, message: '!השיעור המבוקש אינו קיים במערכת'});
        }
    })
})

module.exports = router;