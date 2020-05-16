import React, {useState} from 'react';
import { Tab } from 'semantic-ui-react'
// import GenericTable from './generic_table.component';
import {Form} from 'semantic-ui-react'
import get_mongo_api from '../../mongo/paths.component'
import axios from 'axios'

const httpPostRequestSendMessage = (id, msg) => {
    const post_msg = {
        content : msg,
        to : "admin",
        from : id
    }
    axios.post(get_mongo_api(), post_msg).then((response)=> {
        if (response.data.success) {
            alert(response.data.message)
        } else {
            alert("ההודעה לא נשלחה, נסה שוב")
        }
    })
}

// const get_messages_by_status=(msg_arr) =>{
//     if (msg_arr) {
//         let read_messages = msg_arr.filter(msg => msg.read)
//         if (read_messages.length === 0 ) {
//             read_messages = [{"אין הודעות" : ""}]
//         }
//         let unread_messages = msg_arr.filter(msg => msg.read === false)
//         if (unread_messages.length === 0 ) {
//             unread_messages = [{"אין הודעות" : ""}]
//         }
//         let messages_by_status = {read : read_messages , unread : unread_messages}
//         return messages_by_status
//     } else {
//         return {read : [{"אין הודעות" : ""}] , unread : [{"אין הודעות" : ""}]}
//     }

// }

export function SendMessage({id, messages_arr}) {
    const [msg, setMsg] = useState("")
    const message_box = () => {
        return (
            <>
            <Form>
                <Form.TextArea label="הודעה חדשה" placeholder="הודעה" autoFocus value={msg} onChange={(e,{value})=>{console.log(value);setMsg(value)}}></Form.TextArea>
                <Form.Button onClick={()=>httpPostRequestSendMessage(id, msg)}>שליחה</Form.Button>
            </Form>
            {/* <FilledInput multiline="true" rows="5" rowsMax="10" fullWidth="true" autoFocus="true" value={msg} onChange={(value)=>setMsg(value)}/> */}
            </>
        )
    }
    console.log(msg);
    // console.log(id, messages_arr);
    // const messages_by_status = get_messages_by_status(messages_arr)
    let panes = null
    if (messages_arr) {
        panes = [
            // { menuItem: 'נקרא', render: () => <Tab.Pane>{<GenericTable table_data={{data:messages_by_status.read, title:"נקראו"}} />}</Tab.Pane> },
            // { menuItem: 'לא נקרא', render: () => <Tab.Pane>{<GenericTable table_data={{data:messages_by_status.unread, title:"לא נקראו"}} />}</Tab.Pane> },
            { menuItem: 'שליחת הודעה', render: () => <Tab.Pane>{message_box()}</Tab.Pane> },
        ]
    }
    return (
        <>
        {panes &&  <Tab panes={panes}/>}
        </>
    )
}