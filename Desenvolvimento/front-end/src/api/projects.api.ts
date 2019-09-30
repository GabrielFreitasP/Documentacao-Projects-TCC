import axios from 'axios';
import { backend } from '../util/constants.util';

export const postProject = (data: any) => {
    return axios.request({ method: 'post', baseURL: backend, url: `/project`, data });
};

export const getProjects = (params, companyId) => {
    if (companyId) {
        return axios.request({ method: 'get', baseURL: backend, url: `/project/company/${companyId}`, params });
    } else {
        return axios.request({ method: 'get', baseURL: backend, url: `/project`, params });
    }
};