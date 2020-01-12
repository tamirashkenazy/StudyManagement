import React, { useEffect } from 'react';
import {useAsyncHook} from '../../mongo/paths.component'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import {Button} from 'semantic-ui-react'

const useStyles = makeStyles({
    table: {
      direction : "rtl",

    },
    tableHead : {
        backgroundColor : "#CCE5FF"
    }
  });

export default function TeacherRequestTable(func) {

    const [teachers, loading] = useAsyncHook(`teachers`, null);
    const classes = useStyles();
    return (
        !loading && 
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead className={classes.tableHead}>
                    <TableRow>
                        <TableCell align="right">ת.ז</TableCell>
                        <TableCell align="right">קורס</TableCell>
                        <TableCell align="right">גיליון</TableCell>
                        <TableCell align="right">כפתורים</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {teachers.map(teacher => {
                    let id = teacher._id
                    console.log('id: ', id);
                    let requests = teacher.teaching_requests
                    return(
                        requests.map(request=>{
                            console.log(request);
                            return(
                                <TableRow key={`${id}-${request.course_name}`}>
                                    <TableCell align="right">{id}</TableCell>
                                    <TableCell component="th" scope="row" align="right">{request.course_name}</TableCell>
                                    <TableCell align="right">גיליון</TableCell>
                                    <TableCell align="right"><button><CheckIcon style={{color:"green"}}/></button></TableCell>
                                </TableRow>
                            )
                        })
                    )
                    // onClick={()=>confirmCourse(id)}
                })}
                
                </TableBody>
            </Table>
        </TableContainer>
    )
}