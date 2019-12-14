import React from 'react'
import {useHistory} from 'react-router-dom'

export default function Main() {
    let history = useHistory();

    function onLogOut() {
        history.push("/");
    }

    return (
        <div>
            <h1>
                Main
            </h1>
            <button type="button" onClick={onLogOut}>
                logout
            </button>
        </div>
    )
}
