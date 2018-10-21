import axios from 'axios'
import _ from  'lodash'
import {apiUrl} from "../config";

export const getFileDownloads =(id)=>{
    const path = `${apiUrl}/posts/${id}`;
    return axios.get(path);
};
