import React, { useState } from 'react';
import { Tab } from 'semantic-ui-react'
import UserCard from '../utils/card.component'
import {Dialog_generator} from '../utils//utils'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import GenericTable from '../utils/generic_table.component';


const make_participants = (arr_of_users, args) => {
    const users_by_roles = {teachers : [], students : []}
    const {setCardOpen, setCurrUser} = args
    if (arr_of_users && arr_of_users!==undefined && arr_of_users.length>0){
        arr_of_users.forEach(user => {
            const id = user._id
            if (user.isTeacher) {
                users_by_roles.teachers.push({
                    "" : <IconButton onClick={()=>{setCardOpen(true); setCurrUser(user)}}><AccountCircleOutlinedIcon/></IconButton>,
                    "ת.ז" : id,
                    "שם פרטי" : user.first_name,
                    "שם משפחה" : user.last_name,
                })
            }
            if (user.isStudent) {
                users_by_roles.students.push({
                    "" : <IconButton onClick={()=>{setCardOpen(true); setCurrUser(user)}}><AccountCircleOutlinedIcon/></IconButton>,
                    "ת.ז" : id,
                    "שם פרטי" : user.first_name,
                    "שם משפחה" : user.last_name,
                })
            }
        })
        return users_by_roles
    }
}

const filter_by_id = (arr_of_users, user) => {
    if (user) {
        if (arr_of_users && Array.isArray(arr_of_users) && arr_of_users.length > 0) {
            let a = arr_of_users.filter(temp_user => temp_user._id === user._id)
            if (a.length === 1) {
                return a[0]
            }
            return null
        }
        return null
    }
}

export default function Participants(props){
    const {teachers, students, users} = props
    const [isCardOpen, setCardOpen] = useState(false)
    const [user, setCurrUser ] = useState(null)
    let args = {setCardOpen, setCurrUser, teachers, students};
    let users_participants = make_participants(users, args)
    let panes=null
    if (users_participants) {
        panes = [
            { menuItem: 'מורים', render: () => <Tab.Pane>{<GenericTable table_data={{data:users_participants.teachers, title:null}} />}</Tab.Pane> },
            { menuItem: 'תלמידים', render: () => <Tab.Pane>{<GenericTable table_data={{data:users_participants.students, title:null}} />}</Tab.Pane> },
            ]
    }

    return (
        <>
         <Tab panes={panes}/>
        {Dialog_generator(isCardOpen, ()=>setCardOpen(false), "כרטיס סטודנט" ,"person_pin",{}, ()=><UserCard user={user} teacher={filter_by_id(teachers, user)} student={filter_by_id(students, user)}></UserCard>)}
        </>
    )
}