<template>
  <div class="dimensionAttr">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
            <el-collapse :class="type=='res'?'wideCollapse':'basicCollapse'" v-model="activeNames" >
                <el-collapse-item title="继承属性" name="0" v-if="type=='res'">
                    <el-collapse class="basicCollapse" v-if="type=='res'" v-model="basicNames">
                        <el-collapse-item name="inh_dim">
                            <template slot="title">
                                维度属性
                            </template>
                            <el-table
                                :data="inhDimData"  
                                header-row-class-name="sHeader"
                                row-class-name="attrTabel sRow cp"
                                border
                                >
                                <el-table-column
                                    prop="propertyTitle"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="维度属性">
                                </el-table-column>
                                <el-table-column
                                    prop="dimClassName"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="维度类名">
                                </el-table-column>
                                <el-table-column
                                    prop="dimDbTableName"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="维度表名">
                                </el-table-column>
                                <el-table-column
                                    prop="propertyIsvisible"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="是否可见">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.propertyIsvisible==0?'否':'是'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="dimPropertyNum"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="属性个数">
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                        <el-collapse-item name="inh_basic">
                            <template slot="title">
                                基本属性
                            </template>
                            <el-table
                                :data="inhBasicData"
                                header-row-class-name="sHeader"
                                row-class-name="attrTabel sRow cp"
                                border
                                >
                                <el-table-column
                                    prop="propertyTitle"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="名称">
                                </el-table-column>
                                <el-table-column
                                    prop="dbFiledname"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="字段名称">
                                </el-table-column>
                                <el-table-column
                                    prop="propertyFiledType"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="字段类型">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.propertyFiledType==1">文本型</span>
                                        <span v-if="scope.row.propertyFiledType==2">字符型</span>
                                        <span v-if="scope.row.propertyFiledType==3">数值型</span>
                                        <span v-if="scope.row.propertyFiledType==4">字典项（单选）</span>
                                        <span v-if="scope.row.propertyFiledType==5">字典型（多选）</span>
                                        <span v-if="scope.row.propertyFiledType==6">图片型</span>
                                        <span v-if="scope.row.propertyFiledType==7">时间型</span>
                                        <span v-if="scope.row.propertyFiledType==8">坐标型</span>
                                        <span v-if="scope.row.propertyFiledType==9">维度</span>
                                        <span v-if="scope.row.propertyFiledType==10">挂载</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="propertyIsvisible"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="是否可见">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.propertyIsvisible==0?'否':'是'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="propertyIsRequired"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="是否必填">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.propertyIsRequired==0?'否':'是'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="isDisplayItem"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="是否显示">
                                    <template slot-scope="scope">
                                       <span>{{scope.row.propertyIsRequired==0?'否':'是'}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                    <el-table
                        :data="inhBasicData"
                        v-if="type=='dim'"
                        header-row-class-name="sHeader"
                        row-class-name="attrTabel sRow cp"
                        border
                        >
                        <el-table-column
                            prop="propertyTitle"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="名称">
                        </el-table-column>
                        <el-table-column
                            prop="dbFiledname"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="字段名称">
                        </el-table-column>
                        <el-table-column
                            prop="propertyFiledType"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="字段类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.propertyFiledType==1">文本型</span>
                                <span v-if="scope.row.propertyFiledType==2">字符型</span>
                                <span v-if="scope.row.propertyFiledType==3">数值型</span>
                                <span v-if="scope.row.propertyFiledType==4">字典项（单选）</span>
                                <span v-if="scope.row.propertyFiledType==5">字典型（多选）</span>
                                <span v-if="scope.row.propertyFiledType==6">图片型</span>
                                <span v-if="scope.row.propertyFiledType==7">时间型</span>
                                <span v-if="scope.row.propertyFiledType==8">坐标型</span>
                                <span v-if="scope.row.propertyFiledType==9">维度</span>
                                <span v-if="scope.row.propertyFiledType==10">挂载</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="propertyIsvisible"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="是否可见">
                            <template slot-scope="scope">
                                <span>{{scope.row.propertyIsvisible==0?'否':'是'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="propertyIsRequired"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="是否必填">
                            <template slot-scope="scope">
                                <span>{{scope.row.propertyIsRequired==0?'否':'是'}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item title="自身属性" name="1">
                    <template slot="title">
                        自身属性
                        <el-button v-if="type=='dim'" class="fr" @click.stop="newAttr('res')">新建</el-button>
                    </template>
                   <el-collapse class="basicCollapse" v-if="type=='res'" v-model="basicNames">
                        <el-collapse-item name="self_dim">
                            <template slot="title">
                                维度属性
                                <el-button type='primary' class="fr newBox" @click.stop="newAttr('dim')">新建</el-button>
                            </template>
                            <el-table
                                :data="selfDimData"  
                                header-row-class-name="sHeader"
                                row-class-name="attrTabel sRow cp"
                                border
                                >
                                <el-table-column
                                    prop="propertyTitle"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="维度属性">
                                </el-table-column>
                                <el-table-column
                                    prop="dimClassName"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="维度类名">
                                </el-table-column>
                                <el-table-column
                                    prop="dimDbTableName"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="维度表名">
                                </el-table-column>
                                <el-table-column
                                    prop="propertyIsvisible"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="是否可见">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.propertyIsvisible==0?'否':'是'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="dimPropertyNum"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="属性个数">
                                </el-table-column>
                                <el-table-column
                                    prop="oper"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <span class="oper">
                                            <span class="iconfont" @click.stop="clickEdit(scope.row,'dim')">编辑</span>
                                            <span class="iconfont" @click.stop="clickDelete(scope.row,'dim')">删除</span>
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                        <el-collapse-item name="self_basic">
                            <template slot="title">
                                基本属性
                                <el-button type='primary' class="fr newBox" @click.stop="newAttr('res')">新建</el-button>
                            </template>
                            <el-table
                                :data="selfBasicData"
                                header-row-class-name="sHeader"
                                row-class-name="attrTabel sRow cp"
                                border
                                >
                                <el-table-column
                                    prop="propertyTitle"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="名称">
                                </el-table-column>
                                <el-table-column
                                    prop="dbFiledname"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="字段名称">
                                </el-table-column>
                                <el-table-column
                                    prop="propertyFiledType"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="字段类型">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.propertyFiledType==1">文本型</span>
                                        <span v-if="scope.row.propertyFiledType==2">字符型</span>
                                        <span v-if="scope.row.propertyFiledType==3">数值型</span>
                                        <span v-if="scope.row.propertyFiledType==4">字典项（单选）</span>
                                        <span v-if="scope.row.propertyFiledType==5">字典型（多选）</span>
                                        <span v-if="scope.row.propertyFiledType==6">图片型</span>
                                        <span v-if="scope.row.propertyFiledType==7">时间型</span>
                                        <span v-if="scope.row.propertyFiledType==8">坐标型</span>
                                        <span v-if="scope.row.propertyFiledType==9">维度</span>
                                        <span v-if="scope.row.propertyFiledType==10">挂载</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="propertyIsvisible"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="是否可见">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.propertyIsvisible==0?'否':'是'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="propertyIsRequired"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="是否必填">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.propertyIsRequired==0?'否':'是'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="isDisplayItem"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="是否显示">
                                    <template slot-scope="scope">
                                        <el-switch
                                            v-model="scope.row.isDisplayItem"
                                            active-color="#1081fa" 
                                            inactive-color="#fc5830"
                                            :active-value="1"
                                            :inactive-value="0"
                                            @change="displayChange(scope.row)">
                                        </el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="oper"
                                    :align="'left'"
                                    :show-overflow-tooltip="true"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <span class="oper">
                                            <span class="iconfont" @click.stop="clickEdit(scope.row,'res')">编辑</span>
                                            <span class="iconfont" @click.stop="clickDelete(scope.row,'res')">删除</span>
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                    <el-table
                        :data="selfBasicData"
                        v-if="type=='dim'"
                        header-row-class-name="sHeader"
                        row-class-name="attrTabel sRow cp"
                        border
                        >
                        <el-table-column
                            prop="propertyTitle"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="名称">
                        </el-table-column>
                        <el-table-column
                            prop="dbFiledname"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="字段名称">
                        </el-table-column>
                        <el-table-column
                            prop="propertyFiledType"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="字段类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.propertyFiledType==1">文本型</span>
                                <span v-if="scope.row.propertyFiledType==2">字符型</span>
                                <span v-if="scope.row.propertyFiledType==3">数值型</span>
                                <span v-if="scope.row.propertyFiledType==4">字典项（单选）</span>
                                <span v-if="scope.row.propertyFiledType==5">字典型（多选）</span>
                                <span v-if="scope.row.propertyFiledType==6">图片型</span>
                                <span v-if="scope.row.propertyFiledType==7">时间型</span>
                                <span v-if="scope.row.propertyFiledType==8">坐标型</span>
                                <span v-if="scope.row.propertyFiledType==9">维度</span>
                                <span v-if="scope.row.propertyFiledType==10">挂载</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="propertyIsvisible"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="是否可见">
                            <template slot-scope="scope">
                                <span>{{scope.row.propertyIsvisible==0?'否':'是'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="propertyIsRequired"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="是否必填">
                            <template slot-scope="scope">
                                <span>{{scope.row.propertyIsRequired==0?'否':'是'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="isDisplayItem"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="是否显示">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.isDisplayItem"
                                    active-color="#1081fa" 
                                    inactive-color="#fc5830"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="displayChange(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="oper"
                            :align="'left'"
                            :show-overflow-tooltip="true"
                            label="操作">
                            <template slot-scope="scope">
                                <span class="oper">
                                    <span class="iconfont" @click.stop="clickEdit(scope.row,'res')">编辑</span>
                                    <span class="iconfont" @click.stop="clickDelete(scope.row,'res')">删除</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </div>
        <common-footer></common-footer>
  </div>
</template>
<script>

import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
import UtilService from '@/publicJs/UtilService'


export default {
    name:'dimensionAttr',
    data(){
        return{
            type:'dim',
            activeNames:['1'],
            classname:'',
            inhNames:['inh_dim','inh_basic'],
            basicNames:['self_dim','self_basic'],
            selfDimData:[],
            selfBasicData:[],
            inhDimData:[],
            inhBasicData:[],
        }
    },
    watch:{
        
    },
    computed:{
        aryBread:function(){
            var str = this.$route.params.type=='dim'?'维度':'资源';
            var ary = [
                {name:'系统设置',url:'/systemHome'},
                {name:'模型管理',url:'/systemHome/modelMng/'+this.$route.params.type},
            ];
            ary.push({name:str+'属性页',url:''});
            this.classname = this.$route.params.classname;
            return ary;
        }
    },
    components: {
        commonBread,
        commonFooter,
    },
    mounted() {
        this.type = this.$route.params.type;
        this.getPropData();
    },
    methods:{
       newAttr:function(type){
           this.$router.push('/systemHome/attrInfo/'+type+'/add/'+this.classname+'/null');
       },
       getPropData:function(){
           var that = this;
           var loading = that.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(255,255, 255, 0.6)'
            });
           apiClient.get('ssiteapi/platform/asset/property/listByClassName/'+that.classname,'',function(pres){
               var selfData = pres.results.selfList;
               var inhData = pres.results.inheritList;
               var selfDimData=[];
               var selfBasicData = [];
               $.each(selfData,function(i){
                   if(selfData[i].propertyGroup=='dim'){
                       selfDimData.push(selfData[i]);
                   }else if(selfData[i].propertyGroup=='res'){
                       selfBasicData.push(selfData[i]);
                   }
               })
               that.selfDimData = selfDimData;
               that.selfBasicData = selfBasicData;

                var inhDimData = [];
                var inhBasicData = [];
               $.each(inhData,function(i){
                   if(inhData[i].propertyGroup=='dim'){
                       inhDimData.push(inhData[i]);
                   }else if(inhData[i].propertyGroup=='res'){
                       inhBasicData.push(inhData[i]);
                   }
               })
               that.inhDimData = inhDimData;
               that.inhBasicData = inhBasicData;
               loading.close();
           })
       },
       clickEdit:function(row,type){
           this.$router.push('/systemHome/attrInfo/'+type+'/edit/'+this.classname+'/'+row.propertyTitle);
       },
       clickDelete:function(row,type){
           var that = this;
           that.$confirm('确定删除当前属性，删除后不可恢复?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var apiUrl = ''
                if(type=='dim'){
                    apiUrl = 'ssiteapi/platform/asset/property/removeDim/'+that.classname+'/'+row.dimClassName;
                }else{
                     apiUrl = 'ssiteapi/platform/asset/property/remove/'+row.dbFiledname+'/'+that.classname;
                }
                apiClient.linkApi(apiUrl,'delete',{},function(pres){
                    if(pres.status==200){
                        that.getPropData();
                        that.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    }else if(pres.status==5006){
                        that.$message({
                            type: 'error',
                            message: pres.exception
                        });
                    }
                });
            });
       },
       displayChange:function(row){
           var that = this;
           var param = {
               isDisplayItem:row.isDisplayItem,
               className:row.className,
               dbFiledname:row.dbFiledname,
           }
            apiClient.linkApi('ssiteapi/platform/asset/property/updateDisplayItem','post',param,function(pres){
                if(pres.status==200){
                    that.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                }else{
                    that.getPropData();
                    that.$message({
                        type: 'error',
                        message: '修改失败'
                    });
                }
            })
       }
    },
    filters: {
    }
}
</script>
<style scoped>
.dimensionAttr{
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
    padding: 10px;
    overflow: auto;
}
.basicCollapse{
    width: 100%;
    padding: 10px 10px;
}
.oper .iconfont{
    margin-right: 10px;
    color:#1081fa;
    font-size: 12px;
}
</style>
<style>
.wideCollapse{
    border-top:none!important;
    border-bottom:none!important;
}
.wideCollapse .el-collapse-item__arrow{
    float: left!important;
}
.wideCollapse .el-collapse-item__header.is-active{
    border-bottom-color:#ebeef5!important;
}
.wideCollapse .el-collapse-item__wrap{
    border-bottom:none!important;
}
.wideCollapse .el-collapse-item__content{
    padding-bottom: 5px!important
}
.basicCollapse{
    border-top:none!important;
    border-bottom:none!important;
}
.basicCollapse .el-collapse-item__arrow{
    float: left!important;
}
.basicCollapse .el-collapse-item__header.is-active{
    border-bottom:none!important;
}
.basicCollapse .el-collapse-item__wrap{
    border-bottom:none!important;
}
.basicCollapse .el-collapse-item__header{
    border-bottom:none!important;
}
.basicCollapse  .el-collapse-item__content{
    padding-bottom: 5px!important
}

.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right:none!important;
}
</style>