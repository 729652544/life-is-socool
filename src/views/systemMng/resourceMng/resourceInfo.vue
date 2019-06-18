<template>
  <div class="resourceInfo">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
            <div class="leftField">
                <div class="anchorTitle"><span class="iconfont icon-guzhangbaojing"></span>继承属性</div>
                <ul class="anchorItem">
                    <li><span class="anchorName" @click="scrollRight('inheritBasicTitle')">
                            <span class="iconfont icon-duigou successIcon" v-if="inheritBasicValid==true"></span>
                            <span class="iconfont icon-guanbi1 errorIcon" v-else></span>
                            基本属性
                        </span></li>
                    <li><span class="anchorName" @click="scrollRight('inheritDimTitle')">
                            <span class="iconfont icon-duigou successIcon" v-if="inheritDimValid==true"></span>
                            <span class="iconfont icon-guanbi1 errorIcon" v-else></span>
                            维度属性
                        </span></li>
                </ul>
                <div class="anchorTitle"><span class="iconfont icon-guzhangbaojing"></span>自身属性</div>
                <ul class="anchorItem">
                    <li><span class="anchorName" @click="scrollRight('selfBasicTitle')">
                            <span class="iconfont icon-duigou successIcon" v-if="selfBasicValid==true"></span>
                            <span class="iconfont icon-guanbi1 errorIcon" v-else></span>
                            基本属性
                        </span></li>
                    <li><span class="anchorName" @click="scrollRight('selfDimTitle')">
                            <span class="iconfont icon-duigou successIcon" v-if="selfDimValid==true"></span>
                            <span class="iconfont icon-guanbi1 errorIcon" v-else></span>
                            维度属性
                        </span></li>
                </ul>
            </div> 
            <div class="rightField">
                <div class="rightContentField" id="rightContent">
                    <div class="rightTitle">继承属性</div>
                    <el-collapse class="resCollapse"  v-model="inhNames" @change="collapseChange"> 
                        <el-collapse-item name="inh_basic">
                            <template slot="title">
                                <span id="inheritBasicTitle">基本属性</span>
                            </template>
                            <el-form class="attrForm" ref="inheritBasicForm" :rules="inheritBasicRule" :model="inheritBasicData" label-width="20%">
                                <el-row :span="12"  
                                    v-for="(val1, p1)  in inheritBasicData"
                                    :key="p1">
                                    <el-form-item 
                                        :label="val1.name" 
                                        :prop="p1" 
                                        :required="val1.IsRequired==1?true:false"
                                         v-show="val1.IsVisible==1"
                                       >
                                        <c-text-area v-if="val1.type==1"  :itemData="val1"></c-text-area>
                                        <c-string v-if="val1.type==2" :itemData="val1" :cDisable="p1=='classname'?true:false"></c-string>
                                        <c-number v-if="val1.type==3" :itemData="val1"></c-number>
                                        <c-select v-if="val1.type==4" :itemData="val1"></c-select>
                                        <c-select-double v-if="val1.type==5" :itemData="val1"></c-select-double>
                                        <c-picture v-if="val1.type==6" :itemData="val1"></c-picture>
                                        <c-time v-if="val1.type==7" :itemData="val1"></c-time>
                                        <c-coordinate v-if="val1.type==8" :itemData="val1"></c-coordinate>
                                        <c-mount v-if="val1.type==10" :itemData="val1"></c-mount>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-collapse-item>
                        <el-collapse-item name="inh_dim">
                            <template slot="title">
                                <span id="inheritDimTitle">维度属性</span>
                            </template>
                            <el-form class="attrForm" ref="inheritDimForm" :rules="inheritDimRule" :model="inheritDimData" label-width="20%">
                                <el-row :span="12"  
                                    v-for="(val1, p1)  in inheritDimData"
                                    :key="p1">
                                    <el-form-item 
                                        :label="val1.name" 
                                        :prop="p1" 
                                         v-show="val1.IsVisible==1"
                                        :required="val1.IsRequired==1?true:false"
                                       >
                                        <c-text-area v-if="val1.type==1"  :itemData="val1"></c-text-area>
                                        <c-string v-if="val1.type==2" :itemData="val1"></c-string>
                                        <c-number v-if="val1.type==3" :itemData="val1"></c-number>
                                        <c-select v-if="val1.type==4" :itemData="val1"></c-select>
                                        <c-select-double v-if="val1.type==5" :itemData="val1"></c-select-double>
                                        <c-picture v-if="val1.type==6" :itemData="val1"></c-picture>
                                        <c-time v-if="val1.type==7" :itemData="val1"></c-time>
                                        <c-coordinate v-if="val1.type==8" :itemData="val1"></c-coordinate>
                                        <c-mount v-if="val1.type==10" :itemData="val1"></c-mount>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-collapse-item>
                        
                    </el-collapse>
                    <div class="rightTitle">自身属性</div>
                    <el-collapse class="resCollapse"  v-model="selfNames">
                        <el-collapse-item name="self_basic">
                            <template slot="title">
                                <span id="selfBasicTitle">基本属性</span>
                            </template>
                            <el-form class="attrForm" ref="selfBasicForm" :rules="selfBasicRule" :model="selfBasicData" label-width="20%">
                                 <el-row :span="12"  
                                    v-for="(val1, p1)  in selfBasicData"
                                    :key="p1">
                                    <el-form-item 
                                        :label="val1.name" 
                                        :prop="p1" 
                                         v-show="val1.IsVisible==1"
                                        :required="val1.IsRequired==1?true:false"
                                       >
                                        <c-text-area v-if="val1.type==1"  :itemData="val1"></c-text-area>
                                        <c-string v-if="val1.type==2" :itemData="val1"></c-string>
                                        <c-number v-if="val1.type==3" :itemData="val1"></c-number>
                                        <c-select v-if="val1.type==4" :itemData="val1"></c-select>
                                        <c-select-double v-if="val1.type==5" :itemData="val1"></c-select-double>
                                        <c-picture v-if="val1.type==6" :itemData="val1"></c-picture>
                                        <c-time v-if="val1.type==7" :itemData="val1"></c-time>
                                        <c-coordinate v-if="val1.type==8" :itemData="val1"></c-coordinate>
                                        <c-mount v-if="val1.type==10" :itemData="val1"></c-mount>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-collapse-item>
                        <el-collapse-item name="self_dim">
                            <template slot="title">
                                <span id="selfDimTitle">维度属性</span>
                            </template>
                            <el-form class="attrForm" ref="selfDimForm" :rules="selfDimRule" :model="selfDimData" label-width="20%">
                                <el-row :span="12"  
                                    v-for="(val1, p1)  in selfDimData"
                                    :key="p1">
                                    <el-form-item 
                                        :label="val1.name" 
                                        :prop="p1" 
                                         v-show="val1.IsVisible==1"
                                        :required="val1.IsRequired==1?true:false"
                                       >
                                        <c-text-area v-if="val1.type==1"  :itemData="val1"></c-text-area>
                                        <c-string v-if="val1.type==2" :itemData="val1"></c-string>
                                        <c-number v-if="val1.type==3" :itemData="val1"></c-number>
                                        <c-select v-if="val1.type==4" :itemData="val1"></c-select>
                                        <c-select-double v-if="val1.type==5" :itemData="val1"></c-select-double>
                                        <c-picture v-if="val1.type==6" :itemData="val1"></c-picture>
                                        <c-time v-if="val1.type==7" :itemData="val1"></c-time>
                                        <c-coordinate v-if="val1.type==8" :itemData="val1"></c-coordinate>
                                        <c-mount v-if="val1.type==10" :itemData="val1"></c-mount>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-collapse-item>
                        
                    </el-collapse>
                    <div class="formSubField">
                        <el-button type="info" @click="cancleBtn">取消</el-button>
                        <el-button type="primary" @click="subBtn">确认</el-button>
                    </div>
                </div>
               <common-footer></common-footer> 
            </div>      
        </div>
  </div>
