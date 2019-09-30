import axios from 'axios';
import { backend } from '../util/constants.util';

export const postLogin = (data: any) => {
    return axios.request({ method: 'post', baseURL: backend, url: `/auth`, data });
};

export const getPerson = (id_pessoa: number) => {
    return axios.request({ method: 'get', baseURL: backend, url: `/person/${id_pessoa}` });
}