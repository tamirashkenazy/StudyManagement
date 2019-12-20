const router = require('express').Router();
let Teacher = require('../models/teacher.model');


router.route('/').get((req, res) => {
    Teacher.find()
    .then(teacher => res.json(teacher))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/:id').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (teacher) {
            return res.send({success : true, message:"The teacher is: " + JSON.stringify(teacher), teacher: teacher})
        } else {
            return res.send({success : false, message:"teacher does not exist!" })
        }
    })
})

router.route('/update/course/:id').post((req, res) => {
    const { body } = req;
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"Teacher does not exist!" })
        } else {
            teacher.teaching_courses.push(req.body)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message:"Success: Teacher updated: " + JSON.stringify(teacher)})
        }
    })
})

router.route('/update/hours_available/:id').post((req, res) => {
    const { body } = req;
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"Teacher does not exist!" })
        } else {
            teacher.hours_available.push(req.body)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message:"Success: Teacher updated: " + JSON.stringify(teacher)})
        }
    })
})

router.route('/add').post((req, res) => {
    const { body } = req;
    const { _id, bank_name, bank_branch, bank_account_number, bank_account_name,
                 teaching_courses, hours_available, teaching_requests, lessons, grades_file } = body
    const newTeacher = new Teacher({
        _id,
        bank_name,
        bank_branch,
        bank_account_number,
        bank_account_name,
        teaching_courses,
        hours_available,
        teaching_requests,
        lessons,
        grades_file
    })
    console.log(newTeacher)
    newTeacher.save((err, teacher)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message:"Success: Teacher added, " + JSON.stringify(teacher)})
    })
})

router.route('/:id').delete((req,res) => {
    Teacher.deleteOne({_id: req.params.id})
    .then(teacher => res.json(teacher))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req,res) => {
    Teacher.findById((req.params.id)).then((teacher) => {
        if (!teacher) {
            return res.send({
                success : false,
                message : "Error: no such teacher"
            })
        }
        
        teacher._id = req.body._id.trim();
        teacher.bank_name = req.body.bank_name
        teacher.bank_branch = req.body.bank_branch.trim();
        teacher.bank_account_number = req.body.bank_account_number.trim();
        teacher.bank_account_name = req.body.bank_account_name.trim();
        teacher.teaching_courses = req.body.teaching_courses;
        teacher.hours_available = req.body.hours_available;
        teacher.teaching_requests = req.body.teaching_requests;
        teacher.lessons = req.body.lessons;
        teacher.grades_file = req.body.grades_file.trim();

        teacher.save((err, doc)=> {
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