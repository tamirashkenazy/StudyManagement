const router = require('express').Router();
let Student = require('../models/student.model');
let Groups = require('../models/group.model');
let Course = require('../models/course.model');
let Lesson = require('../models/lesson.model');

/**
 * get list of all the students.
 */
router.route('/').get((req, res) => {
    Student.find()
    .then(students => res.send({success : true, message: students}))
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get student info by id.
 * request parameters:
 *      /byID/<student_id>
 */
router.route('/:id/byID').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (student && !Array.isArray(student)) {
            return res.send({success : true, message: student})
        } else {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        }
    })
})


/**
 * get list of student's requests by student id
 * request parameters:
 *      /<student_id>/requests
 */
router.route('/:id/requests').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            return res.send({success : true, message: student.requests})
        }
    })
})


/**
 * get list of all courses by student id
 * request parameters:
 *      /<student_id>/courses
 */
router.route('/:id/courses').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            return res.send({success : true, message: student.courses})
        }
    })
})


/**
 * get studentname by id
 * request parameters:
 *      /<student_id>/name
 */
router.route('/:id/name').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            return res.send({success : true, message: student.name})
        }
    })
})


/**
 * get list of student's requests by course_id
 * request parameters:
 *      /<student_id>/requests/byCourseID
 */
router.route('/:id/requests/byCourseID').post((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            student.requests = student.requests.filter(request => request.course_id === req.body.course_id)
            return res.send({success : true, message: student.requests})
        }
    })
})


/**
 * get number of hours to book 
 * request parameters:
 *      /<student_id>/hoursToBook
 * request body:
 *      "course_id" : <course_id> 
 */
router.route('/:id/hoursToBook').post((req,res) => {
    let student_id = req.params.id
    Student.findById((student_id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            let request_course = student.courses.filter(course => course.course_id === req.body.course_id)
            return res.send({success : true, message: request_course[0].hours_able_to_book})
        }
    })
})



/**
 * get list of student's requests by status
 * request parameters:
 *       /<student_id>/requests/byStatus
 */
router.route('/:id/requests/byStatus').post((req,res) => {
    let requests
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            requests = student.requests.filter(request => request.status === req.body.status)
            return res.send({success : true, message: requests})
        }
    })
})



/**
 * get number of hours available to book 
 * request parameters:
 *       /<student_id>/requests/byStatus
 * 
 * request body:
 *      "course_id" : <course_id>
 *      "student_id" : <student_id>
 */
router.route('/availableHours').post((req,res) => {
    let student_id = req.body.student_id
    let course_id = req.body.course_id
    Student.findById((student_id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            Lesson.find({ $and: [{"status" : "waiting"} , {"course.course_id" : course_id},  {"student.student_id" : student_id}] }, (err,lessons) => {
                if(err) {
                    return res.send({success : false, message:"Error: " + err})
                } else if (lessons && lessons.length >= 0) {
                    let book_lessons = lessons.length
                    current_course = student.courses.filter(course => course.course_id === course_id)
                    if (current_course.length != 1){
                        return res.send({success : false, message: "הקורס אינו קיים ברשימת הקורסים של הסטודנט"})
                    }
                    //let approved_hours = current_course[0].approved_hours
                    let available_hours = current_course.hours_able_to_book
                    return res.send({success : true, message: available_hours})

                }else {
                    return res.send({success : false, message: "השיעורים המבוקשים אינם קיימים במערכת"})
                }
            })
        }
    })
})



/**
 * get list of all the students at the same group.
 * request parameters:
 *      /group
 * request body:
 *      "group_name" : <name_of_group>
 */
router.route('/group').post((req, res) => {
    Student.find()
    .then(students => {
        students = students.filter(student => student.group.name === req.body.group.name)
        res.send({success : true, message: students})
    })
    .catch(err => res.status(400).json("Error: " + err));
});



/**
 * get list of all the requests with the same status.
 * request parameters:
 *     /<status>/status
 * request body:
 *      none
 */
