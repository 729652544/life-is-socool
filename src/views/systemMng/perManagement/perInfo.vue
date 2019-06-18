<template>
    <div class="sys_perinfo">
        <bread-field class="topBread" :aryBread="aryBread"></bread-field>
        <div class="per_info_form">
            <el-form ref="per_form" :model="per_form"  :rules="per_formRules">
                <el-form-item label="账  号  :" prop="username">
                    <el-input v-model="per_form.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名:" v-if="showAccountName" prop="acountName">
                    <el-input v-model="per_form.acountName" :disabled="isSuperadministrator"></el-input>
                </el-form-item>
                <el-form-item label="联系方式:" prop="phone">
                    <el-input v-model="per_form.phone" :disabled="isSuperadministrator"></el-input>
                </el-form-item>
                <el-form-item label="所属部门:" prop="deptName" class="info_deptName">
                     <el-input 
                        placeholder="请输入内容" 
                        v-model="choseDepName"
                        :suffix-icon="isShowSelect?'el-icon-arrow-down':'el-icon-arrow-right'"
                        @click.native="showSelect"
                        :disabled="isSuperadministrator"
                        >
                    </el-input>
                    <div class="deptTree" v-if="isShowSelect" @mouseleave.stop="isShowSelect = false">
                        <el-tree
                            empty-text="暂无数据"
                            :expand-on-click-node="true"
                            :data="depList"
                            :props="defaultProps"
                            :default-expand-all="true"
                            class="deptTreeList"
                            @node-click="choseDep"
                        >
                        </el-tree>
                    </div>
                </el-form-item>
                <el-form-item label="用 户 名 :" v-if="showName" prop="name">
                    <el-input v-model="per_form.name" :disabled="isSuperadministrator"></el-input>
                </el-form-item>
                <el-form-item class="editBtn"> 
                    <el-button type='info' @click="resetForm('ruleForm2')" v-show="!isSuperadministrator">取消</el-button>
                    <el-button type="primary"  @click="submitForm('per_form')" v-show="!isSuperadministrator">确认</el-button>
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
    var checkphone = (rule, value, callback) => {
      var reg = /0?(13|14|15|18|17)[0-9]{9}/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式输入错误"));
      } else {
        callback();
      }
    };

    return {
      isSuperadministrator: false, //是否是超级管理员
      preInfo: "", //个人信息
      isShowSelect: false,
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      choseDepName: "",

      infoObj: "",
      showAccountName: true,
      showName: true,
      per_form: {
        username: "",
        acountName: "",
        ompDept: {
          deptName: ""
        },
        name: ""
      },
      per_formRules: {
        username: [
          { required: true, message: "请输入活动账号", trigger: "blur" }
        ],
        acountName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          { validator: checkphone, trigger: "blur" }
        ],
        deptName: [
          //   { validator: checkDeptName, trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      },
      aryBread: [{ name: "系统设置", url: "" },{ name: "个人管理", url: "" }, { name: "基本信息", url: "" }]
    };
  },
  components: {
    breadField
  },
  mounted: function() {
    this.getInfo();
    this.queryDepList();
  },
  methods: {
    //显示下拉框
    showSelect: function() {
      if (this.isSuperadministrator == true) {
        this.isShowSelect = false;
      } else if (this.isSuperadministrator == false) {
        this.isShowSelect = !this.isShowSelect;
      }
    },
    //获取部门列表
    queryDepList: function() {
      var that = this;
      var param = {};
      apiClient.post("ssiteapi/authm/dept/getDept", param, function(pres) {
        if (pres.status == 200) {
          that.zdepList = pres.results;
          that.depList = that.GetData("0", that.zdepList);
        }
      });
    },
    choseDep: function(data) {
      var that = this;
      that.per_form.ompDept.id = data.id;
      that.choseDepName = data.deptName;
    },

    filterNode: function(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    //获取localstroage里面的信息
    getInfo: function() {
      var that = this;
      var perJsonDate = localStorage.getItem("userInfo");
      that.infoObj = JSON.parse(perJsonDate);
      var perId = that.infoObj.id;
      apiClient.get("ssiteapi/authm/acount/getById/" + perId, "", function(
        pres
      ) {
        if (pres.status == 200) {
          that.preInfo = pres.results;
          // console.log(that.preInfo);
          //判断是否是超级管理员
          that.preInfo.roles.forEach((o, i) => {
            if (o.roleNameZh == "超级管理员") {
              that.isSuperadministrator = true;
            }
          });
          if (that.preInfo.type == 1) {
            that.showAccountName = false;
            that.showName = true;
            that.per_form.name = that.preInfo.acountName;
          }
          if (that.preInfo.type == 2) {
            that.showAccountName = true;
            that.showName = false;
            that.per_form.acountName = that.preInfo.acountName;
          }
          that.per_form.username = that.preInfo.username;
          that.per_form.phone = that.preInfo.phone;
          that.per_form.ompDept.deptName = that.preInfo.ompDept.deptName;
          that.choseDepName = pres.results.ompDept.deptName;
          that.per_form.ompDept.id = pres.results.ompDept.id;
        }
      });
    },
    submitForm(per_form) {
      var that = this;
      that.$refs[per_form].validate(valid => {
        if (valid) {
          if (that.preInfo.type == 1) {
            var param = {
              id: that.infoObj.id,
              username: that.per_form.username,
              phone: that.per_form.phone,
              acountName: that.per_form.name,
              enabled: that.infoObj.enabled,
              ompDept: {
                id: that.per_form.ompDept.id
              }
            };
          }
          if (that.preInfo.type == 2) {
            var param = {
              id: that.infoObj.id,
              username: that.per_form.username,
              acountName: that.per_form.acountName,
              phone: that.per_form.phone,
              enabled: that.infoObj.enabled,
              ompDept: {
                id: that.per_form.ompDept.id
              }
            };
          }
          apiClient.post("ssiteapi/authm/acount/update", param, function(pres) {
            if (pres.status == 200) {
              that.succes();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消按钮
    resetForm: function() {
      this.$refs["per_form"].resetFields();
      this.getInfo();
    },
    //处理数据
    GetData: function(id, arry) {
      var tree = [];
      var temp;
      for (var i = 0; i < arry.length; i++) {
        if (arry[i].parentId == id) {
          var obj = arry[i];
          temp = this.GetData(arry[i].id, arry);
          if (temp.length > 0) {
            obj.children = temp;
          }
          tree.push(obj);
        }
      }
      return tree;
    },
    //成功弹出框
    succes: function() {
      this.$message({
        message: "基本信息修改成功",
        type: "success"
      });
    }
  }
};
</script>
<style >
.sys_perinfo {
  height: 100%;
  width: 100%;
  padding: 10px;
}
.per_info_form {
  margin-top: 10px;
  background-color: #fff;
  height: calc(100% - 42px);
  position: relative;
  overflow: auto;
}
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
  color:#333333;
  font-size: 14px;
}
.per_info_form .el-form-item__content {
  margin-left: 110px !important;
}
.el-form .el-form-item {
  margin-bottom: 20px;
}
.per_info_form .deptName .el-input-group > .el-input__inner {
  display: inline;
}
.deptTree {
  position: absolute;
  z-index: 100;
  width: 100%;
}
.deptTree .el-tree {
  max-height: 300px;
  overflow: auto;
  width: 91.45%;
  float: right;
  box-shadow: 1px 2px 5px 0px rgba(78, 78, 78, 0.3);
  border-radius: 2px;
  border: solid 1px #d2d2d2;
  margin-top: 0.5%;
  padding-left: 10.04%;
}
.deptTree .el-tree-node__content {
  height: 40px;
  /* padding-left: 10.04% !important; */
}
.editBtn {
text-align: right;
padding-right: 10px;
  }
</style>
