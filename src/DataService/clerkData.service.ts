import axios from "../api/axios"


export const getClerkInfoFromServer = async ()=>{
    const result = await axios.get('/data-clerk');
    const data = result.data as {username:string, balance:number,questionsEntered:number}
    return data;
}