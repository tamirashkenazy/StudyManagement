import React, { useState } from 'react';
import { Container} from 'react-bootstrap'
import { Form,  Label, Dropdown, Button, Radio, Checkbox, Icon} from 'semantic-ui-react';
import axios from 'axios'
import {Link , useHistory } from 'react-router-dom'
import '../../styles/signup-form.scss'
import '../../styles/general.scss'
import {validateForm, check_and_assign_errors, error_default_messages}  from './validationFields'

function SignupForm() {
    let history = useHistory()

    const useSignUpForm = (callback) => {
        const [userState, setUserState] = useState({
            first_name: '',
            last_name: '',
            id_number: '', 
            tel_number: '',
            password: '', 
            year : '',
            email : '',
            gender : '',
            isStudent : false,
            isTeacher : false,
        })
        const [validForm, setValidForm] = useState(false)
        const [errors, setErrors] = useState({
            first_name_error: error_default_messages.first_name,
            last_name_error: error_default_messages.last_name,
            id_number_error : error_default_messages.id_number,
            tel_number_error:  error_default_messages.tel_number,
            password_error:  error_default_messages.password,
            year_error :error_default_messages.year,
            email_error :  error_default_messages.email,
            gender_error : error_default_messages.gender,
            role_error : error_default_messages.role,
    })
        const handleSubmit = (event) => {
            if (event) {
                event.preventDefault();
                callback()
            }
            
        }
        const handleInputChange = (event, {name, value, checked, type}) => {
            //If you want to access the event properties in an asynchronous way, 
            //you should call event.persist() on the event, which will remove the synthetic event from the pool  
            //and allow references to the event to be retained by user code.
            const local_value = (type === 'checkbox') ? checked : value
            event.persist();
            let valid_form = false
            if (type !== 'checkbox') {
                let temp_errors = check_and_assign_errors(name, local_value, errors)
                valid_form = validateForm(temp_errors)
                setValidForm(valid_form && (userState.isStudent || userState.isTeacher))
                setErrors(temp_errors)
            } else {
                if (checked || ((name==='isStudent' && userState.isTeacher) || (name==='isTeacher' && userState.isStudent))) {
                    valid_form = true
                }
                let role_error= null
                if (!valid_form) {
                     role_error = error_default_messages.role
                }
                setErrors(oldErrors => ({...oldErrors, role_error : role_error}))
                //the validForm is validate the fields without relation to checkbox
                setValidForm((validateForm(errors) && (valid_form)))

            }
            setUserState(inputs => ({...inputs, [name] : local_value}));
        }
        return { handleSubmit, handleInputChange, userState, validForm, errors };
    }

    const httpPostRequestToAddUser = () => {
        const {id_number, password, email, first_name, last_name, tel_number, gender, isTeacher, isStudent, year } = userState
        const user_to_add = {  
            _id : id_number,
            password : password,
            email: email,
            first_name : first_name, 
            last_name: last_name, 
            tel_number : tel_number,
            gender : gender,
            isTeacher : isTeacher,
            isStudent: isStudent,
            isAdmin : false,
            study_year: year,
        }
        console.log("the user is: " + user_to_add);
        axios.post('http://localhost:5000/users/add', user_to_add)
        .then((response)=> {
                    if (response.data.success) {
                        history.push('/')
                    } else {
                        alert(response.data.message)
                   }
        })
    }  
    const {userState, validForm, handleInputChange, handleSubmit} = useSignUpForm(httpPostRequestToAddUser);

    const email_field = () => {
        const { email } = userState
        return (
            <Form.Field required>
                <label>אימייל</label>
                <Form.Input
                    name='email'
                    value={email}
                    placeholder='@e-mail'
                    onChange={handleInputChange}
                />
            </Form.Field>
        )
    }
    
    const password_field = () => {
        const { password } = userState
        return (
            <Form.Field required>
                <label>סיסמה</label>
                <Form.Input
                    type="password"
                    placeholder='סיסמה'
                    name='password'
                    value={password}
                    onChange={handleInputChange}
                />
            </Form.Field>
        )
    }
    const id_number_field = () => {
        const { id_number } = userState
        return (
            <Form.Field required>
                <label>ת.ז</label>
                <Form.Input
                    placeholder='ת.ז - שם משתמש'
                    name='id_number'
                    value={id_number}
                    onChange={handleInputChange}
                />
                <Label size="tiny" pointing>שם המשתמש</Label>
            </Form.Field>
        )
    }
    const tel_number_field = () => {
        const { tel_number } = userState
        return (
            <Form.Field required>
                <label>מס' טלפון</label>
                <Form.Input
                    placeholder='05xxxxxxxx'
                    name='tel_number'
                    value={tel_number}
                    onChange={handleInputChange}
                />
            </Form.Field>
        )
        
    }

    const last_name_field = () => {
        const { last_name } = userState
        return (
            <Form.Field required>
                <label>שם משפחה</label>
                <Form.Input
                    placeholder='שם משפחה'
                    name='last_name'
                    value={last_name}
                    onChange={handleInputChange}
                />
            </Form.Field>
        )
        
    }
    const first_name_field = () => {
        const { first_name } = userState
        return (
            <Form.Field required>
                <label>שם פרטי</label>
                <Form.Input
                    placeholder='שם פרטי'
                    name='first_name'
                    value={first_name}
                    onChange={handleInputChange}
                />
            </Form.Field>
        )
    }
    const genders_field = () => {
        const {gender} = userState
        return (
            <>
                <Form.Field 
                    name="gender"
                    control={Radio}
                    label='נקבה'
                    value='female'
                    checked={gender === 'female'}
                    onChange={handleInputChange}
                />
                <Form.Field              
                    name="gender"
                    control={Radio}
                    label='זכר'
                    value='male'
                    checked={gender === 'male'}
                    onChange={handleInputChange}
                />
            </>
        )
    }
    const roles_field = () => {
        const {isStudent, isTeacher} = userState
        return (
            <>
                <Form.Field 
                    name='isStudent'
                    control={Checkbox}
                    label='תלמיד'
                    checked={isStudent}
                    onChange={handleInputChange}
                />
                <Form.Field            
                    name='isTeacher'
                    control={Checkbox}
                    label='מורה'
                    checked={isTeacher}
                    onChange={handleInputChange}
                />
            </>
        )

    }

    const study_year_field = () => {
        const options = [
            { key: 'a', text: 'שנה א', value: 'year-a' },
            { key: 'b', text: 'שנה ב', value: 'year-b' },
            { key: 'c', text: 'שנה ג', value: 'year-c' },
            { key: 'd', text: 'שנה ד', value: 'year-d' },
            { key: 'e', text: 'שנה ה', value: 'year-e' },
        ]
        const {year} = userState
        return (
            <Form.Field required >
                <label>שנת לימודים</label>
                <Dropdown
                    name='year'
                    value={year}
                    clearable 
                    options={options} 
                    selection 
                    onChange={handleInputChange} 
                />
            </Form.Field>
        )
    }
    return (
        <Form style={{margin:"2%"}}>
            <Form.Group widths='equal'>
                {email_field()}
                {password_field()}
                {id_number_field()}
            </Form.Group>
            <Form.Group widths='equal'>
                {tel_number_field()}
                {last_name_field()}
                {first_name_field()}
            </Form.Group>
            <Form.Group widths='equal'>
                {genders_field()}
                {roles_field()}
                {study_year_field()}
            </Form.Group>
            <Form.Group>
                <Form.Field>
                    <Button onClick={handleSubmit} primary disabled={!validForm}>הירשם</Button>
                </Form.Field>
            </Form.Group>
        </Form>
    )
}

export default function signupConatainer () {
    return (
        <Container id="signup-box"  className="right-align">
            <h3>כותרת טופס הרשמה שנראית טוב</h3>
            <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
                <Icon size='big' name='arrow right' style={{margin:"2%"}}></Icon>
            </Link>
            <SignupForm/>
        </Container>
        
    )
}
