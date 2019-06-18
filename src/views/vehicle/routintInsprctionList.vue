<template>
  <div class="routintInsprctionList">
      <common-bread class="topBread" :aryBread="aryBread"></common-bread>
      <div class="tableField">
          <div class="tableOper">
              
                <div class="fl statusOper">
                    <div class="topBox">
                        <common-select
                        :aryOper='aryStatusOper'
                        :currentOper='currentStatusOper'
                        @getDataInfo="statusChange"
                        @clearArr='clearStatus'
                        :openSelectBool='statusBool'
                        @showOptions='onlyStatus'
                        title="状态:"
                        ></common-select>
                        <common-select
                        :aryOper='aryGroupOper'
                        :currentOper='currentGroupOper'
                        @getDataInfo="GroupChange"
                        @clearArr='clearGroup'
                        :openSelectBool='GroupBool'
                        @showOptions='onlyGroup'
                        title="巡查班组:"
                        ></common-select>
                    </div>
                </div>
                <div class="fr">
                    <el-date-picker
                    v-model="routintInsprctionTime"
                    @change='changeDate'
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </div>
          </div>
          <div class="tableData">
            <el-table
                :data="aryRecordList"
                height="100%"
                max-height="100%" 
                header-row-class-name="sHeader"
                row-class-name="sRow cp"
                @row-click="rowClick"
                style="width: 100%">
                <el-table-column width="20"></el-table-column>
                <el-table-column
                    prop="workOrderId"
                    label="工单号"
                    :align="'left'"
                    show-overflow-tooltip
                   >
                </el-table-column>
                <el-table-column
                    prop="inspectionArea"
                    label="巡查区域"
                    :align="'left'"
                    show-overflow-tooltip
                   >
                   <template slot-scope="scope">
                       <span>{{scope.row.inspectionArea}}</span>
                   </template>
                </el-table-column>
                
                 <el-table-column
                    prop="inspectionPerson"
                    label="巡查人"
                    :align="'left'"
                    show-overflow-tooltip
                    >
                </el-table-column>
                <el-table-column
                    prop="inspectionTeamCn"
                    :align="'left'"
                    show-overflow-tooltip
                    label="巡查班组">
                </el-table-column>
                 <el-table-column
                    prop="inspectionStatus"
                    :align="'left'"
                    show-overflow-tooltip
                    label="巡查状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.inspectionStatus==1" class="statusTag managing">处理中</span>
                        <span v-if="scope.row.inspectionStatus==2" class="statusTag complete">已完成</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="assetCount"
                    :align="'left'"
                    show-overflow-tooltip
                    label="电杆数量">
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    :align="'left'"
                    show-overflow-tooltip
                    label="开始时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.startTime|dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="inspectionDuration"
                    :align="'left'"
                    show-overflow-tooltip
                    label="巡视时长">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.inspectionDuration|hourFormat}}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="sPage"       
                v-if="totalSchedule>10"        
                @current-change="handleCurrentChange"
                :current-page.sync="pageNow"
                :page-size="pageSize"
                :prev-text="'〈  上一页'" 
                :next-text="'下一页  〉'"
                layout="prev, pager, next"
                :total="totalSchedule">
            </el-pagination>
          </div>
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
import commonSelect from '@/components/common/commonSelect'