</template>
<script>

import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
import UtilService from '@/publicJs/UtilService'

import cString from '@/components/common/formItem/cString'
import cTextArea from '@/components/common/formItem/cTextArea'
import cNumber from '@/components/common/formItem/cNumber'
import cSelect from '@/components/common/formItem/cSelect'
import cSelectDouble from '@/components/common/formItem/cSelectDouble'
import cTime from '@/components/common/formItem/cTime'
import cCoordinate from '@/components/common/formItem/cCoordinate'
import cMount from '@/components/common/formItem/cMount'
import cPicture from '@/components/common/formItem/cPicture'

export default {
    name:'dictionaryMng',
    data(){
        return{
            selfNames:['self_dim','self_basic'],
            inhNames:['inh_dim','inh_basic'],
            classname:'',
            resId:'',
            type:'',
            selfBasicData:{
            },
            selfBasicRule:{   
            },
            selfDimData:{
            },
            selfDimRule:{   
            },
            inheritBasicData:{ 
            },
            inheritBasicRule:{ 
            },
            inheritDimData:{
            },
            inheritDimRule:{
            },
            allData:{},
            scrollNum:{
            },
            inheritBasicValid:true,
            inheritDimValid:true,
            selfBasicValid:true,
            selfDimValid:true,
        }
    },
    watch:{

    },
    components: {
        commonBread,
        commonFooter,
        cString,
        cTextArea,
        cNumber,
        cSelect,
        cSelectDouble,
        cTime,
        cCoordinate,
        cMount,
        cPicture
    },
    created() {
        this.classname = this.$route.params.classname;
        this.resId = this.$route.params.resid;
        this.type = this.$route.params.type;
        if(this.resId==='null'){
            this.getAttr();
        }else{
             this.getAttrById();
        }
    },
    computed:{
        aryBread:function(){
            var ary = [
                {name:'系统设置',url:''},
                {name:'模型管理',url:'/systemHome/resourceMng/'+this.$route.params.viewType+'/'+this.$route.params.viewId},
            ];
            if(this.type=='add'){
                ary.push({name:'资源录入',url:''});
            }else{
                ary.push({name:'资源编辑',url:''});
            }
            return ary;
        }
    },
    methods:{
        collapseChange:function(){
            var that = this;
            setTimeout(function(){
                that.scrollNum={
                    inheritBasicTitle:$("#inheritBasicTitle").position().top,
                    inheritDimTitle:$("#inheritDimTitle").position().top,
                    selfBasicTitle:$("#selfBasicTitle").position().top,
                    selfDimTitle:$("#selfDimTitle").position().top,
                }
            },500);
        },
        getAttr:function(){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/info/getPropertyByClassName/'+that.classname,{},function(pres){
                that.showData(pres);
            });
        },
        getAttrById:function(){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/info/getDataById/'+that.resId+'/'+that.classname,{},function(pres){
                that.showData(pres);
            });
        },
        showData:function(pres){
            var that = this;
            that.allData = pres.results;
            var selfBasicData = pres.results.selfBasicData;
            var selfDimData = pres.results.selfDimData;
            var inheritBasicData = pres.results.inheritBasicData;
            var inheritDimData = pres.results.inheritDimData;
            var selfBasicDo = {};
            var selfDimDo = {};
            var inheritBasicDo = {};
            var inheritDimDo = {};
            that.DoData(selfBasicData,selfBasicDo,that.selfBasicRule);
            that.DoData(selfDimData,selfDimDo,that.selfDimRule);
            that.DoData(inheritBasicData,inheritBasicDo,that.inheritBasicRule);
            that.DoData(inheritDimData,inheritDimDo,that.inheritDimRule);
            that.selfBasicData = selfBasicDo;
            that.selfDimData = selfDimDo;
            that.inheritBasicData =inheritBasicDo;
            that.inheritDimData = inheritDimDo;

            setTimeout(function(){
                that.scrollNum={
                    inheritBasicTitle:$("#inheritBasicTitle").position().top,
                    inheritDimTitle:$("#inheritDimTitle").position().top,
                    selfBasicTitle:$("#selfBasicTitle").position().top,
                    selfDimTitle:$("#selfDimTitle").position().top,
                }
            },200);
            
        },
        DoData:function(Data,Do,Rule){
             var checkTextArea = (rule, value, callback) => {
                if(value.value==''&&value.IsRequired==1){
                    callback(new Error('请输入'+value.name));
                }else{
                    if(value.value!=null){
                        if(value.value.length>200){
                            callback(new Error(value.name+'长度不可超过200'));
                        }else{
                            callback();
                        }
                    }else {
                        callback();
                    }
                        
                }
            };
            var checkString = (rule, value, callback) => {
                if((value.value==''||value.value==null)&&value.IsRequired==1){
                    callback(new Error('请输入'+value.name));
                }else{
                   if(value.value!==null){
                       if(value.value.length>50){
                        callback(new Error(value.name+'长度不可超过50'));
                        }else{
                            callback();
                        }
                   }else{
                       callback();
                   }
                }
            };
            var checkNumber = (rule, value, callback) => {
                if((value.value==null||value.value=='')&&value.IsRequired==1){
                    callback(new Error('请输入'+value.name));
                }else{
                    if(value.value!==null&&value.value!==''){
                        var reg =/^[0-9]+([.]{1}[0-9]+){0,1}$/;
                        if (!reg.test(value.value)) {
                            callback(new Error(value.name+'为数值类型'));
                        }else{
                            if ((value.value+'').length>50) {
                                callback(new Error(value.name+'长度不可超过50'));
                            } else {
                                var ary = value.value.toString().split(".");
                                if(ary.length>1&&ary[1].length>2){
                                    callback(new Error(value.name+'小数点后最多两位数'));
                                }else{
                                    callback();
                                }
                            }
                        }    
                    } else{
                        callback();
                    }
                }
            };
            var checkSelect = (rule, value, callback) => {
                if(value.value==''&&value.IsRequired==1){
                    callback(new Error('请选择'+value.name));
                }else{
                    callback();
                }
            };
            var checkSelectDouble = (rule, value, callback) => {
                if(value.value==''&&value.IsRequired==1){
                    callback(new Error('请选择'+value.name));
                }else{
                    callback();
                }
            };
            var checkPictuer = (rule, value, callback) => {
                if(value.value==''&&value.IsRequired==1){
                    callback(new Error('请选择'+value.name));
                }else{
                    callback();
                }
            };
            var checkCoordinate = (rule, value, callback) => {
                if(value.value==''&&value.IsRequired==1){
                    callback(new Error('请输入'+value.name));
                }else{
                    callback();
                }
            };
             var checkTime = (rule, value, callback) => {
                if(value.value==''&&value.IsRequired==1){
                    callback(new Error('请输入'+value.name));
                }else{
                    callback();
                }
            };
            var checkMount = (rule, value, callback) => {
                if(value.value==''&&value.IsRequired==1){
                    callback(new Error('请输入'+value.name));
                }else{
                    callback();
                }
            };
            for(var p1 in Data){
                for(var p2 in Data[p1]){
                    Rule[p2] = [];
                    // if(Data[p1][p2].IsRequired==1){
                    if(Data[p1][p2].type==1){
                        Rule[p2].push({ validator: checkTextArea, trigger: 'blur' });
                    }
                    if(Data[p1][p2].type==2){
                        Rule[p2].push({ validator: checkString, trigger: 'blur' });
                    }
                    if(Data[p1][p2].type==3){
                        Rule[p2].push({type: 'number', validator: checkNumber, trigger: 'blur' });
                    }
                    if(Data[p1][p2].type==4){
                        Rule[p2].push({ validator: checkSelect, trigger: 'blur' });
                    }
                    if(Data[p1][p2].type==5){
                        Rule[p2].push({ validator: checkSelectDouble, trigger: 'blur' });
                    }
                    if(Data[p1][p2].type==6){
                        Rule[p2].push({ validator: checkPictuer, trigger: 'blur' });
                    }
                    if(Data[p1][p2].type==7){
                        Rule[p2].push({ validator: checkTime, trigger: 'blur' });
                    }
                    if(Data[p1][p2].type==8){
                        Rule[p2].push({ validator: checkCoordinate, trigger: 'blur' });
                    }
                    if(Data[p1][p2].type==10){
                        Rule[p2].push({ validator: checkMount, trigger: 'blur' });
                    }
                    // }
                    Do[p2] = Data[p1][p2];
                }
            }
            return true;
        },
        subBtn:function(){
            var that = this;
            that.$refs['selfBasicForm'].validate((valid1) => {
                if(valid1){
                    that.selfBasicValid = true;
                }else{
                    that.selfBasicValid = false;
                }
                that.$refs['selfDimForm'].validate((valid2) => {
                    if(valid2){
                        that.selfDimValid = true;
                    }else{
                        that.selfDimValid = false;
                    }
                    that.$refs['inheritBasicForm'].validate((valid3) => {
                        if(valid3){
                            that.inheritBasicValid = true;
                        }else{
                            that.inheritBasicValid = false;
                        }
                        that.$refs['inheritDimForm'].validate((valid4) => {
                            if(valid4){
                                that.inheritDimValid = true;
                            }else{
                                that.inheritDimValid = false;
                            }
                            if(valid1&&valid2&&valid3&&valid4){
                                if(that.type=='add'){
                                    that.addData();
                                }else if(that.type=='edit'){
                                    that.updateData();
                                }
                            }
                        })
                    })
                })
            }) 
            
        },
        addData:function(){
            var that = this;
            var params = {
                "data":that.packData(),
                "isInherit":that.resId=='null'?false:true,
            }
            apiClient.linkApi('ssiteapi/platform/asset/info/insert','PUT',params,function(pres){
                if(pres.status==200){
                     that.$router.push('/systemHome/resourceMng/'+that.$route.params.viewType+'/'+that.$route.params.viewId);
                }else{
                   that.$message({
                        type: 'error',
                        message: pres.exception,
                    });
                }
            });
        },
        packData:function(){    
            var that = this;
            var selfBaiscData  = that.allData.selfBasicData;
            var selfBaiscNow = that.selfBasicData; 
            for(var p1 in selfBaiscData){
                for(var p2 in selfBaiscData[p1]){
                   if(selfBaiscNow[p2].type==3){
                       selfBaiscNow[p2].value = selfBaiscNow[p2].value-0
                   }
                   selfBaiscData[p1][p2] = selfBaiscNow[p2]
                }
            }
            var selfDimData  = that.allData.selfDimData;
            var selfDimNow = that.selfDimData; 
            for(var p1 in selfDimData){
                for(var p2 in selfDimData[p1]){
                   if(selfDimNow[p2].type==3){
                       selfDimNow[p2].value = selfDimNow[p2].value-0
                   }
                   selfDimData[p1][p2] = selfDimNow[p2]
                }
            }
            var inheritBasicData  = that.allData.inheritBasicData;
            var inheritBasicNow = that.inheritBasicData; 
            for(var p1 in inheritBasicData){
                for(var p2 in inheritBasicData[p1]){
                    if(inheritBasicNow[p2].type==3){
                       inheritBasicNow[p2].value = inheritBasicNow[p2].value-0
                    }
                    inheritBasicData[p1][p2] = inheritBasicNow[p2]
                }
            }
            var inheritDimData  = that.allData.inheritDimData;
            var inheritDimNow = that.inheritDimData; 
            for(var p1 in inheritDimData){
                for(var p2 in inheritDimData[p1]){
                    if(inheritDimNow[p2].type==3){
                       inheritDimNow[p2].value = inheritDimNow[p2].value-0
                    }
                    inheritDimData[p1][p2] = inheritDimNow[p2]
                }
            }
            var packData = {
                selfBasicData:selfBaiscData,
                selfDimData:selfDimData,
                inheritBasicData:inheritBasicData,
                inheritDimData:inheritDimData,
            }
            return packData;
        },
        updateData:function(){
            var that = this;
            var params = that.packData();
            apiClient.linkApi('ssiteapi/platform/asset/info/update','POST',params,function(pres){
                
                if(pres.status==200){
                     that.$router.push('/systemHome/resourceMng/'+that.$route.params.viewType+'/'+that.$route.params.viewId);
                }else{
                   that.$message({
                        type: 'error',
                        message: pres.exception,
                    });
                }
            });
        },
        cancleBtn:function(){
            this.$router.go(-1);
        },
        scrollRight:function(boxName){
            var that = this;
            var num  = that.scrollNum[boxName]-80;
            $('#rightContent').animate({scrollTop:num},500);
        }
    },
    filters: {
    }
}
</script>
<style scoped>
.resourceInfo{
    width: 100%;
    height: 100%;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    border-top: solid 1px #e6e6e6;
}
.contentField{
    width: 100%;
    padding-top: 20px;
    height: calc(100% - 50px);
    margin-top: 10px;
    background: #ffffff;
    border-radius: 2px 2px 0px 0px;
    box-shadow: 0px 0px 9px 0px 
    rgba(16, 129, 250, 0.1);
}
.leftField{
    width: 14%;
    border-right: 2px solid #e5e5e5;
    display: inline-block;
    float: left;
    height: 100%;
}
.rightField{
    width: 85%;
    display: inline-block;
    float: right;
    height: 100%;
}
.rightContentField{
    width: 100%;
    padding: 0px 30px;
     height: calc(100% - 50px);
    overflow: auto;
}
.anchorTitle{
    width: 60%;
    border-bottom: 1px solid #9fcdfd;
    height: 40px;
    line-height: 40px;
    margin: 10px auto;
    font-size: 14px;
    color: #1081fa;
}
.anchorTitle .iconfont{
    margin:0px 10px;
}
.anchorItem{
    width: 100%;
    line-height: 40px;
    color: #666;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 25px;
}
.anchorItem .anchorName{
    cursor: pointer;
    font-size: 14px;
    color:#333333;
}
.anchorItem .anchorName:hover{
    color: #1081fa;
}
.anchorItem li {
    text-align: left;
    padding-left: 60px;
}
.rightTitle{
    width: 52.5%;
    color: #333333;
    margin-left: 7%;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #c2c1c1;
    margin-top: 10px;
}
.resCollapse{
    padding: 0px 20px;
    margin: 0 auto;
}
.formSubField{
    padding-left: 49%;
    margin: 40px 0px;
}
.attrForm{
    width: 60%;
}
.errorIcon {
    font-size: 10px;
}
.successIcon{
    font-size: 14px;
}
</style>
<style>
.attrForm .el-select{
    width: 100%!important;
} 
.attrForm .el-date-editor{
    width: 100%!important;
}
.resCollapse{
    border-top:none!important;
    border-bottom:none!important;
}
.resCollapse .el-collapse-item__arrow{
    float: left!important;
}
.resCollapse .el-collapse-item__header.is-active{
    border-bottom:none!important;
    margin-left: 6%;
}
.resCollapse .el-collapse-item__wrap{
    border-bottom:none!important;
}
.resCollapse .el-collapse-item__header{
    border-bottom:none!important;
    margin-left: 6%;
}
.resCollapse  .el-collapse-item__content{
    padding-bottom: 5px!important
}
.resCollapse .el-collapse-item__header{
    display:inline-block;
    margin-left: 6%;
}
</style>
