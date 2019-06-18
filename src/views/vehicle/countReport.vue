<template>
    <div class="countReport">
        <common-bread class="topBread" :aryBread="aryBread"></common-bread>
            
        <div v-loading="loading2"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" class="lineReportContent">
            <div class="filterBox">
                <div class="item">
                </div>
                <!-- <div class="item"></div> -->
                <div class="item operFields">
                    <div class="exportField">
                        导出为:
                        <span class="iconfont icon-PDF pdf" @click="exportPDF"></span>
                        <!-- <span class="iconfont icon-wordwenjian word"  @click="exportWord"></span> -->
                    </div>
                    <div class="exportField">
                        导出为:
                        <span class="iconfont icon-excelwenjian excle" @click="exportExcle"></span>
                        <!-- <span class="iconfont icon-wordwenjian word"  @click="exportWord"></span> -->
                    </div>
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
            <div>
            </div>
            <div id="lineReportContent">
                <span class="assetTitle">
                    车载统计
                </span>
                <div class="content1">
                    <div class="item">
                        <div class="itemImg insAsset"></div>
                        <div class="itemInfo">
                            <div class="value">{{assetsAllValue}}</div>
                            <div class="text">巡检资产<br/>(根)</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemImg insLong"></div>
                        <div class="itemInfo">
                            <div class="value">{{DGValue}}</div>
                            <div class="text">巡检长度<br/>(公里)</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemImg insStreet"></div>
                        <div class="itemInfo">
                            <div class="value">{{QXValue}}</div>
                            <div class="text">巡检街道<br/>(条)</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemImg insErrorMoney"></div>
                        <div class="itemInfo">
                            <div class="value">{{BDZValue}}</div>
                            <div class="text">巡检异常资产<br/>(根)</div>
                        </div>
                    </div>
                </div>
                <div class="content2">
                    <div class="item">
                        <span class="assetTitle">
                            巡检资产数量表
                        </span>
                        <button @click="assetsDrillDown" v-show='applyTrend.data.length>0' class="drillDownBtn">下钻</button>
                        <div class="chartField" >
                            <div class="chart" ref="applyTrend" v-show='applyTrend.data.length>0'> </div>
                            <div class="blankImg" v-show="!applyTrend.data.length>0">
                                <div class="welText">暂无数据</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content3">
                    <div class="item">
                        <span class="assetTitle">
                            当月班组巡检次数比对
                        </span>
                        <div class="chartField" >
                            <div class="chart" ref="lineReport" v-show="lineReport.length>0"> </div>
                            <div class="blankImg" v-show="!lineReport.length>0">
                                <div class="welText">暂无数据</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <span class="assetTitle">
                            当月班组巡检时长(秒)
                        </span>
                        <div class="chartField">
                            <div class="chart" ref="DGPie" v-show="DGPie.length>0"> </div>
                            <div class="blankImg" v-show="!DGPie.length>0">
                                <div class="welText">暂无数据</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <span class="assetTitle">
                            异常电杆隐患班组分布比例
                        </span>
                        <div class="chartField">
                            <div class="chart" ref="BDZPie" v-show="BDZPie.length>0"> </div>
                            <div class="blankImg" v-show="!BDZPie.length>0">
                                <div class="welText">暂无数据</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <form name="overviewPrint" method="post" action="" target="download_target" style="display:none">
                <input id="imgBase" name="imgBase" type="hidden" value="">
                <input id="typeName" name="typeName" type="hidden" value="">
                <input id="startTime" name="startTime" type="hidden" value="">
                <input id="endTime" name="endTime" type="hidden" value="">
                <input id="imgSize" name="imgSize" type="hidden" value="">
            </form>
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
// require('@/publicJs/jspdf.js')
export default {
    data(){
        var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1).getTime()-1;
        var lastMonth = new Date(today-3600 * 1000 * 24*30).getTime();
        // new Date(today-3600 * 1000 * 24*30)
        return {
            loading2:false,
            url:Constants.reportUrl,
            aryBread:[
                {name:'车载巡查',url:'/vehicle'},
                {name:'车载统计',url:''},
            ],
            lineReport:[],
            seriousLineReport:[],
            DGPie:[],
            BDZPie:[],
            applyTrend:{
                data:[],
                relation:[]
            },
            assetsAllValue:'',
            DGValue:0,
            QXValue:'0',
            BDZValue:'0',
            PieObj:{},
            aryColor:[['#f7941d','#f8bb49'],['#1081fa','#4a9bea'],['#1cca9f','#78f1cc'],['#f2835c','#ee6232'],['#bc4db6','#fa79fc'],
                      ['#00aec4','#9cd8d7'],['#ff5b5c','#febbbc'],['#a7ce1c','#e1f0ab'],['#f2835c','#ee6232'],['#00a9e0','#7bddfd'],
                      ['#6388cc','#bac8e0']],
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
    components:{
        commonBread
    },
    created(){
        var that = this;
        var obj = {
            startTime:that.value1[0],
            endTime:that.value1[1]
        }
        that.loading2 = true;
        this.getInfo(obj)
    },
    methods:{
        //下钻跳转
        assetsDrillDown(){
            var that = this;
            that.$router.push('/vehicle/insAssetNum'+'/-'+that.value1[0]+'-'+that.value1[1])
        },
        refresh(){
            var that = this;
            var obj = {
                startTime:that.value1[0],
                endTime:that.value1[1]
            }
            that.loading2 = true;
            that.getInfo(obj);
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
                    document.overviewPrint.action = Constants.apiBaseUrl+'ssiteapi/platform/prodInspection/downloadExcle';
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
                    pageData = canvas.toDataURL('image/png', 1.0);
                    document.overviewPrint.imgBase.value=pageData;
                    document.overviewPrint.typeName.value='lineNet';
                    document.overviewPrint.startTime.value=that.value1[0];
                    document.overviewPrint.endTime.value=that.value1[1];
                    document.overviewPrint.imgSize.value=size;
                    document.overviewPrint.action = Constants.apiBaseUrl+'ssiteapi/platform/prodInspection/downloadPdf';
                    document.overviewPrint.submit();
                    cloneDom.remove();
                }
            })
        },
        getInfo(val){
            var that = this;
            that.getTroubleNum(val);
            that.getPowerOutTime(val);
            that.geteRepairLong(val);
            that.getErrorNum(val);
            // that.getOverheadQuantity(val);
            //线网隐患饼图
            that.getLineReport(val);
            //线网较重隐患班组比例 饼图
            that.getSeriousLineReport(val);
            //折线图
            that.getGroupReport(val);
            //班组较重隐患占比 柱形图
            that.getGroupSeriousReport(val);
            that.loading2 = false;
        },
        changeDate(val){
            var that = this;
            that.value1 = [ val[0].getTime(),val[1].getTime()+3600 * 1000 * 24-1];
            that.getInfo(
                {
                    startTime:that.value1[0],
                    endTime:that.value1[1]
                }
            )
        },
        //巡检资产
        getTroubleNum(val){
            var that = this
             apiClient.post('ssiteapi/platform/prodInspection/getAssetNum',val,function(pres){
                // pres = {
                //     "time":3074,
                //     "exception":null,
                //     "status":200,
                //     "results":20
                // } 
                if(pres.status == 200){
                    that.assetsAllValue = pres.results;
                }
            });
            
        },
        //巡检长度
        getPowerOutTime(val){
            var that = this
            apiClient.post('ssiteapi/platform/prodInspection/getInspectionKm',val,function(pres){
            // apiClient.post('ssiteapi/platform/countrecord/getPowerOutageLong',val,function(pres){
                // pres = {
                //     "time":3074,
                //     "exception":null,
                //     "status":200,
                //     "results":30
                // }
                if(pres.status == 200){
                    that.DGValue = pres.results.inspectionKm;
                }
            });
        },
        //巡检街道
        geteRepairLong(val){
            var that = this
            apiClient.post('ssiteapi/platform/prodInspection/getInspectionStreet',val,function(pres){
                if(pres.status == 200){
                    that.QXValue = pres.results;
                }
            });
        },
         //巡检异常资产
        getErrorNum(val){
            console.log("getErrorNum");
            var that = this
            apiClient.post('ssiteapi/platform/prodInspection/getAbnormalAsset',val,function(pres){
            // apiClient.post('ssiteapi/platform/countrecord/getPowerOutageLong',val,function(pres){
                // pres = {
                //             "time":3074,
                //             "exception":null,
                //             "status":200,
                //             "results":20
                //         }
                if(pres.status == 200){
                    that.BDZValue = pres.results;
                }
            });
        },
        //当月班组巡检次数比对
        getLineReport:function(val){
            var that = this;
            apiClient.post('ssiteapi/platform/prodInspection/teamInspectionNum',val,function(pres){
            // apiClient.post('ssiteapi/platform/countrecord/getHiddenDangersHeavy',val,function(pres){
            //    pres = {
            //         "time":3074,
            //         "exception":null,
            //         "status":200,
            //         "results":[
            //             {
            //                 "tempName":"一班",
            //                 "num":20
            //             },
            //             {
            //                 "tempName":"二班",
            //                 "num":20
            //             }
            //         ]
            //     };
               that.lineReport = pres.results;
               if(that.lineReport.length>0){
                    setTimeout(function(){
                        that.showPie('lineReport', that.lineReport,'个');
                    },100)
                }
            })
        },
        //异常电杆隐患班组分布比例
        getSeriousLineReport(val){
            var that = this;
            apiClient.post('ssiteapi/platform/prodInspection/getAbnormalNum',val,function(pres){
            // apiClient.post('ssiteapi/platform/countrecord/getHiddenDangersHeavyClassGroup',val,function(pres){
            //   pres = {
            //         "time":3074,
            //         "exception":null,
            //         "status":200,
            //         "results":[
            //             {
            //                 "tempName":"一班",
            //                 "num":10
            //             },
            //             {
            //                 "tempName":"二班",
            //                 "num":30
            //             }
            //         ]
            //     }
              that.BDZPie = pres.results;
               if(that.BDZPie.length>0){
                    setTimeout(function(){
                        that.showPie('BDZPie', that.BDZPie,'个');
                    },100)
                }
            })
        },
        //巡检资产数量表
        getGroupReport(val){
            var that = this;
            apiClient.post('ssiteapi/platform/prodInspection/listTeamAssetByDate',val,function(pres){
               that.applyTrend = pres.results;
               if(that.applyTrend.data.length>0){
                    setTimeout(function(){
                        that.showLine(that.applyTrend);
                    },100)
                }
            })
        },
        //当月班组巡检时长
        getGroupSeriousReport(val){
            var that = this;
            apiClient.post('ssiteapi/platform/prodInspection/teamInspectionDuration',val,function(pres){
            //    pres = {
            //         "time":3074,
            //         "exception":null,
            //         "status":200,
            //         "results":[
            //             {
            //                 "tempName":"一班",
            //                 "num":10
            //             },
            //             {
            //                 "tempName":"二班",
            //                 "num":30
            //             }
            //         ]
            //     };
               that.DGPie = pres.results;
            //    that.DGPie.map((item)=>{
            //     item.num = item.duration;
            //    })
            for(var i=0;i<that.DGPie.length;i++){
                that.DGPie[i].num = that.DGPie[i].duration;
            }
               if(that.DGPie.length>0){
                    setTimeout(function(){
                        that.showBar(pres.results,that.aryColor);
                    },100)
                }
            })
        },
         showPie:function(refValue,data,unit){
            var that = this;
            that.PieObj = echarts.init(that.$refs[refValue]);
            var aryLengend = [];
            var aryData = [];
            var aryColor = that.aryColor;
            for(var i = 0;i<data.length;i++){
                     aryLengend.push(data[i].tempNameCn);
                    aryData.push({
                        name:data[i].tempNameCn,
                        value:data[i].num,
                        itemStyle:{
                            normal: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: aryColor[i%11][0] // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: aryColor[i%11][1] // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            }
                        }
                    })
                
            }
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter:function(obj){
                        return obj.name+'：<br/>'+UtilService.formatNum(obj.value-0)+''+unit+'<br/>（'+obj.percent+'%）';
                    }
                },  
                legend: {
                    show:true,
                    orient: 'vertical',
                    // selectedMode:false,
                    itemWidth:8,
                    itemHeight:8,
                    borderRadius:4,
                    align:'left',
                    textStyle:{
                        color:'#828282',
                    },
                    top:15,
                    left:'60%',
                    data:aryLengend,
                    formatter: function (name) {
                        return name;
                    },
                    tooltip: {
                        show:true,
                        trigger: 'item',
                        formatter:function(obj){
                            return obj.name;
                        }
                    },
                },
                series: [
                    {
                        center:['32%','50%'],
                        name:'访问来源',
                        type:'pie',
                        radius: ['40%', '65%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                formatter:function(obj){
                                    return UtilService.formatNum(obj.value)+unit;
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '24',
                                    color:'#1081fa'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:aryData,
                    }
                ]
            };
            that.PieObj.setOption(option);
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
                var useData = "";
                for(var x in that.applyTrend.relation){
                    if(that.applyTrend.relation[x] == params.seriesName){
                        useData = x;
                    }
                }
                that.$router.push('/vehicle/insAssetNum'+'/'+useData+'-'+that.value1[0]+'-'+that.value1[1])
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
        },
        showBar (data,color){
            var ary1 = [],ary2 = [],ary3 = [],ary4 = [],ary5 = [], xAry = [];
            var dataAll = [],dataName = [],dataSeries=[];
            data.forEach(function(item,ind){
                dataAll.push(item.num/1000);
                dataName.push(item.tempNameCn);
            })
            dataSeries.push({
                        name:"",
                        type:'bar',
                        barWidth: '10%',
                        color:color[1][0],
                        data:dataAll
                    });
            var that = this;
            var bar1 = echarts.init(that.$refs['DGPie']);
            var option = {
                color: ['#3398DB'],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                legend: {
                    data:dataName,
                    left:'1%',
                    top:'10px'
                },
                xAxis : [
                    {
                        type : 'value',
                        splitLine:{
                            lineStyle:{
                                color:'#e5e5e5',
                                type:'dashed'
                            }
                        },
                        minInterval: 1,
                    }
                ],
                yAxis : [
                     {
                        type : 'category',
                        data : dataName,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                   
                ],
                series : dataSeries
            }
            bar1.setOption(option);
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
        numFormat:function(value){
            if(value!==''&&value!==0){
                return UtilService.formatNum(value-0);
            }else{
                return '--';
            }
        }
    }
}
</script>

