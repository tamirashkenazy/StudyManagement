const router = require('express').Router();
// let UserSession = require('../models/userSession.model');
let User = require('../models/user.model');

router.route('/').post((req, res) => {
    const { body } = req;
    const { _id, password } = body
    if (!_id) {
        return res.send({
            success : false,
            message : "Error: id is blank"
        })
    }
    if (!password) {
        return res.send({
            success : false,
            message : "Error: Password is blank"
        })
    }
    User.find({_id : _id}, (err, users)=> {
        //the users is a list of what found
        if (err) {
            console.log('error: ' + err);
            return res.send({
                success : false,
                message : "Error: server err"
            })
        }
        if (users && users.length != 1) {
            return res.send({
                success : false,
                message : "Error: no such user " + _id
            })
        }
        const user = users[0]
        if (!user.validPassword(password)) {
            return res.send({
                success : false,
                message : "Error: bad password",
            })
        } else {
            return res.send({
                success : true,
                message : "You are signed in",
            })
        }
        // will be here if the user is correct
        UserSession.find({_id : _id}, (err, user_sessions)=>{
            if (err) {
                return res.send({
                    success : false, message : "Error " + JSON.stringify(err)
                });
            }
            if (user_sessions.length!=1) {
                return res.send({
                    success : false, message : "Error " + JSON.stringify(err)
                });
            }
            const user_session = user_sessions[0]
            console.log('user_session: ' + user_session);
            if (user_session) {
                return res.send({
                    success : true, message : 'Signed in successfuly',
                    token_id : user_session._id
                });
            }
            
        })
    });
});

module.exports = router;