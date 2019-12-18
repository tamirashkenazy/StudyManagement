import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'

export default function Main(props) {
    let history = useHistory();

    const [userDetails, setUserDetails] = useState({ first_name: "", last_name: "" });
    const [isLoading, setIsLoading] = useState(true)
    function onLogOut() {
        history.push("/");
    }

    const fetchDataById = async (_id) => {
        axios.get(`http://localhost:5000/users/${_id}`).then((response=>{
            if (response.data.success) {
                let user = response.data.user
                console.log(JSON.stringify(response.data.user));
                if (user.isStudent) {
                    history.push("/main/student");
                }
                else if (user.isTeacher) {
                    history.push("/main/teacher");
                }
                setUserDetails({ first_name: user.first_name, last_name: user.last_name })
                setIsLoading(false)
            } else {

            }
        }))
    }

    useEffect(()=>{
        console.log(Object.keys(props))
        console.log(JSON.stringify(props))
        const _id = props.location.state._id;
        console.log("id: " + (_id));
        fetchDataById(_id)
    });

    return (
        <div>
            {!isLoading ?<h1> Hello  {userDetails.first_name + " " + userDetails.last_name}</h1> : <h2>Loading</h2>}
            <button type="button" onClick={onLogOut}>
                logout
            </button>
        </div>
    )
}
