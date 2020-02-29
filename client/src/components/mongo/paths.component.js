import {useState, useEffect} from 'react';
import axios from 'axios'
const port = "5001"
const GET_MONGO_PATH = () => `http://localhost:${port}`
const get_mongo_api = (http_request) => {
    return `${GET_MONGO_PATH()}/${http_request}`
}

// from here https://dev.to/vinodchauhan7/react-hooks-with-async-await-1n9g
export function useAsyncHook(api, func_to_sort, args=null) {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    // console.log("api: ", api);
    // the useEffect function happens every time that the args (api, func_to_sort, args=null) are changing
    useEffect(() => {
        async function getDataFromAPI(){
            const response = await axios.get(get_mongo_api(api)).then(response=>{
                if (response.data.success===true) {
                    return response.data.message
                } else {
                    return null
                }
            })
            const arr_from_db = await response
            let options = null
            if (func_to_sort) {
                if (args) {
                    options = func_to_sort(arr_from_db, args)
                } else {
                    options = func_to_sort(arr_from_db)
                }
            } else {
                options = arr_from_db
            }
            setResult(options);
            setLoading(false)
        }
        getDataFromAPI()
    },[])
    return [result, loading];
}

export default get_mongo_api


