import React, { useState } from 'react';
import { Button, Checkbox} from 'semantic-ui-react'
import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import get_mongo_api, { useAsyncHook } from '../../mongo/paths.component'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Table, TableContainer, TableBody, TableRow, TableCell } from '@material-ui/core';

const make_courses_option = (arr_of_courses, teacher) => {
    const { teaching_requests, teaching_courses } = teacher
    let set_of_courses_id = new Set(teaching_requests.map(teaching_req => teaching_req.course_id).concat(teaching_courses.map(course => course.course_id)))
    if (arr_of_courses && arr_of_courses.length > 0) {
        arr_of_courses = arr_of_courses.filter(course => !set_of_courses_id.has(course._id))
        let options = arr_of_courses.map(course_obj => {
            return (
                {
                    key: course_obj._id,
                    value: `${course_obj._id}-${course_obj.name}`,
                    text: `${course_obj._id} - ${course_obj.name}`
                }
            )
        })
        return options
    } else {
        return null
    }
}

export default function CoursesToTeach(props) {
    // const {_id, teacher} = props
    const { teacher } = props
    const [selectedCourses, setSelectedCourses] = useState([])
    const [courses_options, loading] = useAsyncHook(`courses`, make_courses_option, teacher);


    const sendCourses = (id) => {
        // let courses_msg_arr = []
        Object.entries(selectedCourses).forEach(([key, value]) => {
            if (value === true) {
                let course_id = key.split('-')[0]
                let course_name = key.split('-')[1]
                console.log(id);
                axios.post(get_mongo_api(`teachers/add/request/${id}`), { course_id: course_id, course_name: course_name }).then(response => {
                    if (!response.data.success) {
                        console.log(response.data.message)
                    } else {
                        // console.log('course name: ', course_name);
                        // courses_msg_arr.push(course_name)
                        alert(response.data.message)
                        window.location.reload(true)

                    }
                })
            }
        })
    }

    const onChangeCourse = (e, { value, checked }) => {
        let new_selected = Object.assign({}, selectedCourses)
        if (checked === true) {
            new_selected[value] = checked
        } else if (checked === false) {
            delete new_selected[value]
        }
        setSelectedCourses(new_selected)
    }

    return (
        (!loading) &&
        <Grid columns={1} style={{ marginRight: "5%" }} >
            {(courses_options && Array.isArray(courses_options) && courses_options.length > 0) ?
                courses_options.map(option_obj => {
                    return (
                        <Grid.Row  key={option_obj.value} stretched="true" padded="vertically">
                            <FormControlLabel className="checkbox"
                                control={<Checkbox
                                    checked={option_obj.value in selectedCourses && selectedCourses[option_obj.value]}
                                    value={option_obj.value}
                                    onChange={onChangeCourse}
                                />}
                                label={option_obj.text}
                            />
                        </Grid.Row>
                    )

                }) : <div>כל הקורסים נבחרו ונשלחו</div>}
            {/* <Dropdown  fluid placeholder='בחר קורס' onChange={(e,{value})=> setSelectedCourse(value)} options={courses_options}/> */}

            {/* <Grid.Row> */}
            {/* <Dropdown  placeholder='מספר שעות' onChange={(e,{value})=>setHours(value)} options={get_options(4)}/> */}
            {/* </Grid.Row> */}
            {(selectedCourses && Object.entries(selectedCourses).length > 0) && <Grid.Row>
                <Button onClick={() => sendCourses(props.id)}>שלח</Button>
            </Grid.Row>}
        </Grid>
        // <Table>
        //     <TableContainer>
        //         <TableBody>
        //         {(courses_options && Array.isArray(courses_options) && courses_options.length > 0) ?
        //         courses_options.map(option_obj => {
        //             return (
        //                 <TableRow  key={option_obj.value}>
                            
        //                     <FormControlLabel className="checkbox"
        //                         control={<Checkbox
        //                             checked={option_obj.value in selectedCourses && selectedCourses[option_obj.value]}
        //                             value={option_obj.value}
        //                             onChange={onChangeCourse}
        //                         />}
        //                         label={option_obj.text}
        //                     />
        //                 </TableRow>
        //             )

        //         }) : <div>כל הקורסים נבחרו ונשלחו</div>}
        //         </TableBody>
        //     </TableContainer>
        // </Table>
    )
}