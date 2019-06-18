<template>
    <div class="userManagement">
        <bread-field class="topBread" :aryBread="aryBread"></bread-field>
        <div class="userMan_left">
            <div class="topBox">
                <div class="searchBox">
                    <el-input placeholder="请输入部门名称" v-model="filterText" @keyup.enter="searchDep" class="search"></el-input>
                    <span class="searchicon el-icon-search" @click="searchDep"></span>
                </div>
                <el-tree class="filter-tree"
                         :data="depList"
                         :props="defaultProps"
                         :filter-node-method="filterNode"
                         node-key="id" highlight-current
                         ref="depListTree" @node-click="handleNodeClick">
                </el-tree>
            </div>
        </div>
        <div class="userMan_right">
            <div class="detailedInfo">
                <div class="detInfoTop">

                    <div class="userSearchBox">
                        <el-input v-model="searchAcountName" placeholder="请输入用户名" class="userName" @keyup.enter.native="userNameSearch"></el-input>
                        <span class="searchicon el-icon-search" @click="userNameSearch"></span>
                    </div>
                    <el-button class="detDelete active" @click="addUser">添加</el-button>
                    <el-button class="detDelete active" :active="isActive" @click="batchDel">删除</el-button>

                </div>
                <div class="detInfoList">
                    <el-table :data="userList" style="width: 100%" @selection-change="selectionChange" header-row-class-name="sHeader">
                        <el-table-column type="selection">
                        </el-table-column>
                        <el-table-column prop="acountName" label="用户名" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                {{scope.row.acountName || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="username" label="账号" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                {{scope.row.username || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" prop="type" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.type==2">组账户</span>
                                <span v-if="scope.row.type==1">个人账户</span>
                                <span v-if="scope.row.type==''">--</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="角色" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-for="(i,index) in scope.row.roles" :key=index>
                                    {{i.roleNameZh}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phone" label="电话" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                {{scope.row.phone || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                {{scope.row.email || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="deptName" label="所属部门" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.ompDept.deptName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="成员组织" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                {{scope.row.remark || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ scope.row.createTime|dateFormat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enabled" label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>
                                    <el-switch active-color="#08979C" inactive-color="#fc5830" v-model="scope.row.enabled" @change="changeEnabled(scope.row)">
                                    </el-switch>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <span class="zicon-bianji" @click="zEdit(scope.row.id)">编辑</span>
                                <span class="zicon-shanchu" @click="zDelete(scope.row.id)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination v-show="isShowPnt" class="sPage" @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-size="pageSize" :prev-text="'〈  上一页'" :next-text="'下一页  〉'" layout="prev, pager, next" :total="total">
                    </el-pagination>
                </div>
            </div>

            <div class="logo">
                <common-footer></common-footer>
            </div>
        </div>
        <!-- 添加用户的弹出框 -->
        <div class="addUser">
            <el-dialog :title='dialogTitle' :visible.sync="addUserDialog" center :addUser="addUserDialog" @close="closeDialog">
                <el-form ref="addUserForm" :model="addUserForm" label-width="80px" :rules="addUserformRules">
                    <el-form-item label="用户名:" prop="acountName" class="acountName">
                        <el-input v-model="addUserForm.acountName"></el-input>

                    </el-form-item>
                    <el-form-item label="账号:" prop="username">
                        <el-input v-model="addUserForm.username" :disabled="isEdit"></el-input>
                        <span class="errorInfo">{{errorInfo}}</span>
                    </el-form-item>
                    <el-form-item label="密码:" prop="password" maxlength='20' class="adduser_password">
                        <el-input v-model="addUserForm.password" :data-password='addUserForm.realPassword' :type="isShowPsd?'text':'password'"></el-input>
                        <!-- <el-input v-model="addUserForm.password" :data-password='addUserForm.realPassword' v-if="!isShowPsd"></el-input> -->
                        <span class="el-icon-view icon_view" @click="isShowPsd=!isShowPsd"></span>
                    </el-form-item>
                    <!-- <el-form-item label="密码:" prop="password" class="adduser_password" v-if="isEdit">
                        <el-input v-model="addUserForm.password" type="password" v-if="isShowPsd"></el-input>
                        <el-input v-model="addUserForm.password" v-if="!isShowPsd"></el-input>
                        <span class="el-icon-view icon_view" @click="isShowPsd=!isShowPsd"></span>
                    </el-form-item> -->

                    <el-form-item label="所属部门:" prop="choseDepName">
                        <el-input placeholder="请输入内容" v-model="addUserForm.choseDepName" :suffix-icon="isShowSelectDepName?'el-icon-arrow-down':'el-icon-arrow-right'" @click.native="deptogglePanel($event)"></el-input>
                        <div class="suoShuBuMenTree" v-if="isShowSelectDepName" ref="suoShuBuMenTree">
                            <el-tree class="filter-tree suoshubumen" :data="depList" :props="defaultProps" :filter-node-method="filterNode" :expand-on-click-node="false" highlight-current ref="tree2" @node-click="choseDep">
                            </el-tree>
                        </div>
                    </el-form-item>
                    <el-form-item label="所属角色:" prop="rolesName">
                        <el-input placeholder="请输入内容" v-model="addUserForm.rolesName" :suffix-icon="isShowSelectRole?'el-icon-arrow-down':'el-icon-arrow-right'" @click.native="RoletogglePanel($event)"></el-input>
                        <div class="suoShuJueSeTree" v-if="isShowSelectRole" ref="suoShuJueSeTree">
                            <el-checkbox-group v-model="checkRole" class="suoshujuese">
                                <el-checkbox v-for="(item) in permissionList" :key="item.id" :label="item.id" @change="checkRoleChange">
                                    <div>{{item.roleNameZh}}</div>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                    <el-form-item label="类型:" prop="type">
                        <el-radio v-model="addUserForm.type" label="1">个人账户</el-radio>
                        <el-radio v-model="addUserForm.type" label="2">组帐户</el-radio>
                    </el-form-item>
                    <el-form-item label="所属成员:" prop="remark" v-if="isShowRole">
                        <span class="suoshuchengyuan">
                            <div class="addRole" @click="addRole" v-if="roleListRemark.length==0" v-show="roleListRemark.length==0">+添加成员</div>
                            <ul class="roleList">
                                <span v-for="(item,index) of roleListRemark" :key="index" class="dialog_role_list">
                                    <el-input v-model="item.name" :readonly="item.readonly" @blur="inputBlur(item)"></el-input>
                                    <span class="caozuo">
                                        <em style="color:#1081fa;font-style:normal;cursor: pointer;" @click="setDaibanZ(item)" v-if="item.position==0">设为代班长</em>
                                        <i class="zicon-edit icon-bianji iconfont" @click="editRole(item)"></i>
                                        <i class="zicon-delete iconfont icon-iconfonttubiao" @click="delteRole(index)"></i>
                                        <i class="zicon-add iconfont icon-jiahao" @click="addRole"></i>
                                    </span>
                                </span>
                            </ul>
                        </span>
                    </el-form-item>
                    <el-form-item label="电话:" prop="phone">
                        <el-input v-model="addUserForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱:" prop="email">
                        <el-input v-model="addUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:" prop="enabled">
                        <el-switch active-color="#08979C" inactive-color="#fc5830" v-model="addUserForm.enabled"></el-switch>
                    </el-form-item>
                    <el-form-item class="tar">
                        <el-button type='info' @click="resetForm('addUserForm')">取消</el-button>
                        <el-button type="primary" @click="onSubmit('addUserForm')">确认</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import newApiClient from "@/publicJs/newApiClient.js";
import urlMng from "@/services/authMng.js";
import publicMng from "@/services/public.js";
import commonFooter from "@/components/common/commonFooter";
import breadField from "@/components/common/commonBread";
import UtilService from "@/publicJs/UtilService";
export default {
  data() {
    var checkphone = (rule, value, callback) => {
      var reg = /0?(13|14|15|18|17)[0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式输入错误"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      var reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      if (value.trim().length != 0) {
        if (!reg.test(value)) {
          callback(new Error("邮箱格式输入错误"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkDeptName = function(rule, value, callback) {
      if (value.length == 0) {
        callback(new Error("请选择所属部门"));
      } else {
        callback();
      }
    };
    var checkRole = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请选择所属角色"));
      } else {
        callback();
      }
    };
    return {
      isShowSelectRole: false,
      isShowSelectDepName: false,
      editId: "",
      errorInfo: "",
      enabledStatus: "",
      isShowPnt: true,
      checkRole: [],
      inputShow: false,
      handleCurDate: {},
      filterText: "",
      searchAcountName: "",
      aryBread: [
        { name: "系统设置", url: "" },
        { name: "权限管理", url: "/systemHome" },
        { name: "用户管理", url: "" }
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,

      depList: [],
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      isActive: false,
      userName: "",
      addUserDialog: false,
      userList: [],
      addUserForm: {
        username: "",
        acountName: "",
        password: "",
        realPassword: "",
        type: "",
        phone: "",
        email: "",
        ompDept: {
          id: ""
        },
        enabled: true,
        remark: "",
        roles: [
          {
            id: ""
          }
        ],
        banzhangIsShow: false,
        choseDepName: "", //所属部门
        rolesName: "" //所属角色
      },
      zdepList: [],
      defaultDep: {},
      addUserformRules: {
        acountName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            max: 16,
            message: "密码长度不能超过16位",
            trigger: "blur"
          },
          { min: 6, message: "密码长度不能低6位", trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          { validator: checkphone, trigger: "blur" }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        choseDepName: [
          {
            required: true,
            message: "请选择所属部门",
            trigger: "change"
          },
          { validator: checkDeptName, trigger: "change" }
        ],
        enabled: [
          {
            required: true,
            message: "请选择是否允许操作",
            trigger: "change"
          }
        ],
        rolesName: [
          {
            required: true,
            message: "请选择所属角色",
            trigger: "change"
          },
          { validator: checkRole, trigger: "change" }
        ]
      },
      depHandleClickId: "",
      userRole: "",
      role: "",
      permissionList: [],
      roleListRemark: [],
      roleRemark: "",
      selectRow: [],
      rolesIdList: [],
      isEdit: false,
      isAddUser: false,
      isShowPsd: true,
      isShowDBZ: false,
      dialogTitle: "",
      render: 1,
      defaultCheckId: "8279b5c22675466f9263f801b2784931"
    };
  },
  components: {
    commonFooter,
    breadField
  },
  computed: {
    isShowRole: function() {
      if (this.addUserForm.type == 1) {
        return false;
      } else if (this.addUserForm.type == 2) {
        return true;
      }
    }
  },
  mounted: function() {
    this.queryDepList();
    this.searchRole();
  },
  methods: {
    //所属角色点击空白关闭弹出框
    RoletogglePanel: function(event) {
      event || (event = window.event);
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true);
      this.isShowSelectRole ? this.Rolehide() : this.Roleshow();
    },

    Roleshow() {
      this.isShowSelectRole = true;
      document.addEventListener("click", this.RolehidePanel, false);
    },

    Rolehide() {
      this.isShowSelectRole = false;
      document.removeEventListener("click", this.RolehidePanel, false);
    },

    RolehidePanel(e) {
      if (
        this.$refs.suoShuJueSeTree &&
        !this.$refs.suoShuJueSeTree.contains(e.target)
      ) {
        //点击除弹出层外的空白区域
        this.Rolehide();
      }
    },

    //所属部门点击空白关闭弹出框

    //点击空白关闭弹出框
    deptogglePanel: function(event) {
      event || (event = window.event);
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true);
      this.isShowSelectDepName ? this.dephide() : this.depshow();
    },

    depshow() {
      this.isShowSelectDepName = true;
      document.addEventListener("click", this.dephidePanel, false);
    },

    dephide() {
      this.isShowSelectDepName = false;
      document.removeEventListener("click", this.dephidePanel, false);
    },

    dephidePanel(e) {
      if (
        this.$refs.suoShuBuMenTree &&
        !this.$refs.suoShuBuMenTree.contains(e.target)
      ) {
        //点击除弹出层外的空白区域
        this.dephide();
      }
    },

    //关闭弹出框
    closeDialog: function() {
      this.$refs["addUserForm"].resetFields();
    },
    //角色选择的触发函数
    checkRoleChange: function() {
      var rolename = [];
      var persList = this.permissionList;
      for (var i = 0; i < this.checkRole.length; i++) {
        for (var j = 0; j < persList.length; j++) {
          if (persList[j].id == this.checkRole[i]) {
            rolename.push(persList[j].roleNameZh);
          }
        }
      }
      this.addUserForm.rolesName = rolename.toString();
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
      newApiClient.assignApi(publicMng.setUrl("departTree", []), param, function( 
        pres
      ) {
        if (pres.status == 200) {
          that.zdepList = pres.results;
          that.depList = that.GetData("0", that.zdepList);
          that.depHandleClickId = that.depList[0].id;
          that.defaultDep = that.depList[0];
          that.queryUserNum(that.defaultDep.id);
          that.queryUser(that.defaultDep.id);
          setTimeout(function() {
            that.$refs["depListTree"].setCurrentKey(that.defaultDep.id);
          }, 100);
        }
      });
    },
    //修改禁止状态
    changeEnabled: function(item) {
      this.enabledStatus = item.enabled;
      var param = {
        id: item.id,
        ompDept: {
          id: item.ompDept.id
        },
        enabled: this.enabledStatus
      };
      newApiClient.assignApi(urlMng.setUrl("userUpdate", []), param, function(pres) {
        if (pres.status == 200) {
          // console.log(pres, "+++++++");
        }
      });
    },
    //分页
    handleCurrentChange: function(val) {
      this.pageNow = val;
      this.queryUser(this.depHandleClickId);
    },

    //所属成员的增删改
    editRole: function(item) {
      item.readonly = false;
    },
    delteRole: function(index) {
      this.roleListRemark.splice(index, 1);
    },
    addRole: function() {
      this.inputShow = true;
      this.roleListRemark.push({
        name: "",
        position: "0",
        readonly: false
      });
    },
    //失去焦点的时候
    inputBlur: function(item) {
      item.readonly = true;
    },
    //点击设置代班长
    setDaibanZ: function(item) {
      if (item.name != "") {
        for (var i = 0; i < this.roleListRemark.length; i++) {
          var roleRemarkName = this.roleListRemark[i].name;
          if (roleRemarkName.indexOf("代班长") != -1) {
            this.roleListRemark[i].position = "0";
            roleRemarkName = roleRemarkName.substring(
              0,
              roleRemarkName.indexOf("(")
            );
            this.roleListRemark[i].name = roleRemarkName;
          }
        }

        item.position = "1";
        item.name = item.name + "(代班长)";
      }
    },
    //弹出框添加所属成员
    addroleRemark: function() {
      this.roleListRemark.push(this.roleRemark);
      this.addUserForm.remark = this.roleListRemark.toString();
      this.roleRemark = "";
      this.inputShow = false;
    },
    filterNode: function(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    //输入框输入时查询部门列表
    searchDep: function() {
      this.queryDepList();
    },
    //添加用户
    addUser: function() {
      this.addUserDialog = true;
      this.isAddUser = true;
      this.isEdit = false;
      this.dialogTitle = "添加用户";
      this.addUserForm.username = "";
      this.addUserForm.acountName = "";
      this.addUserForm.password = "";
      this.addUserForm.type = "1";
      this.addUserForm.phone = "";
      this.addUserForm.email = "";
      this.addUserForm.rolesName = "";
      this.addUserForm.enabled = true;
      this.errorInfo = "";
      this.checkRole = [];
      this.roleListRemark = [];
    },
    //添加用户表单提交
    addOnSubmit: function(addUserForm) {
      var that = this;
      var roleList = [];
      for (var i = 0; i < that.checkRole.length; i++) {
        roleList.push({ id: that.checkRole[i] });
      }
      that.$refs[addUserForm].validate(valid => {
        if (valid) {
          var remarkName = "";
          var groupRoleList = [];
          for (var i = 0; i < that.roleListRemark.length; i++) {
            groupRoleList.push(that.roleListRemark[i].name);
          }
          remarkName = groupRoleList.toString();
          if (that.addUserForm.type == 1) {
            remarkName = "";
          }
          var param = {
            username: that.addUserForm.username,
            password: that.addUserForm.password,
            type: that.addUserForm.type,
            acountName: that.addUserForm.acountName,
            remark: remarkName,
            phone: that.addUserForm.phone,
            email: that.addUserForm.email,
            enabled: that.addUserForm.enabled,
            roles: roleList,
            ompDept: {
              id: that.addUserForm.ompDept.id || that.depHandleClickId
            }
          };
          newApiClient.assignApi(urlMng.setUrl("userInsert", []), param,
            function(pres) {
              if (pres.status == 200) {
                that.queryUserNum(that.depHandleClickId);
                that.queryUser(
                  that.addUserForm.ompDept.id || that.depHandleClickId
                );
                that.addUserDialog = false;
              } else if (pres.status == 5004) {
                that.errorInfo = pres.exception;
              }
            }
          );
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },

    //点击编辑
    zEdit: function(data) {
      var roleid = [];
      var that = this;
      that.errorInfo = "";
      that.editId = data;
      that.addUserDialog = true;
      that.enabledStatus = data.enabled;
      that.isEdit = true;
      that.isAddUser = false;
      that.dialogTitle = "编辑用户";
      that.roleListRemark = [];
      newApiClient.assignApi(urlMng.setUrl("userGetById", [data]), "", function(
        pres
      ) {
        if (pres.status == 200) {
          that.addUserForm.username = pres.results.username;
          that.addUserForm.acountName = pres.results.acountName;
          that.addUserForm.type = pres.results.type;
          that.addUserForm.phone = pres.results.phone;
          that.addUserForm.email = pres.results.email;
          that.enabledStatus = pres.results.enabled;
          that.addUserForm.password = "................";
          that.addUserForm.realPassword = pres.results.password;
          that.addUserForm.choseDepName = pres.results.ompDept.deptName;
          that.addUserForm.ompDept.id = pres.results.ompDept.id;
          var remark = [];
          remark = pres.results.remark.split(",");
          $.each(remark, function(i) {
            var reamrkObj = {
              name: "",
              position: "",
              readonly: true
            };
            if (remark[i].indexOf("代班长") != -1) {
              reamrkObj.position = "1";
              reamrkObj.name = remark[i];
            } else {
              reamrkObj.name = remark[i];
              reamrkObj.position = "0";
            }
            that.roleListRemark.push(reamrkObj);
          });
          that.addUserForm.enabled = that.enabledStatus;
          var zrolename = [];
          for (var i = 0; i < pres.results.roles.length; i++) {
            roleid.push(pres.results.roles[i].id);
            zrolename.push(pres.results.roles[i].roleNameZh);
          }
          that.addUserForm.rolesName = zrolename.toString();

          that.checkRole = roleid;
        }
      });
    },
    //编辑表单提交
    editSumit: function(addUserForm) {
      var that = this;
      var roleList = [];
      for (var i = 0; i < that.checkRole.length; i++) {
        roleList.push({ id: that.checkRole[i] });
      }
      that.$refs[addUserForm].validate(valid => {
        if (valid) {
          var remarkName = "";
          var groupRoleList = [];
          for (var i = 0; i < that.roleListRemark.length; i++) {
            groupRoleList.push(that.roleListRemark[i].name);
          }
          remarkName = groupRoleList.toString();
          if (that.addUserForm.type == 1) {
            remarkName = "";
          }

          if (that.addUserForm.password == "................") {
            if (that.addUserForm.password.length < 21) {
              var param = {
                id: that.editId,
                username: that.addUserForm.username,
                type: that.addUserForm.type,
                acountName: that.addUserForm.acountName,
                remark: remarkName,
                phone: that.addUserForm.phone,
                email: that.addUserForm.email,
                enabled: that.addUserForm.enabled,
                roles: roleList,
                ompDept: { id: that.addUserForm.ompDept.id }
              };
            } else {
              var param = {
                id: that.editId,
                username: that.addUserForm.username,
                type: that.addUserForm.type,
                acountName: that.addUserForm.acountName,
                remark: remarkName,
                phone: that.addUserForm.phone,
                email: that.addUserForm.email,
                enabled: that.addUserForm.enabled,
                roles: roleList,
                ompDept: { id: that.addUserForm.ompDept.id }
              };
            }
          } else {
            if (that.addUserForm.password.length < 21) {
              var param = {
                id: that.editId,
                username: that.addUserForm.username,
                password: that.addUserForm.password,
                type: that.addUserForm.type,
                acountName: that.addUserForm.acountName,
                remark: remarkName,
                phone: that.addUserForm.phone,
                email: that.addUserForm.email,
                enabled: that.addUserForm.enabled,
                roles: roleList,
                ompDept: { id: that.addUserForm.ompDept.id }
              };
            } else {
              var param = {
                id: that.editId,
                username: that.addUserForm.username,
                type: that.addUserForm.type,
                acountName: that.addUserForm.acountName,
                remark: remarkName,
                phone: that.addUserForm.phone,
                email: that.addUserForm.email,
                enabled: that.addUserForm.enabled,
                roles: roleList,
                ompDept: { id: that.addUserForm.ompDept.id }
              };
            }
          }

          newApiClient.assignApi(urlMng.setUrl("userUpdate", []), param, function(pres) {
            if (pres.status == 200) {
              that.queryUser(that.depHandleClickId);
              that.queryUserNum(that.depHandleClickId);
              that.queryUser(that.addUserForm.ompDept.id);
              that.addUserDialog = false;
            } else if (pres.status == 5004) {
              that.errorInfo = pres.exception;
            }
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    //根据部门查询该部门下有多少账号
    queryUserNum: function(id) {
      var that = this;
      var param = {
        acountName: "",
        deptId: id
      };
      newApiClient.assignApi(urlMng.setUrl("userListAcountCount", []), param, function(
        pres
      ) {
        if (pres.status == 200) {
          that.total = pres.results;
          if (that.total < 10) {
            that.isShowPnt = false;
          } else {
            that.isShowPnt = true;
          }
        }
      });
    },
    // 根据部门查询该部门下相应的账号
    queryUser: function(id) {
      var that = this;
      var param = {
        acountName: "",
        deptId: id,
        pageSize: that.pageSize,
        pageNum: that.pageNum
      };
      newApiClient.assignApi(urlMng.setUrl("departList", []), param, function(pres) {
        if (pres.status == 200) {
          that.userList = pres.results;
        }
      });
    },

    //点击部门查看角色
    handleNodeClick: function(data) {
      this.pageNum = 1;
      this.handleCurDate = data;
      this.depHandleClickId = data.id;
      this.queryUserNum(this.depHandleClickId);
      this.queryUser(this.depHandleClickId);
      this.addUserForm.choseDepName = this.handleCurDate.deptName;
    },
    //根据输入的角色名查询用户
    userNameSearch: function() {
      var that = this;
      var param = {
        acountName: that.searchAcountName,
        deptId: that.depHandleClickId,
        pageSize: that.pageSize,
        pageNum: that.pageNum
      };
      newApiClient.assignApi(urlMng.setUrl("departList", []), param, function(pres) {
        if (pres.status == 200) {
          that.userList = pres.results;
        }
      });
    },
    //表单提交
    onSubmit: function(addUserForm) {
      if (this.isAddUser == true) {
        this.addOnSubmit(addUserForm);
      }
      if (this.isEdit == true) {
        this.editSumit(addUserForm);
      }
    },
    //添加编辑用户选择部门
    choseDep: function(data) {
      var that = this;
      that.addUserForm.ompDept.id = data.id;
      that.addUserForm.choseDepName = data.deptName;
      that.isShowSelectDepName = false;
    },

    //点击取消关闭弹出框
    resetForm(addUserForm) {
      this.$refs[addUserForm].resetFields();
      this.addUserDialog = false;
    },

    //查询所属角色
    searchRole: function() {
      var that = this;
      var param = {
        roleNameZh: that.roleNameZh
      };
      newApiClient.assignApi(urlMng.setUrl("roleGetName", []), param, function(pres) {
        if (pres.status == "200") {
          that.permissionList = pres.results;
        }
      });
    },

    // 删除多选
    selectionChange: function(datas) {
      this.selectRow = datas;
    },
    // 批量删除
    batchDel: function(data) {
      var that = this;
      var arySelect = that.selectRow;
      if (arySelect.length == 0) {
        this.$message({
          message: "请勾选要删除的消息"
        });
      } else {
        this.$confirm("是否确认删除所选用户，删除后将不可找回?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          var aryId = [];
          $.each(arySelect, function(i) {
            aryId.push(arySelect[i].id);
          });
          var param = {
            acountIds: aryId
          };
          newApiClient.assignApi(urlMng.setUrl("userDelete", []), param, function(pres) {
            if (pres.status == 200) {
              that.queryUserNum(that.depHandleClickId);
              that.queryUser(that.depHandleClickId);
            }
          });
        });
      }
    },

    //点击删除
    zDelete: function(data) {
      var that = this;
      that
        .$confirm("是否确认删除该用户，删除后将不可找回?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var param = {
            acountIds: [data]
          };
          newApiClient.assignApi(urlMng.setUrl("userDelete", []), param, function(pres) {
            if (pres.status == 200) {
              that.queryUserNum(that.depHandleClickId);
              that.queryUser(that.depHandleClickId);
            }
          });
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
    }
  },
  filters: {
    //时间格式化
    dateFormat: function(value) {
      if (value !== "" && value !== 0) {
        return UtilService.formatDuring(value, "yyyy-MM-dd  HH:mm:ss");
      } else {
        return "暂无";
      }
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
.userMan_left {
  width: 300px;
  height: calc(100% - 60px);
  overflow: auto;
  box-sizing: border-box;
  background: #fff;
  position: absolute;
}

.adduser_password {
  position: relative;
}
.adduser_password .icon_view {
  position: absolute;
  top: 14px;
  right: 24.45%;
}
.icon_view {
  cursor: pointer;
}
.suoshubumen,
.suoshujuese {
  width: 100%;
  max-height: 300px;
  overflow: auto;
  box-shadow: 1px 2px 5px 0px rgba(78, 78, 78, 0.3);
  border-radius: 2px;
  border: solid 1px #d2d2d2;
}
.suoShuBuMenTree,
.suoShuJueSeTree {
  position: absolute;
  z-index: 100;
  width: 77.57%;
  left: 1.7%;
  margin-top: 5px;
  background: #fff;
}
.addUser .acountName {
  position: relative;
}
.errorInfo {
  position: absolute;
  left: 3%;
  top: 80%;
  color: #f56c6c;
}
.el-popover {
  padding: 0;
}
.tar {
  text-align: right;
  margin-right: 18%;
}
.el-dialog__header {
  background: #000 !important;
}
.el-form {
  padding-left: 8%;
}
</style>
<style>
.userMan_left .searchBox {
  position: relative;
  padding: 10px 10px 0px 10px;
  border-radius: 3px;
}
.userMan_left .searchicon {
  position: absolute;
  right: 20px;
  top: 20px;
  color: #c0c0c0;
  font-size: 18px;
  cursor: pointer;
}
.userMan_left .search {
  width: 100%;
  height: 36px;
  /*padding-left: 10px;*/
  margin-bottom: 10px;
  /*border: 1px solid #d3d3d3;*/
}

/* 注意点 */
.el-tree-node__expand-icon {
  font-size: 18px;
  color: #828282;
}

/* 右边 */
.userMan_right {
  margin-left: 10px;
  background-color: #fff;
  width: calc(100% - 330px);
  height: calc(100% - 60px);
  position: absolute;
  right: 10px;
  padding: 10px 10px 0px 10px;
  overflow: auto;
}
.userMan_right .detailedInfo {
  height: calc(100% - 50px);
}

.detInfoList {
  height: 100%;
}
.detInfoList .el-table__body {
  width: 100% !important;
}
.detInfoList .el-table {
  height: calc(100% - 72px);
  overflow: auto;
}

.detInfoList .el-table__body-wrapper {
  margin-top: 0px;
}
.detInfoTop {
  height: 50px;
  padding-top: 3px;
}
.detInfoTop button.active {
  background-color: #08979c;
  color: #fff;
  border: 1px solid #08979c;
}
.userSearchBox {
  float: right;
  position: relative;
}
.userSearchBox .searchicon {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  color: #909399;
}
.detInfoTop .userName {
  width: 330px;
  height: 36px;
}
.detInfoTop .userName .el-input__inner {
  height: 36px;
  line-height: 36px;
  border: 1px solid #d2d2d2;
}
/* 弹出框 */

.addUser .addRole {
  width: 77.45%;
  height: 40px;
  line-height: 40px;
  border: 1px solid #d2d2d2;
  text-align: center;
  margin-left: 2.06%;
  border-radius: 2px;
  cursor: pointer;
}
.addUser ul.roleList {
  padding-left: 10px;
}

.dialog_role_list {
  position: relative;
}
.dialog_role_list:hover .caozuo {
  display: block;
}
.addUser ul.roleList .el-input {
  margin-bottom: 10px;
}
.addUser .roleList .el-input {
  width: 79.2%;
}
/* .addUser .roleList:hover .caozuo {
  display: block !important;
} */
.addUser .roleList li {
  width: 79.2%;
  height: 40px;
  border-radius: 2px;
  border: solid 1px #d2d2d2;
  margin-bottom: 6px;
  padding-left: 10px;
}
.addUser .el-form-item {
  margin-bottom: 20px !important;
}
.addUser .el-form-item__label {
  width: 90px !important;
}
.addUser .el-form-item__content {
  margin-left: 90px;
}
.addUser .el-form-item__error {
  left: 2%;
}
.addUser .el-dialog {
  width: 38.02%;
  height: 62%;
  box-shadow: -2px 1px 9px 0px rgba(4, 4, 4, 0.15);
  border-radius: 3px;
  background-color: #fff;
}
.addUser .el-dialog__body {
  height: calc(100% - 54px);
  overflow: auto;
}
.addUser .el-input {
  width: 77.57%;
  border-radius: 2px;
}
.addUser .el-dialog__wrapper {
  height: 100%;
  width: 100%;
}

.el-popover {
  padding: 0;
}

.suoShuBuMenTree .el-tree-node__content {
  height: 50px;
}
.suoshujuese .el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.suoshujuese .el-checkbox {
  display: block;
  height: 60px;
  line-height: 60px;
  padding-left: 16.376%;
}
.suoshujuese .el-checkbox__label {
  padding-left: 5.74%;
}

.filter-tree.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #eaf1fb !important;
  color: #08979c !important;
}
.filter-tree .el-tree-node__content:hover {
  background-color: #eaf1fb !important;
  color: #08979c !important;
  width: calc(100% - 1px);
}
.suoshujuese label:hover {
  color: #08979c;
}
.suoshuchengyuan .caozuo {
  position: absolute;
  display: none;
  width: 63.92%;
  right: 0;
  top: -10px;
}
.caozuo .zicon-edit {
  position: absolute;
  right: 30.62%;
  cursor: pointer;
}
.caozuo .zicon-edit:hover {
  color: #08979c;
}
.caozuo .zicon-delete {
  position: absolute;
  right: 18.26%;
  cursor: pointer;
}
.caozuo .zicon-delete:hover {
  color: #08979c;
}
.caozuo .zicon-add {
  position: absolute;
  right: 5.869%;
  cursor: pointer;
}
.caozuo .zicon-add:hover {
  color: #08979c;
}
.suoshuchengyuan .rolRemark .caozuo {
  margin-right: 27px;
}
.rolRemark .caozuo i {
  margin-left: 40px;
}
.rolRemark .daibanzhang {
  color: #08979c;
}
.zicon-bianji {
  display: inline-block;
  height: 21px;
  color: #08979c;
  margin-right: 10px;
  cursor: pointer;
}
.zicon-shanchu {
  display: inline-block;
  height: 21px;
  color: #08979c;
  cursor: pointer;
}
</style>

