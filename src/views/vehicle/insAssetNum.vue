<template>
    <div class="lineReportDetail">
    <common-bread class="topBread" :aryBread="aryBread"></common-bread>
        <div class="lineReportDetailContent">
                        <div class="filterBox">
                <div id="lineReportContent" class="item">
                    <span class="assetTitle">
                    线网隐患数量表
                    </span>
                </div>
                <!-- <div class="item"></div> -->
                <div class="item operFields">
                    <!-- <div class="exportField">
                        导出为:
                        <span class="iconfont icon-PDF pdf" @click="exportPDF"></span>
                    </div>
                    <div class="exportField">
                        导出为:
                        <span class="iconfont icon-excelwenjian excle" @click="exportExcle"></span>
                    </div> -->
                    <div class="refreshBtn" @click="refresh"><span class="iconfont icon-shuaxin2"></span>刷新</div>
                </div>
                <div class="item">
                    <el-date-picker
                    v-model="value1"
                    @change='changeDate'
                    type="daterange"
                    prefix-icon="el-icon"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="filterDataRange"
                    :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </div>
            </div>
            <div class="fodeLineBox">
                
                <div class="chartField">
                    <div class="chart" ref='applyTrend' v-show='applyTrend.data.length>0'></div>
                    <div class="blankImg" v-show="!applyTrend.data.length>0">
                        <div class="welText">暂无数据</div>
                    </div>
                </div>
            </div>
            <div class="lineReportDetailTable">
                <el-table
                    :data="aryMsgList"
                    height="100%"
                    max-height="100%" 
                    header-row-class-name="sHeader"
                    row-class-name="sRow cp"
                    @row-click="rowClick"
                    >
                    <el-table-column
                        prop="workOrderId"
                        label="工单号"
                        :align="'left'"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="po-r">{{ scope.row.workOrderId||'--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="InspectionArea"
                        :align="'left'"
                        show-overflow-tooltip
                        label="巡视区域">
                        <template slot-scope="scope">
                            <span class="po-r">{{ scope.row.inspectionArea||'--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="inspectionPerson"
                        :align="'left'"
                        show-overflow-tooltip
                        label="巡视人">
                    </el-table-column>
                    <el-table-column
                        prop="inspectionTeam"
                        show-overflow-tooltip
                        :align="'left'"
                        label="巡视班组">
                        <template slot-scope="scope">
                            <span>{{ scope.row.inspectionTeamCn||'--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        show-overflow-tooltip
                        :align="'left'"
                        label="巡查状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.inspectionStatus==1" class="statusTag managing">处理中</span>
                            <span v-if="scope.row.inspectionStatus==2" class="statusTag complete">已完成</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="assetCount"
                        show-overflow-tooltip
                        :align="'left'"
                        label="资产数量">
                        <template slot-scope="scope">
                            <span>{{ scope.row.assetCount||'--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="powerTime"
                        show-overflow-tooltip
                        :align="'left'"
                        label="开始时间">
                        <template slot-scope="scope">
                            <span>{{ scope.row.startTime|dateFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="inspectionDuration"
                        show-overflow-tooltip
                        :align="'left'"
                        label="巡视时长">
                        <template slot-scope="scope">
                            <span>{{ scope.row.inspectionDuration/60000}}分钟</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="sPage"
                    v-if="total>10"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNum"
                    :page-size="pageSize"
                    :prev-text="'〈  上一页'" 
                    :next-text="'下一页  〉'"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import Constants from '@/publicJs/Constants.js'
import echarts from 'echarts'
import UtilService from '@/publicJs/UtilService'
import apiClient from '@/publicJs/apiClient.js'
import exportStatic from '@/publicJs/exportStatic.js'
import commonBread from '@/components/common/commonBread'
require('@/publicJs/html2canvas.js')
export default {
    name:'lineReportDetail',
    data(){
        var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1).getTime()-1;
        var lastMonth = new Date(today-3600 * 1000 * 24*30).getTime();
        return {
            useData:[],
            useDataCode : [],
           aryBread:[
                {name:'车载巡查',url:'/vehicle'},
                {name:'车载统计',url:''},
            ],
            aryColor:[['#f7941d','#f8bb49'],['#1081fa','#4a9bea'],['#1cca9f','#78f1cc'],['#f2835c','#ee6232'],['#bc4db6','#fa79fc'],
                      ['#00aec4','#9cd8d7'],['#ff5b5c','#febbbc'],['#a7ce1c','#e1f0ab'],['#f2835c','#ee6232'],['#00a9e0','#7bddfd'],
                      ['#6388cc','#bac8e0']],
            applyTrend:{
                data:[]
            },
            total:0,
            pageSize:10,
            pageNum:1,
            aryMsgList:[],
            paramsAry:[],
            value1:[lastMonth,today],
            pickerOptions:{
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1).getTime();
                        picker.$emit('pick', [new Date(today-3600 * 1000 * 24*7),new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                       var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1).getTime();
                        picker.$emit('pick', [new Date(today-3600 * 1000 * 24*30),new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1).getTime();
                        picker.$emit('pick', [new Date(today-3600 * 1000 * 24*90),new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())]);
                    }
                }],},
        }
    },
    created(){
        this.paramsAry = this.$route.params.params.split('-');
        this.value1 = [ parseInt(this.paramsAry[1]),parseInt(this.paramsAry[2])];
        this.getGroupReport([[this.paramsAry[0]],this.paramsAry[1],this.paramsAry[2]]);
        this.initTable([[this.paramsAry[0]],this.paramsAry[1],this.paramsAry[2]])
    },
    methods:{
        changeDate(val){
            var that = this;
            that.value1 = [ val[0].getTime(),val[1].getTime()+3600 * 1000 * 24-1];
            this.getGroupReport([[this.paramsAry[0]],that.value1[0],that.value1[1]]);
            this.initTable([[this.paramsAry[0]],that.value1[0],that.value1[1]]);
        },
         exportExcle(){
            var that = this;
            var pageData;
            var height = $('#lineReportContent').height();
            var cloneDom = $('#lineReportContent').clone(true);
            cloneDom.css({
                "background-color": "white",
                "position": "absolute",
                "top": "0px",
                "z-index": "-1",
                "height": height
            });
            $("body").append(cloneDom);
            var size = '';
            var width = $('#lineReportContent').width();
            if(width>1366){
                size = 'large';
            }else{
                size = 'small';
            }
            html2canvas($('#lineReportContent'),{
                allowTaint:true,
                height:1000,
                onrendered: function (canvas) {
                    pageData = canvas.toDataURL('image/png', 1.0);
                    document.overviewPrint.imgBase.value=pageData;
                    document.overviewPrint.typeName.value='lineNet';
                    document.overviewPrint.startTime.value=that.value1[0];
                    document.overviewPrint.endTime.value=that.value1[1];
                    document.overviewPrint.imgSize.value=size;
                    document.overviewPrint.action = Constants.apiBaseUrl+'ssiteapi/platform/countrecord/download';
                    document.overviewPrint.submit();
                    cloneDom.remove();
                }
            })
        },
        exportPDF(){
            var that = this;
            var pageData;
            var height = $('#lineReportContent').height();
            var cloneDom = $('#lineReportContent').clone(true);
            cloneDom.css({
                "background-color": "white",
                "position": "absolute",
                "top": "0px",
                "z-index": "-1",
                "height": height
            });
            $("body").append(cloneDom);
            var size = '';
            var width = $('#lineReportContent').width();
            if(width>1366){
                size = 'large';
            }else{
                size = 'small';
            }
            html2canvas($('#lineReportContent'),{
                allowTaint:true,
                height:1000,
                onrendered: function (canvas) {
                         //返回图片dataURL，参数：图片格式和清晰度(0-1)
                  var pageData = canvas.toDataURL('image/jpeg', 1.0);

                  //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
                  var pdf = new jsPDF('', 'pt', 'a4');

                  //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
                  pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );

                  pdf.save('stone.pdf');
                    },
            })
        },
        refresh(){
            var that = this;
            this.getGroupReport([this.paramsAry[0],this.paramsAry[1],this.paramsAry[2]]);
            this.initTable([this.paramsAry[0],this.paramsAry[1],this.paramsAry[2]]);
        },
        //点击行记录跳详情页
        rowClick:function(row, event, column){
            this.$router.push({
                name:'routintInsprctionInfo',
                params:row
            })
        },
        initTable(data){
            var that = this;
            if(data[0] == ""){
            var obj = {
                pageNum:that.pageNum,
                pageSize:that.pageSize,
                startTime:data[1],
                endTime:data[2],
            }
            }
            else {
            var obj = {
                pageNum:that.pageNum,
                pageSize:that.pageSize,
                startTime:data[1],
                endTime:data[2],
                inspectionTeam:data[0],
            }
            }
            apiClient.post('ssiteapi/platform/prodInspection/listTaskTeamAsset',obj,function(pres){
                if(pres.status == 200){
                    console.log("pres",pres);
                    that.aryMsgList = pres.results.list;
                    that.total = pres.results.totalRecord;
                }
            })
        },
        handleCurrentChange(val){
            this.paramsAry = this.$route.params.params.split('-');
            var that = this;
            that.pageNum = val;
             this.initTable([this.paramsAry[0],this.paramsAry[1],this.paramsAry[2]])
        },
        getGroupReport(data){
            console.log("getGroupReport",data);
            var that = this;
            if(data[0] ==""){
                var obj = {
                                startTime:data[1]-0,
                                endTime:data[2]-0
                            }
            }
            else {
                var obj = {
                    inspectionTeam:data[0],
                    startTime:data[1]-0,
                    endTime:data[2]-0
            }
            }
                apiClient.post('ssiteapi/platform/prodInspection/listTeamAssetByDate',obj,function(pres){
                    if(pres.status == 200){
                            that.applyTrend = pres.results;
                            if(that.applyTrend.data.length>0){
                                setTimeout(function(){
                                    that.showLine(that.applyTrend);
                                },100)
                            }
                    }
                    })
        },
       showLine(ary){
            var xAry = [],class1Ary = [],class2Ary = [],class3Ary = [],class4Ary = [],class5Ary = [],class6Ary = [],class7Ary = [];
            var seriesData = [];
            var useData = {};
            var num = 0;
            var nameType = [];
            for(let key in ary.data[0]){
                if(key!="dataStartTime"){
                    useData[""+key+""] = {
                                        name:ary.relation[""+key+""],
                                        data: [],
                                        type: 'line',
                                        lineStyle:{
                                            color:this.aryColor[num][0],
                                            width:1,
                                        },
                                        itemStyle:{
                                            color:this.aryColor[num][0],
                                            borderColor:this.aryColor[num][0],
                                            borderWidth:3,
                                        },
                                        smooth: true,
                                    };
                                    num++;
                }
            }
            for(let key in ary.relation){
                nameType.push(ary.relation[""+key+""]);
            }
            var allSeries=[];
            ary.data.forEach(function(item,ind){
                xAry.push(item.dataStartTime);
                for(let z in useData){
                useData[""+z+""].data.push(item[""+z+""]);
            }
            })

            for(let key in useData){
                allSeries.push(useData[""+key+""]);
            }
            var that = this;
            var line1 = echarts.init(that.$refs['applyTrend']);
            line1.on('click',function(params){
                that.$router.push('/vehicle/insAssetNum'+'/'+params.seriesName+'-'+that.value1[0]+'-'+that.value1[1])
            })
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "班组：{a}<br/>时间：{b}<br/>数量： {c}个",
                },
                toolbox: {
                    feature:{
                        magicType: {type: ['line', 'bar']},
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xAry,
                    axisLine:{
                        show:false,
                        lineStyle:{

                        }
                    },
                    axisTick:{
                        show:false,
                    }
                },
                legend: {
                    // data:nameType,
                    data:nameType,
                    left:'1%',
                    top:'10px'
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    bottom: '5%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        show:false,
                    },
                    axisTick:{
                        show:false,
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#e5e5e5',
                            type:'dashed'
                        }
                    },
                    minInterval: 1,
                },
                
                series: allSeries
            };
            line1.setOption(option);
            line1.on('legendselectchanged',function(params){
                var selectNum = 0;
                for(var x in params.selected){
                    if(params.selected[x]){
                        selectNum++;
                    }
                }
                if(selectNum != that.selectNum){
                    console.log("useData",that.useData);
                if(that.useData.length == 0){
                    console.log("params",params);
                for(var x in params.selected){
                    if(params.selected[x]){
                        that.useData.push(x);
                    }
                }
                for(var y in that.applyTrend.relation){
                    that.useData.map((item)=>{
                        if(that.applyTrend.relation[y] ==  item){
                            that.useDataCode.push(y);
                        }
                    })
                    
                }
                that.getGroupReport([that.useDataCode,that.paramsAry[1],that.paramsAry[2]]);
                that.initTable([that.useDataCode,that.paramsAry[1],that.paramsAry[2]]);
                that.useData=[];
                that.useDataCode = [];
                }
                that.selectNum = selectNum;
                }
                
            })
        },
    },
    components:{
        commonBread
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
                return Math.ceil(value/(60*1000))+'分钟'; 
            }
            
        }
    }
}
</script>

