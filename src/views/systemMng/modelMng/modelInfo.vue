<template>
  <div class="modelInfo">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
            <el-form class="modelForm" ref="modelForm" :rules="modelFormRule" :model="modelForm" label-width="30%">
                <el-row>
                    <el-col :span="10" >
                        <el-form-item label="名称：" prop="classcnname">
                            <el-input v-model="modelForm.classcnname" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" >
                        <el-form-item label="父对象：" >
                            <el-input v-model="modelForm.parentNodeClassName"  placeholder="请输入父对象" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                     <el-col :span="10" >
                        <el-form-item label="类名："  prop="classname">
                            <el-input v-model="modelForm.classname" :disabled="isEdit" placeholder="请输入类名"  @change="classChange"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="库表名：" >
                            <el-input v-model="modelForm.tablename" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="type=='res'">
                    <el-col :span="10" >
                        <el-form-item label="是否节点：">
                            <el-radio-group v-model="modelForm.isnode">
                                <el-radio :label="0" :disabled="isEdit">否</el-radio>
                                <el-radio :label="1" :disabled="isEdit">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否虚对象：" >
                            <el-radio-group v-model="modelForm.isvn">
                                <el-radio :label="0"  :disabled="isEdit">否</el-radio>
                                <el-radio :label="1"  :disabled="isEdit">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="type=='res'">
                    <el-col :span="10" >
                        <el-form-item label="是否挂载：" >
                            <el-radio-group v-model="modelForm.ismountnode">
                                <el-radio :label="0" :disabled="isEdit">否</el-radio>
                                <el-radio :label="1" :disabled="isEdit">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" >
                        <el-form-item label="挂载到："  v-if="modelForm.ismountnode==1">
                            <el-input 
                                v-model="modelForm.mountNodeTextName" 
                                :disabled="isEdit" 
                                @click.native="isEdit?'':showMountTree=true"
                                :suffix-icon="showMountTree?'el-icon-arrow-down':'el-icon-arrow-up'"
                                readonly>
                            </el-input>
                            <div class="flowTree"  v-if="showMountTree"  @mouseleave.stop="showMountTree= false" >
                                <el-tree 
                                    :data="mountTreeData" 
                                    :props="mountTreeProps"
                                    :default-expand-all="true"
                                    :expand-on-click-node="false"
                                    :check-on-click-node="true"
                                    @node-click="mountNodeClick"></el-tree>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="type=='res'">
                    <el-col :span="10" >
                        <el-form-item label="排序：" prop="sort">
                            <el-input v-model="modelForm.sort"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否可见：" >
                            <el-radio-group v-model="modelForm.isvisible">
                                <el-radio :label="0" :disabled="isEdit">否</el-radio>
                                <el-radio :label="1" :disabled="isEdit">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row v-if="type=='dim'">
                    <el-col :span="10" >
                        <el-form-item label="是否可见：" >
                            <el-radio-group v-model="modelForm.isvisible">
                                <el-radio :label="0" :disabled="isEdit">否</el-radio>
                                <el-radio :label="1" :disabled="isEdit">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否虚维度：" >
                            <el-radio-group v-model="modelForm.isvn">
                                <el-radio :label="0"  :disabled="isEdit">否</el-radio>
                                <el-radio :label="1"  :disabled="isEdit">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row v-if="type=='dim'">
                    <el-col :span="10" >
                        <el-form-item label="排序：" prop="sort"  >
                            <el-input v-model="modelForm.sort" placeholder="请输入排序"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20" >
                        <el-form-item label="描述："  label-width="15%" prop="classdescr">
                            <el-input type="textarea" :rows="4" v-model="modelForm.classdescr" placeholder="请输入描述"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20" class="subField">
                        <el-button type="info"  @click="backPrePage()">取消</el-button>
                        <el-button type="primary" @click="subModelForm()">确认</el-button>
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
       var checkClassName = (rule, value, callback) => {
           var reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
           if(value.length==this.nowClassPer.length){
               callback(new Error('类名中以'+this.nowClassPer+'开头且后不能为空'));
           }else{
                if(!reg.test(value)){
                    callback(new Error('类名中仅可输入字母和数字且以字母开头'));
                }else{
                    this.modelForm.tablename='OMP_'+this.modelForm.classname.toUpperCase().replace('RES','RES_').replace('DIM','DIM_');
                    callback();
                }
           }
       };
        return{
            type:'dim',
            isEdit:false,
            showMountTree:false,
            modelForm:{
                classcnname:'',
                parentnodeid:'',
                parentNodeClassName:'',
                classname:'Res',
                tablename:'',
                isnode:0,
                isvn:0,
                ismountnode:0,
                mountnodeid:'',
                mountNodeClassName:'',
                mountNodeTextName:'',
                isvisible:1,
                sort:'',
                classdescr:'',
            },
            modelFormRule:{
                classcnname:[
                    { required: true, message: '名称不可为空', trigger: 'blur' },
                    { max:30, message: '名称最多为30个字符', trigger: 'blur' }
                ],
                classname:[
                    { required: true, message: '类名不可为空', trigger: 'blur' },
                    { max:30, message: '类名最多为20个字符', trigger: 'blur' },
                    { validator: checkClassName, trigger: 'blur' }
                ],
                sort:[
                    { validator: checkSort, trigger: 'blur' }
                ],
                parentnodeid:[],
                classdescr:[
                     { max:300, message: '描述最多为300个字符', trigger: 'blur' }
                ]
            },
            mountTreeData: [],
            mountTreeProps:{
                children: 'children',
                label: 'text'
            },
            nowClassPer:''
        }
    },
    computed:{
        aryBread:function(){
            var str1 = this.$route.params.oper=='add'?'新增':'修改';
            var str2 = this.$route.params.type=='dim'?'维度':'资源';
            var ary = [
                {name:'系统设置',url:'/systemHome'},
                {name:'模型管理',url:'/systemHome/modelMng/'+ this.type},
            ]; 
            ary.push({name:str1+str2+'模型',url:''});
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
        var classname = this.$route.params.id;
        this.nowClassPer = this.$route.params.type=='dim'?'ResDim':'Res';
        if(this.isEdit==false){
            this.modelForm.classname = this.nowClassPer;
            this.getParentInfo(classname);
            this.getMountTree()
        }else{
            // this.modelForm.classname = this.nowClassPer;
            this.getModelInfo(classname);
        }
       
    },
    methods:{
        mountNodeClick:function(data){
            var that = this;
            that.modelForm.mountnodeid = data.id;
            that.modelForm.mountNodeClassName =data.attributes.classname;
            that.modelForm.mountNodeTextName = data.text;
        },
        getParentInfo:function(classname){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/class/queryDataByClassName/'+classname,'',function(pres){
                that.modelForm.parentnodeid = pres.results.id;
                that.modelForm.parentNodeClassName = pres.results.classname;
            })
        },
        getModelInfo:function(classname){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/class/queryDataByClassName/'+classname,'',function(pres){
               for(var p in that.modelForm){
                   that.modelForm[p] = pres.results[p];
               }
               if(that.modelForm.ismountnode==1){
                   that.getMountInfo(that.modelForm.mountNodeClassName);
               }
            })
        },
        getMountInfo:function(classname){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/class/queryDataByClassName/'+classname,'',function(pres){
               that.modelForm.mountNodeTextName =pres.results.classcnname;
            })
        },
        // 返回上一页
        backPrePage:function(){
            this.$router.push('/systemHome/modelMng/'+this.type);
        },
        subModelForm:function(){
            var that = this;
            that.$refs['modelForm'].validate((valid) => { 
                if (valid) {
                    if(that.isEdit){
                        that.saveEditModel();
                    }else{
                        that.saveAddModel();
                    }
                }else{
                    return false;
                }
            });
        },
        // 修改模型
        saveEditModel:function(){
            var that = this;
            var params={
                id:that.modelForm.id,
                classtag:that.type,
                isvisible:that.modelForm.isvisible,
                isvn:that.modelForm.isvn,
                classname:that.modelForm.classname,
                ismountnode:that.modelForm.ismountnode,
                mountnodeid:that.modelForm.mountnodeid,
                isnode:that.modelForm.isnode,
                classdescr:that.modelForm.classdescr,
                tablename:that.modelForm.tablename,
                classcnname:that.modelForm.classcnname,
                parentnodeid:that.modelForm.parentnodeid,
                sort:that.modelForm.sort-0,
            }
            apiClient.linkApi('ssiteapi/platform/asset/class/update','POST',params,function(pres){
                if(pres.status==200){
                    that.backPrePage();
                }else if(pres.status==5004){
                    that.$message({
                        type: 'warning',
                        message: '类名不可重复'
                    });
                }
            });
        },
        // 增加模型
        saveAddModel:function(){
            var that = this;
            var params={
                classtag:that.type,
                isvisible:that.modelForm.isvisible,
                isvn:that.modelForm.isvn,
                classname:that.modelForm.classname,
                ismountnode:that.modelForm.ismountnode,
                mountnodeid:that.modelForm.mountnodeid,
                isnode:that.modelForm.isnode,
                classdescr:that.modelForm.classdescr,
                tablename:that.modelForm.tablename,
                classcnname:that.modelForm.classcnname,
                parentnodeid:that.modelForm.parentnodeid,
                sort:that.modelForm.sort-0,
            }
            apiClient.linkApi('ssiteapi/platform/asset/class/insert','put',params,function(pres){
                if(pres.status==200){
                    that.backPrePage();
                }else if(pres.status==5004){
                    that.$message({
                        type: 'warning',
                        message: '类名不可重复'
                    });
                }
            });
        },
        // 获取挂载树
        getMountTree:function(){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/class/listMount','',function(pres){
               var ary = pres.results;
            //    that.mountTreeData = that.toTreeData(ary,0);
               that.mountTreeData = [ary];               
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
        // 类名改变时
        classChange:function(val){
            var that = this;
            if(val.indexOf('Res')==-1){
                that.modelForm.classname = 'Res';
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
.modelForm{
    margin: 10px auto;
    height: 100%;
    padding: 20px 10%;
    padding-top: 50px;
    overflow: auto;
}
.subField{
    text-align: right;
}
.mountPopper{
    width: 100%;
}
.mountTreeField{
    width: 100%;
    max-height: 250px;
    overflow: auto;
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