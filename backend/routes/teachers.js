const router = require('express').Router();
let Teacher = require('../models/teacher.model');
let Course = require('../models/course.model');
let Constants = require('../models/constants.model');
const mongodb = require('mongodb')
const fs = require('fs')
const binary = mongodb.Binary
var path = require('path');

/**
 * get list of all the teachers.
 */
router.route('/').get((req, res) => {
    Teacher.find()
    .then(teacher => res.send({success : true, message: teacher}))
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get teacher info by id.
 * request parameters:
 *      /byID/<teacher_id>
 */
router.route('/byID/:id').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (teacher && !Array.isArray(teacher)) {
            return res.send({success : true, message: teacher})
        } else {
            return res.send({success : false, message:"המורה אינו קיים במערכת" })
        }
    })
})



/**
 * get list of available dates by teacher id
 * request parameters:
 *      /<teacher_id>/hoursAvailable
 */
router.route('/hoursAvailable/byID/:id').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length === 0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.hours_available})
        }
    })
})


/**
 * get teacher name by id
 * request parameters:
 *      /<teacher_id>/name
 */
router.route('/:id/name').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length === 0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.name})
        }
    })
})



/**
 * get list of available dates by course id
 * request parameters:
 *      /hoursAvailable/allTeachers/<course_id>
 */
router.route('/hoursAvailable/allTeachers/:course_id').get((req,res) => {
    Teacher.find()
    .then(teachers => {
        Constants.find({}, (err,constant) => {
            let max_hours = constant[0].max_teaching_hours_per_week
            var hours = []
            teachers.forEach(teacher =>{
                let course  = (teacher.teaching_courses.filter(course => course.course_id === req.params.course_id)) 
                if (course && course.length>0){
                    let dates = teacher.hours_available.filter(date => {
                        date = `${date.getFullYear()}-${date.getWeek()}`
                        let index = teacher.hours_per_week.findIndex(weeks => weeks.week === date)
                        if (index != -1 &&  teacher.hours_per_week[index].booked_hours >= max_hours){
                            return false
                        }else{
                            return true
                        }
                    })
                    let date_and_number_of_hours = []
                    dates.forEach(date => {
                        week = `${date.getFullYear()}-${date.getWeek()}`
                        let index = teacher.hours_per_week.findIndex(weeks => weeks.week === week)
                        if (index === -1){
                            date_and_number_of_hours.push({date, "left_hours" : max_hours})
                        }else{
                            let left_hours =  max_hours - teacher.hours_per_week[index].booked_hours
                            date_and_number_of_hours.push({date, left_hours})
                        }
                    })
                    hours.push({"teacher_id": teacher._id,"teacher_name" : teacher.name, "hours_available" : date_and_number_of_hours})
                }
            });
            res.send({success : true, message: hours})
        })
    })
    .catch(err => res.status(400).json("Error: " + err));
})

/**
 * get list of all the courses by teacher id
 * request parameters:
 *      /<teacher_id>/courses
 */
router.route('/:id/courses').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.teaching_courses})
        }
    })
})


/**
 * Get the number of teachers that teach a specific course
 * Request parameters:
 *      /<course_id>/numOfTeachers
 */
router.route('/:course_id/numOfTeachers').get((req,res) => {
    Teacher.find()
    .then(teachers => {
        let num_of_teachers = 0
        teachers.forEach(teacher =>{
            let course  = (teacher.teaching_courses.filter(course => course.course_id === req.params.course_id)) 
            if (course && course.length>0){
                num_of_teachers += 1
            }
        });
        res.send({success : true, message: num_of_teachers})
    })
    .catch(err => res.status(400).json("Error: " + err));
})


/**
 * get list of all the requests by teacher id
 * request parameters:
 *      /<teacher_id>/requests
 */
router.route('/:id/requests').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.teaching_requests})
        }
    })
})



/**
 * get grades file by teacher id
 * request parameters:
 *      /<teacher_id>/grades
 */
router.route('/:id/grades').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else if (teacher.grades_file.name == null){
            return res.send({success : true, message:"!הקובץ אינו קיים במערכת"})
        }else{
            var url = process.cwd()
            let buffer = teacher.grades_file.data.buffer
            url = path.join(url, teacher.grades_file.name)
            fs.appendFile(teacher.grades_file.name, Buffer.from(buffer), (err) => {
                if (err) {
                } else {
                    return res.sendFile(url)
                }
            });
        }
    })
})



/**
 * check if file is existed by teacher id
 * request parameters:
 *      /<teacher_id>/checkgrades
 */
