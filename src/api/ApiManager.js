import axios from 'axios';

const ApiManager = axios.create({
    baseURL: 'https://hybee-auth.moshimoshi.cloud',
    responseType: 'json',
    withCredentials: true,
});

export default ApiManager;