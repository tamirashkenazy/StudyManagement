import React, { useState, useEffect } from 'react'
import {Form } from 'semantic-ui-react'
//TALKS to the backend, sends https requests
import get_mongo_api from '../../../mongo/paths.component'
import axios from 'axios'
import GenericTable from '../../utils/generic_table.component';
import {Button} from 'react-bootstrap'

const constnats_to_hebrew = {lesson_price : "עלות שיעור למחלקה", student_fee : "עלות שיעור לתלמיד", annual_budget: "תקציב שנתי", admin_mail_for_qa : "מייל לשאלות ותשובות",
                            max_teaching_hours_per_week : "מקסימום שעות הוראה שבועיות למורה", min_hours_before_cancel : "כמו שעות מינימלית לביטול שיעור טרם תחילתו",admin_mail : "מייל מנהל מערכת"  }
function sort_constants(constants, inputs, handleInputChange) {
    let arr_of_constants = []
    if (constants) {
        Object.entries(constants).forEach(([constant_key, constant_val])=> {
            if (constnats_to_hebrew.hasOwnProperty(constant_key)) {
                let hebrew_key = constnats_to_hebrew[constant_key]
                arr_of_constants.push({
                    "שם הקבוע" : hebrew_key,
                    "ערך קיים" : constant_val,
                    "ערך חדש" : <Form.Input value={inputs[constant_key]} onChange={handleInputChange} name={constant_key}></Form.Input>
                })
            }
            
        })
        return arr_of_constants
    } else {
        arr_of_constants.push({"טבלת ערכי מנהלים" : ""})
        return arr_of_constants
    }
}

async function httpPostRequestToChangeConstant (inputs) {
    const response = await axios.post(get_mongo_api('constants/update'), {constants_to_update : inputs}).then((response)=> {
        if (!response.data.success) {
           alert("השינויים לא נשמרו עקב תקלה")
           return false
        } else {
            alert("השינויים התבצעו בהצלחה")
            return true
        }
    })
    return response
}

export default function ChangeConstants({constants}){
    const useConstantsForm = (httpRequestFunc) => {
        const [inputs, setInputs] = useState(constants)
        useEffect(()=>{
            setInputs(constants)   
        },[])
        // const [wasAdded, setWasAdded] = useState(false)
        async function handleSubmit (event) {
            if (event) {
                event.preventDefault();
                let return_val = await httpRequestFunc(inputs)
                if (return_val) {
                    window.location.reload(true)
                }
                
            }
        }
        const handleInputChange = (event, {name, value}) => {
            event.persist();
            setInputs(inputs => ({...inputs, [name] : value}));
        }
        return {inputs,  handleInputChange, handleSubmit};
    }
    const {inputs, handleInputChange, handleSubmit} = useConstantsForm(httpPostRequestToChangeConstant);
    let constants_arr = sort_constants(constants, inputs, handleInputChange)
    return (
        <>
            <GenericTable table_data={{data: constants_arr, title: "משתני ההנהלה"}}></GenericTable>
            <br></br>
            <Button variant="outline-primary" onClick={handleSubmit}>שינוי ערכים</Button>
            </>
    )
}