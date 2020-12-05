"use strict";

import Vue from 'vue';
import axios from "axios";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import router from '../router'
import store from '../store'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.defaults.baseURL = "http://192.168.67.3:8081"

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

// 前置拦截处理
_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 后置拦截
// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    let res = response.data
    // 根据返回请求中的状态码进行响应
    if (res.code === 200){
      return response
    } else {
      // 错误信息提示
      Element.Message({
        showClose: true,
        message: response.data.msg,
        type: 'error'
      });
      // 阻止后续操作，避免异常
      return Promise.reject(response.data.msg)
    }
  },
  // 响应异常处理
  function(error) {
    if (error.response.data) {
      error.message = error.response.data.msg
    }
    // 出现401错误，清除store缓存数据，跳转到登录页面
    if (error.response.status === 401) {
      store.commit("REMOVE_INFO")
      router.push("/login")
    }

    // 错误信息提示
    Element.Message({
      showClose: true,
      message: error.message,
      type: 'error'
    });
    // 阻止后续操作
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
