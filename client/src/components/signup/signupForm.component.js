import React, { Component } from 'react';
import { Container} from 'react-bootstrap'
import { Form,  Label, Dropdown, Button, Radio, Checkbox, Icon} from 'semantic-ui-react';
import axios from 'axios'
import {Link , Redirect } from 'react-router-dom'
import '../../styles/signup-form.scss'
import '../../styles/general.scss'
import {validateForm, check_and_assign_errors, error_default_messages}  from './validationFields'

class SignupForm extends Component {
    constructor(props) {
        super(props)
        this.state = { 
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
            errors : {
                first_name: error_default_messages.first_name,
                last_name: error_default_messages.last_name,
                id_number:error_default_messages.id_number,
                tel_number:  error_default_messages.tel_number,
                password:  error_default_messages.password,
                year :error_default_messages.year,
                email :  error_default_messages.email,
                gender : error_default_messages.gender,
                role : error_default_messages.role,
            },
            isLoading : true,
            redirect : false
        }
        
        this.onSignUp = this.onSignUp.bind(this);
    }
    
    
    handleChange = (event, { name, value }) => {
        let temp_errors = this.state.errors
        temp_errors = check_and_assign_errors(name, value, temp_errors)
        let valid = validateForm(temp_errors)
        this.setState(prevState => ({ valid_form :  (valid && (prevState.isStudent || prevState.isTeacher)), [name]: value, errors : temp_errors }))
    }

    handleCheckbox = (e, { name, checked }) => {
        const { isTeacher, isStudent, errors} = this.state
        let role_valid = false;
        switch(name){
            case 'isStudent':
                if(checked || isTeacher) {
                    role_valid = true
                    errors.role = null
                }
            break;
            case 'isTeacher':
                if(checked || isStudent) {
                    role_valid = true
                    errors.role = null
                }
            break;
            default:
            break;
        }
        if(!role_valid){
            errors.role =error_default_messages.role
        }
        this.setState(prevState => ({
                [name] : !prevState[name],
                valid_form :  (validateForm(errors) && (role_valid)),
                errors : errors,
            })
        )
    }
    
    onSignUp = (e) => {
        e.preventDefault();
        const { first_name, last_name, id_number, tel_number, password, year, email, gender, isStudent, isTeacher} = this.state
        const new_user = {  
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
   
        console.log(new_user);
        axios.post('http://localhost:5000/users/add', new_user)
        .then((response)=>{
            console.log("success: " + (response.data.success));
            console.log("message: " + (response.data.message));
            if (response.data.success) {
                this.setState({
                    isLoading : false,
                    redirect : true
                });
            } else {
                this.setState({
                    isLoading : false,
                });
           }
        })
    }
    email_field = () => {
        const { email } = this.state
        return (
            <Form.Field required>
                <label>אימייל</label>
                <Form.Input
                    name='email'
                    value={email}
                    placeholder='@e-mail'
                    onChange={this.handleChange}
                />
            </Form.Field>
        )
    }
    
    password_field = () => {
        const { password } = this.state
        return (
            <Form.Field required>
                <label>סיסמה</label>
                <Form.Input
                    type="password"
                    placeholder='סיסמה'
                    name='password'
                    value={password}
                    onChange={this.handleChange}
                />
            </Form.Field>
        )
    }
    id_number_field = () => {
        const { id_number } = this.state
        return (
            <Form.Field required>
                <label>ת.ז</label>
                <Form.Input
                    placeholder='ת.ז - שם משתמש'
                    name='id_number'
                    value={id_number}
                    onChange={this.handleChange}
                />
                <Label size="tiny" pointing>שם המשתמש</Label>
            </Form.Field>
        )
    }
    tel_number_field = () => {
        const { tel_number } = this.state
        return (
            <Form.Field required>
                <label>מס' טלפון</label>
                <Form.Input
                    placeholder='05xxxxxxxx'
                    name='tel_number'
                    value={tel_number}
                    onChange={this.handleChange}
                />
            </Form.Field>
        )
        
    }

    last_name_field = () => {
        const { last_name } = this.state
        return (
            <Form.Field required>
                <label>שם משפחה</label>
                <Form.Input
                    placeholder='שם משפחה'
                    name='last_name'
                    value={last_name}
                    onChange={this.handleChange}
                />
            </Form.Field>
        )
        
    }
    first_name_field = () => {
        const { first_name } = this.state
        return (
            <Form.Field required>
                <label>שם פרטי</label>
                <Form.Input
                    placeholder='שם פרטי'
                    name='first_name'
                    value={first_name}
                    onChange={this.handleChange}
                />
            </Form.Field>
        )
    }
    genders_field = () => {
        const {gender} = this.state
        return (
            <>
                <Form.Field 
                    name="gender"
                    control={Radio}
                    label='נקבה'
                    value='female'
                    checked={gender === 'female'}
                    onChange={this.handleChange}
                />
                <Form.Field              
                    name="gender"
                    control={Radio}
                    label='זכר'
                    value='male'
                    checked={gender === 'male'}
                    onChange={this.handleChange}
                />
            </>
        )
    }
    roles_field = () => {
        const {isStudent, isTeacher} = this.state
        return (
            <>
                <Form.Field 
                    name='isStudent'
                    control={Checkbox}
                    label='תלמיד'
                    checked={isStudent}
                    onChange={this.handleCheckbox}
                />
                <Form.Field            
                    name='isTeacher'
                    control={Checkbox}
                    label='מורה'
                    checked={isTeacher}
                    onChange={this.handleCheckbox}
                />
            </>
        )

    }

    study_year_field = () => {
        const options = [
            { key: 'a', text: 'שנה א', value: 'year-a' },
            { key: 'b', text: 'שנה ב', value: 'year-b' },
            { key: 'c', text: 'שנה ג', value: 'year-c' },
            { key: 'd', text: 'שנה ד', value: 'year-d' },
            { key: 'e', text: 'שנה ה', value: 'year-e' },
        ]
        const {year} = this.state
        return (
            <Form.Field required >
                <label>שנת לימודים</label>
                <Dropdown
                    name='year'
                    value={year}
                    clearable 
                    options={options} 
                    selection 
                    onChange={this.handleChange} 
                />
            </Form.Field>
        )
    }
    render() {
        const {valid_form, redirect} = this.state
        if (redirect) {
            return <Redirect to="/"></Redirect>
        }
        return (
            <Form style={{margin:"2%"}}>
                <Form.Group widths='equal'>
                    {this.email_field()}
                    {this.password_field()}
                    {this.id_number_field()}
                </Form.Group>
                <Form.Group widths='equal'>
                    {this.tel_number_field()}
                    {this.last_name_field()}
                    {this.first_name_field()}
                </Form.Group>
                <Form.Group widths='equal'>
                    {this.genders_field()}
                    {this.roles_field()}
                    {this.study_year_field()}
                </Form.Group>
                <Form.Group>
                    <Form.Field>
                        <Button onClick={this.onSignUp} primary disabled={!valid_form}>הירשם</Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        )
    }
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
