import axios from 'axios';
import "./axios.intercepter"
// 创建axios实例
const http = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 5000,
});
let refreshing = false;
const queue = [];
export class HttpService {
    constructor() {
        this.http = http;
        this.init();
    }
    init() {
        this.http.interceptors.request.use(
            config => {
                // 在请求发送之前做一些处理
                console.log('请求拦截器')
                const access_token = localStorage.getItem('access_token')
                if (access_token) {
                    config.headers['Authorization'] = `Bearer ${access_token}`;
                }
                console.log('config', config)
                return config;
            },
            error => {
                // 对请求错误做些什么
                return Promise.reject(error);
            }
        );
        this.http.interceptors.response.use(
            response => {
                // 对响应数据做些什么
                console.log('响应拦截器')
                return response;
            },
            async error => {
                console.log("出错了", error.config)
                const response = error.response
                const config = error.config
                const refresh_token = localStorage.getItem('refresh_token')
                if (refresh_token && response.status === 401 && ['/user/refresh'].indexOf(config.url) === -1) {
                    if (refreshing) {
                        return new Promise((resolve) => {
                            queue.push({
                                config: config,
                                resolve: resolve
                            })
                        })
                    }
                    refreshing = true;
                    console.log('refresh_token', refresh_token)
                    console.log('刷新一下token')
                    try {

                        const data = await this.http.get('/user/refresh', {
                            params: {
                                refresh_token,
                            }
                        })
                        refreshing = false;
                        console.log('拿到的新token', data)
                        localStorage.setItem('access_token', data.data.access_token)
                        localStorage.setItem('refresh_token', data.data.refresh_token)
                        const queueCopy = [...queue];
                        queueCopy.forEach(({ config, resolve }) => {
                            resolve(this.http(config));
                            queue.shift();
                        })
                        return this.http(config)
                    } catch (e) {
                        console.log('刷新token失败')
                        return Promise.reject(error);
                    }
                } else {
                    return Promise.reject(error);
                }
            }
        );
    }
    get(url, config = {}) {
        return this.http.get(url, config);
    }
    post(url, data = {}, config = {}) {
        return this.http.post(url, data, config);
    }
    put(url, data = {}, config = {}) {
        return this.http.put(url, data, config);
    }
    delete(url, data = {}, config = {}) {
        return this.http.delete(url, data, config);
    }
}
export default http;


