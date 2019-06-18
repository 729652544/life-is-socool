import apiClient from '@/publicJs/apiClient.js'
import {getEnvironment} from '@/system/system'
import proxy from '@/.roadhogrc.mock.js'
const Environment = getEnvironment();
export default {
  get: function (url, data, callback) {
    if(Environment =="test"){
      callback(proxy.getProxy(["GET "+url]));
    }
    else {
      apiClient.get(url,data, callback);
    }
  },
  post: function (url, data, callback) {
    if(Environment =="test"){
      callback(proxy.getProxy(["POST "+url]));
    }
    else {
      apiClient.reqEntry(url,"post", data, callback);
    }
  },
  delete: function (url, data, callback) {
    if(Environment =="test"){
      callback(proxy.getProxy(["DELETE "+url]));
    }
    else {
      apiClient.reqEntry(url,"delete", data, callback);
    }
  },
  put: function (url, data, callback) {
    if(Environment =="test"){
      callback(proxy.getProxy(["PUT "+url]));
    }
    else {
      apiClient.reqEntry(url,"put", data, callback);
    }
  },
  assignApi:function (url, data, callback){
    if(Environment =="test"){
      callback = callback(proxy.getProxy([url]));
    }
    else {
      if(url == "login"){
        apiClient.login(url, data, callback);
      }
      else {
        apiClient.reqEntry(url.split(" ")[1],url.split(" ")[0].toLowerCase(), data, callback);
      }
    }
  },
  assignTestApi:function (url, data, callback){
    if(Environment =="test"){
      callback = callback(proxy.getProxy([url]));
    }
    else {
      if(url == "login"){
        apiClient.login(url, data, callback);
      }
      else {
        apiClient.reqEntryTest(url.split(" ")[1],url.split(" ")[0].toLowerCase(), data, callback);
      }
    }
  },
  linkApi: function (url,type, data, callback) {
    apiClient.linkApi(url,type, data, callback);
  },
  uploadFile:function (url,file,callback){
    apiClient.uploadFile(url,file, callback);
  },
  uploadApk:function (url,file,callback){
    apiClient.uploadApk(url,file, callback);
  },
  login:function (url, data, callback){
    apiClient.login(url, data, callback);
  },
}
