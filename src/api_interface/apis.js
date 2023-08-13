import axios from "axios";
import { REACT_API_URL } from "./apiURLs";



export const postApi = (path, data) => {
    return axios.post(path, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const getApi = (path) => {
    return axios.get(path, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const putApi = (path, data) => {
    return axios.put(path, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const postTokenApi = (path, data, header = {}) => {
    const token = localStorage.getItem("x-access-token");
    return axios.post(path, data, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
            ...header,
        },
    });
};

export const patchTokenApi = (path, data, header = {}) => {
    const token = localStorage.getItem("x-access-token")
    return axios.patch(path, data, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
            ...header

        }
    });
};

export const putTokenApi = (path, data, header = {}) => {
    const token = localStorage.getItem("x-access-token")
    return axios.put(path, data, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
            ...header

        }
    });
};

export const getTokenApi = (path, header = {}) => {
    const token = localStorage.getItem("x-access-token")
    return axios.get(path, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
            ...header
        }
    });
};

export const deleteTokenApi = (path, header = {}) => {
    const token = localStorage.getItem("x-access-token");
    return axios.delete(path, {
        headers: {
            "Content-Type": "application/json",
            asas: "asas",
            "x-access-token": token,
            ...header,
        },
    });
};