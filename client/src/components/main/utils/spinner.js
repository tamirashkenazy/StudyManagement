import React from 'react';

import Spinner from 'react-bootstrap/Spinner'
import Jumbotron from 'react-bootstrap/Jumbotron'

/**
 * the spinner will be shown when there is a loading time
 */
export function SpinnerLoader({header}) {
    return (
        <Jumbotron style={{textAlign : "center" , direction : "rtl"}}>
            <h1>{header}</h1>
            <Spinner animation="border" role="status"/>
        </Jumbotron>
    )
}
