<template>
<div class="userManagement">
    <bread-field class="topBread" :aryBread="aryBread"></bread-field>
    <div class="struLeft">
        <div class="topBox">
            <div class="searchBox">
                <el-input
                    placeholder="请输入部门名称"
                    v-model="filterText" 
                    @keyup.enter="searchUser" class="search"></el-input>
                <span class="searchicon el-icon-search" @click="searchUser"></span>
            </div>
            <el-button @click="creatorgStru" class="addorgStru" >+创建部门</el-button>
        </div>
         <el-tree 
          :data="depList" 
          ref="depList"
          :props="defaultProps"
          node-key="id"
          @node-click="handleNodeClick"
          highlight-current
          class="struTree"
          >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span class="zIcon">
                <span class="icon-jiahao iconfont  zicon-add" @click.stop="append(data)"></span>
                <span class="icon-iconfonttubiao iconfont zicon-delete" @click.stop="remove(node,data)"></span>
                <span class="icon-bianji iconfont zicon-bianji" @click.stop="edit(data)"></span>
            </span>
          </span>
        </el-tree>
    </div>
    <div class="struRight">
         <div class="depDetails" v-show="isShow">
           <el-form :model="depForm" ref="depForm" :rules="depFormRule" label-width="100px" label-position='right' class="demo-ruleForm depDetForm">
              <el-form-item label="排   序   :" prop="sort" >
                <el-input v-model="depForm.sort" class="zInput" :disabled="isDisabled"></el-input>
              </el-form-item>
              <span class="depy" >
                <el-form-item class="deptName"  prop="deptName" label="部门名称:">
                      <el-input v-model="depForm.deptName"  class="zInput" :disabled="isDisabled"></el-input>
                      <span class="errorInfo">{{errorInfo}}</span>
                </el-form-item >
                
                <el-form-item  class="deptBoss" prop="deptBoss" label="负责人:">
                  <el-input v-model="depForm.deptBoss" class="zInput" :disabled="isDisabled"></el-input>  
                </el-form-item >
              </span>
              <el-form-item label="部门描述:" prop="remark" >
                  <el-input type="textarea" v-model="depForm.remark" class="zInputArea remark" :disabled="isDisabled"></el-input>
              </el-form-item>
               <el-form-item class="queren">
                <el-button type="primary" @click="submitForm" class="stru_button" v-show="isShowBtn">确认</el-button>
              </el-form-item>
          </el-form>
         </div>
       <div class="logo">
        <common-footer></common-footer>
        </div> 
    </div>   
