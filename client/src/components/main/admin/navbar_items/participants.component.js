import React, { useState } from 'react';
import { Tab } from 'semantic-ui-react'
import UserCard from '../../utils/card.component'
import {Dialog_generator} from '../../utils/utils'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import GenericTable from '../../utils/generic_table.component';
import {Form } from 'semantic-ui-react'

const make_participants = (arr_of_users, args, IDFilter) => {
    const users_by_roles = {teachers : [], students : []}
    const {setCardOpen, setCurrUser} = args
    if (arr_of_users && Array.isArray(arr_of_users) && arr_of_users.length>0){
        arr_of_users.filter(user=>user._id.includes(IDFilter)).forEach(user => {
            const id = user._id
            if (user.isTeacher) {
                users_by_roles.teachers.push({
                    "" : <IconButton onClick={()=>{setCardOpen(true); setCurrUser(user)}} color="primary"><AccountCircleOutlinedIcon/></IconButton>,
                    "ת.ז" : id,
                    "שם פרטי" : user.first_name,
                    "שם משפחה" : user.last_name,
                })
            }
            if (user.isStudent) {
                users_by_roles.students.push({
                    "" : <IconButton onClick={()=>{setCardOpen(true); setCurrUser(user)}} color="primary"><AccountCircleOutlinedIcon/></IconButton>,
                    "ת.ז" : id,
                    "שם פרטי" : user.first_name,
                    "שם משפחה" : user.last_name,
                })
            }
        })
        return users_by_roles
    }
}

export const filter_by_id = (arr_of_users, user) => {
    if (user) {
        if (arr_of_users && Array.isArray(arr_of_users) && arr_of_users.length > 0) {
            let curr_user = arr_of_users.filter(temp_user => temp_user._id === user._id)
            if (curr_user.length === 1) {
                return curr_user[0]
            }
            return null
        }
        return null
    }
}

export default function Participants({teachers, students, users}){
    const [isCardOpen, setCardOpen] = useState(false)
    const [user, setCurrUser ] = useState(null)
    const [IDFilter, setIDfilter] = useState("")
    let args = {setCardOpen, setCurrUser, teachers, students};
    let users_participants = make_participants(users, args, IDFilter)
    let panes=null
    if (users_participants) {
        panes = [
            { menuItem: 'מורים', render: () => <Tab.Pane>{<GenericTable table_data={{data:users_participants.teachers, title:"מורים"}} />}</Tab.Pane> },
            { menuItem: 'תלמידים', render: () => <Tab.Pane>{<GenericTable table_data={{data:users_participants.students, title:"תלמידים"}} />}</Tab.Pane> },
            ]
    }

    return (
        <>
        <Form.Field >
            <label >חיפוש לפי ת.ז:</label>
            <Form.Input value={IDFilter} onChange={(e)=>setIDfilter(e.target.value)} placeholder="תעודת זהות"></Form.Input>
        </Form.Field>
        {panes &&  <Tab panes={panes}/>}
        
        {Dialog_generator(
            isCardOpen, 
            ()=>setCardOpen(false), 
            null, null, 
            {user, teacher:filter_by_id(teachers, user), student:filter_by_id(students, user)}, 

            (props)=><UserCard user={props.user} teacher={props.teacher} student={props.student}></UserCard>, "card")
        }
        </>
    )
}