router.route('/:status/status').get((req, res) => {
    Student.find()
    .then(students => {
        requests = []
        students.forEach(student => requests.push(student.requests.filter(request => request.status === req.params.status)));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get list of all the requests with the same course_id.
 * request parameters:
 *      /<courseID>/courseID
 * request body:
 *      none
 */
router.route('/:courseID/courseID').get((req, res) => {
    Student.find()
    .then(students => {
        requests = []
        students.forEach(student => requests.push(student.requests.filter(request => request.course_id === req.params.courseID)));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});



/**
 * get list of all the requests.
 * request parameters:
 *      /allRequests
 * request body:
 *      None
 */
router.route('/allRequests').get((req, res) => {
    Student.find()
    .then(students => {
        requests = []
        students.forEach(student => requests.push(student.requests));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


 
/**
 * Add request to student requests list.
 * request parameters:
 *      /add/request/<student_id>
 * request body:
 *      "course_id" : <course_id>
 *      "course_name" : <course_name>
 *      "number_of_hours" : <number_of_hours>      
 */
router.route('/add/request/:id').post((req, res) => {
    Student.findById((req.params.id), (err,student) => {
        new_request = req.body
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length === 0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {   

            course = student.courses.find(({course_id}) => course_id === new_request.course_id )
            if (course){
                gap = Number(student.group.approved_hours) - Number(course.approved_hours) - Number(course.wating_hours) + Number(course.hours_already_done) 
                if (gap > 0){
                    hours_to_add = Math.min(Number(new_request.number_of_hours), gap)
                    final_hours = hours_to_add + Number(course.wating_hours)
                    new_request.number_of_hours = final_hours.toString()
                    student.requests = student.requests.filter(request => request.course_id != course.course_id)
                    changehours(final_hours,course.course_id, student.courses)
                }
                else{
                   return res.send({success : false, message:"!כמות השעות המבוקשת הינה מעל הכמות המותרת עבור הסטודנט" })
                }
            // add new course to list of the courses
            }else{
                new_course = {course_id: new_request.course_id,
                            course_name: new_request.course_name,
                            approved_hours: '0',
                            hours_able_to_book: '0',
                            wating_hours: new_request.number_of_hours,
                            hours_already_done: '0'}
                student.courses.push(new_course)
            }
            new_request.status = 'waiting'
            new_request.updated_at = Date.now()
            student.requests.push(new_request)
            student.save((err, doc)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
                return res.send({success:true, message: "!הבקשה נשלחה בהצלחה"})
            })
        }
    })
})


/**
 * get number of sudents requests devided by course_id.
 * request parameters:
 *     /numOfStudentsByCourse/
 */
router.route('/numOfStudentsByCourse').get((req,res) => {
    var num_of_students = []
    function wait(num_of_students) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(num_of_students);
          }, 4000);
        });
    }
    Course.find().
    then(async function(courses){
        courses.forEach(course => {
          Student.find({ "courses.course_id" : course._id }, (err,students) => {
              num_of_students.push({name : course.name, sum: students.length})
              }) 
        })
          num_of_students = await wait(num_of_students)
          return res.send({success : true, message: num_of_students})
    })
})


/**
 * Add new student.
 * request parameters:
 *      /add
 * request body:
 *      "_id" : <student_id>
 *      optional:
 *          "group_name" : <group_name>
 */
router.route('/add').post((req, res) => {
    _id = req.body._id
    name = req.body.name
    group_name = 'כללי'
    if (req.body.hasOwnProperty('group_name')){
        group_name = req.body.group_name
    }
    requests = []
    courses = []
    Groups.findOne({ name : group_name }, (err,group) => {
        if (err || group === null){
            new_group = ""
        }else{
            new_group = { name: group.name, approved_hours : group.approved_hours}
        }
        student_obj = { _id : _id, name : name, requests : requests, courses : courses, group : new_group}
        const newStudent = new Student(student_obj)
        newStudent.save((err, student)=> {
            if (err) {
                return res.send({success:false, message:"Error: Couldn't Save " + err})
            }
             return res.send({success:true, message: student})
        })
    })
})


 
/**
 * Delete student by id.
 * request parameters:
 *      /<student_id>
 * request body:
 *     None
 */
router.route('deleteStudent/:id').delete((req,res) => {
    Student.deleteOne({_id: req.params.id})
    .then(student => {
        if (student.n === 1){
            res.send({success : true, message: "!הסטודנט נמחק בהצלחה"})
        }else{
            res.send({success : false, message: "!הסטודנט אינו קיים"})
        }
    }).catch(err => res.status(400).json('Error: ' + err))
})


/**
 * Update student.
 * request parameters:
 *     /update
 * request body:
 *      "_id" : <student_id>
 *      "requests" : [list_of_request]
 *      "courses" : [list_of_courses]
 *       "group_name" : <group_object>
 */
router.route('/update').post((req,res) => {
    Student.findById((req.body._id.trim())).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }
        Groups.findOne({ name : req.body.group_name }, (err,group) => {
            if (err || group === null){
                new_group = {name: "", approved_hours : "4"}
            }else{
                new_group = { name: group.name, approved_hours : group.approved_hours}
            }
            student.group.name = new_group.name
            student.group.approved_hours = new_group.approved_hours
            student._id = req.body._id.trim();
            student.requests = req.body.requests;
            student.courses = req.body.courses;
            student.save((err, doc)=> {
                if(err) {
                    return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "!הסטודנט עודכן בהצלחה"});
            })
        })
    }); 
});

/**
 * update student name.
 * request parameters:
 *     /update/name
 * request body:
 *      "_id" : <student_id>
 *      "name" : <student name>
 */
