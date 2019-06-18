<template>
  <div class="back" ref="logBtn">
    <div class="backG">
      <div class="blockLogo">
      </div>
      <div class="blockLogin">
        <!-- <span class="falseInfo">{{isCorrect?'':'用户名或密码输入错误'}}</span> -->
        <div class="loginFormField">
          <span class="falseInfo">{{isCorrect?'':'用户名或密码输入错误'}}</span>
          <el-form class="loginForm" :rules="loginFormRule" :model="loginForm" ref="loginForm">
            <div ref="loginFormField" class="firstInput">
              <el-form-item prop="username">
                <el-input class="userStyle" type="text" prefix-icon="iconfont icon-iconyonghu" placeholder="请输入账号" @focus="searchStorage($event)" @keyup.native="screenUser(loginForm.username)" v-model="loginForm.username">
                </el-input>
              </el-form-item>
              <!-- 用户名下拉列表 -->
              <ul class="userList" v-show="showUserList">
                <li v-for="(item,ind) in userListArr" :key="ind" @click.stop="pitchOnUser(item)">{{item.un}}
                  <i class="iconfont icon-cha-copy" @click.stop="delUser(item)"></i>
                </li>
              </ul>
            </div>
            <el-form-item prop="password">
              <el-input type="password" prefix-icon="iconfont icon-yidongduanicon-" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter.native="loginClick" @focus="showUserList=false" @blur="pwdBlur"></el-input>
            </el-form-item>
            <el-form-item prop="check" class="checkStyle">
              <el-input :class="checkResult == 0?'checkRedCommon':checkResult == 1?'checkGreen':'checkRed'" type="text" prefix-icon="iconfont icon-huabankaobei" v-model="loginForm.check" placeholder="请输入验证码" @change="checkchange">

              </el-input>
            </el-form-item>
            <div class='captcha'>
              <input type="button" @click="createCode" class="verification" v-model="checkCode" />
            </div>
          </el-form>

        </div>
      </div>
    </div>
    <div class="backGBottom">
      <div class="blockLoginBottom">
        <el-button class="submitButton" type="primary" v-on:click="loginClick" @keyup.native="loginClick">登录</el-button>
        <div class="radioBox">
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import newApiClient from "@/publicJs/newApiClient.js";
import urlMng from "@/services/login.js";
import apiClient from "@/publicJs/apiClient.js";
import commonFooter from "@/components/common/commonFooter";
import userService from "@/publicJs/userService.js";
import eventBus from "@/publicJs/eventBus.js";
import "@/css/login.css";
import Vue from "vue";
export default {
  data() {
    return {
      picLyanzhengma: "",
      checkCode: "",
      loginForm: {
        username: "",
        password: "",
        check:"",
        remember: false
      },
      loginFormRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
          { validator: this.checkCorrect, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { validator: this.checkCorrect, trigger: "blur" }
        ],
        check: [
          { required: true, message: "请输入验证码", trigger: "change" },
          { validator: this.checkCorrect, trigger: "blur" }
        ]
      },
      isCorrect: true,
      dictionaryArr: [],
      userListArr: [],
      showUserList: false,
      checkResult:0
    };
  },
  components: {
    commonFooter
  },
  mounted() {
    this.createCode();
  },
  methods: {
    checkchange(value){
      var that = this;
       if(that.loginForm.check==that.checkCode){
            that.checkResult = 1;
          }
          else {
            that.checkResult = 2;
          }
    },
    createCode() {
      //先清空验证码的输入
      this.code = "";
      this.checkCode = "";
      this.picLyanzhengma = "";
      //验证码的长度
      var codeLength = 4;
      //随机数
      var random = new Array(
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      );
      for (var i = 0; i < codeLength; i++) {
        //取得随机数的索引（0~35）
        var index = Math.floor(Math.random() * 36);
        //根据索引取得随机数加到code上
        this.code += random[index];
      }
      //把code值赋给验证码
      this.checkCode = this.code;
    },
    loginClick: function() {
      var that = this;
      that.$refs["loginForm"].validate(valid => {
        if (valid) {
          if(that.loginForm.check!=that.checkCode){
            that.$message.error('验证码错误，请重新输入！');
            that.loginForm.check = "";
          }
          else {
            var param = {
            username: that.loginForm.username,
            password: that.loginForm.password
          };
          // apiClient.login("login", param, function(pres) {
            newApiClient.assignApi("login",param,function(pres){
            if (pres.code == "200") {
              // 存token
              localStorage.setItem("token", pres.token);
              //存登录次数
              that.addLoginRecord({
                acountId: that.loginForm.username,
                loginTime: new Date().getTime()
              });
              //存用户信息
              localStorage.setItem("userInfo", JSON.stringify(pres.acount));
              //存缺陷类型
              var obju = {
                un: that.loginForm.username,
                pw: that.loginForm.password
              };
              if (that.loginForm.remember == true) {
                //如果记住密码勾选
                if (localStorage.getItem("ul")) {
                  var ary = JSON.parse(localStorage.getItem("ul"));
                  var index = -1;
                  $.each(ary, function(i) {
                    if (ary[i].un == obju.un) {
                      index = i;
                    }
                  });
                  if (index > -1) {
                    ary.splice(index, 1);
                  }
                  ary.push(obju);
                  localStorage.setItem("ul", JSON.stringify(ary));
                } else {
                  var ary = [];
                  ary.push(obju);
                  localStorage.setItem("ul", JSON.stringify(ary));
                }
              } else {
                //如果不勾选，删除以前记住的密码
                obju.pw = "";
                var ary = JSON.parse(localStorage.getItem("ul"));
                var index = -1;
                if (ary) {
                  $.each(ary, function(i) {
                    if (ary[i].un == obju.un) {
                      index = i;
                    }
                  });
                  if (index > -1) {
                    ary.splice(index, 1);
                  }
                  ary.push(obju);
                  localStorage.setItem("ul", JSON.stringify(ary));
                } else {
                  var ary = [obju];
                  localStorage.setItem("ul", JSON.stringify(ary));
                }
              }
              that.getAuth(pres.token);
            } else {
              that.isCorrect = false;
              setTimeout(function() {
                that.$refs["loginForm"].validateField(
                  "username",
                  function() {}
                );
                that.$refs["loginForm"].validateField(
                  "password",
                  function() {}
                );
              }, 100);
            }
          });
          }
        } else {
          return false;
        }
      });
    },
    addLoginRecord(param) {
      var that = this;
      apiClient.linkApi(
        "ssiteapi/platform/homepage/api/addLoginRecord",
        "put",
        param,
        function(pres) {
          if (pres.status == 200 && pres.results.data == true) {
            localStorage.setItem("logInId", pres.results.id);
          }
        }
      );
    },
    searchStorage(event) {
      var that = this;
      event || (event = window.event);
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true);
      var userInfo = JSON.parse(localStorage.getItem("ul"));
      that.userListArr = userInfo;
      that.showUserList ? that.hideUserBox() : that.showUserBox();
    },
    screenUser(val) {
      var that = this;
      var userInfo = JSON.parse(localStorage.getItem("ul"));
      that.userListArr = [];
      userInfo.forEach(function(item, ind) {
        if (item.un.indexOf(val) > -1) {
          that.showUserList = true;
          that.userListArr.push(item);
        }
      });
    },
    hideUserBox() {
      var that = this;
      that.showUserList = false;
      document.removeEventListener("click", that.dephidePanel, false);
    },
    showUserBox() {
      var that = this;
      that.showUserList = true;
      document.addEventListener("click", that.dephidePanel, false);
    },
    dephidePanel(e) {
      var that = this;
      if (
        that.$refs.loginFormField &&
        !that.$refs.loginFormField.contains(e.target)
      ) {
        //点击除弹出层外的空白区域
        that.hideUserBox();
      }
    },
    // closeUserList(){
    //   var that = this;
    //   that.showUserList = false;
    // },
    pitchOnUser(item) {
      var that = this;
      that.loginForm.username = item.un;
      that.loginForm.password = item.pw;
      if (item.pw) {
        that.loginForm.remember = true;
      }
      that.showUserList = false;
    },
    delUser(ary) {
      var that = this;
      var userInfo = JSON.parse(localStorage.getItem("ul"));
      that.loginForm.username = "";
      that.loginForm.password = "";
      that.loginForm.remember = "";
      // that.showUserList = false;
      userInfo.forEach(function(item, ind) {
        if (item.un == ary.un) {
          var arr = userInfo.splice(ind, 1);
          localStorage.setItem("ul", JSON.stringify(userInfo));
          // Vue.set({
          //   userListArr:userInfo
          // })
          that.userListArr = userInfo;
        }
      });
    },
    findPwd: function() {
      var that = this;
      if (that.isCorrect == false) {
        that.isCorrect = true;
      }
      var username = that.loginForm.username;
      if (username == "") {
        that.loginForm.password = "";
      } else {
        var password = "";
        var ary = JSON.parse(localStorage.getItem("ul"));
        $.each(ary, function(i) {
          if (ary[i].un == username) {
            password = ary[i].pw;
          }
        });
        that.loginForm.password = password;
        that.loginForm.remember = true;
      }
    },
    getAuth: function(token) {
      var that = this;
      newApiClient.assignApi(urlMng.setUrl("auth",[]),'',function(pres){
      // apiClient.get(
      //   "ssiteapi/authm/premission/getPremissionByToken",
      //   {},
      //   function(pres) {
          if (pres.status == 200) {
            userService.setAuths(pres.results);
            eventBus.$emit("clientSocket", "");
            that.$router.push("/home/mainPage");
          }
        }
      );
    },
    queryUser: function(queryString, cb) {
      var userList = JSON.parse(localStorage.getItem("ul"));
      var resultList = [];
      $.each(userList, function(i) {
        if (userList[i].un.indexOf(queryString) === 0) {
          resultList.push({ value: userList[i].un });
        }
      });
      cb(resultList);
    },
    checkCorrect: function(rule, value, callback) {
      if (!this.isCorrect) {
        callback(new Error("  "));
      } else {
        callback();
      }
    },
    pwdBlur: function() {
      var that = this;
      if (that.isCorrect == false) {
        that.isCorrect = true;
      }
    },
  }
};
</script>
<style scoped>
.yanzhengma_input {
  font-family: "Exo 2", sans-serif;
  border: 1px solid #fff;
  color: #fff;
  outline: none;
  border-radius: 12px;
  letter-spacing: 1px;
  font-size: 17px;
  font-weight: normal;
  background-color: rgba(82, 56, 76, 0.15);
  padding: 5px 0 5px 10px;
  margin-left: 30px;
  height: 30px;
  margin-top: 25px;
  border: 1px solid #e6e6e6;
}
.verification {
      border-radius: 8px;
    width: 100%;
    letter-spacing: 5px;
    height: 36px;
    border: 0;
    margin-top: 2px;
    background-color: white;
    outline: none;
    cursor: pointer;
}
.captcha {
  width: 19%;
  float: right;
  height: 50px;
  text-align: justify;
}
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.leftImage {
  display: block;
  float: left;
  width: 100%;
  height: 100%;
  background: url("../assets/image/loginBackground2.png") 100% no-repeat;
  background-size: 100%;
  position: relative;
}
.loginTit {
  position: absolute;
  top: 40px;
  left: 40px;
  color: #fff;
  vertical-align: bottom;
  padding-left: 25px;
}
.loginTit img {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 2px;
  left: 0;
}
.rightContent {
  display: block;
  float: left;
  width: 724px;
  height: 444px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: url("../assets/image/login.png") no-repeat;
  background-size: cover;
  padding-left: 470px;
}
.logoField {
  width: 80%;
  margin-top: 60px;
}
.loginLogo {
  width: 44px;
  height: 38px;
  display: block;
  margin: 0 auto;
  background: url("../assets/image/logoImg.png") no-repeat;
  background-size: cover;
  margin-bottom: 20px;
}
.loginTitle {
  font-size: 16px;
  text-align: center;
  /* letter-spacing: 3px; */
  color: #1081fa;
  height: 16px;
}
.loginFormField {
  width: 80%;
  margin-left: 10%;
}
/* .inputBox{
    width: 100%;
    height: 40px;
    position: relative;
    margin-bottom: 15px;
    border-bottom: 1px solid #b7b7b7;
  }
  .inputBox>input{
    border: none;
    width: 100%;
    height: 100%;
    padding-left: 45px;
  }
  .inputBox>input:focus{
    border:none;
    outline: none;
    border-bottom: blue;
  }
  .inputBox>span{
    position: absolute;
    line-height: 40px;
    font-size: 20px;
    color: #b7b7b7;
    left: 15px;
  } */
