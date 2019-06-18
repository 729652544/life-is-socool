<template>
  <div class="modelMng">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
           <div class="tableOper">
                <div class="typeNav" :class="nowType=='res'?'active':''" @click="selectTypeNav('res')">资源模型</div>
                <div class="typeNav"  :class="nowType=='dim'?'active':''"  @click="selectTypeNav('dim')">维度模型</div>
                <div class="fr">
                    <el-button type='primary' @click="clickAddModel">新建</el-button>
                    <el-button type='primary' @click="clickEditModel">编辑</el-button>
                    <el-button type='primary' @click="clickDelModel">删除</el-button>
                </div>
           </div>
           <div  class="tableData">
               <el-table  
                    :data="tableData"  
                    style="width: 100%"  
                    height="100%"
                    row-key="id"
                    header-row-class-name="sHeader"
                    :row-class-name="rowClassName"
                    @row-click="rowClick"
                    :row-style="showTr"
                   >  
                    <el-table-column 
                        v-for="(column, index) in columns" 
                        :key="column.dataIndex" 
                        align="left"
                        show-overflow-tooltip
                        :label="column.text"> 
                        <template slot-scope="scope">  
                            <span  @click="toggle(scope.$index)">
                                 <span v-if="spaceIconShow(index)"  v-for="(space, levelIndex) in scope.row.level" :key="levelIndex" class="ms-tree-space"></span>  
                                <span class="" v-show="toggleIconShow(index,scope.row)">  
                                    <i v-show="!scope.row.expanded" class="el-icon-caret-right" aria-hidden="true"></i>  
                                    <i v-show="scope.row.expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>  
                                </span>  
                                {{scope.row[column.dataIndex]}}  
                            </span>
                        </template>  
                    </el-table-column> 
                    <!-- <el-table-column 
                        v-for="(column) in columns" 
                        :key="column.dataIndex" 
                        align="left"
                        show-overflow-tooltip
                        :label="column.text"> 
                        <template slot-scope="scope">  
                           {{scope.row[column.dataIndex]}}  
                        </template>  
                    </el-table-column>    -->
                    <el-table-column
                        prop="operColumn"
                        :align="'left'"
                        show-overflow-tooltip
                        label="操作">
                        <template slot-scope="scope">
                            <span  v-if="scope.row.parentId!=='0'&&scope.row.parentId" :class="scope.row.isvn==1?'grayattrBtn':'attrBtn'" @click="scope.row.isvn==1?'':clickAttr(scope.row)">属性</span>
                        </template>
                    </el-table-column>
                </el-table> 
           </div>
           <!-- <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource"></tree-grid>  -->
        </div>
        <common-footer></common-footer>
  </div>
</template>
<script>
import Vue from 'vue' 
import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
import UtilService from '@/publicJs/UtilService'

import eventBus from '@/publicJs/eventBus.js'

