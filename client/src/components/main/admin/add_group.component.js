import React, { useState } from 'react'
import {Form , Button} from 'semantic-ui-react'
//TALKS to the backend, sends https requests
import get_mongo_api from '../../mongo/paths.component'
import axios from 'axios'

export default function AddGroup(){
    const httpPostRequestToAddGroup = (inputs) => {
        const group_to_add = {  
            name : inputs.group_name,
            approved_hours : inputs.approved_hours
        }
        axios.post(get_mongo_api('groups/add'), group_to_add).then((response)=> {
            if (!response.data.success) {
               alert("הקבוצה לא התווספה")
            } else {
                alert("הקבוצה התווספה בהצלחה")
            }
        })
    }

    const useGroupForm = (httpRequestFunc) => {
        const [inputs, setInputs] = useState({group_name : '', approved_hours : 4})
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
    const {inputs, handleInputChange, handleSubmit} = useGroupForm(httpPostRequestToAddGroup);

    return (
            <Form style={{textAlign : "center"}}>
                <Form.Field width={3} style={{textAlign : "center", margin : "0 auto", padding : "1%"}}>
                    <label>שם הקבוצה</label>
                    <Form.Input
                        style={{direction:"rtl"}}
                        placeholder='שם הקבוצה'
                        name='group_name'
                        value={inputs.group_name} 
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field width={3} style={{textAlign : "center", margin : "0 auto", padding : "1%"}}>
                    <label>מס השעות שמקבלים</label>
                    <Form.Input
                        style={{direction:"rtl"}}
                        placeholder='מס׳ שעות'
                        name='approved_hours'
                        value={inputs.approved_hours} 
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                     <Button onClick={handleSubmit} primary >הוספת קבוצה</Button>
                </Form.Field>
            </Form>
    )
}