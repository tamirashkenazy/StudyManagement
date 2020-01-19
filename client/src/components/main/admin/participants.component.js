import React, { useState } from 'react';
import {useAsyncHook} from '../../mongo/paths.component'
import { Tab } from 'semantic-ui-react'
import UserCard from '../utils/card.component'
import {Dialog_generator} from '../utils//utils'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import GenericTable from '../utils/generic_table.component';


const make_participants = (arr_of_users, args) => {
    const users_by_roles = {teachers : [], students : []}
    const {setCardOpen, setUserID} = args
    if (arr_of_users && arr_of_users!==undefined && arr_of_users.length>0){
        arr_of_users.forEach(user => {
            if (user.isTeacher) {
                users_by_roles.teachers.push({
                    "" : <IconButton onClick={()=>{setCardOpen(true); setUserID(user._id)}}><AccountCircleOutlinedIcon/></IconButton>,
                    "ת.ז" : user._id,
                    "שם פרטי" : user.first_name,
                    "שם משפחה" : user.last_name,
                })
            }
            if (user.isStudent) {
                users_by_roles.students.push({
                    "" : <IconButton onClick={()=>{setCardOpen(true); setUserID(user._id)}}><AccountCircleOutlinedIcon/></IconButton>,
                    "ת.ז" : user._id,
                    "שם פרטי" : user.first_name,
                    "שם משפחה" : user.last_name,
                })
            }
        })
        return users_by_roles
    }
}

export default function Participants(){
    const [isCardOpen, setCardOpen] = useState(false)
    const [user_id, setUserID] = useState(null)
    let args = {setCardOpen, setUserID}
    const [users, loading] = useAsyncHook(`users`, make_participants, args);
    const panes = [
    { menuItem: 'מורים', render: () => <Tab.Pane>{<GenericTable table_data={{data:users.teachers, title:null}} />}</Tab.Pane> },
    { menuItem: 'תלמידים', render: () => <Tab.Pane>{<GenericTable table_data={{data:users.students, title:null}} />}</Tab.Pane> },
    ]
    return (
        !loading &&  <>
         <Tab panes={panes}/>
        {Dialog_generator(isCardOpen, ()=>setCardOpen(false), "כרטיס סטודנט" ,{}, ()=><UserCard user_id={user_id}></UserCard>)}
        </>
    )
       
}