import React, {useState} from 'react';
import get_mongo_api from '../../mongo/paths.component'
import axios from 'axios'

export default function UploadGradesSheet(props){
    const [file, setFile] = useState(null)
    const {id, close_popup} = props
    const httpPostToUploadFile = (e) => {
        e.preventDefault()
        let url = get_mongo_api(`teachers/add/file/${id}`)
        const form_data = new FormData()
        form_data.append("uploadedFile", file)
        const config = {headers: {
            'content-type': 'multipart/form-data'
        }}
        axios.post(url, form_data, config).then(response => {
            if (response.data.success) {
                alert(response.data.message)
                close_popup()
            } else {
                alert(response.data.message)
            }
        })
    }
    return (
        <form onSubmit={(e)=>httpPostToUploadFile(e)}>
            <input type="file" style={{direction:"ltr"}} onChange={(e)=>setFile(e.target.files[0])} className="ui button"/>
            <br></br><br></br>
            <button type="submit" className="ui button blue">העלה קובץ</button>
        </form>
    )
}