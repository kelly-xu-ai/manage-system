import axios from 'axios';
let vm = null;

const getcookie = (objname) => {//获取指定名称的cookie的值
    var arrstr = document.cookie.split("; ");
    for(var i = 0;i < arrstr.length;i ++){
    var temp = arrstr[i].split("=");
    if(temp[0] == objname) return unescape(temp[1]);
    }
}

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: '/api',
    timeout: 5000
})
service.sendThis  = ( _this )=> {
    vm = _this;
};

service.interceptors.request.use( config => {
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

service.interceptors.response.use(response => {
    if(response.status === 200){
        let oldLoginName = vm && vm.oldLoginName;
        let newLoginName = getcookie('loginName');
        debugger
        if (oldLoginName && newLoginName && oldLoginName !== newLoginName) {
            window.location.href= '/'
        } 
        if (response.data.code &&  response.data.code === 401) {
          window.location.href= '/'
        }else {
            return response.data;
        }
    }else{
        Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})

export default service;