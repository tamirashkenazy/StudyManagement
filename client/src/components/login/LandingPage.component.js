import React from 'react';
import {Container, Row, Col, Image} from 'react-bootstrap'
import '../../styles/App.scss'
import login_people_books from '../../images/background_images/login_people_books.jpg'
import study_management from '../../images/background_images/study_management.png'
import FormLogin from './loginForm.component'
import {Link } from 'react-router-dom'
import { Button} from 'semantic-ui-react'



function ImagesLogin() {
    return (
            <Container>
                <Row>
                    <Image src={study_management} fluid="true"  className="study-photo"></Image>
                </Row>
                <Row>
                    <Image src={login_people_books} fluid="true"  className="people-photo"></Image>
                </Row>
            </Container>
    )
}

function LoginBox() {
    return(
        <Container id="login-box">
            <Row style={{padding: '3%'}}>
                <Col id="images-login">
                    <ImagesLogin/>
                </Col>
                <Col style={{}}>
                    <Container style={{height : "100%"}}>
                        <Row style={{direction : "rtl"}}>
                            <FormLogin/>
                        </Row>
                        <Row style={{marginTop: "1rem", direction : "rtl"}}>
                            <Link to={{ pathname: '/signup'}} >
                                <Button color="teal">להרשמה</Button>
                            </Link>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

function LandingPage () {
    return(
        // id and className goes to:  '../../styles/App.scss'
        <div id="land-page" className="bg">
            <LoginBox/>
        </div>
    )
}

export default LandingPage