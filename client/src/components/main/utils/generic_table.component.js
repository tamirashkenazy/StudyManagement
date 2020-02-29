import React from 'react'
// import '../../../styles/table.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    titleRow : {
        textAlign : "center",
        backgroundColor : "#000875",
        color : "white",
        fontSize : "1.4rem"

    },
    table : {
        direction : "rtl",
        align : "right",
        textAlign : "right",
        maxHeight : "60vh",
        maxWidth : "95%", 
        margin : "0 auto" //will center the table inside the component its located

    },
    cell : {
        textAlign : "center",
        fontSize : "1.2rem",
        align: "center"
    }, 
    headerCell : {
        backgroundColor : "#CCE5FF",
        textAlign : "center",
        fontSize : "1.3rem",
    }

});

export default function GenericTable(props) { //props : {table_data : {data: some_data-> array of objects , title: string_of_title}}
    const classes = useStyles();
    const {data, title} = props.table_data
    
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
        <TableContainer component={Paper} className={classes.table}>
            <Table size="small" stickyHeader>
                <TableHead >
                    {(num_of_cols>0 && title) && <TableRow>
                        <TableCell  colSpan={num_of_cols} className={classes.titleRow}>{title}</TableCell>
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