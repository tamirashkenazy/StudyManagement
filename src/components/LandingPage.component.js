import React from 'react';
import { Link } from 'react-router-dom'
import {Container, Row, Col, Image} from 'react-bootstrap'
import '../styles/App.scss'
import login_people_books from '../images/background_images/login_people_books.jpg'
import study_management from '../images/background_images/study_management.png'
import FormLogin from './loginForm.component'
function LoginBox() {
    return(
        <Container className="login-box">
            <Row > {/**noGutters={true} */}
            <Col className="images-login">
                <Image src={study_management} fluid="true"  className="study-photo"></Image>
                <Image src={login_people_books} fluid="true"  className="people-photo"></Image>
            </Col>
            <Col>
                <FormLogin></FormLogin>
            </Col>
                {/* <Form_Login/> */}
            </Row>
        </Container>
    );
}

function LandingPage () {
    return(
        <LoginBox></LoginBox>
        // <div>
        //     <h1> welcome to the main page</h1>
        //     <h1><Link to='/'>go to page "/"</Link></h1>
        //     <h2><Link to='/create'>go to page "/create"</Link></h2>
        // </div>
    )
}

export default LandingPage