<style scoped>
 .lineReportDetail {
     width: 100%;
    height: 100%;
    position: relative;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    overflow: hidden;
 }
 .lineReportDetailContent{
     width: 100%;
     height: calc(100% - 50px);
     overflow-y: auto;
 }
.blankImg{
    width: 100%;
    height: 80%;
    background: url("../../assets/image/imgBlank.png") center center no-repeat;
    position: relative;
}
.fodeLineBox{
    display: flex;
    flex-direction: column;
}
.fodeLineBox .item{
    flex:1;
    margin-right: 10px;
}
.fodeLineBox .item:last-child{
        margin-right: 0px;
}
.fodeLineBox .chartField{
    width: 100%;
    height: 300px;
    background-color: #ffffff;
    box-shadow: 0px 0px 13px 1px 
        rgba(16, 129, 250, 0.1);
    border-radius: 2px;
}

.chartField .chart{
    width: 100%;
    height: 100%;
}
 .assetTitle{
    color: #1081fa;
    font-size: 14px;
    height: 14px;
    line-height: 14px;
    border-left: 2px solid #1081fa;
    padding-left: 5px;
    font-weight: bold;
    margin: 25px 0px 15px 0px;
    display: inline-block;
}
.welText{
    width: 100%;
    height: 30px;
    line-height: 30px;
    position: absolute;
    bottom: 0px;
    text-align: center;
    font-size: 16px;
    color: #666;
}
.lineReportDetailTable {
    width: 100%;
    height: 580px;
    background: #fff;
}
.sPage{
    background: #fff;
}

