<template>
  <div class="sys_perinfo">
    <bread-field class="topBread" :aryBread="aryBread"></bread-field>
    <div class="per_info_form">
      <el-form ref="form" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="原密码:" prop="oldPas" class="oldPas">
          <el-input :type="showOldPsd?'text':'password'" v-model="form.oldPas"></el-input>
          <span class="erroInfo">{{errorInfo}} </span>
          <span class="el-icon-view icon_view" @click='showPsd("oldPas")'></span>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPas">
          <el-input :type="showNewPsd?'text':'password'" v-model="form.newPas"></el-input>
          <span class="el-icon-view icon_view" @click='showPsd("newPas")'></span>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checknewPass">
          <el-input :type="showchecknewPass?'text':'password'" v-model="form.checknewPass"></el-input>
          <span class="el-icon-view icon_view" @click='showPsd("checknewPass")'></span>
        </el-form-item>
        <el-form-item class="edit">
          <el-button type='info' @click="resetForm">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import breadField from "@/components/common/commonBread";
import apiClient from "@/publicJs/apiClient.js";
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            var that = this
            var reg = new RegExp(/^[A-Za-z0-9]+$/);
            var reg2 = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
            this.errorInfo = "";
            if (value.trim() === "") {
                callback(new Error("密码不能为空格或特殊字符"));
            } else {
                if( reg.test(value) && reg2.test(value) && value.length<16 && value.length>5){
                    callback()
                }else {
                    callback(new Error('密码至少6位，并包括大小写字母及数字'))
                }
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.form.newPas) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        var oldPas = (rule, value, callback) => {
            
            var that = this
            if (value.length > 16) {
                callback(new Error("长度不能超过16位"));
            }else {
                callback()
            }
        };
        var checkPas = (rule, value, callback) => {
            var that = this;
            if (!this.isChecked) {
                callback(new Error(this.checkedText));
                that.isChecked = true
            }else {
                callback()
            }
        };
        return {
            errorInfo: "",
            form: {
                oldPas: "",
                newPas: "",
                newPass: ""
            },
            showOldPsd:false,
            showNewPsd:false,
            showchecknewPass:false,
            isChecked :true,
            checkedText:'原密码错误',
            formRules: {
                oldPas: [
                    {
                        required: true,
                        message: "请输入原密码",
                        trigger: "blur"
                    },
                    { validator: oldPas, trigger: "blur" },
                     { validator: checkPas, trigger: "blur" }
                ],
                newPas: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur"
                    },
                    { validator: validatePass, trigger: "blur" },
                    {
                        max: 20,
                        message: "密码长度不能超过20位",
                        trigger: "blur"
                    },
                    { min: 6, message: "密码长度不能低于6位", trigger: "blur" }
                ],
                checknewPass: [
                    {
                        required: true,
                        message: "请确认新密码",
                        trigger: "blur"
                    },
                    { validator: validatePass2, trigger: "blur" },
                    {
                        max: 20,
                        message: "密码长度不能超过20位",
                        trigger: "blur"
                    },
                    { min: 6, message: "密码长度不能低于6位", trigger: "blur" }
                ]
            },

            aryBread: [
                { name: "系统设置", url: "" },
                { name: "个人管理", url: "" },
                { name: "修改密码", url: "" }
            ]
        };
    },

    components: {
        breadField
    },
    methods: {
        showPsd(val){
            if(val == 'oldPas'){
                this.showOldPsd=!this.showOldPsd
            }else if (val == 'newPas'){
                this.showNewPsd=!this.showNewPsd
            }else if(val == 'checknewPass'){
                this.showchecknewPass=!this.showchecknewPass
            }
        },
        submitForm: function(formName) {
            var that = this;
            that.$refs[formName].validate(valid => {
                if (valid) {
                    var param = {
                        oldPassword: that.form.oldPas,
                        newPassword: that.form.newPas
                    };
                    apiClient.post(
                        "ssiteapi/authm/acount/updatePassword",
                        param,
                        function(pres) {
                            if (pres.status == 200) {
                                that.succes();
                            } else {
                                that.isChecked = false;
                                that.checkedText = pres.exception;
                                that.$refs[formName].validateField('oldPas',function(){});
                                // that.errorInfo = pres.exception;
                            }
                        }
                    );
                } else {
                    // console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm: function() {
            this.$refs["form"].resetFields();
        },
        //成功弹出框
        succes: function() {
            this.$message({
                message: "密码修改成功",
                type: "success"
            });
        }
    }
};
</script>
<style scoped>
.per_info_form .el-form {
    width: 37.04%;
    height: 44.79%;
    position: absolute;
    top: 16.96%;
    left: 50%;
    transform: translateX(-50%);
}
.per_info_form label {
    width: 100px !important;
}
.per_info_form .el-input {
    width: 90%;
}
.edit {
    width: 92%;
    text-align: right;
    padding-right: 10px;
}
.oldPas .el-form-item__content {
    position: relative;
}
.erroInfo {
    position: absolute;
    left: 0%;
    top: 75%;
    color: #f56c6c;
}
.per_info_form label {
    color:#333333!important
}
.sys_perinfo {
    height: 100%;
    width: 100%;
    padding: 10px;
}
.per_info_form {
    margin-top: 10px;
    background-color: #fff;
    height: calc(100% - 40px);
    position: relative;
}
.el-icon-view {
    position: absolute;
    right: 12%;
    top: 13px;
    color:#d2d2d2;
}
.el-icon-view:hover {
    color:#1081fa
}
</style>