router.route('/:id/checkgrades').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            if (teacher.grades_file.name == null){
            return res.send({success : false, message:"!הקובץ אינו קיים במערכת"})
            } else{
                return res.send({success : true, message:"!הקובץ קיים במערכת"})
            }
        }
    })
})


/**
 * get list of all the requests with the same status.
 * request parameters:
 *      /status/<status>
 * request body:
 *      none
 */
router.route('/status/:status').get((req, res) => {
    Teacher.find()
    .then(teacher => {
        requests = []
        teacher.forEach(teacher => requests.push({"teacher_id" : teacher._id, "requests" : teacher.teaching_requests.filter(request => request.status === req.params.status)}));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get list of all the requests with the same course_id.
 * request parameters:
 *      /courseID/<courseID>
 * request body:
 *      none
 */
router.route('/courseID/:courseID').get((req, res) => {
    Teacher.find()
    .then(teachers => {
        requests = []
        teachers.forEach(teacher => requests.push({"teacher_id" : teacher._id, "request" : teacher.teaching_requests.filter(request => request.course_id === req.params.courseID)}));
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
    Teacher.find()
    .then(theachers => {
        requests = []
        theachers.forEach(teacher => requests.push({"teacher_id" : teacher._id, "requests" : teacher.teaching_requests}));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});




/**
 * Add course to teaching-courses list.
 * request parameters:
 *      /add/teachingCourse/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 *      "course_name" : <course_name>     
 */
router.route('/add/teachingCourse/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            Course.findById((req.body.course_id), (err,course) => {
                if(err) {
                    return res.send({success : false, message:"Error: " + err})
                } else if (!course || course.length===0) {
                    return res.send({success : false, message:"!הקורס המבוקש אינו קיים במערכת" })
                } else {
                    if (teacher.teaching_courses.includes(course._id)){
                        return res.send({success : false, message:"המורה כבר מלמד את הקורס המבוקש"})
                    }
                    teacher.teaching_courses.push(course._id)
                    teacher.save((err, doc)=> {
                        if (err) {
                            return res.send({success:false, message:"Error: Couldn't Save " + err})
                        }
                        return res.send({success:true, message:"!הקורס התווסף בהצלחה"})
                    })
                }
            })
        }
    })
})



/**
 * Add request to teacher requests list.
 * request parameters:
 *      /add/request/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 *      "course_name" : <course_name>     
 */
router.route('/add/request/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        new_request = req.body
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            course = teacher.teaching_courses.find(({ course_id }) => course_id === new_request.course_id )
            if (course){
                return res.send({success : false, message:"הקורס כבר קיים ברשימת הקורסים שהמורה מלמד" })
            }
            course = teacher.teaching_requests.find(({ course_id }) => course_id === new_request.course_id )
            if (course){
                return res.send({success : false, message:"הקורס כבר קיים ברשימת הבקשות של המורה " })
            }
            new_request.status = 'waiting'
            new_request.updated_at = Date.now()
            teacher.teaching_requests.push(new_request)
            teacher.save((err, doc)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
                return res.send({success:true, message: " הבקשה ללמד את הקורס "  + new_request.course_name + " נשלחה בהצלחה "})
            })
        }
    })
})


/**
 * Add list of requests to teacher requests.
 * request parameters:
 *      /add/requestsList/<teacher_id>
 * request body:
 *      [
 *      "course_id" : <course_id>
 *      "course_name" : <course_name>     
 *      ]
 */
router.route('/add/requestsList/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        let new_requests = req.body.requests
        let response = {success:true, message: ` הבקשה ללמד את הקורסים נשלחה בהצלחה`};
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            new_requests.forEach(new_request => {
                course = teacher.teaching_courses.find(({ course_id }) => course_id === new_request.course_id )
                if (course){
                    response = {success : false, message:`הקורס ${new_request.course_name} כבר קיים ברשימת הקורסים שהמורה מלמד` }
                }
                course = teacher.teaching_requests.find(({ course_id }) => course_id === new_request.course_id )
                if (course){
                    response = {success : false, message:`הקורס ${new_request.course_name} כבר קיים ברשימת הבקשות של המורה ` }
                }
                new_request.status = 'waiting'
                new_request.updated_at = Date.now()
                teacher.teaching_requests.push(new_request)
            })
            if (response.success == true){
                teacher.save((err, doc)=> {
                    if (err) {
                        return res.send({success:false, message:"Error: Couldn't Save " + err})
                    }
                    return res.send(response)
                })  
            }
            else{
                return res.send(response)
            }

        }
    })
})