.el-input__icon {
  color: #1081fa !important;
}
.radioBox {
  width: 90%;
  height: 40px;
  text-align: right;
  font-size: 10px;
  color: #939495;
  margin-top: 10px;
  margin-right: 10%;
}

.loginButton {
  widows: 100%;
  height: 40px;
  background-color: #5896f8;
  font-size: 16px;
  color: white;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  margin-top: 20px;
}
.loginFooter {
  width: 100%;
  display: block;
  position: absolute;
  bottom: 0px;
}
.submitButton {
  width: 80%;
  max-width: 100%;
  margin-left: 10%;
  border-radius: 8px !important;
  margin-top: 30px;
  background-color: #08979c;
}
.falseInfo {
  color: red;
  font-size: 12px;
  height: 37px;
  line-height: 28px;
  margin-top: 10px;
  padding-left: 15px;
  display: block;
}
.userList {
	position: absolute;
    z-index: 9999;
    top: 82px;
    left: 10%;
    width: 80%;
    max-height: 150px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #e4e7ed;
}
.userList li {
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  padding-left: 10px;
  color: #666;
  font-size: 14px;
}
.userList li:hover {
  background: #f5f7fa;
  position: relative;
}
.userList li:hover i {
  display: inline-block;
}
.userList li i {
  font-weight: bold;
  display: none;
  position: absolute;
  height: 20px;
  line-height: 20px;
  margin-top: 10px;
  width: 20px;
  border-radius: 50%;
  right: 7px;
  text-align: center;
  border-radius: 50%;
  /* border: .1px solid #000; */
}
.userList li i:hover {
  color: #1081fa;
}
.loginForm_inp {
  height: 46px;
}
</style>


