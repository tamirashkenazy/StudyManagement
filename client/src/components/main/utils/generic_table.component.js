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


// export default function Student(props) {
//     const data = [
//                     { id: 1, name: 'itay', age: 21, email: 'itay@email.com' },
//                     { id: 2, name: 'eli', age: 19, email: 'eli@email.com' },
//                     { id: 3, name: 'yosi', age: 16, email: 'yosi@email.com' },
//                     { id: 4, name: 'mali', age: 25, email: 'mali@email.com' }
//                 ]
//     const title="table"
// }

const useStyles = makeStyles({
    titleRow : {
        textAlign : "center",
        backgroundColor : "#000875",
        color : "white",

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
        textAlign : "right"
    }, 
    headerCell : {
        backgroundColor : "#CCE5FF",
        textAlign : "right" 
    }

});

export default function GenericTable(props) {
    const classes = useStyles();
    const {data, title} = props.table_data
    
    let num_of_cols = 0
    if (data && data.length > 0) {
        num_of_cols = Object.keys(data[0]).length
    }
    const renderTableHeader = () => {
        // check if there is at least one element in the array
        if (!(data && data.length > 0)) {
            return null
        }
        let header = Object.keys(data[0])
        return (
            <TableRow className={classes.headerRow}>
                {header.map((key, index) => {
                    return <TableCell className={classes.headerCell} key={index}>{key.toUpperCase()}</TableCell>
                })}
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
            <Table stickyHeader aria-label="sticky table" >
                <TableHead >
                    {num_of_cols && <TableRow>
                        <TableCell  colSpan={num_of_cols} className={classes.titleRow}> {title}</TableCell>
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