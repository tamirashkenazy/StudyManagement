import React, { useState } from 'react'
import {Form } from 'semantic-ui-react'
import { Button} from 'react-bootstrap'

//TALKS to the backend, sends https requests
import get_mongo_api from '../../mongo/paths.component'
import axios from 'axios'
export default function AddCourse(){
    const httpPostRequestToAddCourse = (inputs) => {
        const course_to_add = {  
            _id : inputs.course_id,
            name : inputs.course_name,
        }
        axios.post(get_mongo_api('courses/add'), course_to_add).then((response)=> {
            if (!response.data.success) {
               alert("הקורס לא התווסף בהצלחה")
            } else {
                alert("הקורס התווסף בהצלחה")
            }
        })
    }

    const useCourseForm = (httpRequestFunc) => {
        const [inputs, setInputs] = useState({course_name : '', course_id : ''})
        // const [wasAdded, setWasAdded] = useState(false)
        const handleSubmit = (event) => {
            if (event) {
                event.preventDefault();
                httpRequestFunc(inputs)
                window.location.reload(true)
            }
        }
        const handleInputChange = (event, {name, value}) => {
            event.persist();
            setInputs(inputs => ({...inputs, [name] : value}));
        }
        return {inputs,  handleInputChange, handleSubmit};
    }
    const {inputs, handleInputChange, handleSubmit} = useCourseForm(httpPostRequestToAddCourse);

    return (
            <Form style={{textAlign : "center"}}>
                <Form.Field width={3} style={{textAlign : "center", margin : "0 auto", padding : "1%"}}>
                    <label>מספר קורס</label>
                    <Form.Input
                        style={{direction:"ltr"}}
                        placeholder='yyyyy'
                        name='course_id'
                        value={inputs.course_id} 
                        onChange={handleInputChange}
                    />
                </Form.Field>
                
                <Form.Field width={3} style={{textAlign : "center", margin : "0 auto", padding : "1%"}}>
                    <label>שם הקורס</label>
                    <Form.Input
                        style={{direction:"rtl"}}
                        placeholder='שם הקורס'
                        name='course_name'
                        value={inputs.course_name} 
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                     <Button onClick={handleSubmit} >הוספת קורס</Button>
                </Form.Field>
            </Form>
    )
}