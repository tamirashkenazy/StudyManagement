import React, {useState} from 'react';
import { Tab } from 'semantic-ui-react'
// import GenericTable from './generic_table.component';
import {Form} from 'semantic-ui-react'
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
            alert("ההודעה לא נשלחה, נסה שוב")
        }
    })
}


export function SendMessage({user, close_popup}) {
    const [msg, setMsg] = useState("")
    const message_box = () => {
        return (
            <>
            <Form>
                <Form.TextArea label="הודעה חדשה" placeholder="הודעה" autoFocus value={msg} onChange={(e,{value})=>{console.log(value);setMsg(value)}}></Form.TextArea>
                <Form.Button onClick={()=>httpPostRequestSendMessage(user, msg, close_popup)}>שליחה</Form.Button>
            </Form>
            {/* <FilledInput multiline="true" rows="5" rowsMax="10" fullWidth="true" autoFocus="true" value={msg} onChange={(value)=>setMsg(value)}/> */}
            </>
        )
    }
    // console.log(id, messages_arr);
    // const messages_by_status = get_messages_by_status(messages_arr)
    let panes = [
        // { menuItem: 'נקרא', render: () => <Tab.Pane>{<GenericTable table_data={{data:messages_by_status.read, title:"נקראו"}} />}</Tab.Pane> },
        // { menuItem: 'לא נקרא', render: () => <Tab.Pane>{<GenericTable table_data={{data:messages_by_status.unread, title:"לא נקראו"}} />}</Tab.Pane> },
        { menuItem: 'שליחת הודעה', render: () => <Tab.Pane>{message_box()}</Tab.Pane> },
    ]
    return (
        <>
        {panes &&  <Tab panes={panes}/>}
        </>
    )
}