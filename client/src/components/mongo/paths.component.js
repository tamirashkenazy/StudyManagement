let GET_MONGO_PATH = () => 'http://localhost:5000'
let get_mongo_api = (http_request) => {
    return `${GET_MONGO_PATH()}/${http_request}`
}
export default get_mongo_api