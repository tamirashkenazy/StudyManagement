import React, { useState } from 'react'
import {Form , Button} from 'semantic-ui-react'
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
                
                // setWasAdded(true)
            }
        })
    }

    const useCourseForm = (httpRequestFunc) => {
        const [inputs, setInputs] = useState({course_name : '', course_id : ''})
        const [wasAdded, setWasAdded] = useState(false)
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
        return {inputs,  handleInputChange, handleSubmit, wasAdded};
    }
    const {inputs, handleInputChange, handleSubmit} = useCourseForm(httpPostRequestToAddCourse);

    return (
        <div>
            <Form className="login-form">
                <Form.Field>
                    <label>מספר קורס</label>
                    <Form.Input
                        style={{direction:"ltr"}}
                        placeholder='yyyyy'
                        name='course_id'
                        value={inputs.course_id} 
                        onChange={handleInputChange}
                    />
                </Form.Field>
                
                <Form.Field>
                    <label>שם הקורס</label>
                    <Form.Input
                        style={{direction:"ltr"}}
                        placeholder='שם הקורס'
                        name='course_name'
                        value={inputs.course_name} 
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                     <Button onClick={handleSubmit} primary >הוסף קורס</Button>
                    
                </Form.Field>
            </Form>
        </div>
    )
}