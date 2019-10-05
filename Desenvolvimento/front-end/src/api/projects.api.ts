import axios from 'axios';
import { backend } from '../util/constants.util';

export const postProject = (data: any) => {
    return axios.request({ method: 'post', baseURL: backend, url: `/project`, data });
};

export const putProject = (data: any,) => {
    return axios.request({ method: 'put', baseURL: backend, url: `/project/${data.id}`, data });
};

export const getProjects = (params: any, companyId?: number) => {
    if (companyId) {
        return axios.request({ method: 'get', baseURL: backend, url: `/project/company/${companyId}`, params });
    } else {
        return axios.request({ method: 'get', baseURL: backend, url: `/project`, params });
    }
};

export const getProject = (projectId: number, personId: number) => {
    return axios.request({ method: 'get', baseURL: backend, url: `/project/${projectId}/person/${personId}` });
}

export const postMyProject = (id_projeto: number, id_dev: number, remove: boolean = false) => {
    if (!remove) {
        return axios.request({ method: 'post', baseURL: backend, url: `/myproject`, data: { id_projeto, id_dev } });
    } else {
        return axios.request({ method: 'post', baseURL: backend, url: `/myproject/remove`, data: { id_projeto, id_dev } });
    }
}

export const getMyProjects = (personId: number) => {
    return axios.request({ method: 'get', baseURL: backend, url: `/myproject/${personId}` });
}