/**
 * get number of teacher teaching each course_id.
 * request parameters:
 *     /numOfSTeachersByCourse/
 */
router.route('/numOfSTeachersByCourse').get((req,res) => {
    var num_of_teachers = []
    function wait(num_of_teachers) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(num_of_teachers);
          }, 5000);
        });
    }
    Course.find().
    then(async function(courses){
        courses.forEach(course => {
          Teacher.find({ "teaching_courses.course_id" : course._id }, (err,teacher) => {
              num_of_teachers.push({name : course.name, sum: teacher.length})
              }) 
        })
          num_of_teachers = await wait(num_of_teachers)
          return res.send({success : true, message: num_of_teachers})
    })
})

/**
 * Add dates to teacher hours_available list.
 * request parameters:
 *      /add/hoursAvailable/<teacher_id>
 * request body:
 *      dates : <list_of_dates>
 */
router.route('/add/hoursAvailable/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            let dates_to_add = req.body.dates.map(date => new Date(date))
            teacher.hours_available.push.apply(teacher.hours_available, dates_to_add)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!השעות נרשמו במערכת"})
        }
    })
})
       

/**
 * Add grades file.
 * request parameters:
 *      /add/file/<teacher_id>
 * request body:
 *      file : <binary_file>
 *      name : <file_name>
 */
router.post('/add/file/:id', async (req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            teacher.grades_file.name = req.params.id.toString() + ".pdf"

            teacher.grades_file.data = binary(req.files.uploadedFile.data)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!הקובץ נשמר במערכת"})
        }
    })
})



/**
 * Add new teacher.
 * request parameters:
 *      /add
 * request body:
 *      "_id" : <teacher_id>
 */
router.route('/add').post((req, res) => {
    const { _id, name } = req.body
    let teaching_requests = []
    let hours_available = []
    let teaching_courses = []
    let hours_per_week = []
    let grades_file = null
    const newTeacher = new Teacher({
        _id : _id,
        name : name,
        teaching_requests : teaching_requests,
        hours_available : hours_available,
        teaching_courses : teaching_courses,
        grades_file : grades_file
    })
    newTeacher.save((err, teacher)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message: teacher})
    })
})


/**
 * Delete teacher by id.
 * request parameters:
 *      /<teacher_id>
 * request body:
 *     None
 */
router.route('/:id').delete((req,res) => {
    Teacher.deleteOne({_id: req.params.id})
    .then(teacher => {
        if (teacher.n === 1){
            res.send({success : true, message: "!המורה נמחק בהצלחה"})
        }else{
            res.send({success : false, message: "!המורה אינו קיים"})
        }
    }).catch(err => res.status(400).send({success : false, message: err}))
})


/**
 * Update teacher.
 * request parameters:
 *     /update/<theacher-id>
 * request body:
 *      "_id" : <theacher>
 *      "teaching_courses" : [teaching_courses]
 *      "teaching_requests" : [teaching_requests]
 *      "hours_available" : [hours_available]
 *      "hours_per_week" : [hours_per_week]
 *      "grades_file" : <grades_file>
 */
