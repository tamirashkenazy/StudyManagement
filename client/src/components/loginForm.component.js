
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {Form , Button, Checkbox} from 'semantic-ui-react'
import axios from 'axios'
import '../styles/login-form.scss'
import '../styles/general.scss'

class FormLogin extends Component  {
    constructor(props) {
        super(props)
        this.state = { 
            username: '', 
            password: '', 
            forgotPassword : false,
        }
        this.onSignIn = this.onSignIn.bind(this);
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }
    
    onSignIn(e) {
        e.preventDefault();
        const {username} = this.state
        console.log(username);
        axios.get('http://localhost:5000/users/'+ username)
        .then(res => console.log("data: " + res.data.map(user => user.id_number))).catch(err=>console.log(err))
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

                <Form className="login-form">
                    <Form.Field>
                        <label>שם משתמש</label>
                        <Form.Input
                            placeholder='ת.ז'
                            name='username'
                            value={username}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    
                    <Form.Field>
                        <label>סיסמה</label>
                        <Form.Input
                            type="password"
                            placeholder='סיסמה'
                            name='password'
                            value={password}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    
                    <Form.Field
                            control={Checkbox}
                            label='שכחתי סיסמה'
                        />

                    <Form.Field>
                        <Link to="/signup">
                            <Button color="teal">להרשמה</Button>
                        </Link>
                        <Button onClick={this.onSignIn} primary>התחבר</Button>
                    </Form.Field>
                </Form>
                
            </div>
        )
    }
}

export default FormLogin;