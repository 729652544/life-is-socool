<template>
    <div class="routintInsprctionInfo">
        <common-bread class="topBread" :aryBread="aryBread" ></common-bread>
        <div class="infoContent">
            <div class="topOperField">   
                <el-button @click="returnList">返回</el-button>
            </div>      
            <div class="infoData">                
                <span class="iconfont icon-gongdan headerSpan" id="spnJoin">&nbsp;任务详情</span>
                <ul class="ulsBox" >
                    <li>
                        <span>巡检状态</span>
                        <span>
                            <span v-if="objTask.inspectionStatus=='1'" class="managing">进行中</span>
                            <span v-if="objTask.inspectionStatus=='2'" class="unReAssign">已完成</span>
                        </span> 
                        <span>工单号</span>
                        <span>{{objTask.workOrderId||'--'}}</span>
                                         
                    </li>
                    <li>    
                        <span>巡查人</span>
                        <span>{{objTask.inspectionPerson||'--'}}</span>
                        <span>巡查班组</span>
                        <span>{{objTask.inspectionTeamCn||'--'}}</span>
                    </li>
                    <li>    
                        <span>开始时间</span>
                        <span>{{objTask.startTime|dateFormat}}</span>
                        <span>结束时间</span>
                        <span >{{objTask.endTime|dateFormat}}</span>
                    </li>
                    <li>
                        <span>巡查时长</span>
                        <span>{{objTask.inspectionDuration|hourFormat}}</span>
                        <span>巡查里程</span>
                        <span>
                            <span>{{objTask.inspectionKm+'千米'}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span @click="seeLineInfo" class="seeInfo">查看巡检轨迹</span>
                        </span>
                    </li>
                    <li>
                        <span>平均速度</span>
                        <span>{{objTask.inspectionAvgSpeed+'千米/小时'}}</span>
                        <span>巡查资产</span>
                        <span>
                            <span>{{objTask.assetCount}}</span>
                            <span @click="seeAllAssets" class="seeInfo">查看详情</span>
                        </span>
                    </li>
                    <li>
                        <span>异常资产</span>
                        <span>
                            <span>{{objTask.abnormalCount}}</span>
                            <span @click="seeAbnormalAssets" class="seeInfo">查看详情</span>
                        </span>
                        <span>巡查街道</span>
                        <span>{{objTask.inspectionStreet||'--'}}</span>
                    </li>
                    <li>
                        <span>巡查区域</span>
                        <span>{{objTask.inspectionArea||'--'}}</span>
                    </li>
                </ul>       
            </div>
            <!-- <div class="right">
                <p class="contTit"><span class="iconfont icon-rizhi"></span>流转日志</p>
                <div class="rightBox">
                    <ul>
                        <li class="circulationLog" v-for="(item,ind) in arrayLog" :key='ind'>
                            <div>
                                <p class="logTime">{{item.createtime|dayFormat}}</p>
                                <p class="logTime">{{item.createtime|timeFormat}}</p>
                            </div>
                            <div  class="logItem">
                                <span class="point"></span>
                                <p class="listPer">{{(item.processor||'--').split('(')[0]}}<span class="job">{{item.taskName}} <span v-if="item.summary!=''">{{'('+item.summary+')'}}</span> </span></p>
                                <p class="listRem">备注:{{item.memo||'--'}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div> -->
        </div>
        <el-dialog title="轨迹信息" :visible.sync="lineShow">
            <div id="mapLineField"></div>
        </el-dialog>
        <el-dialog title="资产详情" :visible.sync='allAssetsShow' class="scanList">
            <div class="dialogBox">
                <div class="infoSearch">
                    <el-input
                    v-model="infoSearch" placeholder="请输入杆牌号进行搜索" @keyup.enter.native="searchPoleNum"
                    ></el-input>
                    <span class="iconfont icon-suosou" @click="searchPoleNum"></span>
                </div>
                <el-table
                    :data="listScan"
                    height="100%"
                    max-height="100%" 
                    header-row-class-name="sHeader">
                    <el-table-column
                        type="index"
                        label="序号"
                        :align="'left'"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="poleNum"
                        label="标牌号"
                        :align="'left'"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="inspectionArea"
                        label="所属区域"
                        :align="'left'"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="inspectionStreet"
                        label="所属街道"
                        :align="'left'"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="workOrderId"
                        label="所属路侧"
                        :align="'left'"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="时间"
                        :align="'left'"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.createTime|dateFormat }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
                <el-pagination
                    class="sPage"       
                    v-if="totalSchedule>10"        
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNum"
                    :page-size="pageSize"
                    :prev-text="'〈  上一页'" 
                    :next-text="'下一页  〉'"
                    layout="prev, pager, next"
                    :total="totalSchedule">
                </el-pagination>
                
        </el-dialog>
        <common-footer></common-footer>
    </div>
</template>
<script>
import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
import UtilService from '@/publicJs/UtilService'
import Constants from '@/publicJs/Constants.js'
export default {
  name:'routintInsprctionInfo',
  data(){
      return{
        flag:false,
        imgBath:Constants.imgUrl,
        env:Constants.env,
        aryBread:[
              {name:'车载巡查',url:'/vehicle'},
              {name:'巡查记录',url:''},
          ],
        arrayLog:[],
        objTask:{
            dispatcherAccount:'',
        },
        lineShow:false,
        allAssetsShow:false,
        infoSearch:'',
        listScan:[],
        totalSchedule:0,
        pageNum:1,
        pageSize:10,
        searchType:'0',//查询资产类型  默认0是全部

      }
  },
  watch:{
   
  },
  components: {
    commonBread,commonFooter,
  },
  created() {
    var that = this;
    that.objTask = that.$route.params;
    that.getRushLog(that.$route.params.workOrderId);
  },
  methods:{
      returnList(){
          var that = this;
          that.$router.go(-1);
      },
      getRushLog(id){
          var that = this;
          apiClient.get('ssiteapi/platform/prodInspectiongetLogById/'+id,{},function(pres){
              if(pres.status == 200){
                  that.arrayLog = pres.results;
              }
          })
      },
      seeLine(){
          var that = this;
          that.lineShow = true;
      },
      
      //查询全部巡查资产
      seeAllAssets(){
          var that = this;
          that.allAssetsShow = true;
          that.searchType = '0';
          that.getListScanRecord();
      },
      //查询异常资产
      seeAbnormalAssets(){
          var that = this;
          that.allAssetsShow = true;
          that.searchType = '1';
          that.getListScanRecord();
      },
      
      //点击分页
      handleCurrentChange(val){
          var that = this;
            that.pageNum = val;
            that.getListScanRecord();
      },
      //搜索框搜索
      searchPoleNum(){
          var that = this;
          that.getListScanRecord();
      },
      //查询巡查资产
      getListScanRecord(poleNum){
          var that = this;
          var obj = {
                pageSize:10,
                pageNum:that.pageNum,
                taskWorkOrderId:that.objTask.workOrderId,
            }
            //如果是异常资产    加上isAbnormal字段；
            if(that.searchType == '1'){
                obj.isAbnormal = '1'
            }
            if(that.infoSearch.trim()!=''){
                obj.poleNum = that.infoSearch.trim();
            }
          apiClient.post('ssiteapi/platform/prodInspection/listScanRecord',obj,function(pres){
              if(pres.status == 200){
                  that.listScan = pres.results.list;
                  that.totalSchedule = pres.results.totalRecord;
              }
          })
      },
      initLineMap:function(){
            this.map = new BMap.Map("mapLineField");    
            var point = new BMap.Point(116.404, 39.915);    
            this.map.setCurrentCity('北京市');
            this.map.centerAndZoom(point, 12);    
            this.map.enableScrollWheelZoom(true);
            var bottom_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_LARGE}); 
            var bottom_right_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT})
            this.map.addControl(bottom_right_navigation);    
            this.map.addControl( bottom_right_control);  
      },
      
    //查看轨迹信息
    seeLineInfo:function(){
        var that = this;
        that.lineShow = true;
        setTimeout(function(){
            that.initLineMap();
            if(that.objTask.longitude==0||that.objTask.latitude==0){
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(that.objTask.accidentSite, function(point){
                    if (point) {
                        that.getTaskInMap(that.objTask.itemid,point);
                    }else{
                        that.$message({
                            type: 'warning',
                            message: '故障地点地理位置解析错误!'
                        });
                    }
                }, "北京市");
            }else{
                var point = new BMap.Point(that.objTask.longitude,that.objTask.latitude);     
                that.getTaskInMap(that.objTask.itemid,point);
            }
        },100);
    },
    //获取车辆轨迹
    getTaskInMap:function(itemid,accidentPoint){
        var that = this;
        apiClient.get('ssiteapi/platform/maintain/api/acqtrajectory/?itemid='+itemid+'&env='+that.env,{},function(pres){
            if(pres.status==200){ 
                that.map.clearOverlays();
            //画故障地点
            var aicon = new BMap.Icon(require('@/assets/image/redFlag.png'), new BMap.Size(33, 33));
            var amarker = new BMap.Marker(accidentPoint, {
              icon: aicon
            });
            // amarker.addEventListener("mouseover", function (event) {
            //   that.getTaskById(itemid);
            // });
            that.map.addOverlay(amarker);

            var trajectory = pres.results.trajectory;
            var lastPoint = pres.results.lastestPonit;
           // if (trajectory.length !== 0) {
              //画折线
              var pois = [];
              $.each(trajectory, function (i) {
                pois.push(new BMap.Point(trajectory[i].accidentLongitude, trajectory[i].accidentLatitude))
              });
                var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                    scale: 0.6,//图标缩放大小
                    strokeColor:'#fff',//设置矢量图标的线填充颜色
                    strokeWeight: '1',//设置线宽
                });
                var icons = new BMap.IconSequence(sy, '10', '30');
                var polyline =new BMap.Polyline(pois, {
                    enableEditing: false,//是否启用线编辑，默认为false
                    enableClicking: true,//是否响应点击事件，默认为true
                    icons:[],
                    strokeWeight:'8',//折线的宽度，以像素为单位
                    strokeOpacity: 1,//折线的透明度，取值范围0 - 1
                    strokeColor:"#1081fa" //折线颜色
                });
              that.map.addOverlay(polyline);
              // 轨迹无信息  取当前车位置为起点和小车点
              if(trajectory.length==0){
                  if(pres.results.status ==2){
                    if(lastPoint){
                        var point = new BMap.Point(lastPoint.longitude,lastPoint.latitude);
                        var icon = new BMap.Icon(require('@/assets/image/carBegin.png'), new BMap.Size(25, 36));
                        var marker = new BMap.Marker(point, {
                        icon: icon
                        });
                        that.map.addOverlay(marker);

                        var icon = new BMap.Icon(require('@/assets/image/carIcon.png'), new BMap.Size(56, 31));
                        var marker = new BMap.Marker(point, {
                            icon: icon
                        });
                        // marker.addEventListener("mouseover", function (event) {
                        //     that.getCarInfoById(pres.results.acountid, 'task');
                        // });
                        that.map.addOverlay(marker);
                        that.map.setViewport([accidentPoint,point]);
                    }else {
                        that.map.setViewport([accidentPoint]);
                    }
                  }else {
                      that.map.setViewport([accidentPoint]);
                  }
                    
                
              }else{
                //轨迹有信息  起点为轨迹信息第一个点   
                // 若任务结束  终点取轨迹信息最后一个点   若任务正在进行 小车取当前车位置
                //开始标志
                var icon = new BMap.Icon(require('@/assets/image/carBegin.png'), new BMap.Size(25, 36));
                var marker = new BMap.Marker(pois[0], {
                  icon: icon
                });
                that.map.addOverlay(marker);
                // 进行中
                if (pres.results.status == 2) {
                   var point = new BMap.Point(lastPoint.longitude,lastPoint.latitude);
                   var icon = new BMap.Icon(require('@/assets/image/carIcon.png'), new BMap.Size(56, 31));
                    var marker = new BMap.Marker(point, {
                      icon: icon
                    });
                    // marker.addEventListener("mouseover", function (event) {
                    //   that.getCarInfoById(pres.results.acountid, 'task');
                    // });
                    that.map.addOverlay(marker);
                    that.map.setViewport(pois.concat([accidentPoint,point]));
                }else{ //已完成
                    var icon = new BMap.Icon(require('@/assets/image/carEnd.png'), new BMap.Size(30, 36));
                    var marker = new BMap.Marker(pois[pois.length - 1], {
                      icon: icon
                    });
                    that.map.addOverlay(marker);
                    that.map.setViewport(pois.concat([accidentPoint]));
                }
               
              }    
            }
        })
    },
  },
  
    filters: {
        //时间格式化
        dateFormat: function (value) {  
          if(value!==null&&value!==0&&value!==undefined&&value!==""){
            return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
          }else {
            return '--'
          }
        },
        dayFormat: function (value) {  
          if(value!==null&&value!==0&&value!==undefined&&value!==""){
            return UtilService.formatDuring(value, 'yyyy-MM-dd');
          }else {
            return '--'
          }
        },
        timeFormat: function (value) {  
          if(value!==null&&value!==0&&value!==undefined&&value!==""){
            return UtilService.formatDuring(value, 'HH:mm:ss');
          }else {
            return '--'
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
    i,em,strong,b{
        font-style: normal;
        font-weight: normal;
    }
    .routintInsprctionInfo{
        width: 100%;
        height: 100%;
        position: relative;
        background: #efefef;
        padding: 10px 10px 0px 10px;
    }  
    .topOperField {
        padding: 10px 0 0 10px;
    }
    .infoContent{
        width: 100%;
        height: calc(100% - 90px);
        margin-top: 10px;
        background: #ffffff;
        border-radius: 5px;
        overflow: auto;
    }
    .infoData{ 
        margin: 10px 10px;
        border: 1px solid #eeeeee;
        width: 50%;
        float: left;
        background:  #fafafa;        
    }
    
    .infoData>ul{
        width: 100%;
        line-height: 43px;
        color: #666;
    }
    .infoData>ul>li{
        background:#ffffff;
        display: flex;
        min-height: 42px;
    }
    .infoData>ul>li>span{
        display: inline-block;
        word-break:keep-all;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow: hidden;
    }
    .infoData>ul>li>span:nth-child(1){
        color:#333;
        width: 10%;
        text-align: center;
        border: 1px solid #e1e1e1;
        border-top: none;
        border-left: none;
        background: #f5f5f5;
    }
    .infoData>ul>li>span:nth-child(2){
        width: 40%;
        text-align: left;
        border-bottom: 1px solid #e1e1e1;
        border-right: 1px solid #e1e1e1;
        padding-left: 8px;
    }
    .infoData>ul>li>span:nth-child(3){
        width: 10%;
        color:#333;
        text-align: center;
        border: 1px solid #e1e1e1;
        border-left: none;
        border-top: none;
        background: #f5f5f5;
    }
    .infoData>ul>li>span:nth-child(4){
        width: 40%;
        text-align: left;
        border-bottom: 1px solid #e1e1e1;
        padding-left: 8px;
    }
    .managing{
        color: #1081fa;
    }
    .unReAssign{
        color: #828282;
    }
    .headerSpan{
        display: block;
        font-size: 14px;
        padding: 10px 20px;
        color: #333333;
        border-bottom:#eeeeee solid 1px;
        
    }
    .ulsBox{
        float: left;
        border-right: 1px solid #cdcdcd;
        overflow: auto;
    }
    .ulsBox:last-child{
        border-right: none;
    }
    .ulsBox>li{
        background:#fafafa !important;
        font-size: 12px;
    }
    #spnJoin{
        border-bottom: 1px solid #eeeeee;
       
    }
    .infoData,.right {
        height: 642px;
    }
    .right {
        margin-top: 10px;
        float: left;
         width: 47%;
        background: #fafafa;
        padding-left: 15px;
        line-height: 48px;
        border: solid 1px #e8e8e8;
    }
    .contTit {
        font-size: 14px;
        line-height: 38px;
        color: #333333;
        border-bottom: 1px solid #eeeeee;
    }
    .rightBox {
        display: flex;
        height:calc( 100% - 52px);
    }
    .rightBox ul {
        margin-top: 10px;
        width: 100%;
        
        height: 100%;
        overflow-y: auto
    }
    .circulationLog {
        width: 98%;
        display: flex;
        flex-basis: 5%;  
    }
    .logTime {
        width: 85px;
        padding-right: 15px;
        font-size: 12px;
        line-height: 20px;
    }
    .logItem {
        padding-left: 15px;
        padding-bottom: 10px;
        border-left: 1px solid #e5e5e5;
        position: relative;
        width: 90%;
        line-height: 40px;
        font-size: 12px;
        color:#333333;
    }
    .point {
        position: absolute;
        width: 6px;
        height: 6px;
        background: #e5e5e5;
        left: -3px;
        top: 0;
        border-radius: 50%;
    }
    .listPer {
        border-bottom: 1px dashed #d2d2d2;
        background: #f5f5f5;
        padding-left: 10px;
    }
    .listRem {
        color:#666666;
        background: #f5f5f5;
        padding-left: 10px;
    }
    .job {
        color:#1081fa;
        padding-left: 10px;
    }
    .icon-rizhi{
        padding-right: 5px;
        color:#9e9e9e;
        font-size: 14px;
    }
    .icon-gongdan:before {
        color:#9e9e9e;
    }
    
    .seeInfo{
        cursor: pointer;
        color: #1081fa;
        text-decoration: underline;
    }
    #mapLineField{
        width: 100%;
        height: 480px;
    }
    .infoSearch{
        width: 300px;
        height: 36px;
        margin: 5px 0;
        background-color: #f6f8fc;
	    border-radius: 2px;
        margin-right: 10px;
        display: inline-block;
        line-height: 32px;
        position: relative;
        top: -2px;
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
    .scanList {
        display: flex;
        width: 100%;
    }
    .scanList .el-dialog {
        height: 100%!important;
    }
    .dialogBox {
        overflow: hidden;
        height: 650px;
    }
    @media (min-width: 1000px) and (max-width: 1600px) {
        .dialogBox {
            overflow: hidden;
            height: 400px;
        }
    }
</style>