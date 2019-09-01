
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

export const getFilelist = (query) => {
    return request({
        url: '/file/list',
        method: 'post',
        params: query
    })
}

export const getTreelist = (query) => {
    return request({
        url: '/system/category/treeData',
        method: 'get',
        params: query
    })
}

export const checkPassword = (query) => {
    return request({
        url: '/system/user/checkPassword',
        method: 'post',
        params: query
    })
}

export const updatePwd = (query) => {
    return request({
        url: '/system/user/updatePwd',
        method: 'post',
        params: query
    })
}

export const sendMessage = (query) => {
    return request({
        url: '/captcha/sendMessage',
        method: 'post',
        params: query
    })
}

export const verifyCode = (query) => {
    return request({
        url: '/captcha/verifyCode',
        method: 'post',
        params: query
    })
}

export const forgetPwd = (query) => {
    return request({
        url: '/system/user/forgetPwd',
        method: 'post',
        params: query
    })
}

export const getUserList = (query) => {
    return request({
        url: '/system/user/list',
        method: 'post',
        params: query
    })
}

export const removeUser = (query) => {
    return request({
        url: '/system/user/remove',
        method: 'post',
        params: query
    })
}

export const addUser = (query) => {
    return request({
        url: '/system/user/add',
        method: 'post',
        params: query
    })
}

export const checkLoginNameUnique = (query) => {
    return request({
        url: '/system/user/checkLoginNameUnique',
        method: 'post',
        params: query
    })
}


export const editUser = (query) => {
    return request({
        url: '/system/user/edit',
        method: 'post',
        params: query
    })
}

export const addCategory = (query) => {
    return request({
        url: '/system/category/add',
        method: 'post',
        params: query
    })
}

export const removeFile = (query) => {
    return request({
        url: '/file/remove',
        method: 'post',
        params: query
    })
}

export const changeFile = (query) => {
    return request({
        url: '/file/change',
        method: 'post',
        params: query
    })
}

export const deleteClass = (query) => {
    return request({
        url: '/system/category/remove',
        method: 'post',
        params: query
    })
}

export const updateFile = (query) => {
    return request({
        url: '/file/edit',
        method: 'post',
        params: query
    })
}

export const updateClass = (query) => {
    return request({
        url: '/system/category/edit',
        method: 'post',
        params: query
    })
}

export const logout = (query) => {
    return request({
        url: '/logout',
        method: 'get',
        params: query
    })
}

export const readFile = (query) => {
    return request({
        url: '/file/get',
        method: 'post',
        params: query
    })
}

