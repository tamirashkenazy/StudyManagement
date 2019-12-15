import React from 'react'
import {useHistory} from 'react-router-dom'

export default function Main(props) {
    let history = useHistory();

    function onLogOut() {
        history.push("/");
    }

    return (
        <div>
            <h1>
                Hello {props.location.state.first_name}
            </h1>
            <button type="button" onClick={onLogOut}>
                logout
            </button>
        </div>
    )
}
