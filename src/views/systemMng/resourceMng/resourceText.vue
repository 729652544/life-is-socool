<template>
  <div class="resourceText">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
            <div class="leftField">
                <div class="anchorTitle"><span class="iconfont icon-guzhangbaojing"></span>继承属性</div>
                <ul class="anchorItem">
                    <li><span class="anchorName" @click="scrollRight('inheritBasicTitle')">基本属性</span></li>
                    <li><span class="anchorName" @click="scrollRight('inheritDimTitle')">维度属性</span></li>
                </ul>
                <div class="anchorTitle"><span class="iconfont icon-guzhangbaojing"></span>自身属性</div>
                <ul class="anchorItem">
                    <li><span class="anchorName" @click="scrollRight('selfBasicTitle')">基本属性</span></li>
                    <li><span class="anchorName" @click="scrollRight('selfDimTitle')">维度属性</span></li>
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
                            <div class="infoField">
                                <div 
                                    v-for="(val1, p1)  in inheritBasicData"
                                    :key="p1">
                                    <div 
                                        class="perInfo"
                                        v-for="(val2, p2)  in val1"
                                        :key="p2"
                                        v-show="val2.IsVisible==1">
                                        <div class="leftInfo">{{val2.name}}</div>
                                        <div class="rightInfo" v-if="val2.type==4">{{val2.dicName}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==5">{{val2.dicNames}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==6">
                                            <img :src="imgBath+val2.value" class="imgShow" v-if="val2.value!==''&&val2.value!==null" />
                                            <span class="imgName"  v-if="val2.value!==''&&val2.value!==null">{{val2.value.split('/').reverse()[0].substring(13)}} </span>
                                        </div>
                                        <div class="rightInfo" v-else-if="val2.type==7">{{val2.value|dateFormat}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==10">{{val2.mountName}}</div>
                                        <div class="rightInfo" v-else>{{val2.value}}</div>
                                    </div>
                                </div>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="inh_dim">
                            <template slot="title">
                                <span id="inheritDimTitle">维度属性</span>
                            </template>
                            <div class="infoField">
                                <div 
                                    v-for="(val1, p1)  in inheritDimData"
                                    :key="p1">
                                    <div 
                                        class="perInfo"
                                        v-for="(val2, p2)  in val1"
                                        :key="p2"
                                        v-show="val2.IsVisible==1">
                                        <div class="leftInfo">{{val2.name}}</div>
                                        <div class="rightInfo" v-if="val2.type==4">{{val2.dicName}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==5">{{val2.dicNames}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==6">
                                            <img :src="imgBath+val2.value" class="imgShow" v-if="val2.value!==''&&val2.value!==null" />
                                            <span class="imgName"  v-if="val2.value!==''&&val2.value!==null">{{val2.value.split('/').reverse()[0].substring(13)}} </span>
                                        </div>
                                        <div class="rightInfo" v-else-if="val2.type==7">{{val2.value|dateFormat}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==10">{{val2.mountName}}</div>
                                        <div class="rightInfo" v-else>{{val2.value}}</div>
                                    </div>
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <div class="rightTitle">自身属性</div>
                    <el-collapse class="resCollapse"  v-model="selfNames">
                        <el-collapse-item name="self_basic">
                            <template slot="title">
                                <span id="selfBasicTitle">基本属性</span>
                            </template>
                            <div class="infoField">
                                <div 
                                    v-for="(val1, p1)  in selfBasicData"
                                    :key="p1">
                                    <div 
                                        class="perInfo"
                                        v-for="(val2, p2)  in val1"
                                        :key="p2"
                                        v-show="val2.IsVisible==1">
                                        <div class="leftInfo">{{val2.name}}</div>
                                        <div class="rightInfo" v-if="val2.type==4">{{val2.dicName}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==5">{{val2.dicNames}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==6">
                                            <img :src="imgBath+val2.value" class="imgShow" v-if="val2.value!==''&&val2.value!==null" />
                                            <span class="imgName"  v-if="val2.value!==''&&val2.value!==null">{{val2.value.split('/').reverse()[0].substring(13)}} </span>
                                        </div>
                                        <div class="rightInfo" v-else-if="val2.type==7">{{val2.value|dateFormat}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==10">{{val2.mountName}}</div>
                                        <div class="rightInfo" v-else>{{val2.value}}</div>
                                    </div>
                                </div>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="self_dim">
                            <template slot="title">
                                <span id="selfDimTitle">维度属性</span>
                            </template>
                            <div class="infoField">
                                <div 
                                    v-for="(val1, p1)  in selfDimData"
                                    :key="p1">
                                    <div 
                                        class="perInfo"
                                        v-for="(val2, p2)  in val1"
                                        :key="p2"
                                        v-show="val2.IsVisible==1">
                                        <div class="leftInfo">{{val2.name}}</div>
                                        <div class="rightInfo" v-if="val2.type==4">{{val2.dicName}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==5">{{val2.dicNames}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==6">
                                            <img :src="imgBath+val2.value" class="imgShow" v-if="val2.value!==''&&val2.value!==null" />
                                            <span class="imgName"  v-if="val2.value!==''&&val2.value!==null">{{val2.value.split('/').reverse()[0].substring(13)}} </span>
                                        </div>
                                        <div class="rightInfo" v-else-if="val2.type==7">{{val2.value|dateFormat}}</div>
                                        <div class="rightInfo" v-else-if="val2.type==10">{{val2.mountName}}</div>
                                        <div class="rightInfo" v-else>{{val2.value}}</div>
                                    </div>
                                </div>
                            </div>
                        </el-collapse-item>
                        
                    </el-collapse>
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
import cPicture from '@/components/common/formItem/cPicture'
import cMount from '@/components/common/formItem/cMount'
import Constants from '@/publicJs/Constants.js'

import Vue from 'vue' 

export default {
    name:'resourceText',
    data(){
        return{
            // aryBread:[
            //     {name:'系统设置',url:'/systemHome'},
            //     {name:'资源管理',url:'/systemHome/resourceMng'},
            //     {name:'资源录入',url:''},
            // ],
            selfNames:['self_dim','self_basic'],
            inhNames:['inh_dim','inh_basic'],
            classname:'',
            resId:'',
            type:'',
            selfBasicData:{
            },
            selfDimData:{
            },
            inheritBasicData:{ 
            },
            inheritDimData:{
            },
            allData:{},
            scrollNum:{
            },
            imgBath:Constants.imgUrl,
        }
    },
    watch:{

    },
    computed:{
        aryBread:function(){
            var ary = [
                {name:'系统设置',url:''},
                {name:'资源管理',url:'/systemHome/resourceMng/'+this.$route.params.viewType+'/'+this.$route.params.viewId},
                {name:'资源详情',url:''}
            ];
            return ary;
        },
    },
    components: {
        commonBread,
        commonFooter,
    },
    created() {
        this.classname = this.$route.params.classname;
        this.resId = this.$route.params.resid;
        this.getAttrById();
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
        getAttrById:function(){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/info/getDataById/'+that.resId+'/'+that.classname,{},function(pres){
                that.selfBasicData = pres.results.selfBasicData;
                that.selfDimData = pres.results.selfDimData;
                that.inheritBasicData = pres.results.inheritBasicData;
                that.inheritDimData = pres.results.inheritDimData;
                setTimeout(function(){
                    that.scrollNum={
                        inheritBasicTitle:$("#inheritBasicTitle").position().top,
                        inheritDimTitle:$("#inheritDimTitle").position().top,
                        selfBasicTitle:$("#selfBasicTitle").position().top,
                        selfDimTitle:$("#selfDimTitle").position().top,
                    }
                },200);
                that.DoData(that.selfBasicData);
                that.DoData(that.selfDimData);
                that.DoData(that.inheritBasicData);
                that.DoData(that.inheritDimData);
            });
        },
        DoData:function(Data){
             for(var p1 in Data){
                for(var p2 in Data[p1]){
                    if(Data[p1][p2].type==4){
                        this.getDicName(Data[p1][p2]);
                    }else if(Data[p1][p2].type==5){
                        this.getDoubleDicName(Data[p1][p2]);
                    }else if(Data[p1][p2].type==10){
                        this.getMountName(Data[p1][p2]);
                    }
                }
            }
        },
        getDicName:function(obj){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/dict/listItemByDictId/'+obj.dicId,{},function(pres){
                var ary = pres.results;
                $.each(ary,function(i){
                    if(ary[i].itemId==obj.value){
                         Vue.set(obj, 'dicName', ary[i].itemName)  
                    }
                })
            });
        },
        getDoubleDicName:function(obj){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/dict/listItemByDictId/'+obj.dicId,{},function(pres){
               
                var ary = pres.results;
                var preAry = obj.value.split(',');
                var aftAry = [];
                preAry.forEach(function(item,i){
                    ary.forEach(function(item2,j){
                        if(item2.itemId==item){
                            aftAry.push(item2.itemName);
                        }
                    })
                })
                Vue.set(obj, 'dicNames', aftAry.join(','));
            });
        },
        getMountName:function(obj){
            var that = this;
            var classname = this.$route.params.classname;
             apiClient.get('ssiteapi/platform/asset/info/listMountByClassName/'+classname,{},function(pres){
                var ary = pres.results;
                $.each(ary,function(i){
                    if(ary[i].res_id==obj.value){
                         Vue.set(obj, 'mountName', ary[i].res_name)  
                    }
                })
            });
        },
        scrollRight:function(boxName){
            var that = this;
            var num  = that.scrollNum[boxName]-80;
            $('#rightContent').animate({scrollTop:num},500);
        },
    },
    filters: {
        //时间格式化
        dateFormat: function (value) {
            if(value!==''&&value!==0&value!==null){
                return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
            }else {
                return ''
            }
        },
    }
}
</script>
<style scoped>
.resourceText{
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
    width: 80%;
    border-bottom: 1px solid #9fcdfd;
    height: 40px;
    line-height: 40px;
    margin: 10px auto;
    font-size: 14px;
    color: #1081fa;
}
.anchorTitle .iconfont{
    margin:0px 10px;
    font-size: 14px;
}
.anchorItem{
    width: 100%;
    line-height: 40px;
    color: #666;
    text-align: left;
    padding-left: 60px;
    margin-top: 10px;
    margin-bottom: 25px;
    font-size: 14px;
}
.anchorItem .anchorName{
    cursor: pointer;
}
.anchorItem .anchorName:hover{
    color: #1081fa;
}
.rightTitle{
    width: 50.8%;
    margin-left: 7%;
    color: #666;
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
    text-align: right;
    margin: 40px 0px;
}
.infoField{
    width: 700px;
    margin-left: 6%;
}
.perInfo:first-child{
     border-top: solid 1px #dcdcdc;
}
.perInfo{
    width: 100%;
    border-bottom: solid 1px #dcdcdc;
    border-right: solid 1px #dcdcdc;
    border-left: solid 1px #dcdcdc;
    /* background-color: #f7f7f9; */
    position: relative;
    padding-left: 100px;
    min-height: 46px;
}
.perInfo .leftInfo{
    width: 100px;
    display: inline-block;
    float: left;
    height: 100%;
    color: #b0aeae;
    padding: 0px 10px;
    background: #f7f7f9;
    line-height: 40px;
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
}
.perInfo .rightInfo{
    width: 595px;
    display: inline-block;
    line-height: 40px;
    padding: 0px 10px;
    color: #666;
    background: #ffffff;
    min-height: 40px;
}
.imgShow{
    width: 90px;
    height: 90px;
    margin: 5px;
    display: inline-block;
    border-radius: 5px;
    float: left;
}
.imgName{
    line-height: 100px;
    padding: 0px 10px;
}
</style>
<style>
.resCollapse{
    border-top:none!important;
    border-bottom:none!important;
}
.resCollapse .el-collapse-item__arrow{
    float: left!important;
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
