<template>
  <div class="scheduleRecord">
      <common-bread class="topBread" :aryBread="aryBread"></common-bread>
      <div class="tableField">
        <div class="tableOper">
            <div class="fl statusOper">
                <el-button type="primary"  @click="create">创建供应商</el-button>
            </div>
            <div class="fr">
                <div class="infoSearch">
                    <el-input
                    v-model="infoSearch" placeholder="请输入供应商名称" @keyup.enter.native="searchSchedule"
                    ></el-input>
                    <span class="iconfont icon-suosou" @click="searchSchedule"></span>
                </div>
            </div>
        </div>
          <div class="tableData">
            <el-table
                :data="aryScheduleList"
                height="100%"
                max-height="100%" 
                header-row-class-name="sHeader"
                row-class-name="sRow cp"
                style="width: 100%">
                <el-table-column width="20"></el-table-column>
                <el-table-column
                    prop="SupplierNumber"
                    label="供应商编号"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    width="120px"
                   >
                </el-table-column>
                <el-table-column
                    prop="NameOfSupplier"
                    label="供应商名称"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                    width="200px"
                   >
                </el-table-column>
                <el-table-column
                    prop="SupplierAbbreviation"
                    label="供应商简称"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                </el-table-column>
                <el-table-column
                    prop="AreaName"
                    label="地区名称"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                </el-table-column>
                <el-table-column
                    prop="DateOfDevelopment"
                    label="发展日期"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                   <template slot-scope="scope">
                        <span>{{scope.row.DateOfDevelopment|dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="Contacts"
                    label="联系人"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                </el-table-column>
                <el-table-column
                    prop="Telephone"
                    label="电话"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                </el-table-column>
                <el-table-column
                    prop="Salesman"
                    label="专营业务员名字"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                   <template slot-scope="scope">
                        <span v-if="scope.row.Salesman!=''">{{scope.row.Salesman}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="Department"
                    label="分管部门名称"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                   <template slot-scope="scope">
                        <span v-if="scope.row.Department!=''">{{scope.row.Department}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="applyUnitCn"
                    label="备注"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                   <template slot-scope="scope">
                        <span v-if="scope.row.remarks!=''">{{scope.row.remarks}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="applyUnitCn"
                    label="操作"
                    :align="'left'"
                    :show-overflow-tooltip="showTooltip"
                   >
                    <template slot-scope="scope">
                        <span class="inTableBtn" @click.stop="editedOrder(scope.row)">修改</span>
                        <span class="inTableBtn" @click.stop="deleteOrder(scope.row)">删除</span>
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

export default {
  name:'SupplierList',
  data(){
      return{
        currentViewId:'b10001_001_002',
        aryBread:[
            {name:'系统管理',url:'/systemHome'},
            {name:'供应商管理',url:''},
        ],
        showTooltip:true,
        aryScheduleList: [],
        infoSearch:'',
        pageNow: 1,
        pageSize: 10,
        totalSchedule: 0,
      }
  },
  components: {
    commonBread,
    commonFooter,
  },
  created(){
      var that = this;
      that.getScheduleInfo();
  },
  methods:{	
      //获取列表信息
      getScheduleInfo(){
          var that = this;
        var param = {
            pageSize: that.pageSize,
            pageNum: that.pageNow,
            classname:"ResSupplier",
            filter:[],
        };
        // if(that.infoSearch.length>0){
        //     param.workLocaCn = that.infoSearch
        // };
        apiClient.post('ssiteapi/platform/asset/info/listByParamWithPage',param,function(pres){
            if(pres.status==200){
                that.aryScheduleList = pres.results.list;
                that.totalSchedule = pres.results.totalRecord;  
            }
        });
      },
      //创建供应商
      create(){
          var that = this;
          that.$router.push('/systemHome/SupplierMng/NewSupplier/'+null);
      },
      //搜索
      searchSchedule(){
            var that = this;
            that.getScheduleInfo()
            that.pageNow = 1;
      },
      //修改
      editedOrder(row){
          var that = this;
          that.$router.push('/systemHome/SupplierMng/NewSupplier/'+row.res_id);
      },
      //删除
      deleteOrder(row){
          var that = this;
          apiClient.linkApi('ssiteapi/platform/asset/info/remove/'+row.res_id+'/ResSupplier','delete',{},function(pres){
                    if(pres.status == 200){
                        that.$message({
                            type:'success',
                            message:'删除成功'
                        })
                        that.getScheduleInfo()
                    }else {
                        that.$message({
                            type:'warning',
                            message:'删除失败'
                        })
                        that.getScheduleInfo()
                    }
                })
      },
      //页码跳转
      handleCurrentChange(val){
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
        },
        timeFormat:function(value){
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
    .formSubField {
        width: 100%;
        text-align: center;
        margin-top: 40px;
        padding-bottom: 40px;
    }
    .inTableBtn {
    color: #1081fa;
    padding-right: 10px;
    }
    .inTableBtn:hover{
        font-weight: bold;
    }
</style>