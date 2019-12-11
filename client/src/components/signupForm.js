import React, { Component } from 'react';
import { Container, Form,  Label, Dropdown, Button, Radio, Checkbox} from 'semantic-ui-react';
import axios from 'axios'
import '../styles/signup-form.scss'
import '../styles/general.scss'


class FormSignup extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            first_name: '', 
            last_name: '', 
            id_number: '', 
            tel_number: '',
            password: '', 
            year : '',
            mail : '',
            gender : '',
            isStudent : false,
            isTeacher : false,
        }
        this.onSubmit = this.onSubmit.bind(this);
    }
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleCheckbox = (e, { name, value }) => {
        // console.log(name, [name] );
        // console.log( e.target.checked);
        this.setState(prevState => ({
                [name] : !prevState[name]
            })
        )
    }
    onSubmit(e) {
        e.preventDefault();
        const {first_name, last_name, id_number, tel_number, password, year, mail, gender, isStudent, isTeacher} = this.state
        console.log(first_name, last_name, id_number, tel_number, password, year, mail, gender, isStudent, isTeacher);
        
        const new_user = {  
                        first_name : first_name, 
                        last_name: last_name, 
                        id_number: id_number,
                        tel_number : tel_number,
                        password : password,
                        year: year,
                        mail: mail,
                        gender : gender,
                        isStudent: isStudent,
                        isTeacher : isTeacher,
                        isAdmin : false}
                        // isAdmin : false}
   
        // const {username} = this.state
        console.log(new_user);
        axios.post('http://localhost:5000/users/add', new_user)
        .then(res => console.log('ok')).catch(err=>console.log("error: " + err))
    }
    

    render() {
        const {first_name, last_name, id_number, tel_number, password, year, mail , gender} = this.state
        const options = [
            { key: 'a', text: 'שנה א', value: 'year-a' },
            { key: 'b', text: 'שנה ב', value: 'year-b' },
            { key: 'c', text: 'שנה ג', value: 'year-c' },
            { key: 'd', text: 'שנה ד', value: 'year-d' },
            { key: 'e', text: 'שנה ה', value: 'year-e' },
        ]
        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field required>
                        <label>שנת לימודים</label>
                        <Dropdown 
                            name='year'
                            value={year}
                            clearable 
                            options={options} 
                            selection 
                            onChange={this.handleChange} 
                        />
                        
                        {/* <Input fluid placeholder='First name' /> */}
                    </Form.Field>
                    <Form.Field>
                        <label>מייל</label>
                        <Form.Input
                            // type="password"
                            name='mail'
                            value={mail}
                            placeholder='@e-mail'
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <label>שם פרטי</label>
                        <Form.Input
                            placeholder='שם פרטי'
                            name='first_name'
                            value={first_name}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>סיסמה</label>
                        <Form.Input
                            type="password"
                            placeholder='סיסמה'
                            name='password'
                            value={password}
                            onChange={this.handleChange}
                        />
                        {/* <Input fluid placeholder='First name' /> */}
                    </Form.Field>
                    <Form.Field>
                        <label>מס' טלפון</label>
                        <Form.Input
                            // type="password"
                            placeholder='טלפון'
                            name='tel_number'
                            value={tel_number}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>שם משפחה</label>
                        <Form.Input
                            // type="password"
                            placeholder='שם משפחה'
                            name='last_name'
                            value={last_name}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Group inline>
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
                    </Form.Group>
                    <Form.Group inline>
                        <Form.Field
                            name='isStudent'
                            control={Checkbox}
                            label='תלמיד'
                            // value={isStudent}
                            checked={this.state.isStudent}
                            onChange={this.handleCheckbox}
                        />
                        <Form.Field                            
                            name='isTeacher'
                            control={Checkbox}
                            label='מורה'
                            // value={isTeacher}
                            checked={this.state.isTeacher}
                            onChange={this.handleCheckbox}
                        />
                    </Form.Group>
                    <Form.Field>
                        <label>ת.ז</label>
                        <Form.Input
                            // type="password"
                            placeholder='ת.ז - שם משתמש'
                            name='id_number'
                            value={id_number}
                            onChange={this.handleChange}
                        />
                        <Label size="tiny" pointing>שם המשתמש</Label>
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field>
                        <Button onClick={this.onSubmit} primary>הירשם</Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        )
    }
}

export default function SignupForm () {
    return (
        <Container className="signup-box">
            <div className="right-align">
                <FormSignup></FormSignup>   
            </div>
        </Container>
        
    )
}
