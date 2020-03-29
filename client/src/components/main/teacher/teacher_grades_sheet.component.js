import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import get_mongo_api from '../../mongo/paths.component'
import Input from '@material-ui/core/Input';
// import Button from '@material-ui/core/Button';
import axios from 'axios'
import {Form , Button} from 'semantic-ui-react'


export default function UploadGradesSheet(props){
    const { id} = props

    const httpPostRequestToUploadFile = () => {
        const login_user = {  
            grades_sheet : inputs.grades_sheet,
        }
        axios.post(get_mongo_api(`teachers/add/file/${id}`), login_user.grades_sheet).then((response)=> {
            if (response.data.success) {
                alert(response.data.message)
                window.location.reload(true)
                
            } else {
                alert(response.data.message)
            }
        })
    }

    const useUploadGradesSheetForm = (callback) => {
        const [inputs, setInputs] = useState({ grades_sheet: ''})
        const handleSubmit = (event) => {
            if (event) {
                event.preventDefault();
                callback(inputs)
            }
            
        }
        const handleInputChange = (event, {name, value}) => {
            event.persist();
            console.log('value: ', value);
            setInputs(inputs => ({...inputs, [name] : value}));
        }
        return { handleSubmit, handleInputChange,  inputs};
    }

    const {inputs, handleInputChange, handleSubmit} = useUploadGradesSheetForm(httpPostRequestToUploadFile);

    return (
        <>
            <form action={get_mongo_api(`teachers/add/file/${id}`)} method="POST" enctype="multipart/form-data">
                <input type="text" name="name" placeholder="File Name.." /><br />
                <input type="file" name="uploadedFile" /> <br /> <br />
                <input type="submit" value="Upload File" />
             </form>
            <hr></hr>
        {/* <Form >
                <Form.Field>
                    <Form.Input
                        style={{direction:"ltr"}}
                        type="file"
                        
                        name='grades_sheet'
                        value={inputs.grades_sheet} 
                        onChange={handleInputChange}
                    />
                </Form.Field>

                <Form.Field>
                    <Button onClick={handleSubmit} primary >העלאת קובץ</Button>
                </Form.Field>
            </Form> */}
        </>
    )
}