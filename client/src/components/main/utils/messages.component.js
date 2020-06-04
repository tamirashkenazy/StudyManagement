import React, {useState} from 'react';
import { Tab, Form } from 'semantic-ui-react'
// import GenericTable from './generic_table.component';
import get_mongo_api from '../../mongo/paths.component'
import axios from 'axios'

const httpPostRequestSendMessage = (user, msg, close_popup) => {
    const post_msg = {
        message : msg,
        user : user
    }
    axios.post(get_mongo_api("users/mailToAdmin"), post_msg).then((response)=> {
        if (response.data.success) {
            alert(response.data.message)
            close_popup()
        } else {
            alert("ההודעה לא נשלחה, נסו שוב")
        }
    })
}


export function SendMessage({user, close_popup}) {
    const [msg, setMsg] = useState("")
    const message_box = () => {
        return (
            <Form>
                <Form.TextArea label="הודעה חדשה" placeholder="הודעה" autoFocus value={msg} onChange={(e,{value})=>{setMsg(value)}}></Form.TextArea>
                <Form.Button onClick={()=>httpPostRequestSendMessage(user, msg, close_popup)}>שליחה</Form.Button>
            </Form>
        )
    }

    let panes = [
        { menuItem: 'שליחת הודעה למנהל', render: () => <Tab.Pane>{message_box()}</Tab.Pane> },
    ]
    return (
        <>
        {panes &&  <Tab panes={panes}/>}
        </>
    )
}