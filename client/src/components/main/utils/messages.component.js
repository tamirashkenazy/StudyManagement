import React from 'react';
import { Tab } from 'semantic-ui-react'
import GenericTable from './generic_table.component';

const get_messages_by_status=(msg_arr) =>{
    if (msg_arr) {
        let read_messages = msg_arr.filter(msg => msg.read)
        if (read_messages.length === 0 ) {
            read_messages = [{"אין הודעות" : ""}]
        }
        let unread_messages = msg_arr.filter(msg => msg.read === false)
        if (unread_messages.length === 0 ) {
            unread_messages = [{"אין הודעות" : ""}]
        }
        let messages_by_status = {read : read_messages , unread : unread_messages}
        return messages_by_status
    } else {
        return {read : [{"אין הודעות" : ""}] , unread : [{"אין הודעות" : ""}]}
    }

}

export function SendMessage({id, messages_arr}) {
    console.log(id, messages_arr);
    const messages_by_status = get_messages_by_status(messages_arr)
    let panes = null
    
    if (messages_arr) {
        panes = [
            { menuItem: 'נקרא', render: () => <Tab.Pane>{<GenericTable table_data={{data:messages_by_status.read, title:"נקראו"}} />}</Tab.Pane> },
            { menuItem: 'לא נקרא', render: () => <Tab.Pane>{<GenericTable table_data={{data:messages_by_status.unread, title:"לא נקראו"}} />}</Tab.Pane> },
            ]
    }
    return (
        <>
        {panes &&  <Tab panes={panes}/>}
        </>
    )
}