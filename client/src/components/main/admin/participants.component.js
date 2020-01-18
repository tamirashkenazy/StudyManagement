import React from 'react';
import {useAsyncHook} from '../../mongo/paths.component'
import { Table } from 'semantic-ui-react'
import { Tab } from 'semantic-ui-react'
const make_participants = (arr_of_users) => {
    // let local_courses = courses
    if (arr_of_users && arr_of_users!==undefined && arr_of_users.length>0){
        let options = arr_of_users.map(user => {
            return (
                {
                    _id : user._id,
                    first_name : user.first_name,
                    last_name : user.last_name,
                    tel_number : user.tel_number,
                    email : user.email,
                    role : {isTeacher : user.isTeacher, isStudent : user.isStudent},
                    // value : `${course_obj._id}-${course_obj.name}`,
                    // text : `${course_obj._id} - ${course_obj.name}`
                }
            )
        })
        return options
    }
}
// const make_arr = (arr) => {
//     if (arr && arr!==undefined && arr.length>0){
//         let options = arr.map(obj => {
//             return (
//                 {
//                     _id : obj._id,
//                     data : obj
//                     // value : `${course_obj._id}-${course_obj.name}`,
//                     // text : `${course_obj._id} - ${course_obj.name}`
//                 }
//             )
//         })
//         return options
//     }
// }

const findById = (users, id, field) => {
    let user = users.filter(user=>user._id === id)
    if (user && user.length > 0) {
        user = user[0]
        return user[field]
    }
    return null
    // console.log(user[0]);
}

const createData = (users, teachers, students, func) => {
    let first_name_field = "first_name"
    let last_name_field = "last_name"
    let new_students = students.map(student=> {
        return (
            {...student,
                first_name : func(users,student._id, first_name_field),
                last_name : func(users,student._id, last_name_field),

            }
        )
    })
    let new_teachers = teachers.map(teacher=> {
        return (
            {...teacher,
                first_name : func(users,teacher._id, first_name_field),
                last_name : func(users,teacher._id, last_name_field)
            }
        )
    })
    // console.log("newStudent: ", new_student);
    return {teachers : new_teachers, students : new_students}
}

const table = (arr) => {
    return (
        <Table   textAlign="center" sortable style={{direction : "rtl"}}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell 
                        // sorted={column === 'name' ? direction : null}
                        // onClick={this.handleSort('name')}
                    >
                        ת.ז
                    </Table.HeaderCell>
                    <Table.HeaderCell>שם פרטי</Table.HeaderCell>
                    <Table.HeaderCell>שם משפחה</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {arr.map(arr_obj=> {
                    return (
                        <Table.Row key={arr_obj._id}>
                            <Table.Cell>{arr_obj._id}</Table.Cell>
                            <Table.Cell>{arr_obj.first_name}</Table.Cell>
                            <Table.Cell>{arr_obj.last_name}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
    )
    
}


export default function Participants(){

    // const [selectedCourse, setSelectedCourse] = useState(null)
    const [users, loading] = useAsyncHook(`users`, make_participants);
    const [teachers, load_teachers] = useAsyncHook(`teachers`,(x)=>(x));
    const [students, load_students] = useAsyncHook(`students`, (x)=>(x));
    const data = createData(users, teachers, students, findById)

    const panes = [
    { menuItem: 'מורים', render: () => <Tab.Pane>{table(data.teachers)}</Tab.Pane> },
        { menuItem: 'תלמידים', render: () => <Tab.Pane>{table(data.students)}</Tab.Pane> },
    ]
    return (
        !loading &&data.teachers && data.students  &&
        <Tab panes={panes}/>
        
        // <Grid columns={6} style={{ margin:"10%", minHeight:"20%"}} >
        //     {users.map(user=>{
        //         return (
        //             <Grid.Row key={user._id}>
                        
        //             </Grid.Row>
        //         )
        //     })}
        //     <Grid.Row >
        //         <Dropdown  fluid placeholder='בחר קורס' onChange={(e,{value})=> setSelectedCourse(value)} options={courses_options}/>
        //     </Grid.Row>
        //     <Grid.Row>
        //         <Dropdown  placeholder='מספר שעות' onChange={(e,{value})=>setHours(value)} options={get_options(4)}/>
        //     </Grid.Row>
        //     {selectedCourse && hours && <Grid.Row>
        //         <Button onClick={()=>{sendCourse(props._id); console.log('clicked');}}>שלח</Button>
        //     </Grid.Row>}
        // </Grid>
    )
}