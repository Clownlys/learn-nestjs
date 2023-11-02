import axios from 'axios';

axios.interceptors.request.use(
    config => {
        // 在请求发送之前做一些处理
        console.log('请求拦截器')
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        console.log('响应拦截器')
        return response;
    },
    async error => {
        console.log("出错了")
        const response = error.response
        const config = error.config
        const refresh_token = localStorage.getItem('refresh_token')
        console.log('refresh_token', refresh_token)
        if (refresh_token && response.status === 401 && ['/user/refresh'].indexOf(config.url) === -1) {
            console.log('响应拦截器401')
            const { refresh_token, access_token } = await axios.get('/api/refresh', {
                headers: {
                    refresh_token,
                }
            })
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            return axios(config)
        } else {
            return Promise.reject(error);
        }
    }
);
