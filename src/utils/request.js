import axios from 'axios'
import { Message} from 'element-ui';


const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
});

request.interceptors.response.use(
  response => {
    const res = response.data;
    if (response.status !== 200 && res.success !== true) {
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.log('err: ' + error);
    Message({
      message: error.message,
      type: 'error',
      duration: 5000,
    });
    return Promise.reject(error);
  }
);

export default request