export default {
    name:'modelMng',
    data(){
        return{
            aryBread:[
                {name:'系统设置',url:'/systemHome'},
                {name:'模型管理',url:''},
            ],
            nowType:'res',
            columns: [{  
                text: '名称',  
                dataIndex: 'classcnname'  
            },
            {  
                text: '类名',  
                dataIndex: 'classname'  
            },{  
                text: '表名',  
                dataIndex: 'tablename'  
            },{  
                text: '是否可见',  
                dataIndex: 'isvisibleText'  
            },{  
                text: '是否虚对象',  
                dataIndex: 'isvnText'  
            }
            ],  
            currentRow:{},
            tableData:[],
        }
    },
    watch:{

    },
    components: {
        commonBread,
        commonFooter,
    },
    mounted() {
        this.nowType = this.$route.params.type;
        this.getModelList();
    },
    methods:{
        selectTypeNav:function(type){
             var that = this;
             that.nowType = type;
             that.getModelList();
        },
        spaceIconShow (index) {   
            if (index === 0) {  
            return true  
            }  
            return false  
        },
        // 点击展开和关闭的时候，图标的切换  
        toggleIconShow (index, record) { 
            return index === 0 && record.children && record.children.length > 0;
        },    
        // 展开下级  
        toggle: function (trIndex) {  
            let me = this  
            let record = me.tableData[trIndex]  
            record.expanded = !record.expanded ;
        },  
        // 显示行   
        showTr: function (row, index) {
            // console.log('4444444444-----'+new Date().getTime());  
            const show = row.row.parentId? row.row.parents.expanded && row.row.parents.show:true;
            row.row.show = show;
            // console.log('555555555-----'+new Date().getTime());  
            return show ? '' : 'display:none;'  
        },  
        rowClassName:function(row,rowIndex){
            var str = '';
            if(row.row.id==this.currentRow.id){
                str = ' active'
            }
            return 'sRow cp'+str;
        },
        rowClick:function(row, event, column){
            this.currentRow = row;
        },
        clickAttr:function(row){
            this.$router.push('/systemHome/modelAttr/'+this.nowType+'/'+row.classname);
        },
        clickAddModel:function(){
            var that = this;
            if(that.currentRow.id){
                if(that.nowType=='dim'){
                    if(that.currentRow.id===1){
                        that.$router.push('/systemHome/modelInfo/'+that.nowType+'/add/'+that.currentRow.classname);
                    }else{
                        that.$message({
                            type: 'warning',
                            message: '维度属性无继承'
                        });
                    }
                }else{
                    that.$router.push('/systemHome/modelInfo/'+that.nowType+'/add/'+that.currentRow.classname);
                }
            }else{
                that.$message({
                    type: 'warning',
                    message: '请选择一项模型，以创建其子节点模型。'
                });
            }
        },
        clickEditModel:function(){
            var that = this;
            if(this.currentRow.id){
                if(this.currentRow.parentId===undefined||this.currentRow.parentId==0){
                    that.$message({
                        type: 'warning',
                        message: '该节点为根节点，不支持编辑'
                    });
                    return false;
                }
                that.$router.push('/systemHome/modelInfo/'+that.nowType+'/edit/'+that.currentRow.classname);
            }else{
                that.$message({
                    type: 'warning',
                    message: '请选择一项模型，作为编辑对象。'
                });
            }
        },
        clickDelModel:function(){
            var that = this;
            if(this.currentRow.id){
                if(this.currentRow.parentId===undefined||this.currentRow.parentId==0){
                    that.$message({
                        type: 'warning',
                        message: '该节点为根节点，不支持删除'
                    });
                    return false;
                }
                let haveChildren = false;
                for (let i = 0 ;i<that.tableData.length;i++){
                    if(that.tableData[i].parentId==this.currentRow.id){
                        haveChildren = true;
                    }
                }
                if(haveChildren){
                    that.$message({
                        type: 'warning',
                        message: '该节点有子节点，不支持删除'
                    });
                    return false;
                }
                that.$confirm('确定删除当前节点模型，删除后不可恢复?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apiClient.linkApi('ssiteapi/platform/asset/class/remove/'+that.currentRow.classname+'/'+that.currentRow.tablename,'delete',{},function(pres){
                        if(pres.status==200){
                            that.getModelList();
                            that.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                        }else if(pres.status== 5005){
                            that.$message({
                                type: 'warning',
                                message: '该节点已被挂载，不支持删除'
                            });
                        }else if(pres.status== 5006 ){
                            that.$message({
                                type: 'warning',
                                message: pres.exception,
                            });
                        }
                    });
                });
            }else{
                that.$message({
                    type: 'warning',
                    message: '请选择一项模型，作为删除对象。'
                });
            }
        },
        getModelList:function(){
            var that = this;
            var loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(255,255, 255, 0.6)'
            });
            apiClient.get('ssiteapi/platform/asset/class/queryDataByClassTag/'+that.nowType,'',function(pres){
                that.tableData = that.treeToAry([pres.results]);
                loading.close();
            });
        },
        treeToAry:function(data, parent, level, expandedAll){
            let tmp = []  
            let that = this;
            data.forEach(function (record) {  
                if(!record.parent){
                    Vue.set(record, 'parentId', undefined)  
                }   
                let _level = 0  
                if (level !== undefined && level !== null) {  
                _level = level + 1  
                }  
                Vue.set(record,'show',true)  
                Vue.set(record, 'level', _level)  
                for(var p in record.attributes){
                    if(!record.p){
                        Vue.set(record, p,record.attributes[p])  
                    }
                }
                Vue.set(record, 'isvisibleText',record.isvisible==0?'否':'是')  
                Vue.set(record, 'isvnText',record.isvn==0?'否':'是')  
                Vue.set(record, 'attributes',undefined);
                Vue.set(record, 'parents',parent)
                if (record.expanded === undefined) {  
                    if(_level>1){
                        Vue.set(record, 'expanded', false)  
                    }else{
                        Vue.set(record, 'expanded', true)  
                    }
                    
                }      
                tmp.push(record)  
                if (record.children && record.children.length > 0) {  
                    let children = that.treeToAry(record.children, record, _level, expandedAll)  
                    tmp = tmp.concat(children);  
                }  
            })  
            return tmp  
        }
  },
  filters: {
  }
}
</script>
<style scoped>
.modelMng{
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
.tableOper{
    width: 100%;
    height: 60px;
    padding: 0px 10px;
    line-height: 60px;
}
.tableOper .typeNav{
    height: 40px;
    line-height: 40px;
    margin-right: 30px;
    display: inline-block;
    float: left;
    text-align: center;
    cursor: pointer;
    color:#333333;
    font-size: 14px
}
.tableOper .active{
    color: #1081fa;
    border-bottom: 2px solid #1081fa;
}
.tableOper .fr {
    margin-right: 5px;
}
.tableData{
    height: calc(100% - 100px);
}
.ms-tree-space{position: relative;  
    top: 1px;  
    display: inline-block;  
    font-family: 'Glyphicons Halflings';  
    font-style: normal;  
    font-weight: 400;  
    line-height: 1;  
    width: 18px;  
    height: 14px;}  
.ms-tree-space::before{content: ""}  
table td{  
    line-height: 26px;  
}  
.attrBtn{
    display: inline-block; 
    color: #1081fa;
    text-align: center;
}
.grayattrBtn{
    display: inline-block; 
    color: #cdcccc;
    cursor: text;
}
.el-table--enable-row-transition .el-table__body td {
    padding: 0!important;
}
table .el-table td{
    padding: 0!important
}
</style>