router.route('/updateTeachers/:id').post((req,res) => {
    Teacher.findById((req.params.id)).then((teacher) => {
        if (!teacher || teacher.length===0) {
            return res.send({success : false,message : "!המורה אינו קיים במערכת"})
        }
        teacher._id = req.body._id.trim();
        teacher.teaching_courses = req.body.teaching_courses;
        teacher.hours_available = req.body.hours_available;
        teacher.teaching_requests = req.body.teaching_requests;
        teacher.hours_per_week = req.body.hours_per_week;
        teacher.grades_file = req.body.grades_file.trim();
        teacher.save((err, doc)=> {
            if(err) {
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({
                success : true, message : "!המורה עודכן בהצלחה"});
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
    let teachers = req.body.id_to_courses
    let success = true
    let validate = 1
    function wait(validate) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(validate);
          }, 1000);
        });
    }
    let end_function = teachers.length
    teachers.forEach(function(teacher){
        let teacher_id = teacher[0]
        let courses_list = teacher[1]
        Teacher.findById((teacher_id)).then((teacher) => {
            let validate = Object.keys(courses_list).length;
            Object.entries(courses_list).forEach(([course_id, status]) => {
                if (status === "") {
                    validate --;
                    return
                }
                let current_request = teacher.teaching_requests.filter(request => request.course_id === course_id)
                if (!current_request || current_request.length === 0) {
                    success = false
                } else{
                    current_request = current_request[0]
                    current_request.status = status
                    if (status === 'approved'){
                        let new_course = {"course_id" : current_request.course_id,
                                    "course_name" : current_request.course_name,
                                    "hours_already_done" : '0'}
                        teacher.teaching_courses.push(new_course)
                    }
                    validate --;
                }
            });
            save_teacher = async function(){
                while(validate != 0){
                    await wait(validate)
                }
                teacher.save((err, teacher)=> {
                    if (err) {
                        success = false
                    }else{
                        end_function--;
                    }
                })
            }
            save_teacher()
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
 * update request status by id and course_id.
 * request parameters:
 *     /update/requestStatus/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 *      "status" : <status>
 */
router.route('/update/requestStatus/:id').post((req,res) => {
    Teacher.findById((req.params.id)).then((teacher) => {
        if (!teacher || teacher.length === 0) {
            return res.send({success : false, message : "!המורה אינו קיים במערכת"})
        }
        let new_request = req.body;
        let current_request = teacher.teaching_requests.filter(request => request.course_id === new_request.course_id)
        if (!current_request || current_request.length === 0) {
            return res.send({success : false, message:"!הבקשה אינה קיימת במערכת" })
        } else{
            current_request = current_request[0]
            current_request.status = new_request.status
            if (new_request.status === 'approved'){
                let new_course = {"course_id" : current_request.course_id,
                            "course_name" : current_request.course_name,
                            "hours_already_done" : '0'}
                teacher.teaching_courses.push(new_course)
            }
            teacher.save((err, doc)=> {
                if(err) {
                    return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "!סטטוס הבקשה עודכן בהצלחה"});
            })
        }
    }); 
});

/**
 * update teacher name.
 * request parameters:
 *     /update/teachingHours/<teacher_id>
 * request body:
 *      "_id" : <teacher_id>
 *      "name" : <teacher name>
 */
router.route('/update/name').post((req,res) => {
    let teacher_id = req.body._id
    let new_name = req.body.name
    Teacher.findById((teacher_id)).then((teacher) => {
        if (!teacher || teacher.length === 0) {
            return res.send({success : false, message : "!המורה אינו קיים במערכת"})
        }
        teacher.name = new_name
        teacher.save((err, doc)=> {
            if(err) {
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({success : true, message : "!שם המורה עודכן בהצלחה"});
        })
    }); 
});



/**
 * update number of hours by id and course_id.
 * request parameters:
 *     /update/teachingHours/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 *      "teachingHours" : <numbr_of_hours>
 */
router.route('/update/teachingHours/:id').post((req,res) => {
    Teacher.findById((req.params.id)).then((teacher) => {
        if (!teacher || teacher.length === 0) {
            return res.send({success : false, message : "!המורה אינו קיים במערכת"})
        }
        new_hours = req.body;
        course = teacher.teaching_courses.filter(course => course.course_id === new_hours.course_id)
        if (!course || course.length === 0) {
            return res.send({success : false, message:"!הקורס אינו קיים במערכת" })
        } else{
            course = course[0]
            updated_hours = new_hours.teachingHours + Number(course.hours_already_done)
            course.hours_already_done = updated_hours.toString()
            teacher.save((err, doc)=> {
                if(err) {
                    return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "!השעות עודכנו בהצלחה"});
            })
        }
    }); 
});



/**
 * delete teachingCourse by id and course_id.
 * request parameters:
 *     /delete/request/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 */
router.route('/delete/teachingCourse/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            teacher.teaching_courses = teacher.teaching_courses.filter(course => course != req.body.course_id)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: " הקורס " + course + "!נמחק מרשימת הקורסים של המורה בהצלחה"})
        }
    })
})


/**
 * delete request by id and course_id.
 * request parameters:
 *     /delete/request/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 */
router.route('/delete/request/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            teacher.teaching_requests = teacher.teaching_requests.filter(request => request.course_id != req.body.course_id)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!הבקשה נמחקה בהצלחה"})
        }
    })
})


/**
 * teacher lesson cancel.
 * request parameters:
 *     /update/lessonCancelled
 * request body:
 *       "teacher_id" : <teacher_id>
 *       "date" : <date>
 */
