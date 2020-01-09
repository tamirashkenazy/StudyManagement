import axios from 'axios'
import get_mongo_api from '../mongo/paths.component'

export function httpPostRequestToAddUser(formValues, history) {
    const user_to_add = {  
        _id : formValues._id,
        password : formValues.password,
        email: formValues.email,
        first_name : formValues.first_name, 
        last_name: formValues.last_name, 
        tel_number : formValues.tel_number,
        gender : formValues.gender,
        isTeacher : formValues.isTeacher,
        isStudent: formValues.isStudent,
        isAdmin : false,
        study_year: formValues.study_year,
    }
    console.log("the user is: " + user_to_add);
    axios.post(get_mongo_api('users/add'), user_to_add)
    .then((response)=> {
        if (response.data.success) {
            history.push('/')
        } else {
            alert(response.data.message)
        }
    })
} 

export function httpPostRequestToAddStudent(id) {
    const student_to_add = {  
        _id : id,
        requests : []
    }
    console.log("the student is: " + student_to_add);
    axios.post(get_mongo_api('students/add'), student_to_add)
    .then((response)=> {
        if (!response.data.success) {
            alert(response.data.message)
        }
    })
} 

export function httpPostRequestToAddTeacher(id) {
    const teacher_to_add = {  
        _id : id,
    }
    console.log("the student is: " + teacher_to_add);
    axios.post(get_mongo_api('students/add'), teacher_to_add)
    .then((response)=> {
        if (!response.data.success) {
            alert(response.data.message)
        }
    })
} 