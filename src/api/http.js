import axios from "axios";
import qs from "qs";

// 进行一些全局配置
// 请求响应超时时间
axios.defaults.timeout = 5000;

// post 请求 JSON格式 -----------------------------------------------------------------------
async function post(url, param, headers, option) {
  const data = param;
  url = url + `?t=${new Date().getTime()}`;
  const params = {
    method: "post",
    url,
    data,
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json;charSet=UTF-8",
    },
    timeout: option && option.timeout ? option.timeout : 10000,
  };
  if (headers) {
    params.headers = Object.assign(params.headers, headers);
  }
  return await requestHandel(params, option);
}
// post 请求fromdata格式 -----------------------------------------------------------------------
async function postFrom(url, param, headers, option) {
  const data = qs.stringify(param);
  url = url + `?t=${new Date().getTime()}`;
  const params = {
    method: "post",
    url,
    data,
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json;charSet=UTF-8",
    },
  };
  if (headers) {
    params.headers = Object.assign(params.headers, headers);
  }
  return await requestHandel(params, option);
}
// post login 请求 params格式 -----------------------------------------------------------------------
async function loginPost(url, param, headers, option) {
  url = url + `?t=${new Date().getTime()}`;
  const data = param;
  const params = {
    method: "post",
    url,
    data,
    params: data,
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json;charSet=UTF-8",
    },
    timeout: option && option.timeout ? option.timeout : 10000,
  };
  if (headers) {
    params.headers = Object.assign(params.headers, headers);
  }
  return await requestHandel(params, option);
}

// get 请求 JSON格式-----------------------------------------------------------------------
async function get(url, param, headers, option) {
  //   url = url + `?t=${new Date().getTime()}`;
  const data = {
    method: "get",
    url,
    params: param,
    // withCredentials: true,
    headers: {
      // 'Content-Type':'application/json;charSet=UTF-8'
    },
    timeout: option && option.timeout ? option.timeout : 10000,
  };
  if (headers) {
    data.headers = Object.assign(data.headers, headers);
  }
  return await requestHandel(data, option);
}

async function requestHandel(params, option) {
  try {
    const requestJson = await axios(params);
    return new Promise((resolve) => {
      if (option && option.defEx) {
        resolve(requestJson.data);
        return;
      }
      //   if (requestJson.data.code !== 200) {
      //     if (requestJson.data.code === 401) {
      //       console.log("去登陆-----------");
      //     } else {
      //       Vue.prototype.$notify.error({
      //         title: "系统错误",
      //         message: requestJson.data.message,
      //       });
      //     }
      //     reject();
      //   } else {
      resolve(requestJson.data);
      //   }
    });
  } catch (error) {
    console.log("网络请求异常", error);
    return error;
  }
}

// 封装自己的get/post方法
export { get, post, loginPost, postFrom };
