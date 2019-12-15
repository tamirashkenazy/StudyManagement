
import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import {Form , Button, Checkbox} from 'semantic-ui-react'
import axios from 'axios'
import '../styles/login-form.scss'
import '../styles/general.scss'

class FormLogin extends Component  {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = { 
            username: '', 
            password: '', 
            forgotPassword : false,
            redirect : false,
        }
        this.onSignIn = this.onSignIn.bind(this);
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }
    
    onSignIn(e) {
        e.preventDefault();
        const {username, password} = this.state
        const login_user = {  
            _id : username,
            password : password,
        }
        axios.post('http://localhost:5000/sign_in/', login_user).then((response)=> {
            console.log("success: " + (response.data.success));
            console.log("message: " + (response.data.message));
            if (response.data.success) {
                this.setState({
                    isLoading : false,
                    redirect : true,
                })
            } else {
                console.log(response.data.message);
                console.log("not succ " + response.data.message);
           }
        }).then(()=>{
            this.setState({
                isLoading : false,
            });
        })
    }
    componentWillUnmount() {
        this._isMounted = false;
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
        const { username, password, redirect } = this.state
        if (redirect) {
            return (
                <Redirect to={{pathname:'/main', state:{first_name:username} }}></Redirect>
            )
        }
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