<style scoped>
 .lineReport {
     width: 100%;
    height: 100%;
    position: relative;
    background: #efefef;
    padding: 10px 10px 0px 10px;
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
.itemImg{
        width: 80px;
        display: inline-block;
        height: 100px;
        position: absolute;
        top: 0px;
        left: 10px;
        bottom: 0px;
    }
    .itemImg.insLong{
         background: url(../../assets/image/insLong.png) no-repeat center;
    }
    .itemImg.insAsset{
         background: url(../../assets/image/insAsset.png) no-repeat center;
    }
    .itemImg.insStreet{
         background: url(../../assets/image/insStreet.png) no-repeat center;
    }
    .itemImg.insErrorMoney{
         background: url(../../assets/image/insErrorMoney.png) no-repeat center;
    }
    .itemImg.number{
         background: url(../../assets/image/number.png) no-repeat center;
    }
    .itemImg.times{
         background: url(../../assets/image/times.png) no-repeat center;
    }
    .itemImg.icon5{
         background: url(../../assets/image/a_icon5.png) no-repeat center;
    }
    .itemImg.icon6{
         background: url(../../assets/image/a_icon6.png) no-repeat center;
    }
    .itemInfo{
        width: 100%;
        padding-right: 10px;
        text-align: right;
        height: 80px;
        float: left;
        margin: 10px 0px;
    }
    .itemInfo .value{
        color: #1081fa;
        font-size: 22px;
        font-weight: bold;
        line-height: 45px;
        
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .itemInfo .text{
        font-size: 12px;
        color: #666565;
        line-height: 20px;
    }
    .content2{
        display: flex;
    }
    .content2 .item{
        flex:1;
        margin-right: 10px;
    }
    .content2 .item:last-child{
            margin-right: 0px;
    }
    .content2 .chartField{
        width: 100%;
        height: 300px;
        background-color: #ffffff;
        box-shadow: 0px 0px 13px 1px 
            rgba(16, 129, 250, 0.1);
        border-radius: 2px;
    }

    .content1 .assetTitle{
        margin-top: 5px;
    }
    .content3{
        display: flex;
    }
    .content3 .item{
        flex:1;
        margin-right: 10px;
    }
    .content3 .item:last-child{
         margin-right: 0px;
    }
    .content3 .chartField{
        width: 100%;
        height: 270px;
        background-color: #ffffff;
        box-shadow: 0px 0px 13px 1px 
            rgba(16, 129, 250, 0.1);
        border-radius: 2px;
    }
    .chartField .chart{
        width: 100%;
        height: 100%;
    }
    .blankImg{
        width: 100%;
        height: 80%;
        background: url("../../assets/image/imgBlank.png") center center no-repeat;
        position: relative;
    }
    .welText{
        width: 100%;
        height: 30px;
        line-height: 30px;
        position: absolute;
        bottom: 0px;
        text-align: center;
        font-size: 16px;
        color: #666565;
    }
#lineReportContent{
    margin-top: -55px;
}
</style>
<style>

.filterBox .filterDataRange{
    width:100%!important;
}
.filterBox .filterDataRange .el-range-separator{
    min-width: 20px;
}
.drillDownBtn {
    background: none;
    border: 0;
    text-decoration: underline;
    cursor: pointer;
}
</style>