export default {
  name:'routintInsprctionList',
  data(){
      return{
          aryBread:[
              {name:'车载巡检',url:'/vehicle'},
              {name:'巡查记录',url:''},
          ],
          openSelectBool:false,
          currentStatusOper:[],
          currentGroupOper:[],
          statusBool:false,
          GroupBool:false,
          aryStatusOper:[{name:"处理中",id:1},{name:"已完成",id:2}],
          aryGroupOper:[],
          aryRecordList:[],
          pageSize:10,
          pageNow:1,
          totalSchedule:0,
          routintInsprctionTime:[],

      }
  },
  components: {
    commonBread,
    commonFooter,
    commonSelect,
  },
  created(){
    var that = this;
    //查列表
    that.getRoutintInsprctionList();
    //获取巡查班组
    that.getSearchGroup();
  },
  
  methods:{
    // 获取车巡记录
    getRoutintInsprctionList:function(){
        var that = this;
        var param = {
            pageSize: that.pageSize,
            pageNum: that.pageNow,
        };
        if(that.routintInsprctionTime&&that.routintInsprctionTime.length>0){
            param.startTime = that.routintInsprctionTime[0].getTime();
            param.endTime = that.routintInsprctionTime[1].getTime();
        }
        if(that.currentStatusOper.length>0){
            param.inspectionStatus = that.currentStatusOper
        }
        if(that.currentGroupOper.length>0){
            param.inspectionTeam = that.currentGroupOper
        }
        
        apiClient.post('ssiteapi/platform/prodInspection/listTaskWithPage',param,function(pres){
            if(pres.status==200){
                that.aryRecordList = pres.results.list;
                that.totalSchedule = pres.results.totalRecord;
            }
        });
    },
    //筛选
    onlyStatus(data){
        if(data == 1){
            this.statusBool = !this.statusBool;
            this.GroupBool = false;
        }else  {
            this.statusBool = false;
            this.GroupBool = false;
        }
    },
    clearStatus(){
        this.currentStatusOper = [];
        this.getRoutintInsprctionList();
    },
    statusChange(){
        this.pageNow = 1;
        this.getRoutintInsprctionList();
    },
    onlyGroup(data){
        if(data == 1){
            this.GroupBool = !this.GroupBool;
            this.statusBool = false;
        }else  {
            this.GroupBool = false;
            this.statusBool = false;
        }
    },
    clearGroup(){
        this.currentGroupOper = [];
        this.getRoutintInsprctionList();
    },
    GroupChange(){
        this.pageNow = 1;
        this.getRoutintInsprctionList();
    },
    //点击行记录跳详情页
    rowClick:function(row, event, column){
        this.$router.push({
            name:'routintInsprctionInfo',
            params:row
        })
    },
    //点击搜索
    searchSchedule:function(){
        var that = this;
        that.getRoutintInsprctionList()
        that.pageNow = 1;
        
    },
    //点击时间控件
    changeDate(val){
        var that = this;
        that.getRoutintInsprctionList();
    },
    //获取巡查班组；
    getSearchGroup(){
        var that = this;
        apiClient.post('ssiteapi/authm/role/getRole',{},function(pres){
            if(pres.status == 200){
                pres.results.forEach(function(item,ind){
                    if(item.roleName.indexOf('linet')>-1){
                        that.aryGroupOper.push({
                            id:item.roleName,
                            name:item.roleNameZh
                        })
                    }
                })
            }
        })
    },
    //页码跳转
    handleCurrentChange:function(val){
        this.pageNow = val;
        this.getRoutintInsprctionList();
    },
  },
    filters: {
        //时间格式化
        dateFormat: function (value) {
          if(value!==''&&value!==0){
            return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
          }else {
            return '暂无'
          }
        },
        hourFormat:function(value){
            if(value==''||value==undefined||value==0){
                return '--';
            }else{
                return (value-0)/(60*1000)>1?Math.floor((value-0)/(60*1000))+'分钟'+Math.ceil(( (value-0) % (1000 * 60)) / 1000)+'秒': Math.ceil(( (value-0) % (1000 * 60)) / 1000) +'秒';
            }
            
        }
    }
}
</script>
<style scoped>
    .routintInsprctionList{
        width: 100%;
        height: 100%;
        position: relative;
        background: #efefef;
        padding: 10px 10px 0px 10px;
    }  
    .tableField{
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
        padding: 0px 10px 0 10px;
        line-height: 60px;
    }
    .tableData{
        height: calc(100% - 100px);
        max-height: 580px;
    }
    .operBtn{
        width: 75px;
        height: 38px;
        border-radius: 5px;
        border: solid 1px #828282;
        color: #828282;
        display: inline-block;
        text-align: center;
        line-height: 38px;
        margin-left: 10px;
        cursor: pointer;
    }
    .statusOper .topBox {
        display: inline-block;
        font-size: 14px;
        margin-left: 15px;
        height: 60px;
        float: left;
    }
    .statusTag{
        width: 56px;
        height: 24px;
        border: 1px solid #000000;
        color:#000000;
        line-height: 24px;
        padding: 1px 5px;
    }
    .managing{
        color: #1081fa;
        border: 1px solid #1081fa;
    }
    .complete{
        color: #828282;
        border: 1px solid #828282;
    }
    .el-popper {
        margin-top: 0!important;
    }
    .el-button {
        float: left;
        margin-top: 12px;
    }
    
    .endlist {
        overflow: hidden;
    }
    /*结单详情*/
	.endlist>li{
        margin: 10px 10px;
        border: none;
		float: left;
		display: inline-block;
        word-break:keep-all;
        width: 100%;
		white-space:nowrap;
        text-overflow:ellipsis;
        overflow: hidden;
	}
	.endlist >li>span{
		border: none;
		display: inline-block;
	}
    .endlist>li>span:nth-child(1){
        width: 15% !important;
		text-align: right;
    }
    .endlist>li>span:nth-child(2){
        width:35% !important;
		text-align: left;
    }
    .endlist>li>span:nth-child(3){
        width: 15% !important;
        text-align: right;
    }
    .endlist>li>span:nth-child(4){
        width: 35% !important;
        text-align: left;
    }
    .twolist{
		width: 90% !important;
		border-right: none !important;
	}
    .formSubField {
        width: 100%;
        text-align: center;
        padding-left: calc(50% - 70px);
        margin-top: 40px;
        overflow: hidden;
        padding-bottom: 40px;
    }
    .diaLog>.el-dialog {
        height: 60%!important;
    }
</style>