.operFields{
    text-align: right;
}
 .lineReportContent {
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
 }
 .assetTitle{
        color: #1081fa;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        border-left: 2px solid #1081fa;
        padding-left: 5px;
        font-weight: bold;
        margin: 25px 0px 15px 0px;
        display: inline-block;
    }
.content1{
    display: flex;
}
.content1 .item{
    height: 100px;
    background-color: #ffffff;
    -webkit-box-shadow: 0px 0px 13px 1px rgba(16, 129, 250, 0.1);
    box-shadow: 0px 0px 13px 1px rgba(16, 129, 250, 0.1);
    border-radius: 2px;
    margin-right: 10px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding-left: 80px;
    position: relative;
}
.content1 .item:last-child{
    margin-right: 0px;
}
.exportField{
    height: 36px;
    background: #ffffff;
    border:1px solid #d2d2d2;
    padding: 0px 15px;
    line-height: 36px;
    font-size: 14px;
    display: inline-block;
    margin-right: 5px;
}
.exportField .iconfont{
    padding-left: 10px;
    cursor: pointer;
}
.exportField .excle{
    color: #207245;
}
.pdf {
    color: red;
}
.refreshBtn{
    height: 36px;
    background: #ffffff;
    border:1px solid #d2d2d2;
    padding: 0px 15px;
    line-height: 36px;
    font-size: 14px;
    cursor: pointer;
    display: inline-block;
    margin-right: -5px;
    border-radius: 2px;
}
.refreshBtn:hover{
    color: #1081fa;
    border:1px solid #1081fa;
}
.refreshBtn .iconfont{
    padding-right: 5px;
}
.filterBox{
    width: 100%;
    height: 40px;
    /* border-radius: 2px;
    box-shadow: 0px 0px 9px 1px 
    rgba(16, 129, 250, 0.1);
    background-color: #ffffff; */
    line-height: 40px;
    color: #666;
    font-size: 14px;
    display: flex;
    color:#666666!important;
    margin: 10px 0;
}
.filterBox .item{
    flex: 1;
    margin-right: 15px;
    position: relative;
}
.filterBox .item:last-child{
    margin-right: 0px;
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
</style>
