const router = require('express').Router();
let Groups = require('../models/group.model');

// when initializing - checks if there is default group - if no - init one
Groups.find({}, (err,groups) => {
    if (groups && Array.isArray(groups) && groups.length === 0) {
        const defaul_group = new Groups(
            {
                name : "כללי",
                approved_hours : "4"
            }
        )
        defaul_group.save()
    }
})


/**
 * get list of all the groups.
 */
router.route('/').get((req, res) => {
    //mongoose method to find all the groups
    Groups.find()
    .then(groups => res.send({success : true, message: groups}))
    .catch(err => res.status(400).send({success:false, message: "Error: " + err}));
});

/**
 * get group info by name.
 * request parameters:
 *      /<group_name>
 */
router.route('/:name').get((req,res) => {
    Groups.find({ name : req.params.name }, (err,group) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (group && group.length > 0) {
            return res.send({success : true, message: group})
        }else{
            return res.send({success : false, message:"!הקבוצה אינה קיימת במאגר"})
        }
    })
})


/**
 * Add new group.
 * request parameters:
 *      /add
 * request body:
 *      "name" : <name_of_group>
 *      "approved_hours" : <approved_hours>
 */
router.route('/add').post((req, res) => {
    const { body } = req;
    const { name, approved_hours } = body
    const newGroup = new Groups({
        name,
        approved_hours
    })
    newGroup.save((err, group)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message: group})
    })
})

/**
 * Delete group.
 * request parameters:
 *      /<geoup_name>
 * request body:
 *      None
 */
router.route('/:name').delete((req,res) => {
    if (req.params.name === "כללי") {
        res.send({success : false, message: "לא ניתן למחוק את הקבוצה: כללי"})
    }
    Groups.deleteOne({name: req.params.name})
    .then(group => {
        if (group.n === 1){
            res.send({success : true, message: "!הקבוצה נמחקה בהצלחה"})
        }else{
            res.send({success : false, message: "!הקבוצה אינה קיימת"})
        }
    }).catch(err => res.status(400).send({success:false, message: "Error: " + err}))
})

module.exports = router;