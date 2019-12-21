const router = require('express').Router();
let TeacherRequests = require('../models/teacherRequest.model');

router.route('/').get((req, res) => {
    //mongoose method to find all the teacher Requests
    TeacherRequests.find()
    .then(teacherRequests => res.json(teacherRequests))
    .catch(err => res.status(400).json("Error: " + err));
});

// get all the requests of specific teacher
router.route('/byTeacherId/:teacherId').get((req,res) => {
    console.log(req.params.teacherId)
    TeacherRequests.find({ teacherId : req.params.teacherId }, (err,teacherRequests) => {
        console.log(teacherRequests)
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (teacherRequests.length > 0) {
            return res.send({success : true, message:"teacher Requests: " + JSON.stringify({teacherRequests} ), teacherRequests: teacherRequests})
        }else{
            return res.send({success : false, message:"there is no requests for this teacher! "})
        }
    })
})


// get all the request with the same status
router.route('/byStatus/:status').get((req,res) => {
    console.log(req.params.status)
    TeacherRequests.find({ status : req.params.status }, (err,teacherRequests) => {
        console.log(teacherRequests)
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (teacherRequests.length > 0) {
            return res.send({success : true, message:"teacher Requests: " + JSON.stringify({teacherRequests} ), teacherRequests: teacherRequests})
        }else{
            return res.send({success : false, message:"There are no suitable requests."})
        }
    })
})

router.route('/findOne').post((req,res) => {
    const {teacherId, courseNumber} = req.body
    TeacherRequests.find({"teacherId": teacherId, "courseNumber": courseNumber}, (err, teacherRequests)=>{
        if (err) {
            return res.send({
                success : false, message : 'Error in find request: ' + err,
            });
        }
        else if (teacherRequests && teacherRequests.length > 0) {
            return res.send({
                success : true, message : 'found request: ' + JSON.stringify(teacherRequests[0]), teacherRequests: teacherRequests[0]
            });
        } else {
            return res.send({
                success : false, message : 'could not find teacher Requests',
            });
        }
    })
})

router.route('/add').post((req, res) => {
    const { body } = req;
    let { teacherId, courseNumber, status } = body
    TeacherRequests.find({ $and:[{teacherId : teacherId}, {courseNumber : courseNumber}] }, (err, previousRequest)=>{
        if(err) {
            return res.send({success : false, message:"Error: Server Error"})
        } else if (previousRequest && previousRequest.length > 0) {
            return res.send({success : false, message:"Error: Request Already Exist"})
        } else{
            const newRequest = new TeacherRequests({
                teacherId,
                courseNumber,
                status
            })
            console.log(newRequest)
            newRequest.save((err, teacherRequests)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
                return res.send({success:true, message:"Success: course added, " + JSON.stringify(teacherRequests)})
            })
        }
    });
})

router.route('/update').post((req,res) => {
    const {teacherId, courseNumber, } = req.body
    TeacherRequests.find({"teacherId": teacherId, "courseNumber": courseNumber}).
    then((request) => {
        if (!request || request.length != 1) {
            return res.send({
                success : false,
                message : "Error: no such request"
            })
        }
        if (request.length == 1){
            request = request[0]
            console.log(request)
            request.teacherId = req.body.teacherId
            request.courseNumber = req.body.courseNumber
            request.status = req.body.status
            request.save((err, doc)=> {
                if(err) {
                    console.log('Error: ' + err);
                    return res.send({
                        success : false, message : err.message
                    });
                }
                return res.send({
                    success : true, message : 'Updated successfuly',
                });
            })
        }
    }); 
});


router.route('/delete').delete((req,res) => {
    const {teacherId, courseNumber} = req.body
    TeacherRequests.deleteOne({"teacherId": teacherId, "courseNumber": courseNumber}, (err, teacherRequests)=>{
        if (err) {
            return res.send({
                success : false, message : 'Error in delete: ' + err,
            });
        }
        if (teacherRequests.deletedCount > 0) {
            return res.send({
                success : true, message : 'Deleted successfuly',
            });
        } else if (teacherRequests.deletedCount == 0) {
            return res.send({
                success : false, message : 'could not find teacher Requests to delete',
            });
        }
    })
})

module.exports = router;