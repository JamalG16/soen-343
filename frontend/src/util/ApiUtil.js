import axios from 'axios';
import { getToken } from './AuthUtil';

const api = axios.create({
    baseURL: `http://${process.env.REACT_APP_IP}/api/`,
});

export const login = async (email, password) => {
    return await api.post('/accounts/login', {
        email,
        password,
    });
}

export const register = async (firstName, lastName, email, address, phone, password, isAdmin) => {
    return await api({
        method: 'post',
        url: '/accounts',
        data: {
            firstName,
            lastName,
            email,
            address,
            phone,
            password,
            isAdmin,
        }, 
        headers: { 
            'Authorization': `Bearer ${getToken()}` 
        },
    });
}

export const getActiveUsers = async () => {
    return await api.get('/accounts?active=true', {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${getToken()}`,
        },
        responseType: 'json',
        crossorigin: true
    });
}