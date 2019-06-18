<template>
  <div class="resourceMng">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
            <div class="resListField" >  
                <div class="resTab">
                    <div class="resNav" :class="currentNav=='model'?'active':''" @click="clickNav('model')">模型视图</div>
                    <div class="resNav" :class="currentNav=='dim'?'active':''" @click="clickNav('dim')">维度视图</div>
                </div>
                <div class="resTree">
                    <div v-show="currentNav=='model'">
                        <el-tree 
                            ref="modelTreeData"
                            :data="modelTreeData" 
                            class="viewTree" 
                            :props="modelTreeProps"
                            :default-expanded-keys="[modelCurrentNode.id]"
                            node-key="id"
                            :highlight-current="true"
                            :filter-node-method="filterModelTree"
                            @node-click="clickModelTree">
                        </el-tree>
                    </div>
                    <div v-show="currentNav=='dim'">
                        <el-tree 
                            ref="dimTreeData"
                            :data="dimTreeData" 
                            class="viewTree" 
                            :props="dimTreeProps"
                             :default-expanded-keys="[dimCurrentNode.id]"
                            node-key="id"
                            :highlight-current="true"
                            @node-click="clickDimTree">
                            <span class="custom-tree-node" slot-scope="{ node, data }" >
                                <span>{{ node.label }}</span>
                            </span>
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="resInfoField">
                <div v-show="currentNav=='model'?modelCurrentNode.id=='1':dimCurrentNode.id=='1'" class="blankField">
                    <div class="blankImg">
                        <div class="welText">欢迎进入资源管理</div>
                    </div>
                </div>
                <div v-show="currentNav=='model'?modelCurrentNode.id!=='1':dimCurrentNode.id!=='1'" class="resInfoContent">
                    <div class="resOper">
                        <div class="operNav">
                            <div :class="activeOperNav==0?'active':''" @click="clickFilter">
                                <span v-if="activeOperNav==0">收起筛选<span class="el-icon-arrow-up"></span></span>
                                <span v-else>筛选<span class="el-icon-arrow-down"></span></span>
                            </div>
                            <div :class="activeOperNav==1?'active':''" @click="clickShowHeader">
                                <span v-if="activeOperNav==1">收起设置<span class="el-icon-arrow-up"></span></span>
                                <span v-else>设置显示字段<span class="el-icon-arrow-down"></span></span>
                            </div>
                        </div>
                        <div class="fr">
                            <el-button type='primary'  @click="clickInhAddBtn" v-show="currentNav=='model'&&(modelCurrentNode.attributes?modelCurrentNode.attributes.isvn==0:true)">依赖创建</el-button>
                            <el-button type='primary' @click="clickNewAddBtn" v-show="currentNav=='model'&&(modelCurrentNode.attributes?modelCurrentNode.attributes.isvn==0:true)">全新创建</el-button>
                            <el-button type='primary' @click="clickEditBtn" v-show="currentNav=='model'&&(modelCurrentNode.attributes?modelCurrentNode.attributes.isvn==0:true)">编辑</el-button>
                             <el-button type='primary' @click="clickDelBtn" v-show="currentNav=='model'&&(modelCurrentNode.attributes?modelCurrentNode.attributes.isvn==0:true)">删除</el-button>
                        </div>
                        <div class="operContent" v-show="activeOperNav==0||activeOperNav==1">
                            <div v-show="activeOperNav==0">
                                <el-select class="operSearchCloumn" @change="searchText=''" v-model="searchCloumn" slot="prepend" placeholder="搜索字段">
                                    <el-option 
                                        v-for="item in aryCloumn"
                                        :key="item.name"
                                        :label="item.label"
                                        :value="item.name"></el-option>
                                </el-select>
                                <div class="operSearchText">
                                    <el-date-picker
                                        v-model="searchText"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        prefix-icon="el-icon"
                                        v-if="searchCloumn=='create_time'">
                                    </el-date-picker>
                                    <el-input
                                        v-else
                                        placeholder="请输入内容"
                                        v-model="searchText"
                                        @keyup.enter.native="getResList"
                                      ></el-input>
                                </div>
                                <el-button type="primary" class="smallBtn"  @click="getResList">确定</el-button>
                            </div>
                            <div v-show="activeOperNav==1">
                                <div class="cloumnBox">
                                    <el-checkbox-group v-model="checkedColumn">
                                        <el-checkbox 
                                            v-for="(item,index) in tableHeader" 
                                            v-if="item.dbFiledname!==undefined&&item.propertyGroup!=='dim'"
                                            :label="item.dbFiledname" 
                                            :disabled="(item.dbFiledname=='res_name'||item.dbFiledname=='type'||item.dbFiledname=='incode'||item.dbFiledname=='create_time')?true:false"
                                            :key="index">{{item.propertyTitle}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <div class="cloumnBtn">
                                    <el-button type="primary" class="smallBtn" @click="subFilterColumn">确定</el-button>
                                </div>
                            </div>
                        </div>  
                    </div>
                    <div class="tableData">
                        <el-table  
                            :data="tableData"  
                            style="width: 100%"  
                            height="100%"
                            row-class-name="sRow cp"
                            header-row-class-name="sHeader"
                             @row-click="rowClick"
                             @selection-change="selectChange">  
                            <el-table-column
                               v-if="currentNav=='model'&&(modelCurrentNode.attributes?modelCurrentNode.attributes.isvn==0:true)"
                                prop="check"
                                type="selection"
                                :fixed="true"
                                width="40">
                            </el-table-column>
                            <el-table-column
                                v-for="(item,index) in tableHeader"
                                v-if="filterColumn.indexOf(item.dbFiledname)>-1"
                                :key="index"
                                :prop="item.dbFiledname"
                                :label="item.propertyTitle"
                                :align="'left'"
                                :min-width="'150px'"
                                :show-overflow-tooltip="showTooltip"
                                >
                                <template slot-scope="scope">
                                    <span v-if="item.propertyFiledType==7"> {{scope.row[item.dbFiledname]|dateFormat}} </span>  
                                    <span v-else>{{scope.row[item.dbFiledname]||'--'}}</span>
                                </template>
                            </el-table-column>
                        </el-table> 
                        <el-pagination
                            class="sPage pageTop"
                            v-if="total>10"
                            @current-change="handleCurrentChange"
                            :current-page.sync="pageNow"
                            :page-size="pageSize"
                            :prev-text="'〈  上一页'" 
                            :next-text="'下一页  〉'"
                            layout="prev, pager, next"
                            :total="total">
                        </el-pagination>
                    </div>
                </div>
                 <common-footer></common-footer>
            </div>
        </div>
        <el-dialog title="选择父资源" :visible.sync="parentResDialog" width="700px" >
             <el-form class="parentForm" :rules="parentFormRule" label-width="20%"  :model="parentForm"  ref="parentForm">
                <el-form-item label="父资源：" prop="parentNode">
                    <el-input v-model="parentForm.parentNode" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="选择资源：" prop="res">
                    <el-select v-model="parentForm.res" filterable placeholder="请选择">
                        <el-option
                            v-for="item in parentRes"
                            :key="item.res_id"
                            :label="item.res_name"
                            :value="item.res_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="parentResDialog = false">取消</el-button>   
                <el-button type="primary" @click="parentSub()">确认</el-button>
            </span>
        </el-dialog>
  </div>
</template>
<script>

import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
import UtilService from '@/publicJs/UtilService'
import Vue from 'vue' 

export default {
    name:'resourceMng',
    data(){
        return{
            aryBread:[
                {name:'系统设置',url:'/systemHome'},
                {name:'资源管理',url:''},
            ],
            currentNav:'model',
            dimTreeData:[],
            dimTreeProps: {
                children: 'children',
                label: 'text'
            },
            dimCurrentNode:{
                id:'1',
            },
            modelTreeData:[],
            modelTreeProps:{
                children: 'children',
                label: 'text'
            },  
            modelCurrentNode:{
                id:'1',
            },
            searchText:'',
            searchCloumn:'res_name',
            aryCloumn:[
                {name:'res_name',label:'名称'},
                {name:'type',label:'类型'},
                {name:'incode',label:'资产编号'},
                {name:'create_time',label:'创建时间'},
                {name:'distributionorganize',label:'配电单位'},
            ],
            tableData:[],
            selectRow:[],
            showTooltip:true,
            total:0,
            pageNow:1,
            pageSize:10,
            parentResDialog:false,
            parentForm:{
                classname:'',
                parentNode:'',
                res:'',
            },
            parentFormRule:{
                parentNode:[],
                res:[{ required: true, message: '请选择资源', trigger: 'blur' },],
            },
            parentRes:[],
            tableHeader : [],
            activeOperNav:2,
            checkedColumn:[],
            filterColumn:[],
            objUser:{}
        }
    },
    watch:{

    },
    components: {
        commonBread,
        commonFooter
    },
    mounted() {
        this.currentNav = this.$route.params.type;
        this.objUser = JSON.parse(localStorage.getItem("userInfo"));
        var id = this.$route.params.id;
        if(this.currentNav=='model'){
            this.getModelTree(id);
            this.getDimTree('1');
        }else{
            this.getModelTree('1');
            this.getDimTree(id);
        }
        
    },
    methods:{
        // 切换导航
        clickNav:function(name){
            var that = this;
            that.currentNav = name;
            that.searchText='';
            that.getDisplayAttr(); 
        },
        // 查模型树
        getModelTree:function(id){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/class/queryDataByClassTag/res','',function(pres){
                that.modelTreeData = [];
                that.modelTreeData.push(pres.results);
                
                setTimeout(function(){
                    if(id){
                        that.modelCurrentNode=that.$refs['modelTreeData'].getNode(id).data;
                    }
                    that.$refs['modelTreeData'].setCurrentKey(that.modelCurrentNode.id);
                    that.getDisplayAttr();
                     that.$refs['modelTreeData'].filter('');
                },100)  
            });
            
        },
        filterModelTree(value,data,node){
            if(data.attributes.isvisible==1){
                return true;
            }else{
                return false;
            }
        },
        // 查维度树
        getDimTree:function(id){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/diminfo/list','',function(pres){
                var dimData=[pres.results]; 
                var fDimData = that.filterUnShow(dimData);
                that.dimTreeData = fDimData;  
                setTimeout(function(){
                    if(id){
                        that.dimCurrentNode=that.$refs['dimTreeData'].getNode(id).data;
                    }
                   that.$refs['dimTreeData'].setCurrentKey(that.dimCurrentNode.id);
                   that.getDisplayAttr();
                },100)     
            })
        },
        filterUnShow:function(dimData){
            var that = this;
            var ary = [];
            for(var i = 0;i<dimData.length;i++){
                if(dimData[i].attributes.isVisual==1){
                    var children = that.filterUnShow(dimData[i].children);
                    dimData[i].children = children;
                    ary.push(dimData[i]);
                }
            };
            return ary;
        },
        // 点击维度树
        clickDimTree:function(data){
            var that = this;
            that.pageNow = 1;
            that.dimCurrentNode = data;
            that.getDisplayAttr();
            that.activeOperNav=2;
            that.searchText='';
            that.aryCloumn=[
                {name:'res_name',label:'名称'},
                {name:'type',label:'类型'},
                {name:'incode',label:'资产编号'},
                {name:'create_time',label:'创建时间'},
                ]
        },
        // 点击模型树
        clickModelTree:function(data){
            var that = this;
            that.pageNow = 1;
            that.modelCurrentNode = data;
            that.getDisplayAttr();
            that.activeOperNav=2;
            that.searchText='';
            if(data.id=='2'||data.parentId=='2'){
                that.aryCloumn=[
                {name:'res_name',label:'名称'},
                {name:'type',label:'类型'},
                {name:'incode',label:'资产编号'},
                {name:'create_time',label:'创建时间'},
                {name:'distributionorganize',label:'配电单位'},
                ]
            }else{
                that.aryCloumn=[{name:'res_name',label:'名称'},{name:'create_time',label:'建立时间'}];
            }
        },
        // 获取资产列表
        getResList:function(){   
            var that = this;
            that.tableData = [];
            that.activeOperNav = 2;
            var currentObj = {};
            if(that.currentNav=='model'){
                currentObj = that.modelCurrentNode;
            }else if(that.currentNav=='dim'){
                currentObj = that.dimCurrentNode;
            }
            if(currentObj.id!=='1'){
                var params = {}
                if(that.currentNav=='model'){
                    params = {
                       "filter":[],
                        "classname":currentObj.attributes.classname,
                        "pageSize":that.pageSize,
                        "pageNum":that.pageNow,
                    }
                    if(that.searchCloumn!==''&&that.searchText!==''&& that.searchText!==null){
                        if(that.searchCloumn=='create_time'){
                            params.filter = [{"tn":"ResObject","alias":"t1","content":"t1."+that.searchCloumn+" >"+that.searchText[0].getTime()+" AND t1."+that.searchCloumn+" < "+that.searchText[1].getTime()}]
                        }else if(that.searchCloumn=='type'||that.searchCloumn=='incode'){
                            params.filter = [{"tn":"ResAsset","alias":"OMP_RES_ASSET","content":"OMP_RES_ASSET."+that.searchCloumn+" like '%"+that.searchText+"%'"}]
                        }else if(that.searchCloumn == 'distributionorganize'){
                            params.filter = [{"tn":"ResDimSupplyStation","alias":"OMP_RES_DIM_SUPPLYSTATION","content":"OMP_RES_DIM_SUPPLYSTATION."+that.searchCloumn+" like '%"+that.searchText+"%'"}]
                        }else{
                            params.filter = [{"tn":"ResObject","alias":"t1","content":"t1."+that.searchCloumn+" like '%"+that.searchText+"%'"}]
                        }
                    }
                }else{
                    var ary = JSON.parse(currentObj.attributes.filterArray);
                    if(that.searchCloumn!==''&&that.searchText!==''&& that.searchText!==null){
                        if(that.searchCloumn=='create_time'){
                            ary.push({"tn":"ResObject","alias":"t1","content":"t1."+that.searchCloumn+" >"+that.searchText[0].getTime()+" AND t1."+that.searchCloumn+" < "+that.searchText[1].getTime()})
                        }else if(that.searchCloumn=='type'||that.searchCloumn=='incode'){
                            ary.push({"tn":"ResAsset","alias":"OMP_RES_ASSET","content":"OMP_RES_ASSET."+that.searchCloumn+" like '%"+that.searchText+"%'"})
                        }else{
                            ary.push({"tn":"ResObject","alias":"t1","content":"t1."+that.searchCloumn+" like '%"+that.searchText+"%'"})
                        }
                    }
                    params = {
                       "filter":ary,
                        "classname":'ResAsset',
                        "pageSize":that.pageSize,
                        "pageNum":that.pageNow,
                    }
                }
                var loading = that.$loading({
                    lock: true,
                    text: '加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255,255, 255, 0.6)'
                });
                apiClient.linkApi('ssiteapi/platform/asset/info/listByParamWithPage','POST',params,function(pres){
                    loading.close();
                   if(pres.status==200){
                        if(pres.results){
                            that.tableData = pres.results.list;
                            that.total = pres.results.totalRecord;
                            $.each(that.tableData,function(i){
                                for(var p in that.tableData[i]){
                                    $.each( that.tableHeader,function(j){
                                        if(that.tableHeader[j].dbFiledname==p&&(that.tableHeader[j].propertyFiledType==4||that.tableHeader[j].propertyFiledType==5)){
                                            that.dimFormate(that.tableData[i],p,that.tableHeader[j].dicId);
                                        }
                                    })
                                }
                            })
                        }else{
                            that.tableData = [];
                            that.total = 0;
                        }
                    }
                   
                })
            }
           
        },
        // 点击继承创建
        clickInhAddBtn:function(){
            var that = this;
            var currentObj = {};
            var refText = '';
            if(that.currentNav=='model'){
                currentObj = that.modelCurrentNode;
                refText = 'modelTreeData';
            }else if(that.currentNav=='dim'){
                currentObj = that.dimCurrentNode;
                refText = 'dimTreeData';
            }
            if(currentObj.parentId=='1'){
                that.$message({
                    type: 'warning',
                    message: '当前为一级节点，无法进行继承创建',
                });
            }else{
                var parentNode = that.$refs[refText].getNode(currentObj.parentId);
                if(parentNode.data.attributes.isvn!==1){
                    that.parentResDialog = true;
                    that.parentForm.parentNode = parentNode.data.text;
                    that.parentForm.classname = parentNode.data.attributes.classname;
                    // var params = {
                    //     "filter":[],
                    //     "classname":that.parentForm.classname,
                    //     "pageSize":100,
                    //     "pageNum":1,
                    // }
                    apiClient.get('ssiteapi/platform/asset/info/listByClassName/'+that.parentForm.classname,{},function(pres){
                        var ary = pres.results;
                         that.parentRes = [];
                        $.each(ary,function(i){
                            if(ary[i].classname==that.parentForm.classname){
                                that.parentRes.push(ary[i]);
                            }
                        });
                    });
                }else{
                    that.$message({
                        type: 'warning',
                        message: '父节点为虚对象不可依赖创建',
                    });
                }  
            }
        },
        // 点击确认 创建父资源
        parentSub:function(){
            var that = this;
            var currentObj = {};
            if(that.currentNav=='model'){
                currentObj = that.modelCurrentNode;
            }else if(that.currentNav=='dim'){
                currentObj = that.dimCurrentNode;
            }
            that.$refs['parentForm'].validate((valid) => {
                if(valid){
                    that.$router.push('/systemHome/resourceInfo/'+currentObj.attributes.classname+'/'+that.parentForm.res+'/add/'+that.currentNav+'/'+currentObj.id);
                    // that.$router.push('/systemHome/resourceInfo/ResBus/'+that.parentForm.res+'/add');
                }
            })
        },
        // 点击全新创建
        clickNewAddBtn:function(){
            var that = this;
            var currentObj = {};
            if(that.currentNav=='model'){
                currentObj = that.modelCurrentNode;
            }else if(that.currentNav=='dim'){
                currentObj = that.dimCurrentNode;
            }
            that.$router.push('/systemHome/resourceInfo/'+currentObj.attributes.classname+'/null'+'/add/'+that.currentNav+'/'+currentObj.id);
        },
        // 点击编辑按钮
        clickEditBtn:function(){
            var that = this;
            var arySelect = that.selectRow;
            if(arySelect.length==0){
                that.$message({
                    type: 'warning',
                    message: '请勾选要编辑的资源',
                });
            }else if(arySelect.length>1){
                that.$message({
                    type: 'warning',
                    message: '仅可编辑一条资源',
                });
            }else{
                var currentObj = {};
                if(that.currentNav=='model'){
                    currentObj = that.modelCurrentNode;
                }else if(that.currentNav=='dim'){
                    currentObj = that.dimCurrentNode;
                }
                that.$router.push('/systemHome/resourceInfo/'+currentObj.attributes.classname+'/'+arySelect[0].res_id+'/edit/'+that.currentNav+'/'+currentObj.id);
            }
        },
        // 点击删除按钮
        clickDelBtn:function(){
            var that = this;
            var arySelect = that.selectRow;
            if(arySelect.length==0){
                that.$message({
                    type: 'warning',
                    message: '请勾选要删除的资源',
                });
            }
            else if(arySelect.length>1){
                that.$message({
                    type: 'warning',
                    message: '仅可删除一条资源',
                });
            }else{
                this.$confirm('确定要删除已勾选的资源?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var resid = arySelect[0].res_id;
                    var currentObj = {};
                    if(that.currentNav=='model'){
                        currentObj = that.modelCurrentNode;
                    }else if(that.currentNav=='dim'){
                        currentObj = that.dimCurrentNode;
                    }
                    apiClient.linkApi('ssiteapi/platform/asset/info/remove/'+resid+'/'+currentObj.attributes.classname,'delete',{},function(pres){
                        if(pres.status==200){
                            that.$message({
                                type: 'success',
                                message: '删除成功',
                            });
                            that.getResList();
                        }else if(pres.status==5006){
                            that.$message({
                                type: 'error',
                                message: '子节点存在数据',
                            });
                        }   
                    })
                }).catch(() => {     
                });
            }
        },
        // 点分页
        handleCurrentChange:function(val){
            this.pageNow = val;
            this.getResList();
        },
        selectChange:function(data){
            this.selectRow= data;
        },
        rowClick:function(row, event, column){
            if(column.property!=='check'){
                var that = this;
                var currentObj = {};
                if(that.currentNav=='model'){
                    currentObj = that.modelCurrentNode;
                }else if(that.currentNav=='dim'){
                    currentObj = that.dimCurrentNode;
                }
                that.$router.push('/systemHome/resourceText/'+row.classname+'/'+row.res_id+'/'+that.currentNav+'/'+currentObj.id);
            }
        },
        // 获取显示字段
        getDisplayAttr(){
            var that = this;
            that.tableData = [];
            var currentObj = {};
            if(that.currentNav=='model'){
                currentObj = that.modelCurrentNode;
            }else if(that.currentNav=='dim'){
                currentObj = that.dimCurrentNode;
            }
            if(currentObj.id!=='1'){
                var classname = []; 
                var isDimProp = false;
                if(that.currentNav=='model'){
                    classname = [currentObj.attributes.classname];
                    isDimProp = false;
                }else{
                    var ary = JSON.parse(currentObj.attributes.filterArray);
                    $.each(ary,function(i){
                        classname.push(ary[i].tn);
                    })
                    isDimProp = true;
                }
                var loading = that.$loading({
                    lock: true,
                    text: '加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255,255, 255, 0.6)'
                });
                var params = {
                    isDimProp:isDimProp,
                    className:classname,
                }
                apiClient.post('ssiteapi/platform/asset/property/listByClassWithDisplayItem',params,function(pres){
                    loading.close();
                    var data = pres.results;
                    that.tableHeader = [];
                    var selfList = data.selfList;
                    var inheritList = data.inheritList;
                    var resNameObj = {};
                    var typeObj = {};
                    var incodeObj = {};
                    var createTimeObj = {};
                    for(var i=0;i<inheritList.length;i++){
                        if(inheritList[i].dbFiledname=='res_name'){
                            resNameObj = inheritList[i];
                        }
                        if(inheritList[i].dbFiledname=='type'){
                            typeObj = inheritList[i];
                        }
                        if(inheritList[i].dbFiledname=='incode'){
                            incodeObj = inheritList[i];
                        }
                        if(inheritList[i].dbFiledname=='create_time'){
                            createTimeObj = inheritList[i];
                        }
                    }
                    // 表格前三列和最后一列为固定字段  中间为可配置字段
                    that.tableHeader.push(resNameObj);
                    that.tableHeader.push(typeObj);
                    that.tableHeader.push(incodeObj);
                    for(var i=0;i<selfList.length-1;i++){
                        for(var j=0;j<selfList.length-1-i;j++){
                            if(selfList[j].propertyOrder > selfList[j+1].propertyOrder){
                                var swap = selfList[j];
                                selfList[j] = selfList[j+1];
                                selfList[j+1] = swap;
                            }
                        }
                    }
                    that.tableHeader = that.tableHeader.concat(selfList);
                    that.tableHeader.push(createTimeObj);
                    var filterColumn = [];
                    var selectedModelAttr = localStorage.getItem('selectedModelAttr');
                    //  缓存无此信息  默认展示所有字段
                    if(selectedModelAttr==null){
                        $.each(that.tableHeader,function(i){
                            filterColumn.push(that.tableHeader[i].dbFiledname);
                        })
                        var obj={
                            username:that.objUser.username,
                            classname:classname,
                            filterColumn:filterColumn,
                            id:currentObj.id,
                            type:that.currentNav,
                        }
                        localStorage.setItem('selectedModelAttr',JSON.stringify([obj]));
                    }else{
                        var arySelected = JSON.parse(selectedModelAttr);
                        var isHave = false;
                        $.each(arySelected,function(i,item){
                            if(item.username==that.objUser.username&&item.id==currentObj.id&&item.type==that.currentNav){
                                filterColumn = item.filterColumn;
                                isHave = true;
                            }
                        })
                        // 有此信息 但无该用户该模型对应信息
                        if(!isHave){
                             $.each(that.tableHeader,function(i){
                                filterColumn.push(that.tableHeader[i].dbFiledname);
                            })
                            var obj={
                                username:that.objUser.username,
                                classname:classname,
                                filterColumn:filterColumn,
                                id:currentObj.id,
                                type:that.currentNav,
                            }
                            arySelected.push(obj);
                            localStorage.setItem('selectedModelAttr',JSON.stringify(arySelected));
                        }
                    }
                    that.filterColumn = filterColumn;
                    that.getResList();
                })
            }
        },
        // 点击筛选
        clickFilter(){
            var that = this;
            that.activeOperNav==0?that.activeOperNav=2:that.activeOperNav=0;
        },
        // 点击设置显示字段
        clickShowHeader(){
            var that = this;
            that.activeOperNav==1?that.activeOperNav=2:that.activeOperNav=1;
            that.checkedColumn =  that.filterColumn;
        },
        subFilterColumn(){
            var that = this;
            that.activeOperNav=2;
            that.filterColumn = that.checkedColumn;
            var arySelected = JSON.parse(localStorage.getItem('selectedModelAttr'));
            // 存入缓存
            var currentObj = {};
            if(that.currentNav=='model'){
                currentObj = that.modelCurrentNode;
            }else if(that.currentNav=='dim'){
                currentObj = that.dimCurrentNode;
            }
            $.each(arySelected,function(i,item){
                if(item.username==that.objUser.username&&item.id==currentObj.id&&item.type==that.currentNav){
                    arySelected[i].filterColumn = that.filterColumn;
                }
            });
            localStorage.setItem('selectedModelAttr',JSON.stringify(arySelected));
        },
        // 格式化字典数据
         dimFormate:function(obj,p,dicId){
             var that = this;
            apiClient.get('ssiteapi/platform/asset/dict/listItemByDictId/'+dicId,{},function(pres){
                var ary = pres.results;
                var preAry = obj[p].split(',');
                var aftAry = [];
                preAry.forEach(function(item,i){
                    ary.forEach(function(item2,j){
                        if(item2.itemId==item){
                            aftAry.push(item2.itemName);
                        }
                    })
                })
                Vue.set(obj,p,aftAry.join(','));
            });
         }
    },
    filters: {
        //时间格式化
        dateFormat: function (value) {
          if(value!==''&&value!==0&&value!==undefined){
            return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
          }else {
            return '--'
          }
        },
    },

}
</script>
<style scoped>
.resourceMng{
    width: 100%;
    height: 100%;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    border-top: solid 1px #e6e6e6;
}  
.resListField{
    width: 300px;
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px 
        rgba(16, 129, 250, 0.1);
    border-radius: 2px;
    margin: 0px 10px 0px 0px;
    display: inline-block;
    float: left;
    overflow: auto;
}
.resInfoField{
    width: calc(100% - 310px);
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px 
        rgba(16, 129, 250, 0.1);
    border-radius: 2px;
    display: inline-block;
    float: right;    
}
.resInfoContent{
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
}
.contentField{
    width: 100%;
    padding: 10px 0px 0px 0px;
    height: calc(100% - 40px);;
}
.resTab{
    height: 45px;
    line-height: 45px;
    background: #ececec;
    overflow: hidden;
}
.resTab>.resNav{
    display: inline-block;
    width: 110px;
    float: left;
    text-align: center;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
}
.resTab>.resNav:hover{
    color: #1081fa;
}
.resTab>.active{
    background: #ffffff;
    line-height: 42px;
    border-top: 3px solid #1081fa;
    color: #1081fa;
}
.resOper{
    width: 100%;
    min-height: 60px;
    padding: 0px 15px;
    line-height: 60px;
    position: relative;
}
.resTree{
    padding-top: 10px;
}
.searchResBox{
    float: right;
    display: inline-block;
    margin-left: 10px;
}
.tableData{
    height: calc(100% - 110px);
    max-height: 580px;
}
.blankField{
     height:calc(100% - 40px);
    -webkit-display:flex;
    display:flex;
    -webkit-align-items:center;
    align-items:center;
    -webkit-justify-content:center;
    justify-content:center;
}
.blankImg{
    width: 200px;
    height: 210px;
    background: url("../../../assets/image/resBlank.png") no-repeat;
    position: relative;
}
.welText{
    width: 100%;
    height: 30px;
    line-height: 30px;
    position: absolute;
    bottom: 0px;
    text-align: center;
    font-size: 16px;
    color: #666;
}
.parentForm{
    width: 80%;
    margin: 20px auto 150px;
}
.parentForm .el-select{
    width: 100%;
}
.searchResBox .searchBtn{
    width: 100%;
    height: 100%;
    display: inline-block;
    cursor: pointer;
}
.el-button {
    margin-right: -5px;;
}
.operContent{
    width: 100%;
    min-height: 100px
}
.operSearchCloumn{
    width: 100px;
}
.operSearchText {
    display: inline-block;
    width: 350px;
}
.cloumnBox{
    width: 100%;
    max-height: 100px;
    overflow: auto;
    line-height: 40px;
    border:1px solid #aaaaaa;
    margin-right: -5px;
}
.cloumnBox .el-checkbox{
    margin-left: 25px;
    color: #999999;
}
.cloumnBtn{
    text-align: right;
}
.pageTop{
    margin-top: 10px;
}
</style>
<style>
.viewTree .el-tree-node__content{
    height: 40px!important;
    display:block!important;
    line-height: 40px!important;
    position: relative!important;
    color: #333333!important;
    font-size: 14px!important;
}
.viewTree .el-tree-node__content:hover{
    background-color: #eaf1fb!important;
    color: #1081fa!important;
}
.viewTree.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: #eaf1fb!important;
    color: #1081fa!important;
}
.searchResBox .el-input__inner{
    height: 36px!important;
    width:330px;
    line-height: 36px!important;
}
.searchResBox .el-input-group__prepend{
    background-color:#ffffff!important;
}
.searchResBox .el-select .el-input__inner{
    width: 120px!important;
}
.searchResBox .el-input-group__append{
    background-color: #ffffff!important;
}
.searchBoxa {
    width: 330px;
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 10px;
}
.searchBoxa  input {
    border: 1px solid #d2d2d2;
}
.searchBoxa  input:hover {
    border: 1px solid #aaaaaa;
}
.iconSearch {
    position: absolute;
    right: 10px;
    top: 23px;
    z-index: 1;
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #909399;
}
.selSearch {
    position: absolute;
    width: 105px;
    right: 350px;
    margin-top: 1px;
}
.operNav{
    display: inline-block;
}
.operNav>div{
    display: inline-block;
    cursor: pointer;
    font-size: 14px;
    color: #999999;
    min-width: 80px;
    text-align: left;
}
.operNav .active>span{
    border-bottom:1px solid #1081fa;
    color:#1081fa;
}
.operNav span:hover{
    color:#1081fa;
}
.cloumnBox .is-disabled {
    cursor:text!important;
}
.cloumnBox .is-disabled .el-checkbox__inner, .cloumnBox .is-disabled .el-checkbox__label{
    cursor:text!important;
}
.operSearchText .el-date-editor {
   padding-top: 1px!important;
}
.operSearchText .el-date-editor .el-range-separator{
    width: 20px!important;
}
.operContent .el-input__inner{
    border-left:none!important;
    border-right:none!important;
    border-top:none!important;
    border-radius:0px!important;
}
.operSearchCloumn .el-input__inner{
    padding-left: 0px!important;
}
.smallBtn {
    height: 30px!important;
    width: 60px!important;
    min-width: 60px!important;
    font-size:12px!important;
    position: relative;
}
.smallBtn span {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%,-50%)
}
</style>