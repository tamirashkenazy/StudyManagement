
import React, { Component } from 'react'
// import {Form , Button} from 'react-bootstrap'
import {Form , Button, Checkbox, FormField} from 'semantic-ui-react'
import axios from 'axios'
import '../styles/login-form.scss'

class FormLogin extends Component  {
    constructor(props) {
        super(props)
        this.state = { 
            username: '', 
            password: '', 
            forgotPassword : false,
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    // handleSubmit = (e) => {
    //     const { username, password } = this.state
    //     console.log(username, password)
    // }
    onSubmit(e) {
        e.preventDefault();
        const {username} = this.state
        console.log(username);
        axios.get('http://localhost:5000/users/'+ username)
        .then(res => console.log("data: " + res.data.map(user => user.id_number)));
    }
    WelcomeHeader = () => {
        return (
            <div>
                <h3 id="welcome">ברוכים הבאים</h3>    
                <h4 id="welcome-to-where">מערכת לניהול שעות החונכות</h4>
                <br></br>
            </div>
        )
    }

    render() {
        const { username, password } = this.state
        return (
            <div className="right-align">
                <this.WelcomeHeader/>
                <Form onSubmit={this.onSubmit}>
                    <FormField>
                        <label>שם משתמש</label>
                        <Form.Input
                            placeholder='ת.ז'
                            name='username'
                            value={username}
                            onChange={this.handleChange}
                        />
                    </FormField>
                    
                    <FormField>
                        <label>סיסמה</label>
                        <Form.Input
                            type="password"
                            placeholder='סיסמה'
                            name='password'
                            value={password}
                            onChange={this.handleChange}
                        />
                    </FormField>
                    
                    <Form.Field
                            control={Checkbox}
                            label='שכחתי סיסמה'
                        />
                    <Form.Field control={Button}>התחבר</Form.Field>
                    {/* <Button onClick={this.handlePrint}>print state</Button>  */}
                </Form>
                
            </div>
        )
    }
}

export default FormLogin;