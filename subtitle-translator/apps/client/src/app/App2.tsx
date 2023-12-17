import axios from "axios"
import { useQuery } from "react-query"
import React from "react"

const fetchFiles = async () => {
    const resp = await axios.get('http://192.168.1.106:3333/api/files')
    return resp
}

const App2 = () => {
    const {data, error, isFetching} = useQuery('files', fetchFiles)

    if (isFetching) {
        return <>Loading....</>
    }

    if(error) {
        return <>{error}</>
    }

    return (<ul>
        {data?.data}
    </ul>)
}

export default App2