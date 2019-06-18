import $ from "jquery";
import Constants from './Constants.js'
import router from '../router'
import userService from './userService'
import eventBus from '@/publicJs/eventBus.js'
export default {
  baseUrl: Constants.apiBaseUrl,
  testUrl: 'http://192.168.2.155:8089/',
  imgUrl: Constants.imgUrl,
  get: function (url, data, callback) {
    $.ajax({
      url: this.baseUrl + url,
      type: 'get',
      data: data,
      headers: {
        'token': localStorage.getItem('token')||'',
        'isencry': 0,
        'isRemote':0,
        'version': 'v1',
        "Content-type": "application/json; charset=UTF-8",
      },
      success: function (data) {
        try {
          if(typeof data == 'string'){
            data = JSON.parse(data);
          }
          if(data.status==5001){
            eventBus.$emit('closeSocket');
            userService.clearUser();
            router.push('/');
          }else{
            callback(data);
          }
        } catch (e) {

        }
      },
      error: function (data) {
        callback(data);
        console.info(url + '请求异常');
      }
    });
  },
  returnBase:function(){
    return this.baseUrl;
  },
  returnImg:function(){
    return this.imgUrl;
  },
  fileUrl: function(){
    console.log(this.baseUrl);
    return this.baseUrl+"ssiteapi/platform/resdir/share/uploadFile";
  },
  post: function (url, data, callback) {
    $.ajax({
      url: this.baseUrl + url,
      type: 'post',
      data: JSON.stringify(data),
      headers: {
        'token': localStorage.getItem('token')||'',
        'isencry': 0,
        'isRemote':0,
        'version': 'v1',
        "Content-type": "application/json; charset=UTF-8",
      },
      success: function (data) {
        try {
          if(typeof data == 'string'){
            data = JSON.parse(data);
          }
          if(data.status==5001){
            eventBus.$emit('closeSocket');
            userService.clearUser();
            router.push('/');
          }else{
            callback(data);
          }
        } catch (e) {

        }
      },
      error: function (data) {
        callback(data);
        console.info(url + '请求异常');
      }
    });
  },
  reqEntryTest: function (url,type, data, callback){
    let useData = "";
    if(type == "get"){
      useData = data;
    }
    else {
      useData = JSON.stringify(data);
    }
    $.ajax({
      url: this.testUrl + url,
      type: type,
      data: useData,
      headers: {
        'token': localStorage.getItem('token')||'',
        'isencry': 0,
        'isRemote':0,
        'version': 'v1',
        "Content-type": "application/json; charset=UTF-8",
      },
      success: function (data) {
        try {
          if(typeof data == 'string'){
            data = JSON.parse(data);
          }
          if(data.status==5001){
            eventBus.$emit('closeSocket');
            userService.clearUser();
            router.push('/');
          }else{
            callback(data);
          }
        } catch (e) {

        }
      },
      error: function (data) {
        callback(data);
        console.info(url + '请求异常');
      }
    });
  },
  reqEntry: function (url,type, data, callback){
    let useData = "";
    if(type == "get"){
      useData = data;
    }
    else {
      useData = JSON.stringify(data);
    }
    console.log("this.baseUrl",this.baseUrl);
    $.ajax({
      url: this.baseUrl + url,
      type: type,
      data: useData,
      headers: {
        'token': localStorage.getItem('token')||'',
        'isencry': 0,
        'isRemote':0,
        'version': 'v1',
        "Content-type": "application/json; charset=UTF-8",
      },
      success: function (data) {
        try {
          if(typeof data == 'string'){
            data = JSON.parse(data);
          }
          if(data.status==5001){
            eventBus.$emit('closeSocket');
            userService.clearUser();
            router.push('/');
          }else{
            callback(data);
          }
        } catch (e) {

        }
      },
      error: function (data) {
        callback(data);
        console.info(url + '请求异常');
      }
    });
  },
  linkApi: function (url,type, data, callback) {
    $.ajax({
      url: this.baseUrl + url,
      type: type,
      data: JSON.stringify(data),
      headers: {
        'token': localStorage.getItem('token')||'',
        'isencry': 0,
        'isRemote':0,
        'version': 'v1',
        "Content-type": "application/json; charset=UTF-8",
      },
      success: function (data) {
        try {
          if(typeof data == 'string'){
            data = JSON.parse(data);
          }
          if(data.status==5001){
            eventBus.$emit('closeSocket');
            userService.clearUser();
            router.push('/');
          }else{
            callback(data);
          }
        } catch (e) {

        }
      },
      error: function (data) {
        console.info(url + '请求异常');
        callback(data);
      }
    });
  },
  uploadFile:function (url,file,callback) {
      var fileUploadUrl=this.baseUrl;
      var formData=new FormData();
      formData.append("fileUpload",file);
      if(window.FormData) {
          var xhr = new XMLHttpRequest();
          xhr.open('POST',fileUploadUrl+url);
          xhr.setRequestHeader('token', localStorage.getItem('token')||'');
          xhr.setRequestHeader('isencry',0);
          xhr.setRequestHeader('isRemote', 0);

          xhr.onload=function () {
              if (xhr.status === 200) {
                  var obj=JSON.parse(xhr.response);
                  if(obj.status==200)
                  {
                      callback(obj);
                  }
              }
              else {
                  console.info("访问异常错误信息=",data.msg);
              }
          }
          xhr.send(formData);
      }else{
          console.info("不支持H5文件上传");
      }
  },
  uploadApk:function (url,file,callback) {
    var fileUploadUrl=this.baseUrl;
    if(window.FormData) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST',fileUploadUrl+url);
        xhr.setRequestHeader('token', localStorage.getItem('token')||'');
        xhr.setRequestHeader('isencry',0);
        xhr.setRequestHeader('isRemote', 0);

        xhr.onload=function () {
            if (xhr.status === 200) {
                var obj=JSON.parse(xhr.response);
                if(obj.status==200)
                {
                    callback(obj);
                }
            }
            else {
                console.info("访问异常错误信息=",data.msg);
            }
        }
        xhr.send(file);
    }else{
        console.info("不支持H5文件上传");
    }
},
  login: function (url, data, callback) {
    $.ajax({
      url: this.baseUrl + url,
      type: 'post',
      data: data,
      success: function (data) {
        try {
          callback(data);
        } catch (e) {

        }
      },
      error: function (data) {
        console.info(url + '请求异常');
      }
    });
  },
 
}