router.route('/update/name').post((req,res) => {
    let student_id = req.body._id
    let new_name = req.body.name
    Student.findById((student_id)).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }
        student.name = new_name
        student.save((err, doc)=> {
            if(err) {
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({success : true, message : "!שם הסטודנט עודכן בהצלחה"});
        })
    }); 
});


/**
 * student lesson done.
 * request parameters:
 *     /update/courseHours/<student_id>
 * request body:
 *       "course_id" : <course_id>
 */
router.route('/update/courseHours/:id').post((req,res) => {
    let course_id = req.body.course_id
    Student.findById((req.params.id)).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }else{
            let course_to_update = student.courses.findIndex(course => course.course_id === course_id)
            let hours_already_done = Number(student.courses[course_to_update].hours_already_done)
            hours_already_done++;
            student.courses[course_to_update].hours_already_done = hours_already_done.toString()
            student.save((err, doc)=> {
                if(err) {
                   return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "השעות עודכנו בהצלחה"});
            })
        }
    }); 
});
 

/**
 * student lesson cancel.
 * request parameters:
 *     /update/lessonCancelled/<student_id>
 * request body:
 *       "course_id" : <course_id>
 */
router.route('/update/lessonCancelled/:id').post((req,res) => {
    let course_id = req.body.course_id
    Student.findById((req.params.id)).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }else{
            let course_to_update = student.courses.findIndex(course => course.course_id === course_id)
            let hours_able_to_book = Number(student.courses[course_to_update].hours_able_to_book)
            hours_able_to_book++;
            student.courses[course_to_update].hours_able_to_book = hours_able_to_book.toString()
            student.save((err, doc)=> {
                if(err) {
                   return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "השעות עודכנו בהצלחה"});
            })
        }
    }); 
});


/**
 * added new lesson to student.
 * request parameters:
 *     /update/newLessons/
 * request body:
 *    "course_id" : <course_id>
 *    "number_of_hours" : <number_of_hours>
 *
 */
router.route('/update/newLessons/:id').post((req,res) => {
    let course_id = req.body.course_id
    let number_of_hours = req.body.number_of_hours
    Student.findById((req.params.id)).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }else{
            let course_to_update = student.courses.findIndex(course => course.course_id === course_id)
            let hours_able_to_book = Number(student.courses[course_to_update].hours_able_to_book)
            hours_able_to_book = hours_able_to_book - number_of_hours;
            student.courses[course_to_update].hours_able_to_book = hours_able_to_book.toString()
            student.save((err, doc)=> {
                if(err) {
                   return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "השעות עודכנו בהצלחה"});
            })
        }
    }); 
});


/**
 * update student's group by id.
 * request parameters:
 *     /update/group/<student_id>
 * request body:
 *       "group_name" : <group_name>
 */
router.route('/update/group/:id').post((req,res) => {
    Student.findById((req.params.id)).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }
        Groups.findOne({ name : req.body.group_name }, (err,group) => {
            if (err || group === null){
                new_group = ""
            }else{
                new_group = { name: group.name, approved_hours : group.approved_hours}
            }
            student.group = new_group;
            student.save((err, doc)=> {
                if(err) {
                   return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "!הקבוצה של הסטודנט עודכנה בהצלחה"});
            })
        })
    }); 
});


/**
 * update request status by list of id and course_id.
 * request parameters:
 *     /update/requestStatusesList/
 * request body:
 *     ["id_to_courses" : ["student_id", {key: "course_id", value: "status"}]]
 *      
 */
router.route('/update/requestStatusesList').post((req,res) => {
    let students = req.body.id_to_courses
    let success = true
    let validate = 1
    function wait(validate) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(validate);
          }, 1500);
        });
    }
    let end_function = students.length
    students.forEach(function(student){
        let student_id = student[0]
        let courses_list = student[1]
        Student.findById((student_id)).then((student) => {
            validate = Object.keys(courses_list).length;
            Object.entries(courses_list).forEach(([course_id, status]) => {
                if (status === "") {
                    validate --;
                    return
                }
                let current_request = student.requests.filter(request => request.course_id === course_id)
                if (!current_request || current_request.length === 0) {
                    success = false
                } else{
                    current_request = current_request[0]
                    course_to_update = student.courses.findIndex(course => course.course_id === course_id)
                    if (status === 'approved'){
                        let current_approved_hours = student.courses[course_to_update].approved_hours
                        let updated_hours = Number(current_approved_hours) + Number(current_request.number_of_hours)
                        let current_able_to_book = student.courses[course_to_update].hours_able_to_book
                        let updated_hours_to_book = Number(current_able_to_book) + Number(current_request.number_of_hours)
                        student.courses[course_to_update].approved_hours = updated_hours.toString()
                        student.courses[course_to_update].hours_able_to_book = updated_hours_to_book.toString()
                        student.courses[course_to_update].wating_hours = '0'
                    }else if(status === 'declined'){
                        student.courses[course_to_update].wating_hours = '0'
                    }
                    status_to_update = student.requests.findIndex(requests => requests.course_id === course_id)
                    student.requests[status_to_update].status = status
                    validate--;
                }
            });
            save_student = async function(){
                while(validate != 0){
                    await wait(validate)
                }
                student.save((err, student)=> {
                    if (err) {
                        success = false
                    }else{
                        end_function--;
                    }
                })
            }
            save_student()
        });
    });
    send_response = async function(){
        while(end_function != 0 && success != false){
            await wait(end_function)
        }
        if (success === true){
            return res.send({success : true, message : "!הבקשות עודכנו בהצלחה"});
        }else{
            return res.send({success : true, message : "העדכון נכשל, אנא נסה שנית"});
        }
    }
    send_response()
});



