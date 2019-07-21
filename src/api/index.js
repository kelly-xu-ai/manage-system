import request from '../utils/request';

export const fetchData = (query) => {
    return request({
        url: '/ms/table/list',
        method: 'post',
        data: query
    })
}
export const login = (query) => {
    return request({
        url: '/login',
        method: 'post',
        params: query
    })
}
export const getUserInfo = (query) => {
    return request({
        url: '/system/user/info',
        method: 'get',
        params: query
    })
}

export const getPhoneRandom = (query) => {
    return request({
        url: '/captcha/sendMessage',
        method: 'get',
        params: query
    })
}