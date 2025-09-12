import axios from 'axios';
const instance = axios.create(
    {
        baseURL: "http://localhost:8080/",
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',   
        }
    })

export default {
 
    async getCtrChart() {
        try {
            const { data } = await instance.get('/ctr')
            return data
        } catch (e) {
            console.error(e)
        }
    },

    async getMvPMChart(event: string) {
        try {
            const { data } = await instance.get('/evpm', { params: { event }})
            return data
        } catch (e) {
            console.error(e)
        }
    }
        
}