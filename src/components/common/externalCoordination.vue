<template>
  <div class="scheduleRecord">
      <common-bread class="topBread" :aryBread="aryBread"></common-bread>
        <el-dialog title="结束工单" class="diaLog" :visible.sync="dialogFormVisible" width="50%">
            <el-form class="endlist">
                    <li>
                        <span>工单号：</span>
                        <span>{{dataObj.workOrderId||'--'}}</span>
                        <span>申请时间：</span>
                        <span>{{dataObj.applyTime|dateFormat}}</span>       
                    </li>
                    <li> 
                        <span>工单类型：</span>
                        <span>外协调度</span>
                        <span>申请单位：</span>
                        <span>{{dataObj.applyUnitCn || '--'}}</span>
                    </li>
                    <li>    
                        <span>申请人：</span>
                        <span>{{dataObj.applicantCn||'--'}}</span>
                        <span>电话号码：</span>
                        <span >{{dataObj.applicantTel}}</span>
                    </li>
                    <li>
                        <span>项目负责人：</span>
                        <span>{{dataObj.principalCn}}</span>
                        <span>电话号码：</span>
                        <span>{{dataObj.principalTel}}</span>
                    </li>
                    <li>
                        <span>工程工号：</span>
                        <span class="twolist">{{dataObj.projectJobId||'--'}}</span>
                        <span>工作地点：</span>
                        <span class="twolist">{{dataObj.workLocaCn||'--'}}</span>
                    </li>
                    <li>
                        <span>工作时间：</span>
                        <span class="twolist">{{dataObj.startTime|dateFormat}} —— {{dataObj.endTime|dateFormat}}</span>
                    </li>
                    <li>
                        <span>工作内容：</span>
                        <span class="twolist">{{dataObj.workContent||'--'}}</span>
                    </li>
                    <li>
                        <span>调度员：</span>
                        <span class="twolist">{{dataObj.dispatcherCn||'--'}}</span>
                    </li>
                    <li>
                        <span >断电分路：</span>
                        <span class="twolist">{{dataObj.shuntCn||'--'}}</span>
                    </li>
            </el-form>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="finishRecord()">确 定</el-button>
            </div> -->
            <div class="formSubField">
                <el-button type="info" class="btn110" @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" class="btn110" @click="finishRecord()">确认</el-button>
            </div>
        </el-dialog> 
      
      <div class="tableField">
          <div class="tableOper">
                <div class="fl statusOper">
                    <el-button type="primary"  @click="create">创建</el-button>
                    <div class="topBox">
                        <common-select
                            :aryOper='aryOper'
                            :currentOper='currentOper'
                            @getDataInfo="statusChange"
                            @clearArr='clearStatus'
                            :openSelectBool='statusBool'
                            @showOptions='onlyStatus'
                            :title='"状态:"'
                            >
                        </common-select>
                    </div>
                </div>
                <div class="fr">
                    <div class="infoSearch">
                        <el-input
                        v-model="infoSearch" placeholder="请输入工作地点进行搜索" @keyup.enter.native="searchSchedule"
                        ></el-input>
                        <span class="iconfont icon-suosou" @click="searchSchedule"></span>
                    </div>
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
                    prop="applyUnitCn"
                    label="申请单位"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                </el-table-column>
                <el-table-column
                    prop="applicantCn"
                    label="申请人"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                </el-table-column>
                
                 <el-table-column
                    prop="workLocaCn"
                    label="工作地点"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    >
                </el-table-column>
                <el-table-column
                    prop="principalCn"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    label="项目负责人">
                </el-table-column>
                <el-table-column
                    prop="principalTel"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    label="负责人电话">
                </el-table-column>
                 <el-table-column
                    prop="status"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==0" class="statusTag unManage">未处理</span>
                        <span v-if="scope.row.status==1" class="statusTag managing">处理中</span>
                        <span v-if="scope.row.status==2" class="statusTag complete">已完成</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="spFlag"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    label="审核状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.spFlag==0" class="statusTag unManage">待审核</span>
                        <span v-if="scope.row.spFlag==1" class="statusTag managing">审核中</span>
                        <span v-if="scope.row.spFlag==2" class="statusTag complete">已通过</span>
                        <span v-if="scope.row.spFlag==3" class="statusTag complete">未通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="applyTime"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    label="申请时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.applyTime|dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="dispatcherCn"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    label="调度人"
                    width="100px">
                </el-table-column>
                <el-table-column
                    prop="shuntCn"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    label="断电分路"
                    >
                </el-table-column>
                <el-table-column
                    prop="status"
                    :align="'left'"
                    label="操作"
                    width="170">
                    <template slot-scope="scope">
                        <span class="inTableBtn" v-if="scope.row.spFlag==2&&(scope.row.status==0||scope.row.status==1)" @click.stop="addNew(scope.row)">新增</span>
                        <span class="inTableBtn" v-if="scope.row.spFlag==0" @click.stop="edited(scope.row)">修改</span>
                        <span class="inTableBtn" v-if="scope.row.spFlag==0&&scope.row.dispatcherAcct==dispatcherAcct" @click.stop="deleteOrder(scope.row)">删除</span>
                        <span class="inTableBtn" v-if="scope.row.spFlag==2&&scope.row.status==1" @click.stop="finish(scope.row)">结单</span>
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
  name:'externalCoordination',
  data(){
      return{
          currentViewId:'b10001_001_002',
          showTooltip:true,
          aryBread:[
              {name:'调度管理',url:'/schedule'},
              {name:'外协调度',url:''},
          ],
          openSelectBool:false,
          currentOper:[],
          statusBool:false,
          infoSearch:'',
          aryOper:[{name:"未处理",id:0},{name:"处理中",id:1},{name:"已完成",id:2}],
          aryRecordList:[],
          pageSize:10,
          pageNow:1,
          totalSchedule:0,
          dispatcherCn : JSON.parse(localStorage.getItem('userInfo')).acountName,
          dispatcherAcct: JSON.parse(localStorage.getItem('userInfo')).username,
          dialogFormVisible: false,
          dataObj: {},
      }
  },
  components: {
    commonBread,
    commonFooter,
    commonSelect,
  },
  mounted() {
    var that = this;
    eventBus.$on('getAgain',(e)=>{
        that.getScheduleInfo()
    })
  },
  created(){
    var that = this;
    that.getScheduleInfo();
  },
  
  methods:{
    // 获取调度记录
    getScheduleInfo:function(){
        var that = this;
        var param = {
            pageSize: that.pageSize,
            pageNum: that.pageNow,
        };
        if(that.currentOper.length>0){
            param.status = that.currentOper
        }
        if(that.infoSearch.length>0){
            param.workLocaCn = that.infoSearch
        }
        
        apiClient.post('ssiteapi/platform/substation/assistexternal/listAssist',param,function(pres){
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
        }else  {
            this.statusBool = false;
        }
    },
    clearStatus(){
        this.currentOper = [];
        this.getScheduleInfo();
    },
    statusChange(){
        this.pageNow = 1;
        this.getScheduleInfo();
    },
    //点击行记录跳详情页
    rowClick:function(row, event, column){
            this.$router.push('/schedule/associationInfo/'+row.workOrderId+'/'+this.pageNow);
    },
    //点击创建
    create:function(){
        var that = this;
        that.$router.push({
          name: 'createExCoor',
          params: {
            isShow: 0,
          }
        })
    },
    //点击搜索
    searchSchedule:function(){
        var that = this;
        that.getScheduleInfo()
        that.pageNow = 1;
        
    },
    //点击新增
    addNew(row){
        var that = this;
        that.$router.push({
          name: 'createExCoor',
          params: {
            isShow: 1,
            data: row,
          }
        })
        
    },
    //点击修改
    edited(row){
        var that = this;
        that.$router.push({
          name: 'createExCoor',
          params: {
            isShow: 2,
            data: row,
          }
        })
    },
    //点击删除
    deleteOrder(row){
        var that = this;
        
        that.$confirm('确定要删除此外协记录吗?', '删除提醒', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var param = row;
                
               apiClient.linkApi('ssiteapi/platform/substation/assistexternal/api/deleteAssist','delete',param,function(pres){
                   
                    if(pres.status==200&&pres.results==true){
                        that.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                       that.getScheduleInfo();
                    }else{
                        that.$message({
                            type: 'warning',
                            message: '操作失败，请稍后再试!'
                        });
                    }
                     
                })
            })
    },
    //点击结单
    finish(row){
            var that = this;
            
            apiClient.get('ssiteapi/platform/substation/assistexternal/getDetail/'+row.workOrderId,{},function(pres){
                
                    if(pres.status==200){
                        that.dataObj = pres.results[0];
                        
                    }
                });
            that.dialogFormVisible = true;
    },
    
    finishRecord(){
        var that = this;
        var param = {
            workOrderId:that.dataObj.workOrderId,
            dispatcherCn: JSON.parse(localStorage.getItem('userInfo')).acountName,
            dispatcherAcct: JSON.parse(localStorage.getItem('userInfo')).username,
        };
        apiClient.post('ssiteapi/platform/substation/assistexternal/finishAssist',param,function(pres){
            if(pres.status==200){
                that.dialogFormVisible = false;
                that.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                that.getScheduleInfo();
            }else{
                that.$message({
                    type: 'warning',
                    message: '操作失败，请稍后再试!'
                });
            }
        });
    },

    //页码跳转
    handleCurrentChange:function(val){
        this.pageNow = val;
        this.getScheduleInfo();
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
        }
    }
}
</script>
<style scoped>
    .scheduleRecord{
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
        padding: 0px 0 0 10px;
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
    .active{
        background: #1081fa;
        color:#ffffff;
         border: solid 1px #1081fa;
    }
    .statusOper .el-radio{
        margin-left: 15px;
    }
    .statusOper .topBox {
        display: inline-block;
        font-size: 14px;
        margin-left: 15px;
        height: 60px;
        float: left;
    }
    .infoSearch{
        width: 300px;
        height: 36px;
        background-color: #f6f8fc;
	    border-radius: 2px;
        margin-right: 10px;
        display: inline-block;
        line-height: 32px;
        position: relative;
    }
   
    .infoSearch input:focus{
        border:none;
        outline: none;
    }
    .infoSearch span{
        position: absolute;
        top: 3px;
        width: 30px;
        right: 5px;
        font-size: 20px;
        cursor: pointer;
        text-align: center;
        color: #b4b2b2;
    }
    .statusTag{
        width: 56px;
        height: 24px;
        border: 1px solid #000000;
        color:#000000;
        line-height: 24px;
        padding: 1px 5px;
    }
    .unManage{
        color: #d9030e;
        border: 1px solid #d9030e;
    }
    .managing{
        color: #1081fa;
        border: 1px solid #1081fa;
    }
    .unReAssign{
        color: #fc5830;
        border: 1px solid #fc5830;
    }
    .complete{
        color: #828282;
        border: 1px solid #828282;
    }
    .backout{
        color: #cdcccc;
        border: 1px solid #cdcccc;
    }

    .inTableBtn{
        color: #1081fa;
        padding-right: 10px;
    }
    .inTableBtn:hover{
        font-weight: bold;
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