</div> 
</template>
<script>
import commonFooter from "@/components/common/commonFooter";
import breadField from "@/components/common/commonBread";
import apiClient from "@/publicJs/apiClient.js";
import urlMng from "@/services/authMng.js";
import newApiClient from "@/publicJs/newApiClient.js";
export default {
  data() {
    var checkSort = (rule, value, callback) => {
      if (value && value.length > 0) {
        if (!Number.isInteger(value - 0)) {
          callback(new Error("请输入数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkdeptName = (rule, value, callback) => {
      if (value.length > 20) {
        callback(new Error("部门名称不能超过20个字"));
      } else {
        callback();
      }
    };
    var checkZdeptBoss = (rule, value, callback) => {
      if (value.length > 5) {
        callback(new Error("负责人名字不能超过5个字"));
      } else {
        callback();
      }
    };
    return {
      errorInfo: "", //错误信息
      iniDepList: [],
      handleDate: "",
      isShowBtn: false,
      isDisabled: true,
      input: "",
      filterText: "",
      depList: [],
      isShow: false,
      newParentId: 0,
      depForm: {
        parentId: "",
        deptName: "",
        deptBoss: "",
        remark: "",
        sort: ""
      },
      depFormRule: {
        sort: [
          { required: true, message: "请输入序号", trigger: "blur" },
          { validator: checkSort, trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          { validator: checkdeptName, trigger: "blur" }
        ],
        deptBoss: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
          { validator: checkZdeptBoss, trigger: "blur" }
        ]
      },
      aryBread: [
        { name: "系统设置", url: "" },
        { name: "权限管理", url: "/systemHome" },
        { name: "组织架构", url: "" }
      ],
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      currentHandleId: "",
      currentHandleParentId: "",
      submitType: "",
      defaultCheckedId:'8279b5c22675466f9263f801b2784931',
    };
  },
  components: {
    commonFooter,
    breadField
  },
  mounted: function() {
    var that = this;
    this.queryDepList();
    
  },
  watch:{
  },
  methods: {
    //添加
    append: function(data) {
      var that = this;
      that.$refs['depForm'].resetFields();
      that.isShow = true;
      that.isShowBtn = true;
      that.isDisabled = false;
      that.submitType = "creatSubmit";
      that.depForm = {
        parentId: "",
        deptName: "未命名",
        deptBoss: "",
        remark: "",
        slot: ""
      };
      if (data.id >= 1529386987873) {
        that.currentHandleParentId = data.parentId;
      } else {
        that.currentHandleParentId = data.id;
      }
      const newChild = {
        deptName: "未命名",
        parentId: data.id,
        id: new Date().getTime()
      };
      if (data.id >= 1529386987873) {
        that.warnMessage("父级部门未保存，请先保存父级部门，再进行添加");
        return false;
      }

      that.$refs["depList"].append(newChild, data.id);
    },
    //创建
    creatorgStru: function() {
      var that = this;

      that.$refs['depForm'].resetFields();

      that.isShow = true;
      that.isShowBtn = true;
      that.isDisabled = false;

      that.depForm = {
        parentId: "",
        deptName: "未命名",
        deptBoss: "",
        remark: "",
        slot: ""
      };
      const newChild = {
        deptName: "未命名",
        parentId: that.handleDate.parentId,
        id: "test"+new Date().getTime()
      };

      if (!this.handleDate.id) {
        this.depList.push(newChild);
      }
      if (this.handleDate.id) {
        that.$refs["depList"].insertAfter(newChild, this.handleDate.id);
      }

      this.submitType = "creatSubmit";
    },
    //移除
    remove: function(node, data) {
      var that = this;
      var deleteInfo;
      if (data.children) {
        deleteInfo = "是否确认删除部门，删除后部门内所有子部门也将全部删除?";
      } else {
        deleteInfo = "是否确认删除部门?";
      }
      this.$confirm(deleteInfo, "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if(data.id.indexOf("test")<0){
          var obj = {
          acountName:'',
          deptId:data.id,
          pageSize:10,
          pageNum:1
        }
        newApiClient.assignApi(urlMng.setUrl("departList", []),obj,function(pres){
          if(pres.status == 200){
            if(pres.results.length>0){
                that.$message({
                  type:'warning',
                  message:'删除失败，必须先删除该部门下的所有子用户'
                })
            }else {
              var id = data.id;
              newApiClient.assignApi(urlMng.setUrl("departDelete", [id]), "", function(pres) {
                  if (pres.status == 200) {
                    that.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    that.queryDepList();
                    that.depForm = {
                      parentId: "",
                      deptName: "",
                      deptBoss: "",
                      remark: ""
                    };
                  }
              });
            }
          }
        })
        }
        else {
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
          that.$message({
                      type: "success",
                      message: "删除成功!"
                    });
        }
              
      });
    },
    //编辑
    edit: function(data) {
      var that = this;

      that.$refs['depForm'].resetFields();

      that.isShow = true;
      that.depForm.sort = data.sort;
      that.depForm.deptName = data.deptName;
      that.depForm.deptBoss = data.deptBoss;
      that.depForm.remark = data.remark;
      that.depForm.parentId = data.parentId;
      that.depForm.id = data.id;
      that.isShowBtn = true;
      that.isDisabled = false;
      console.info(data);
      if (data.id.indexOf("test")>=0) {
        that.submitType = "creatSubmit";
      } else {
        that.submitType = "updataSubmit";
      }
    },

    searchUser: function() {
      this.queryDepList();
    },
    handleNodeClick: function(data) {
      var that = this;
      that.$refs['depForm'].resetFields();
      that.isShow = true;
      that.handleDate = data;
      that.currentHandleParentId = data.parentId;
      that.depForm.parentId = data.parentId;
      that.depForm.deptName = data.deptName;
      that.depForm.deptBoss = data.deptBoss;
      that.depForm.remark = data.remark;
      that.depForm.sort = data.sort;
      that.isDisabled = true;
      that.isShowBtn = false;
    },
    //查询部门列表
    queryDepList: function() {
      var that = this;
      if (that.filterText.trim() == "") {
        var param = {};
      } else {
        var param = {
          deptName: that.filterText
        };
      }
      newApiClient.assignApi(urlMng.setUrl("departTree", []), param, function(pres) {
        if (pres.status == 200) {
          that.iniDepList = pres.results;
          that.depList = that.GetData("0", that.iniDepList);
          setTimeout(() => {
            that.$refs['depList'].setCurrentKey(that.depList[0].id)
          }, 100);
          that.handleNodeClick(that.depList[0]);
        }
      });
    },
    //提交表单
    submitForm: function() {
      var that = this;
      that.$refs["depForm"].validate(function(valid) {
        if (valid) {
          if (that.submitType == "creatSubmit") {
            that.creatDataRequest();
          }
          if (that.submitType == "updataSubmit") {
            that.updateDateRequest();
          }
        } else {
          return false;
        }
      });
    },
    //创建的数据请求
    creatDataRequest: function() {
      var that = this;
      var param = {
        sort: that.depForm.sort,
        deptName: that.depForm.deptName,
        deptBoss: that.depForm.deptBoss,
        remark: that.depForm.remark,
        parentId: that.currentHandleParentId || that.newParentId
      };
      newApiClient.assignApi(urlMng.setUrl("departInsert", []), param, function(
        pres
      ) {
        if (pres.status == 200) {
          that.queryDepList();
          that.isShowBtn = false;
          that.isDisabled = true;
          that.errorInfo = "";
        } else if (pres.status == 5004) {
          that.errorInfo = pres.exception;
        }
      });
    },
    //修改的数据请求
    updateDateRequest: function() {
      var that = this;
      var param = {
        sort: that.depForm.sort,
        deptName: that.depForm.deptName,
        deptBoss: that.depForm.deptBoss,
        remark: that.depForm.remark,
        parentId: that.depForm.parentId,
        id: that.depForm.id
      };
      newApiClient.assignApi(urlMng.setUrl("departUpdate", []), param, function(
        pres
      ) {
        if (pres.status == 200) {
          that.queryDepList();
          that.isShowBtn = false;
          that.isDisabled = true;
          that.errorInfo = "";
        } else if (pres.status == 5004) {
          that.errorInfo = pres.exception;
        }
      });
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
    //警告提示信息
    warnMessage: function(message) {
      this.$message({
        message: message,
        type: "warning"
      });
    }
  }
};
</script>
<style scoped>
.userManagement {
  background: #efefef;
  padding: 10px 10px 0px 10px;
  width: 100%;
  height: 100%;
  position: relative;
}
.topBread {
  margin-bottom: 10px;
}
.struLeft {
  width: 300px;
  height: calc(100% - 60px);
  box-sizing: border-box;
  background: #fff;
  overflow: auto;
  position: absolute;
}
.topBox {
  padding: 10px 10px 0px 10px;
}
.struLeft .addorgStru {
  width: 100%!important;
  height: 36px;
  border: 1px solid #02848D;
  font-size: 14px;
  background: #fff;
  color: #02848D;
  margin-bottom: 20px;
  border-radius: 2px;
  max-width: 100%;
}
.struLeft .addorgStru:hover {
  cursor: pointer;
  border-color: #006D75!important;
  outline: none;
  color:#006D75!important;
  background: #fff!important;
}
.struLeft .zicon-bianji {
  color: #828282;
}
.struLeft .zicon-bianji:hover {
  color: #006D75;
}
.struLeft .searchBox {
  position: relative;
}
.struLeft .searchicon {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #c0c0c0;
  font-size: 18px;
}
.struLeft .search {
  width: 100%;
  height: 36px;
  /*padding-left: 10px;*/
  margin-bottom: 10px;
}
.struLeft .search:hover {

}
.struLeft .search:focus {
  border: 1px solid #02848D;
  outline: none;
}
.struLeft .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

/* 右边 */
.struRight {
  margin-left: 10px;
  background-color: #fff;
  width: calc(100% - 330px);
  height: calc(100% - 60px);
  position: absolute;
  right: 10px;
  padding-left: 10%;
}
.depDetForm {
  padding-top: 8.9%;
  padding-right: 13%;
}
.depDetails {
  height: calc(100% - 40px);
  overflow: auto;
}
.depDetails .el-form-item__label {
  width: 184px !important;
}
.depDetForm .el-form-item__content {
  margin-left: 200px;
}
.depDetForm .el-input {
  width: 34%;
}
.depDetForm .el-form-item.formItemDeptName {
  width: 50%;
  float: left;
}
.depDetForm .el-form-item.formItemDeptBoss {
  float: left;
}
.struRight .logo {
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}

/* 删除框 */
.struTree.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #eaf1fb !important;
  color: #02848D !important;
}
.custom-tree-node:hover .zIcon{
  display: inline;
}
.struLeft .el-tree-node__content {
  height: 40px;
}

.struLeft .el-tree-node__content:hover .custom-tree-node {
  color: #02848D;
}

.struLeft .active {
  background-color: #eaf1fb;
}
.depDetails .el-form-item__error {
  left: 8% !important;
}

.depDetails .el-form-item__label {
  width: 16.7% !important;
  font-size:14px;
  color:#333333;
}

.depDetails .el-textarea {
  width: 89.45%;
}
.queren {
  width: 90%;
  margin-right: 0;
}
.depy {
  display: block;
  height: 40px;
  width: 100%;
  margin-bottom: 9.3px;
}
.depy .el-form-item__error {
  left: 33% !important;
}

.depDetails .el-textarea__inner {
  min-height: 170px !important;
}
.depDetails .stru_button {
  float: right;
  margin-right: 10.5%;
  width: 70px;
  height: 36px;
}
.depy .deptName {
  float: left;
  width: 50%;
  color: #666;
}
.depy .deptName .el-form-item__content {
  position: relative;
}
.depy .deptName .errorInfo {
  position: absolute;
  left: 34%;
  top: 80%;
  color: #f56c6c;
}
.depy .deptName .el-form-item__label {
  width: 33.4% !important;
}
.depy .deptBoss {
  float: right;
  width: 50%;
  color: #666;
}
.deptBoss .el-form-item__label {
  width: 33.4% !important;
}
.depy .el-form-item__content {
  margin-left: 0px !important;
}
.depy .zdeptName,
.zdeptBoss {
  width: 25.4%;
  text-align: right;
  display: inline-block;
  margin-right: 7%;
}
.depy .deptName .el-input {
  width: 76%;
}
.depy .deptBoss .el-input {
  width: 76%;
}

tree.struTree {
  margin-left: 12px;
}

.struTree .el-tree-node__expand-icon {
  font-size: 16px;
}
.struTree .zIcon {
  margin-right: 3.1%;
  display:none;
}
.struTree .zicon-delete {
  margin-right: 15px;
  color: #828282;
}

.struTree .zicon-add {
  margin-right: 15px;
  color: #828282;
}
.struTree .zicon-delete:hover,
.struTree .zicon-add:hover {
  color: #02848D;
}
.struTree.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content  .custom-tree-node{
  background-color: #eaf1fb !important;
  color: #02848D !important;
  height: 40px!important;
}
.struTree .el-tree-node__content:hover {
  background-color: #eaf1fb !important;
  color: #02848D !important;
}
.el-icon-caret-right:before {
  content: ''!important
}
</style>
