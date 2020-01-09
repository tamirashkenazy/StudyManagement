import {useState, useEffect} from 'react';
import axios from 'axios'


const GET_MONGO_PATH = () => 'http://localhost:5000'
const get_mongo_api = (http_request) => {
    return `${GET_MONGO_PATH()}/${http_request}`
}

// from here https://dev.to/vinodchauhan7/react-hooks-with-async-await-1n9g
export function useAsyncHook(api, func_to_sort) {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getCoursesFromDB(){
            const response = await axios.get(get_mongo_api(api)).then(response=>{ //api = `courses`
                return response.data
            })
            const arr_of_courses = await response
            const options = func_to_sort(arr_of_courses)
            setResult(options);
            setLoading(false)
        }
        getCoursesFromDB()
    },[api, func_to_sort])
    return [result, loading];
}

export default get_mongo_api