/**
 * update students' group by id.
 * request parameters:
 *     /updateGroup/listOfStudents
 * request body:
 *       "group_name" : <group_name>
 *       "students_id" : <list_of_id>
 */
router.route('/updateGroup/listOfStudents').post((req,res) => {
    let id_list = req.body.students_id
    let group_name = req.body.group_name
    let error_ids = []
    let validate = id_list.length
    function wait(validate) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(validate);
          }, 2000);
        });
    }
    Groups.findOne({ name : group_name }, (err, group) => {
        if (group) {
            id_list.forEach(student_id=>{
                Student.findById((student_id)).then((student) => {
                    if (student) {
                        student.group.name = group.name
                        student.group.approved_hours = group.approved_hours
                        student.save((err, student)=>{
                            validate -= 1;
                            if(err) {
                                error_ids.push(student_id) 
                            }
                        })
                    } else {
                        //if there is no such student
                        error_ids.push(student_id)
                        validate -= 1;
                    }
                })
            })
        } else { //!group
            res.send({
                success : false, message : `אינה קיימת במערכת ${group_name}`
            })
        }
    })
    send_response = async function(){
        while(validate != 0){
            await wait(validate)
        }
        // compare arrays of error_ids and id_list - if equals - ok, else return the id list of 
        if (error_ids.length > 0){ // WARNING: not all the students updated
            res.send({success : false, message : error_ids})
        }else{
            res.send({success : true, message : `הסטודנטים שייכים כעת לקבוצה: ${group_name} `})
        }
    }
    send_response()
});



/**
 * update request status by id and course_id.
 * request parameters:
 *     /update/requestStatus/<student_id>
 * request body:
 *      "course_id" : <course_id>
 *      "status" : <status>
 */
router.route('/update/requestStatus/:id').post((req,res) => {
    Student.findById((req.params.id)).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }
        new_request = req.body;
        current_request = student.requests.filter(request => request.course_id === new_request.course_id)
        if (!current_request || current_request.length === 0) {
            return res.send({success : false, message:"!הבקשה אינה קיימת במערכת" })
        }
        else{
            current_request = current_request[0]
            course_to_update = student.courses.findIndex(course => course.course_id === new_request.course_id)
            if (new_request.status === 'approved'){
                let current_approved_hours = student.courses[course_to_update].approved_hours
                let updated_hours = Number(current_approved_hours) + Number(current_request.number_of_hours)
                let current_able_to_book = student.courses[course_to_update].hours_able_to_book
                let updated_hours_to_book = Number(current_able_to_book) + Number(current_request.number_of_hours)
                student.courses[course_to_update].approved_hours = updated_hours.toString()
                student.courses[course_to_update].hours_able_to_book = updated_hours_to_book.toString()
                student.courses[course_to_update].wating_hours = '0'
            }else if(new_request.status === 'declined'){
                student.courses[course_to_update].wating_hours = '0'
            }
            status_to_update = student.requests.findIndex(requests => requests.course_id === new_request.course_id)
            student.requests[status_to_update].status = new_request.status
            student.save((err, doc)=> {
                if(err) {
                    return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "!סטטוס הבקשה עודכן בהצלחה"});
            })
        }
    }); 
});


/**
 * delete request by id and course_id.
 * request parameters:
 *     /delete/request/<student_id>
 * request body:
 *      "course_id" : <course_id>
 */
router.route('/delete/request/:id').post((req, res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length === 0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            student.requests = student.requests.filter(request => request.course_id != req.body.course_id)
            student.save((err, student)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!הבקשה הוסרה בהצלחה"})
        }
    })
})


function changehours(new_hours, course_id, courses ) {
    for (var i in courses) {
      if (courses[i].course_id == course_id) {
          courses[i].wating_hours = new_hours;
         break; //Stop this loop, we found it!
      }
    }
 }


module.exports = router;