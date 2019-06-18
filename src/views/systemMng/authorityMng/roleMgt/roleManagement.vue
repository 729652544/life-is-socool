<template>
  <div class="userManagement">
    <bread-field class="topBread" :aryBread="aryBread"></bread-field>
    <div class="role_left">
      <div class="topBox">
        <div class="searchBox">
          <el-input type="text" placeholder="请输入角色名称" v-model="roleNameZh" class="search" @keyup.enter="searchRole"></el-input>
          <span class="searchicon el-icon-search" @click="searchRole"></span>
        </div>
        <el-button type="text" @click="addRoleBtn" class="addRoleBtn">+创建角色</el-button>
      </div>
      <ul class="permissionList">
        <li v-for="(item,index) in permissionList" :key="index" @click="handleQueryRoleList(item.id,item,index)" :class="item.id==meberid?'active':''">
          <span>{{ item.roleNameZh }}</span>
          <span>({{item.acountCount}})</span>
          <span type="text" class="icon icon-iconfonttubiao iconfont" @click="deleteRole(item.id)"></span>
          <span type="text" class="icon icon-bianji iconfont" @click="editSerach(item.id)"></span>
        </li>
      </ul>
    </div>
    <!-- 弹出框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" center class="roleMab" :before-close="closeDialog" v-show="dialogFormVisible">
      <el-form :model="form" :rules="formRules" ref="form">
        <el-form-item label="角色ID:" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" auto-complete="off" v-show="iscreat"></el-input>
          <el-input v-model="form.roleName" auto-complete="off" disabled v-show="isedit"></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" :label-width="formLabelWidth" prop="roleNameZh" class="roleNameZh">
          <el-input v-model="form.roleNameZh" auto-complete="off"></el-input>
          <span class="errorInfo">{{errorInfo}}</span>
        </el-form-item>
        <el-form-item label="描述:" :label-width="formLabelWidth" prop="roleDesc">
          <el-input type="textarea" v-model="form.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type='info' @click="closefrom">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <div class="role_right">
        <div class="topBtnBox">
            <div class="topLeft" @click="clickContentShow($event)">
              <span :class="isShowSJ?'active':''">数据</span>

              <span :class="isShowJdt?'active':''">权限管理</span>
              <span :class="isShowMbr?'active':''">成员</span>
            </div>
            <div class="topRight">
                <div class="listBtn" v-show="isShowMbr">
                    <el-button type='primary' class="delete" @click="batchDel">删除</el-button>
                    <div class="searchBox">
                    <span class="el-icon-search iconSearch" @click="queryMenList()"></span>
                    <el-input v-model="zAcountName" placeholder="请输入用户名" class="zAcountName" type="text" @keyup.enter.native="queryMenList()">
                    </el-input>
                    </div>
                </div>
                <div class="jdtBtn" v-show="isShowJdt">
                    <el-button  @click="updateJdt">提交</el-button>
                </div>


              <div class="jdtBtn" v-show="isShowSJ">
                <span>已选择：{{checkedKeys.length}}个</span>
                <el-button @click="onChange" v-show="isShowElBtn">编辑</el-button>
                <el-button @click="noChange" v-show="!isShowElBtn">取消</el-button>
                <el-button  @click="updateJdt" v-show="!isShowElBtn">提交</el-button>
              </div>



            </div>
        </div>
        <div class="contentBox">
            <div class="memberList" v-show="isShowMbr">
                <el-table :data="memberList" style="width: 100%" header-row-class-name="sHeader" @selection-change="selectionChange" ref="selectRow">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="acountName" label="用户名" show-overflow-tooltip :align="'left'">
                        <template slot-scope='scope'>
                            {{scope.row.acountName || '--'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" show-overflow-tooltip :align="'left'">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type=='1'">个人</span>
                        <span v-if="scope.row.type=='2'">组帐户</span>
                        <span v-if="scope.row.type==''">--</span>
                    </template>
                    </el-table-column>
                    <el-table-column label="角色" show-overflow-tooltip :align="'left'">
                    <template slot-scope="scope">
                        {{zRoleNameZh}}
                    </template>
                    </el-table-column>
                    <el-table-column prop="phone" label="电话" show-overflow-tooltip :align="'left'">
                        <template slot-scope='scope'>
                            {{scope.row.phone || '--'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱" show-overflow-tooltip :align="'left'">
                        <template slot-scope='scope'>
                            {{scope.row.username || '--'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="所属部门" show-overflow-tooltip prop="ompDept" :align="'left'">
                    <template slot-scope="scope">
                        <span>{{scope.row.ompDept.deptName}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="成员组织" show-overflow-tooltip :align="'left'">
                        <template slot-scope="scope">
                        <span>{{ scope.row.remark?scope.row.remark:'--'}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="createTime" width="140" label="创建时间" show-overflow-tooltip :align="'left'">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createTime|dateFormat}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column label="状态" show-overflow-tooltip :align="'left'">
                    <template slot-scope="scope">
                        <span>
                        <el-switch v-model="scope.row.enabled" active-color="#02848D" inactive-color="#fc5830" @change="changeEnabled(scope.row)">
                        </el-switch>
                        </span>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作" show-overflow-tooltip :align="'left'">
                    <template slot-scope="scope">
                        <span type="text" class="operation" @click="removeMember(scope.row)">移除</span>
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination 
                v-show="total>10" 
                class="sPage"
                @current-change="handleCurrentChange" 
                :current-page.sync="pageNow" 
                :page-size="pageSize" 
                :prev-text="'〈  上一页'" 
                    :next-text="'下一页  〉'"
                layout="prev, pager, next" 
                :total="total">
                </el-pagination>
            </div>
            <div class="jdt_content" v-show="isShowJdt">
                <div class="jdt_content_box" v-for="(item,index) in allJdtDate" :key="index">
                    <!-- 标题 -->
                    <div class="jdt_content_top">
                    <el-checkbox class="jdt_firstOrderName"
                                 v-model="parAllCheox[index].checkbox"
                                 @change="allCheckbo(index,item)"
                                 :label="item.id">{{item.name}}
                    </el-checkbox>
                    </div>

                    <div class="jdt_content_bottom"
                         v-for="(items,indexs) in item.children" :key="indexs">
                    <ul>
                        <el-checkbox-group v-model="parAllCheox[index].childrenArr">
                            <li>
                                <!-- 左 -->
                                <div class="jdt_content_bottom_left"
                                     @click.stop.prevent="changeRight(index,items.id,items.children)">
                                <el-checkbox :label="items.id"
                                             class="jdt_secondOrderName">{{items.name}}
                                </el-checkbox>
                                </div>


                                                <!-- 右 -->
                                <div class="jdt_content_bottom_right">
                                <span v-for="(itemss,indexss) in items.children" :key="indexss">
                                    <el-checkbox :label="itemss.id">{{itemss.name}}</el-checkbox>
                                </span>
                                </div>
                            </li>
                        </el-checkbox-group>
                    </ul>
                    </div>
                </div>
            </div>
            <div v-show="isShowSJ">待定
              <el-tree
                :data="data"
                show-checkbox
                node-key="id"

                :default-checked-keys="[5,21]"
                :props="defaultProps"
              >
              </el-tree>

              <el-tree class="filter-tree"
                       :data="data"
                       show-checkbox
                       :props="defaultProps"
                       :filter-node-method="filterNode"
                       node-key="id"
                       @check-change="handleCheckChange"

                       :default-checked-keys="checkedKeys"
                       ref="depListTree"
                      >
              </el-tree>








            </div>



        </div>
      <div class="role_logo">
        <common-footer></common-footer>
      </div>
    </div>
  </div>
</template>
<script>
import commonFooter from "@/components/common/commonFooter";
import breadField from "@/components/common/commonBread";
import urlMng from "@/services/authMng.js";
import newApiClient from "@/publicJs/newApiClient.js";
import UtilService from "@/publicJs/UtilService";
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource) ;



export default {
    data() {
        return {
          newdata:[],

          checkedKeys:[],




          data: [
            {
            id: 1,
            label: '一级 1',
              disabled: true,
              children: [{
              id: 4,
              label: '二级 1-1',
              disabled: true,
              children: [{
                id: 9,
                label: '三级 1-1-1',
                disabled: true,

                children: [
                  {
                    id: 21,
                    label: '四级 1-1-1-1',
                  disabled: true
                  },
                  {
                    id: 13,
                    label: '四级 1-1-1-2',
                  disabled: true
                  }]
              }, {
                id: 10,
                label: '三级 1-1-2',
                disabled: true
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            disabled: true,
            children: [{
              id: 5,
              label: '二级 2-1',
              disabled: true
            }, {
              id: 6,
              label: '二级 2-2',
              disabled: true
            }]
          }, {
            id: 3,
            label: '一级 3',
            disabled: true,
            children: [{
              id: 7,
              label: '二级 3-1',
              disabled: true
            }, {
              id: 8,
              label: '二级 3-2',
              disabled: true
            }]
          }],
          defaultProps: {
            children: 'children',
            label: 'label'
          },




















            isShowElBtn:true,
            title: "",
            errorInfo: "",
            checkLists: [],
            checkList: [],
            checked: false,
            jdtUserId: [],
            input: "",
            roleName: "",
            roleNameZh: "",
            roleId: "",
            permissionList: [],
            dialogFormVisible: false,
            isedit: "",
            iscreat: "",
            isShowSJ:false,
            isShowJdt: false,
            isShowMbr: true,
            form: {
                id: "",
                roleName: "",
                roleNameZh: "",
                roleDesc: "",
                region: "",
                date1: "",
                date2: "",
                delivery: false,
                type: [],
                resource: "",
                desc: ""
            },

            formRules: {
                roleName: [
                    { required: true, message: "请输入角色ID", trigger: "blur" }
                ],
                roleNameZh: [
                    {
                        required: true,
                        message: "请输入角色名称",
                        trigger: "blur"
                    }
                ]
            },
            formLabelWidth: "70px",

            aryBread: [
                { name: "系统设置", url: "" },
                { name: "权限管理", url: "/systemHome" },
                { name: "角色管理", url: "" }
            ],
            chirAllCheox: [], //二级全选
            parAllCheox: [], //选中的所有权限点ID
            zAllJdtDate: [],//查询接口回来的所有权限点
            allJdtDate: [],//经过处理的所有权限点
            firstJdtOrder: [],
            secondJdtOrder: [],
            threeJdtOrder: [],
            parAllCheoxa: [],
            roleJdt: [],
            jdtState: true,
            roleid: "",
            zAcountName: "",
            isActive: true,
            value1: true,
            value2: true,
            pageSize: 10,
            pageNow: 1,
            total: 0,
            zRoleNameZh: "",
            zDeptName: "",
            ztype: "",
            enabled: "",
            selectRow: [],
            memberList: [],
            memberListObj: [],
            isIndeterminate: false,
            render: 1,
            meberid: ""
        };
    },
    components: {
        commonFooter,
        breadField
    },
    computed: {},
    mounted: function() {
        this.searchRole();
        this.queryAllJdt();
      this.drawLine();
    },
    watch: {
        roleid: function(curVal, oldVal) {
            this.queryMemNum();
            this.queryMenList();
        }
    },
    created: function() {
        this.queryMemNum();
        this.queryMenList();
    },
    methods: {
      drawLine: function () {
        console.log("OK");
        this.$http.post('http://192.168.2.155:8089/sy_i_platform/interface/rest/role/treeList').then((data) => {
          console.log(data,"222222222222");
        });
      },

      onChange(){
        this.isShowElBtn=false
        let data = digui(this.data);
        console.log("data",data);
        //方法
        function digui(dataUse) {
          for(var i = 0;i<dataUse.length;i++){
            dataUse[i].disabled = false;
            if (dataUse[i].children!=undefined) {
              if(dataUse[i].children.length>0){
                digui(dataUse[i].children);
              }
              else {
                dataUse[i];
              }
            }

          }
        }
      },

      noChange(){
        this.isShowElBtn=true
      },


    getCheckedNodes() {
        console.log(this.$refs.depListTree.getCheckedNodes());
      },

      filterNode: function(value, data) {
        if (!value) return true;
        return data.deptName.indexOf(value) !== -1;
      },


      handleCheckChange () {
        let res = this.$refs.depListTree.getCheckedNodes()
        let arr = []
        res.forEach((item) => {
          arr.push(item.id)
        })
        this.checkedKeys=arr
        console.log(arr)
      },
























        //禁止的改变
        changeEnabled: function(item) {
            this.enabledStatus = item.enabled;
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
        //查询角色列表
        searchRole: function() {
            var that = this;
            var param = {
                roleNameZh: that.roleNameZh
            };
          newApiClient.assignApi(urlMng.setUrl("roleGetName", []), param, function(
                pres
            ) {
                if (pres.status == "200") {
                    that.permissionList = pres.results;
                    if (that.render == 1) {
                        that.roleid = pres.results[0].id;
                        that.zRoleNameZh = pres.results[0].roleNameZh;
                        that.queryMemNum();
                        that.queryMenList();

                        that.queryRoleJdt();
                        that.meberid = that.roleid;
                        that.render = 2;
                    }
                }
            });
        },
        //提交表单
        submitForm: function() {
            var that = this;
            if (that.iscreat == true) {
                that.creatRole();
            }
            if (that.isedit == true) {
                that.editRole();
            }
        },
        //创建按钮
        addRoleBtn: function() {
            this.title = "添加角色";
            this.isedit = false;
            this.iscreat = true;
            this.dialogFormVisible = true;
            this.form.roleName = "";
            this.form.roleDesc = "";
            this.form.roleNameZh = "";
            this.errorInfo = "";
        },
        //创建角色
        creatRole: function() {
            var that = this;
            that.$refs["form"].validate(valid => {
                if (valid) {
                    var param = {
                        roleName: that.form.roleName,
                        roleNameZh: that.form.roleNameZh,
                        roleDesc: that.form.roleDesc
                    };
                  newApiClient.assignApi(urlMng.setUrl("roleInsert", []),param,function(pres) {
                        if (pres.status == "200") {
                            that.dialogFormVisible = false;
                            that.searchRole();
                        } else if (pres.status == 5004) {
                            that.errorInfo = pres.exception;
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //编辑查询
        editSerach: function(id) {
            var that = this;
            that.title = "编辑角色";
            that.isedit = true;
            that.iscreat = false;
            that.dialogFormVisible = true;
            that.errorInfo = "";
          newApiClient.assignApi(urlMng.setUrl("roleGetById", [id]), "", function(
                pres
            ) {
                if (pres.status == "200") {
                    that.form = pres.results;
                }
            });
        },
        //编辑修改
        editRole: function() {
            var that = this;
            that.$refs["form"].validate(valid => {
                if (valid) {
                    var param = {
                        roleName: that.form.roleName,
                        roleNameZh: that.form.roleNameZh,
                        roleDesc: that.form.roleDesc,
                        id: that.form.id
                    };
                  newApiClient.assignApi(urlMng.setUrl("roleUpdate", []),
                        param,
                        function(pres) {
                            if (pres.status == "200") {
                                that.dialogFormVisible = false;
                                that.searchRole();
                            }
                        }
                    );
                } else {
                    return false;
                }
            });
        },
        //删除角色信息
        deleteRole: function(id) {
            var that = this;
            var roleid = id;
            that
                .$confirm(
                    "是否确认删除该角色，删除后角色内所有账户也将全部移除",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                .then(function() {
                  newApiClient.assignApi(urlMng.setUrl("roleDelete", [roleid]), "",
                        function(pres) {
                            if (pres.status == "200") {
                                that.searchRole();
                            }
                        }
                    );
                });
        },

        //查询成员列表
        handleQueryRoleList: function(id, item, index) {
            var that = this;
            that.roleid = id;
            that.meberid = id;
            that.pageNow = 1;
            that.queryRoleJdt();
            that.zRoleNameZh = item.roleNameZh;
            that.queryMemNum();
            that.queryMenList();
        },
        //权限点的全选和全不选
        allCheckbo: function(index, data) {
            var that = this;
            if (that.parAllCheox[index].checkbox == true) {
                that.allJdtDate.forEach((item, ind) => {
                    if (index == ind) {
                        item.children.forEach((item, zi) => {
                            that.parAllCheox[index].childrenArr.push(item.id);
                            if(item.children&&item.children.length>0){
                               item.children.forEach(function(item2,ind2){
                                   that.parAllCheox[index].childrenArr.push(item2.id)
                               })
                            }
                        });
                    }
                });
            } else {
                that.parAllCheox[index].childrenArr = [];
            }
        },
        //点左边改变右边
        changeRight(index,id,data){
            if(data&&data.length>0){
                if(this.parAllCheox[index].childrenArr.indexOf(id)==-1){
                    this.parAllCheox[index].childrenArr.push(id)
                    data.forEach((v,i)=>{
                            this.parAllCheox[index].childrenArr.push(v.id)
                    })
                }
                else{
                    if( this.parAllCheox[index].childrenArr.indexOf(id)!=-1){
                            this.parAllCheox[index].childrenArr.splice(this.parAllCheox[index].childrenArr.indexOf(id),1)
                    }
                    data.forEach((v,i)=>{
                        this.parAllCheox[index].childrenArr.forEach((val,ind)=>{
                            if(val == v.id ){
                                this.parAllCheox[index].childrenArr.splice(ind,1)
                            }
                        })
                    })
                }
            }
            else{
               if(this.parAllCheox[index].childrenArr.indexOf(id)==-1){
                    this.parAllCheox[index].childrenArr.push(id)
                }
                else{
                    if( this.parAllCheox[index].childrenArr.indexOf(id)!=-1){
                            this.parAllCheox[index].childrenArr.splice(this.parAllCheox[index].childrenArr.indexOf(id),1)
                    }
                    
                }
            }
            //选中子集，父级自动勾选
           this.allJdtDate.forEach((o, i) => {
                if (index == i) {
                    if (this.parAllCheox[index].childrenArr.length < 1) {
                        this.parAllCheox[index].checkbox = false;
                    } else {
                        this.parAllCheox[index].checkbox = true;
                    }
                }
            });
           
        }   ,    
        //查询所有的权限点
        queryAllJdt: function() {
            var that = this;
            var param = {}
          newApiClient.assignApi(urlMng.setUrl("preGetAll", []), "",function(pres) {
                if (pres.status == 200) {
                    that.zAllJdtDate = pres.results;
                    that.parAllCheox = [];
                    that.allJdtDate = that.GetData("0", that.zAllJdtDate);
                    console.log(that.allJdtDate);
                    that.allJdtDate.forEach((o, i) => {
                        that.parAllCheox.push({
                            checkbox: false,
                            childrenArr: []
                        });
                    });
                }
            });
          newApiClient.assignTestApi(urlMng.setUrl("newpreGetAll", []),param,function(pres) {
            if (pres.results.retCode == 200) {
              that.newzAllJdtDate = pres.results.retValue;
              that.newdata = [];
              that.newallJdtDate = that.GetData("0", that.newzAllJdtDate);
              console.log(that.newallJdtDate);
              that.newallJdtDate.forEach((o, i) => {
                that.newdata.push();
              });
            }
          });
        },
        //根据角色id查询角色的权限点
        queryRoleJdt: function() {
            var that = this;
            var arr = [];
            that.checkList = [];
          newApiClient.assignApi(urlMng.setUrl("preGetByRid", [this.roleid]), "",function(pres) {
                if (pres.status == "200") {
                    that.roleJdt = pres.results;
                    that.allJdtDate.forEach((item, ind) => {
                        that.parAllCheox[ind].checkbox = false;
                        that.parAllCheox[ind].childrenArr = [];
                        if(item.children&&item.children.length>0){
                            item.children.forEach((item2, ind2) => {
                                that.roleJdt.forEach(function(item3,ind3){
                                    if(item2.id == item3.id){
                                        that.parAllCheox[ind].childrenArr.push(item3.id);
                                    }
                                    if (item.id == item3.id) {
                                        that.parAllCheox[ind].checkbox = true;
                                    }
                                })
                                if(item2.children && item2.children.length>0){
                                    item2.children.forEach(function(item4,ind4){
                                        that.roleJdt.forEach(function(item5,ind5){
                                            if(item4.id == item5.id){
                                                that.parAllCheox[ind].childrenArr.push(item4.id);
                                            }
                                            if (item.id == item5.id) {
                                                that.parAllCheox[ind].checkbox = true;
                                            }
                                        })
                                            
                                    })
                                }
                            });
                        }
                            
                    });
                }
            });
        },
        //处理数据
        GetData: function(resourceId, arry) {
            var tree = [];
            var temp;
            for (var i = 0; i < arry.length; i++) {
                if (arry[i].resourcePid == resourceId) {
                   
                    var obj = arry[i]; 
                    temp = this.GetData(arry[i].resourceId, arry);
                    if (temp.length > 0) {
                        obj.children = temp;
                    }
                    tree.push(obj);
                }
            }
            return tree;
        },
        //跟新权限点
        updateJdt: function() {
            var that = this;
            var premissionsList = [];
            var curJdtObj = [];
            //循环选中权限点数组
            that.isShowElBtn=true;
            that.parAllCheox.forEach(function(item,ind){
                if(item.checkbox == true){
                    curJdtObj.push(that.allJdtDate[ind]);
                    //循环所有权限点
                    that.zAllJdtDate.forEach(function(item2,ind2){
                        item.childrenArr.forEach(function(item3,ind3){
                            if(item2.id == item3){
                                curJdtObj.push(item2);
                            }
                        })
                    })
                }
            })


            $.each(curJdtObj, function(i) {
                var obj = {
                    premissionId: "",
                    options: []
                };
                obj.premissionId = curJdtObj[i].id;
                obj.options[0] = curJdtObj[i].operationList[0].id;
                premissionsList.push(obj);
            });
            var param = {
                roleId: that.roleid,
                premissions: premissionsList
            };
          newApiClient.assignApi(urlMng.setUrl("preForRole", []),
                param,
                function(pres) {
                    if (pres.status == 200) {
                        that.succes("权限点绑定成功");
                    }
                }
            );
        },

        //切换
        showJdt: function() {
            this.isShowJdt = true;
            this.isShowMbr = false;
        },
        showMbr: function() {
            this.isShowJdt = false;
            this.isShowMbr = true;
        },
      showSJ: function() {
        this.isShowJdt = false;
        this.isShowSJ=true;
        this.isShowMbr = false;
      },

        //查询有多少成员
        queryMemNum: function() {
            var that = this;
            var param = {
                AcountName: that.zAcountName,
                roleId: that.roleid
            };
          newApiClient.assignApi(urlMng.setUrl("roleListAcountCount", []),
                param,
                function(pres) {
                    if (pres.status == "200") {
                        that.total = pres.results;
                    }
                }
            );
        },
        //查询具体的成员
        queryMenList: function() {
            var that = this;
            var param = {
                acountName: that.zAcountName,
                roleId: that.roleid,
                pageSize: that.pageSize,
                pageNum: that.pageNow
            };

          newApiClient.assignApi(urlMng.setUrl("roleListAcount", []),param, function(
                pres
            ) {
                if (pres.status == "200") {
                    that.memberList = pres.results;
                    pres.results.forEach((o, i) => {
                        o.zdeptname = o.ompDept.deptName;
                    });
                }
            });
        },
        //分页
        handleCurrentChange: function(val) {
            this.pageNow = val;
            this.queryMenList();
        },
        //移除成员
        removeMember: function(item) {
            var that = this;
            var param = {
                roleId: that.roleid,
                acountIds: [item.id]
            };
            that
                .$confirm("是否确认移除，移除后将不可找回?", "移除提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                })
                .then(function() {
                  newApiClient.assignApi(urlMng.setUrl("roleDelAcount", []),
                        param,
                        function(pres) {
                            if (pres.status == 200) {
                                that.queryMenList(that.roleid);
                                that.queryMemNum(that.roleid);
                                that.searchRole();
                            }
                        }
                    );
                });
        },
        //多选
        selectionChange: function(datas) {
            this.selectRow = datas;
        },
        //批量删除
        batchDel: function() {
            var that = this;
            var arySelect = that.selectRow;
            if (arySelect.length == 0) {
                this.$message({
                    message: "请勾选要删除的消息"
                });
            } else {
                this.$confirm("是否确认删除该角色，删除后角色内所有账户也将全部移除","提示",{
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    var aryId = [];
                    $.each(arySelect, function(i) {
                        aryId.push(arySelect[i].id);
                    });
                    var param = {
                        roleId: that.roleid,
                        acountIds: aryId
                    };
                  newApiClient.assignApi(urlMng.setUrl("roleDelAcount", []),param,function(pres) {
                        if (pres.status == 200) {
                            that.queryMenList(that.roleid);
                            that.queryMemNum(that.roleid);
                            that.searchRole();
                        }
                    });
                });
            }
        },
        //成功弹出框
        succes: function(message) {
            this.$message({
                message: message,
                type: "success"
            });
        },
        closeDialog: function(done) {
            this.$refs["form"].resetFields();
            done();
            this.dialogFormVisible = false;
        },
        closefrom: function() {
            this.$refs["form"].resetFields();
            this.dialogFormVisible = false;
        },
        clickContentShow(e){
            var that = this;
            if(e.target.innerText == '权限管理'){
                that.isShowJdt = true;
                that.isShowMbr = false;
              that.isShowSJ=false
            }else if(e.target.innerText == '成员'){
                that.isShowJdt = false;
                that.isShowMbr = true;
              that.isShowSJ=false
            }else if(e.target.innerText == '数据') {
              that.isShowJdt = false;
              that.isShowMbr = false;
              that.isShowSJ = true
            }
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
.role_left {
    width: 300px;
    height: calc(100% - 69px);
    box-sizing: border-box;
    background: #fff;
    position: absolute;
}
.topBox {
    padding: 10px 10px 0px 10px;
}
.role_left .searchBox {
    position: relative;
}
.role_left .searchBox  input {
    border: 1px solid #d2d2d2;
}
.role_left .searchBox  input:hover {
    border: 1px solid #aaaaaa;
}
.role_left .searchicon {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #c0c0c0;
    font-size: 18px;
}
.role_left .search {
    width: 100%;
    height: 36px;
    /*padding-left: 10px;*/
    margin-bottom: 10px;
    /*border: 1px solid #d3d3d3;*/
}
.role_left .addRoleBtn {
    width: 100%;
    height: 36px;
    border: 1px solid #02848D;
    background: #fff;
    color: #02848D;
    max-width: 100%;
}
.role_left .addRoleBtn:hover {
    border: 1px solid #006D75;
    color: #006D75;
    cursor: pointer;
}
.permissionList {
    margin-top: 8.994%;
    width: 100%;
    height: calc(100% - 125px);
    overflow: auto;
}
.permissionList li {
    padding-left: 5%;
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
}
.permissionList li:active {
    color: red;
}
.permissionList li:hover {
    color: #02848D;
}
.permissionList li:hover .icon {
    color: #02848D;
    display: inline;
}
.permissionList .icon {
    float: right;
    padding-right: 15px;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    display: none;
}
.permissionList .icon:first-child {
    padding-right: 33.5%;
}
.permissionList .active {
    background: #eaf1fb;
    color: #02848D;
}

/* 弹框 */

.roleMab .errorInfo {
    position: absolute;
    left: 1%;
    top: 80%;
    color: #f56c6c;
}
/* 右边 */
.role_right {
    margin-left: 10px;
    width: calc(100% - 330px);
    height: calc(100% - 69px);
    position: absolute;
    overflow-y: hidden;
    right: 10px;
    background-color: #fff;
}
.role_right .contentBox{
    height: calc(100% - 90px);
    width: 100%;
    padding: 0 10px;
    overflow-y: auto;
}
.jdt_content{
  height: 100%;
  padding: 10px 0;
  overflow: auto;
}
.jdt_content_top {
    margin-bottom: 28px;
}
.jdt_firstOrderName {
    font-size: 16px;
    color: #474647;
}
.jdt_content_bottom {
    /*border: 1px solid #bfbfbf;*/
}

.jdt_content_bottom li {
    display: flex;
    display: -webkit-flex;
}
.jdt_content_bottom_left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 3.67%;
    /*border-right: 1px solid #bfbfbf;*/
}
.jdt_content_bottom_right {
    flex: 5;
    display: flex;
    flex-wrap: wrap;
    min-height: 53.5px;
}
.jdt_content_bottom_right span {
    height: 50px;
    min-width: 16.6%;
    align-items: center;
    justify-content: flex-start;
    display: flex;
    margin-left: 1.63%;
    overflow: hidden;
}
input[type="checkbox"] {
    margin-right: 23px;
    color: #828282;
}
.jdt_content_box {
    margin-bottom: 32px;
    padding-left: 10px;
}
.topBtnBox {
    padding:10px 10px 10px 15px;
    height: 60px;
    width: 100%;
}
.topLeft {
    float: left;
    cursor: pointer;
}
.topLeft > span {
    height: 40px;
    line-height: 40px;
    text-align: center;
    display: block;
    margin-right:15px;
    float: left;
    color: #333333;
    font-size:14px;
}
.topLeft > span.active {
    color: #02848D;
    border-bottom: 1px solid #02848D;
    font-size:14px;
}
.topRight {
    float: right;
}
.topRight .searchBox {
    position: relative;
    float: left;
    width: 330px;
    margin-left: 15px;
}
.topRight .delete {
    min-width: 70px;
    max-width: 150px;
    height: 36px;
    float: left;
    background:#02848D;
    border: 1px solid #02848D;
    margin-right: 10px;
}
.topRight .input {
    height: 36px;
    width: 330px;
}
.topRight .iconSearch {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1;
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #909399;
}
.operation {
    width: 29px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #02848D;
    cursor: pointer;
}
.zAcountName {
}
</style>
<style>
.roleMab .el-dialog {
    width: 38.02%;
}
.roleMab .el-textarea__inner {
    min-height: 310px !important;
}
.roleMab .el-dialog--center .el-dialog__body {
    padding: 6.59% 13.59% 5.9% 8.51%;
}
.roleMab .el-form-item__label {
    width: 82px !important;
}
.roleMab .el-form-item__content {
    margin-left: 110px !important;
}
.roleMab .el-dialog--center .el-dialog__footer {
    text-align: right;
}
.roleMab .el-dialog__footer {
    padding-bottom: 9.589%;
}
.memberList .el-table__body {
    width: 100% !important;
}
.memberList .el-table__body tr {
    height: 46px;
}
.memberList .el-table__body-wrapper .is-scrolling-none {
    max-height: 580px;
}
.memberList {
    height: calc(100% - 60px);
}
.memberList .el-table {
    height: calc(100% - 32px);
    overflow: auto;
}
.memberList .el-table thead {
    color: #666666;
    background: #eaecf0;
}
.search::-webkit-input-placeholder {
    color:#aaaaaa
}
.el-table--scrollable-x .el-table__body-wrapper {
    height: 100%;
    max-height:580px;
    overflow-y:auto;
}
</style>