router.route('/update/lessonCancelled').post((req,res) => {
    let date = req.body.date
    let teacher_id = req.body.teacher_id
    date = new Date(date)
    Teacher.findById((teacher_id)).then((teacher) => {
        if (!teacher || teacher.length === 0) {
            return res.send({success : false, message : "!המורה אינו קיים במערכת"})
        }else{
            let year = date.getFullYear();
            let month = date.getWeek()
            let current_week = `${year}-${month}`
            let index = teacher.hours_per_week.findIndex(weeks => weeks.week === current_week)
            teacher.hours_per_week[index].booked_hours--
            teacher.save((err, doc)=> {
                if(err) {
                   return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "השעות עודכנו בהצלחה"});
            })
        }
    }); 
});


/**
 * delete dates by teacher id.
 * request parameters:
 *     /delete/hoursAvailable/
 * request body:
 *      [
 *       teacher_id : <teacher_id>
 *      "hours_available" : [hours_available]
 *      ]
 */
router.route('/update/addlessons').post((req, res) => {
    let teachers = req.body
    let success = true
    let remove_hours = 1
    let add_weekly_hour = 1
    function wait() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
    }
    let end_function = teachers.length
    teachers.forEach(function(teacher){
        let teacher_id = teacher.teacher_id
        let dates = teacher.hours_available
        let dates_to_remove = dates.map(date => new Date(date))
        Teacher.findById((teacher_id)).then((current_teacher) => {
            remove_hours =  current_teacher.hours_available.length
            current_teacher.hours_available = current_teacher.hours_available.filter(function(date){
                let match = dates_to_remove.find(d => d.getTime() === date.getTime())
                let hasMatch = !!match; // convert to boolean
                remove_hours--;
                return !hasMatch
            })
            add_weekly_hour = dates_to_remove.length
            dates_to_remove.forEach(date => {
                let current_week = `${ date.getFullYear()}-${date.getWeek()}`

                let index = current_teacher.hours_per_week.findIndex(weeks => weeks.week === current_week)
                if (index === -1){
                    new_week = {week : current_week, booked_hours : 1}
                    current_teacher.hours_per_week.push(new_week)
                }else{
                    current_teacher.hours_per_week[index].booked_hours++
                }
                add_weekly_hour--
            });
            save_teacher = async function(){
                while(remove_hours != 0 || add_weekly_hour != 0){
                    await wait()
                }
                current_teacher.save((err, teacher)=> {
                    if (err) {
                        success = false
                    }else{
                        end_function--;
                    }
                })
            }
            save_teacher()
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
 * delete dates by teacher id.
 * request parameters:
 *     /delete/hoursAvailable/<teacher_id>
 * request body:
 *      "hours_available" : [hours_available]
 */
router.route('/delete/hoursAvailable/:id').post((req, res) => {
   let hours_available = req.body.hours_available
   let validate = hours_available.length
   function wait(validate) {
       return new Promise(resolve => {
         setTimeout(() => {
           resolve(validate);
         }, 2000);
       });
   }
   Teacher.findById((req.params.id), (err,teacher) => {
       if(err) {
           return res.send({success : false, message:"Error: " + err})
       } else if (!teacher || teacher.length===0) {
           return res.send({success : false, message: "!המורה אינו קיים במערכת"})
       } else {
           validate = teacher.hours_available.length
           let dates_to_remove = hours_available.map(date => new Date(date))
           teacher.hours_available = teacher.hours_available.filter(function(date){
               let match = dates_to_remove.find(d => d.getTime() === date.getTime())
               let hasMatch = !!match; // convert to boolean
               validate--;
               return !hasMatch
           })
           send_response = async function(){
               while(validate != 0){
                   await wait(validate)
               }
               teacher.save((err, teacher)=> {
                   if (err) {
                       return res.send({success:false, message:"Error: Couldn't Save " + err})
                   }else{
                   return res.send({success:true, message: "!השעות המסומנות הוסרו בהצלחה"})
                   }
               })
           }
           send_response()
       }
   })
})


/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
    
        dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
        var newYear = new Date(this.getFullYear(),0,1);
        var day = newYear.getDay() - dowOffset; //the day of week the year begins on
        day = (day >= 0 ? day : day + 7);
        var daynum = Math.floor((this.getTime() - newYear.getTime() - 
        (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
        var weeknum;
        //if the year starts before the middle of a week
        if(day < 4) {
            weeknum = Math.floor((daynum+day-1)/7) + 1;
            if(weeknum > 52) {
                nYear = new Date(this.getFullYear() + 1,0,1);
                nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                /*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
                weeknum = nday < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.floor((daynum+day-1)/7);
        }
        return weeknum;
    };

module.exports = router;