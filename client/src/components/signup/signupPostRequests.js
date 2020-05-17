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
    axios.post(get_mongo_api('users/add'), user_to_add)
    .then((response)=> {
        if (response.data.success) {
            history.push('/')
            window.location.reload(true)
        } else {
            alert(response.data.message)
        }
    })
} 

export async function httpPostRequestToAddStudent(id, first_name, last_name) {
    var full_name = [first_name,last_name]
    const student_to_add = {  
        _id : id,
        name : full_name.join(" ")
    }
    const response = await axios.post(get_mongo_api('students/add'), student_to_add)
    .then((response)=> {
        if (!response.data.success) {
            alert(response.data.message)
        }
    })
    return response
} 

export async function httpPostRequestToAddTeacher(id, first_name, last_name) {
    var full_name = [first_name,last_name]
    const teacher_to_add = {  
        _id : id,
        name : full_name.join(" ")
    }
    const response = await axios.post(get_mongo_api('teachers/add'), teacher_to_add)
    .then((response)=> {
        if (response.data.success === false) {
            alert(response.data.message)
        }
    })
    return response
} 