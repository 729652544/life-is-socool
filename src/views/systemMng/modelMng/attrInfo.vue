<template>
  <div class="modelInfo">
      
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
            <el-form class="attrForm" ref="attrForm" :rules="attrFormRule" :model="attrForm" label-width="30%">
                <el-row >
                    <el-col :span="12" >
                        <el-form-item label="属性名称：" prop="propertyTitle">
                            <el-input v-model="attrForm.propertyTitle" placeholder="请输入属性名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" >
                        <el-form-item label="维度类名："  prop="dimClassName" v-if="type=='dim'">
                            <el-input v-model="attrForm.dimText" readonly :disabled="isEdit" 
                                    placeholder="请选择维度类名"  
                                    @click.native="isEdit?'':showDimTree=true"
                                    :suffix-icon="showDimTree?'el-icon-arrow-down':'el-icon-arrow-up'">
                            </el-input>
                            <div class="flowTree"  v-if="showDimTree"  @mouseleave.stop=" showDimTree= false" >
                                <el-tree 
                                    :data="aryDimModel" 
                                    :props="dimTreeProps"
                                    :default-expand-all="true"
                                    :expand-on-click-node="false"
                                    :check-on-click-node="true"
                                    @node-click="dimNodeClick"></el-tree>
                            </div>
                        </el-form-item>
                        <el-form-item label="字段名称："  prop="dbFiledname" v-if="type=='res'">
                            <el-input v-model="attrForm.dbFiledname" :disabled="isEdit" placeholder="请输入字段名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="type=='dim'">
                    <el-col :span="12" >
                        <el-form-item label="维度表名：">
                            <el-input v-model="attrForm.dimDbTableName" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" >
                        <el-form-item label="属性个数：" >
                            <el-input v-model="attrForm.dimPropertyNum" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="type=='res'">
                    <el-col :span="12" >
                        <el-form-item label="属性类型：" prop="propertyGroup">
                            <el-input v-model="attrForm.propertyGroup" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" >
                        <el-form-item label="是否显示："  v-show="type!=='dim'" >
                            <el-radio-group v-model="attrForm.isDisplayItem">
                                <el-radio :label="0" >否</el-radio>
                                <el-radio :label="1">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
                <el-row v-if="type=='res'">
                    <el-col :span="12" >
                        <el-form-item label="字段类型：" prop="propertyFiledType" >
                            <el-select v-model="attrForm.propertyFiledType" placeholder="请选择" :disabled="isEdit">
                                <el-option
                                    v-for="item in filedTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="attrForm.propertyFiledType==4||attrForm.propertyFiledType==5" >
                        <el-form-item label="字典列表："  prop="dicId">
                            <el-select v-model="attrForm.dicId" placeholder="请选择" :disabled="isEdit">
                                <el-option
                                    v-for="item in aryDic"
                                    :key="item.dicId"
                                    :label="item.dicName"
                                    :value="item.dicId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="12">
                        <el-form-item label="是否可见："  v-show="type!=='dim'" >
                            <el-radio-group v-model="attrForm.propertyIsvisible" @change="isvisibleChange">
                                <el-radio :label="0" :disabled="isEdit">否</el-radio>
                                <el-radio :label="1" :disabled="isEdit">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否必填："  v-show="type!=='dim'">
                            <el-radio-group v-model="attrForm.propertyIsRequired">
                                <el-radio :label="0" :disabled="isEdit||attrForm.propertyIsvisible==0">否</el-radio>
                                <el-radio :label="1" :disabled="isEdit||attrForm.propertyIsvisible==0">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="type=='res'">
                    <el-col :span="12" >
                        <el-form-item label="排序：" prop="propertyOrder">
                            <el-input v-model="attrForm.propertyOrder"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" >
                        <el-form-item label="标签：" prop="propertyTag">
                            <el-input v-model="attrForm.propertyTag"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" >
                        <el-form-item label="描述："  label-width="15%" prop="propertyDescr">
                            <el-input type="textarea" :rows="4" v-model="attrForm.propertyDescr" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" class="subField">
                        <el-button type="info" @click="backPrePage()">取消</el-button>   
                        <el-button type="primary" @click="saveAttrForm()">确认</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <common-footer></common-footer>
  </div>
</template>
<script>

import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
import UtilService from '@/publicJs/UtilService'
import eventBus from '@/publicJs/eventBus.js'

