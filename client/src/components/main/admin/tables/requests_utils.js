import React, {useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green, red, grey } from '@material-ui/core/colors';
import { Radio, Button } from '@material-ui/core';
import axios from 'axios';
import get_mongo_api from '../../../mongo/paths.component';

export const GreenRadio = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  export const RedRadio = withStyles({
    root: {
      color: red[400],
      '&$checked': {
        color: red[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  export const GreyRadio = withStyles({
    root: {
      color: grey[400],
      '&$checked': {
        color: grey[600],
      },
    },
    checked: {},
  })((props) => <Radio icon={<Button>הסרת בחירה</Button>} color="default" {...props} />);


export const httpRequestToApproveDeclineRequests = (selectedValues, api) => {
    console.log(selectedValues);
    let arr = Object.entries(selectedValues).filter(([id, course_to_status_obj])=>{
        if (course_to_status_obj && Object.keys(course_to_status_obj).length > 0) {
            return true
        }
    })
    console.log(arr);
    let post_msg = {id_to_courses : arr}
    axios.post(get_mongo_api(api),post_msg).then(response=>{ 
        if (response.data.success) {
            alert(response.data.message)
            window.location.reload(true)
        } else {
            alert(response.data.message)
        }
    })
}


const create_initial_object_requests = (arr) => {
    let start_requesters_object = {}
    if (arr && Array.isArray(arr) && arr.length > 0) {
        arr.forEach(obj => {
            start_requesters_object[obj._id] = {}
        })
    }
    return start_requesters_object
}

export const useChoosingForm = (httpRequestFunc, arr_of_persons, update_api) => {
    let start_requesters_object = create_initial_object_requests(arr_of_persons)
    const [selectedValues, setSelectedValues] = useState(start_requesters_object)
    useEffect(()=>{
        setSelectedValues(start_requesters_object)   
    }, [arr_of_persons])
    // const [wasAdded, setWasAdded] = useState(false)
    async function handleSubmit (event) {
        if (event) {
            event.preventDefault();
            let return_val = await httpRequestFunc(selectedValues, update_api)
            if (return_val) {
                window.location.reload(true)
            }
            
        }
    }
    const handleInputChange = (event) => {
        event.persist();

        let {name, value} = event.target
        let [id, course_id] = name.split(',')
        if (value === "") {
            value = null
        }
        console.log(name, value, id, course_id);
        setSelectedValues(selectedValues => {
            return({...selectedValues, [id] : {...selectedValues[id], [course_id] : value}})
        });
        console.log(selectedValues);

    }
    return {selectedValues, handleInputChange, handleSubmit};
}