import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
    titleRow : {
        textAlign : "center",
        backgroundColor : "#546e7a", //#01579b
        color : "white",
        fontSize : "2rem",
    },
    table : {
        direction : "rtl",
        maxHeight: "50vh",
        textAlign : "center",
        "overflow-y": 'auto',
    },
    cell : {
        textAlign : "center",
        fontSize : "1rem",
        align: "center",
        border : "0px"


    }, 
    headerCell : {
        backgroundColor : "#cfd8dc",
        textAlign : "center",
        fontSize : "1.2rem",
        border : "0px"


    }

});

export default function GenericTable(props) { //props : {table_data : {data: some_data-> array of objects , title: string_of_title}}
    const classes = useStyles();
    let data, title;
    if (props.table_data) {
        data = props.table_data.data
        title = props.table_data.title
    }
    
    let num_of_cols = 0
    if (data && data.length > 0) {
        num_of_cols = Object.keys(data[0]).length
    }
    const renderTableHeader = () => {
        // check if there is at least one element in the array
        if ( !data || (Array.isArray(data) &&  data.length === 0)) {
            return <TableRow><TableCell></TableCell></TableRow>
        }
        let header = Object.keys(data[0])

        return (
            <TableRow className={classes.headerRow}>
                {header.map((key, index) => 
                    <TableCell className={classes.headerCell} key={index}>{key}</TableCell>
                )}
            </TableRow>
        )
    }

    const renderTableData = () => {
        //removed the index if not necessary
        if (!(data && data.length > 0)) {
            return null
        }
        return data.map((element, index) => {
            let cols = Object.keys(element)
            if (!(cols && cols.length>0)){
                return null
            }
            return (
                <TableRow  key={index}>
                    {cols.map((val, index) => {
                        return <TableCell  className={classes.cell} key={index}>{element[cols[index]]}</TableCell>
                    })}
                </TableRow>
            )
        })
    }
    return (
        <TableContainer className={classes.table} component={Paper} >
            <Table size="small" stickyHeader>
                <TableHead >
                    {(num_of_cols>0 && title) && <TableRow>
                        <TableCell  colSpan={num_of_cols} className={classes.titleRow}><Typography variant="h5">{title}</Typography> </TableCell>
                    </TableRow>}
                    {renderTableHeader()}
                </TableHead>
                <TableBody> 
                    {renderTableData()}
                </TableBody>
            </Table>
        </TableContainer>
    )
}