export default {
    name:'modelInfo',
    data(){
        var checkSort = (rule, value, callback) => {
            if(value&&value.length>0){
                if (!Number.isInteger(value-0)) {
                    callback(new Error('请输入数字值'));
                }else{
                    if (value < 1||value >99) {
                        callback(new Error('排序范围为1-99'));
                    } else {
                        callback();
                    }
                }  
            }else{
                callback();
            }
        };
        var checkPropTitle = (rule, value, callback) => {
            var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
            if(!reg.test(value)){
                callback(new Error('属性名称中不可输入特殊字符'));
            }else{
                callback();
            }
        };
        var checkFiledname = (rule, value, callback) => {
            var reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
            if(!reg.test(value)){
                callback(new Error('字段名称中仅可输入字母和数字且以字母开头'));
            }else{
                callback();
            }
        };
        var checkDic = (rule, value, callback) => {
            if(this.attrForm.propertyFiledType==4||this.attrForm.propertyFiledType==5){
                if(value==null||value==''){
                     callback(new Error('请选择字典'));
                }else{
                    callback();
                }
            }else{
                callback();
            }
        };
        var checkTag = (rule, value, callback) => {
            var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
            if(!reg.test(value)){
                callback(new Error('标签中不可输入特殊字符'));
            }else{
                callback();
            }
        };
        return{
            type:'',
            isEdit:false,
            classname:'',
            attrForm:{
                propertyTitle:'',
                dimClassName:'',
                dimText:'',
                dimDbTableName:'',
                dimPropertyNum:'',
                propertyIsvisible:1,
                propertyIsRequired:0,
                propertyDescr:'',
                propertyGroup:'',
                propertyFiledType:1,
                dbFiledname:'',
                dicId:null,
                propertyOrder:'',
                propertyTag:'',
                isDisplayItem:0
            },
            attrFormRule:{
                propertyTitle:[
                    { required: true, message: '属性名称不可为空', trigger: 'blur' },
                    { validator: checkPropTitle, trigger: 'blur' }
                ],
                dimClassName:[
                    { required: true, message: '维度类名不可为空', trigger: 'change' },
                ],
                propertyOrder:[
                    { validator: checkSort, trigger: 'blur' }
                ],
                propertyDescr:[
                    { max:300, message: '描述最多为300个字符', trigger: 'blur' }
                ],
                dbFiledname:[
                    { required: true, message: '字段名称不可为空', trigger: 'blur' },
                    { validator: checkFiledname, trigger: 'blur' }
                ],
                dicId:[
                    { validator: checkDic, trigger: 'blur' }
                ],
                propertyTag:[
                    { required: true, message: '标签不可为空', trigger: 'blur' },
                    { validator: checkTag, trigger: 'blur' }
                ]
            },
            filedTypeOptions:[{
                value:1,
                label:'文本型'
            },{
                value:2,
                label:'字符型'
            },{
                value:3,
                label:'数值型'
            },{
                value:4,
                label:'字典型（单选）'
            },
            {
                value:5,
                label:'字典项（多选）'
            },
            {
                value:6,
                label:'图片型'
            },{
                value:7,
                label:'时间型'
            },{
                value:8,
                label:'坐标型'
            },
            // {
            //     value:9,
            //     label:'维度'
            // },
            {
                value:10,
                label:'挂载'
            }
            ],
            aryDic:[],
            aryDimModel:[],
            dimTreeProps:{
                children: 'children',
                label: 'text'
            },
            loading:{},
            showDimTree:false,
        }
    },
    computed:{
        aryBread:function(){
            var str1 = this.$route.params.oper=='add'?'新增':'修改';
            var str2 = this.$route.params.type=='dim'?'维度':'资源';
            var ary = [
                {name:'系统设置',url:'/systemHome'},
                {name:'模型管理',url:'/systemHome/modelMng/'+this.$route.params.type},
            ];
            ary.push({name:str1+str2+'属性',url:''});
            this.attrForm.propertyGroup = str2+'属性';
            return ary;
        }
    },
    watch:{

    },
    components: {
        commonBread,
        commonFooter,
    },
    mounted() {
        this.type = this.$route.params.type;
        this.isEdit = this.$route.params.oper=='add'?false:true;
        this.classname = this.$route.params.classname;
        var propertyTitle = this.$route.params.column;
        if(this.type=='res'){
            this.getDicList()
        }
        if(this.type=='dim'){
            this.getDimModel();
        }
        if(this.isEdit){
            this.getAttrInfo(propertyTitle);
        }
    },
    methods:{
        // 获取字典列表
        getDicList:function(){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/dict/listType',{},function(pres){
                that.aryDic = pres.results;
            });
        },
        // 查维度模型
        getDimModel:function(){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/class/queryDataByClassTag/dim','',function(pres){
                that.aryDimModel = [pres.results];
            });
        },
        toTreeData:function(data,parent_id){
            var tree = [];
            var temp;
            for (var i = 0; i < data.length; i++) {
                if (data[i].parentnodeid == parent_id) {
                    var obj = data[i];
                    temp = this.toTreeData(data, data[i].id);
                    if (temp.length > 0) {
                    obj.children = temp;
                    }
                    tree.push(obj);
                }
            }
            return tree;
        },
        dimNodeClick:function(data){
            var that = this;
            if(data.attributes.classname=='ResObject'){
                 that.$message({
                    type: 'warning',
                    message: '维度类名不可选择ResObject'
                });
            }else{
                that.attrForm.dimClassName = data.attributes.classname;
                that.attrForm.dimText = data.attributes.classcnname
                apiClient.get('ssiteapi/platform/asset/property/getDimByClassName/'+data.attributes.classname,'',function(pres){
                    that.attrForm.dimDbTableName = pres.results.dimTableName;
                    that.attrForm.dimPropertyNum = pres.results.dimPropertyNum;

                })
            }
        },
        // 返回上一页
        backPrePage:function(){
            this.$router.go(-1);
        },
        saveAttrForm:function(){
            var that = this;
            that.$refs['attrForm'].validate((valid) => { 
                if (valid) {
                    that.loading = that.$loading({
                        lock: true,
                        text: '加载中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(255,255, 255, 0.6)'
                    });
                    if(that.isEdit){
                        that.saveEditAttr();
                    }else{
                        that.saveAddAttr();
                    }
                }else{
                    return false;
                }
            });
        },
        saveEditAttr:function(){
            var that = this;
            var params = {
                className:that.classname,
                propertyGroup:that.type,
                dbFiledname:that.attrForm.dbFiledname,
                propertyIsvisible:that.attrForm.propertyIsvisible,
                propertyOrder:that.attrForm.propertyOrder-0,
                propertyDescr:that.attrForm.propertyDescr,
                dimClassName:that.attrForm.dimClassName,
                propertyIsRequired:that.attrForm.propertyIsRequired,
                dimDbTableName:that.attrForm.dimDbTableName,
                propertyTitle:that.attrForm.propertyTitle,
                dimPropertyNum:that.attrForm.dimPropertyNum,
                dicId:that.attrForm.dicId,
                propertyFiledType:that.attrForm.propertyFiledType,
                propertyTag:that.attrForm.propertyTag,
                isDisplayItem:that.attrForm.isDisplayItem,
            }
            apiClient.linkApi('ssiteapi/platform/asset/property/update','POST',params,function(pres){
                that.loading.close();
                if(pres.status==200){
                    that.backPrePage();
                }
                if(pres.status==5006){
                    that.$message({
                        type: 'error',
                        message: '资产数据已存在，不可更新属性'
                    });
                }
            });
        },
        saveAddAttr:function(){
            var that = this;
            var params = {
                className:that.classname,
                propertyGroup:that.type,
                dbFiledname:that.attrForm.dbFiledname,
                propertyIsvisible:that.attrForm.propertyIsvisible,
                propertyOrder:that.attrForm.propertyOrder-0,
                propertyDescr:that.attrForm.propertyDescr,
                dimClassName:that.attrForm.dimClassName,
                propertyIsRequired:that.attrForm.propertyIsRequired,
                dimDbTableName:that.attrForm.dimDbTableName,
                propertyTitle:that.attrForm.propertyTitle,
                dimPropertyNum:that.attrForm.dimPropertyNum,
                dicId:'',
                propertyFiledType:that.attrForm.propertyFiledType,
                propertyTag:that.attrForm.propertyTag,
                isDisplayItem:that.attrForm.isDisplayItem,
            }
            if(that.attrForm.propertyFiledType==4||that.attrForm.propertyFiledType==5){
                params.dicId = that.attrForm.dicId;
            }
            apiClient.linkApi('ssiteapi/platform/asset/property/insert','put',params,function(pres){
                that.loading.close();
                if(pres.status==200){
                    that.backPrePage();
                }
                if(pres.status==5006){
                    that.$message({
                        type: 'error',
                        message: pres.exception,
                    });
                }

            });
        },
        // 获取属性信息
        getAttrInfo:function(column){
            var that = this;
            that.loading = that.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(255,255, 255, 0.6)'
            });
            apiClient.get('ssiteapi/platform/asset/property/getDataByPropertyAndClass/'+column+'/'+this.classname,'',function(pres){
               for(var p in that.attrForm){
                   that.attrForm[p] = pres.results[p];
                }
               that.getDimInfo(that.attrForm.dimClassName);
                that.loading.close();
            })
        },
        getDimInfo:function(classname){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/class/queryDataByClassName/'+classname,'',function(pres){
               that.attrForm.dimText =pres.results.classcnname;
            })
        },
        isvisibleChange:function(val){
            if(val==0){
                this.attrForm.propertyIsRequired = 0;
            }
        }
    },
    filters: {
    }
}
</script>
<style scoped >
.modelInfo{
    width: 100%;
    height: 100%;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    border-top: solid 1px #e6e6e6;
}
.contentField{
    width: 100%;
    height: calc(100% - 90px);
    margin-top: 10px;
    background: #ffffff;
    border-radius: 2px 2px 0px 0px;
    box-shadow: 0px 0px 9px 0px 
    rgba(16, 129, 250, 0.1);
}
.attrForm{
    margin: 10px auto;
    height: 100%;
    padding: 20px 10%;
    padding-top: 50px;
    overflow: auto;
}
.subField{
    text-align: right;
}
.attrForm .el-select{
    width: 100%;
}
.flowTree{
    position: absolute;
    overflow: auto;
    z-index: 100;
    width: 100%;
    height: 150px;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    margin-top:5px;
    background: #ffffff;
    z-index: 1;
}

</style>