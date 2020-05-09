import React from 'react';
import get_mongo_api from '../../mongo/paths.component'

export default function UploadGradesSheet(props){
    const { id} = props
    return (
        <div style={{direction : "ltr"}}>
            <form action={get_mongo_api(`teachers/add/file/${id}`)} method="POST" encType="multipart/form-data" >
                <label for="file"> File Name: </label>
                <input type="text"  placeholder="File Name.." style={{direction : "ltr"}}/><br />
                <input type="file" name="uploadedFile" /> <br /> <br />
                <input type="submit" value="Upload File"/>
             </form>
        </div>
    )
}