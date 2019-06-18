<template>
    <div class="mainContent">
        <div class="mainBox">
            <div class="mainLaft">
                <div class="leftTop">
                    <div class="charts">
                        <div class="cahrtTop">
                            <div class="txt">访问量</div>
                            <div class="eye"><i class="iconfont icon-shuoming"></i></div>
                        </div>
                        <div class="chartNum1">{{fwl.total}}</div>
                        <div class="chart" ref="pageView" v-show="pageView.length>0"> </div>
                        <div class="blankImg" v-show="!pageView.length>0">
                            <img src="../assets/image/imgBlank.png" alt="">
                        </div>
                        <div class="chartNum2">日访问量：{{fwl.current}}</div>
                    </div>
                    <div class="charts">
                        <div class="cahrtTop">
                            <div class="txt">工单数</div>
                            <div class="eye"><i class="iconfont icon-shuoming"></i></div>
                        </div>
                        <div class="chartNum1">{{gds.total}}</div>
                        <div class="chart" ref="workOrder" v-show="workOrder.length>0"> </div>
                        <div class="blankImg" v-show="!workOrder.length>0">
                            <img src="../assets/image/imgBlank.png" alt="">
                        </div>
                        <div class="chartNum2">日工单：{{gds.current}}</div>
                    </div>
                    <div class="charts">
                        <div class="cahrtTop">
                            <div class="txt">收录文档数</div>
                            <div class="eye"><i class="iconfont icon-shuoming"></i></div>
                        </div>
                        <div class="chartNum1">{{totalFiles}}</div>
                        <div class="chart" ref="onLine" v-show="onLine.length>0"> </div>
                        <div class="blankImg" v-show="!onLine.length>0">
                            <img src="../assets/image/imgBlank.png" alt="">
                        </div>
                        <div class="chartNum2">日收录：{{todayFiles}}</div>
                    </div>
                </div>
                <div class="leftBottom">
                    <div class="title" @click="changeLeftNav($event)">
                        <div class="titIn">
                            <!-- <div :class="['perTit ',isActive=='公告'?'active':'']">公告</div> -->
                            <!-- <div :class="'perTit '+isActive=='公告'?'active':''">公告</div> -->
                            <div :class="['perTit ',isActive=='通告'?'active':'']">通告</div>
                            <div :class="['perTit ',isActive=='新闻'?'active':'']">新闻</div>
                        </div>

                    </div>
                    <div class="conts announcement"  v-loading='loading'>
                        <div class="perConts" v-for="(item,ind) in newsAry" :key="ind">
                            <div class="icons">
                                <img :src='"@/assets/image/mainPage/icon"+ind+".png"' alt="">
                            </div>
                            <div class="news">
                                <div class="newsTit">
                                    <div class="titLeft"> <a target="blank" :href="item.href">{{item.title}}</a> </div>
                                    <div class="titRight">{{item.publishTime?item.publishTime.slice(5):'--'}}</div>
                                </div>
                                <div class="newsBody">

                                    <span >{{item.text}}</span>
                                </div>
                            </div>

                        </div>
                        <div v-show="newsAry.length>0" class="seeMore" @click="seeMore">
                            查看更多>>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mainRight">
                <div class="greetinWords">
                    <div class="userImg">
                        <img src="@/assets/image/userImg.png">
                    </div>
                    <div class="greetinRight">
                        <div class="greetinTit">{{userName}}，{{new Date().getHours()>12?'下午好':'上午好'}}，祝你开心每一天</div>
                        <div class="greetinCont">{{userDept}} | {{Idiograph}}</div>
                    </div>
                </div>
                <div class="weather">
                    <div class="weatherTit">
                        <div class="titIn">
                            生活提示
                        </div>
                    </div>
                    <div class="weatherBody">
                        <div class="weatherBdLeft">
                            <div class="weatherBdLeftTit">
                            {{gregorianCalendar+' '}}{{' 星期'+timeObj().weekCn+'  '}} {{'  '+lunarCalendar}}
                            </div>
                            <div class="weatherBdLeftBody">
                                <img :src="require('@/assets/image/runTrend/bs_weather_'+weatherEnName+'.png')"/>
                                <div class="weatBox">
                                    <div class="wbl">{{temperatureNow}}</div>
                                    <div class="wbr">
                                        <div>°C</div><div>{{weatherCnName}}</div>
                                    </div>
                                </div>
                                <div class="weatBox">{{temperatureScope}}</div>
                                <div class="weatBox">{{wind}}</div>
                            </div>
                        </div>
                        <div class="weatherBdright">
                            <div class="weatherBdRightTit">
                                北京今日限行
                            </div>
                            <div class="weatherBdRightBody">
                                <img :src="require('@/assets/image/mainPage/car.png')"/>
                                <div class="weatBox">
                                    <div class="wbl">{{limitNum[0]}}</div>
                                    <div class="wbc" v-if="limitNum[0]!='不限行'">和</div>
                                    <div class="wbr">{{limitNum[1]}}</div>
                                </div>
                                <div class="weatBox">{{temperatureScope}}</div>
                                <div class="weatBox">{{wind}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="QRCode">
                    <div class="RCodeTit">
                        <div class="titIn">
                            二维码
                        </div>
                    </div>
                    <div class="QRCodeBody">
                        <div class="QRCodeBdBox">
                            <div class="QRcodeImg">
                                <img src="@/assets/image/mainPage/QRCode.png" alt="">
                            </div>
                            <div class="QRcodeTxt">
                                <div>扫一扫</div>
                                <div>关注二维码</div>
                                <div>北京公交集团公众号</div>
                            </div>
                        </div>
                        <div class="QRCodeBdBox">
                            <div class="QRcodeImg">
                                <img src="@/assets/image/mainPage/bjCar.png" alt="">
                            </div>
                            <div class="QRcodeTxt">
                                <div>扫一扫</div>
                                <div>关注二维码</div>
                                <div>北京电车公众号</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">Copyright 2018 国金源富 版权所有</div>
    </div>
</template>

<script>
import echarts from 'echarts'
import apiClient from '@/publicJs/apiClient.js'
import UtilService from '@/publicJs/UtilService'
import commonFooter from "@/components/common/commonFooter";
export default {
    data(){
        return {
            pageView:[],
            workOrder:[],
            onLine:[],
            totalFiles:0,
            todayFiles:0,
            userName:JSON.parse(localStorage.getItem('userInfo')).acountName,
            userDept:JSON.parse(localStorage.getItem('userInfo')).acountName!=='sysadmin'?JSON.parse(localStorage.getItem('userInfo')).ompDept.deptName:'超级管理员',
            weatherEnName:'qing',
            weatherCnName:'',
            temperatureScope:'',
            temperatureNow:'',
            wind:'',
            value1:{startTime: new Date().getTime()-1000*30*60*24*7,endTime:new Date().getTime()},
            isActive:'通告',
            Idiograph:'',
            limitNum:[1,1],
            newsAry:[],
            timeObj(){
                var date = new Date();
                var weekAlb = date.getDay();
                var weekCn = '';
                switch(weekAlb){
                    case 1:
                    weekCn = '一';
                    break;
                    case 2:
                    weekCn = '二';
                    break;
                    case 3:
                    weekCn = '三';
                    break;
                    case 4:
                    weekCn = '四';
                    break;
                    case 5:
                    weekCn = '五';
                    break;
                    case 6:
                    weekCn = '六';
                    break;
                    case 7:
                    weekCn = '日';
                    break;
                }
                return {
                    weekCn:weekCn,
                    fullTime:new Date().toLocaleString(),
                }
            },
            lunar: {tg: '甲乙丙丁戊己庚辛壬癸',
                dz: '子丑寅卯辰巳午未申酉戌亥',
                number: '一二三四五六七八九十',
                year: '鼠牛虎兔龙蛇马羊猴鸡狗猪',
                month: '正二三四五六七八九十冬腊',
                monthadd: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                calendar: [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95]
            },
            lunarCalendar:'',
            gregorianCalendar:'',
            fwl:{},
            gds:{},
            loading:false,
        }
    },
    mounted(){
        this.getWeather();
        this.getGroupReport(this.value1);
        this.getFiles()
        this.getGroupSeriousReport(this.value1);
        this.randomIdiograph();
        this.getLimitNum();
        this.getPublicNoticeAry();
        // UtilService.formatDuring(new Date().getTime(), 'yyyy-MM-dd')
        //获取农历月份
        // var dateObj = this.getLunarDate(UtilService.formatDuring(new Date().getTime(), 'yyyy-MM-dd'));
        this.gregorianCalendar = UtilService.formatDuring(new Date().getTime(), 'MM')+'月'+UtilService.formatDuring(new Date().getTime(), 'dd')+'日';
        this.lunarCalendar = this.getLunarDateString(this.getLunarDate(UtilService.formatDuring(new Date().getTime(), 'yyyy-MM-dd')))
    },
    components:{
        commonFooter
    },
    methods:{
        //跳转到详情
        // toNewsDetail(url){
        //     var that = this;
        //     window.location.href(url)
        // },
        //获取日期
        getLunarDate(date) {

            var year, month, day;
            if (!date) {
                date = new Date(), year = date.getFullYear(), month = date.getMonth(), day = date.getDate();
            } else {
                date = date.split('-'), year = parseInt(date[0]), month = date[1] - 1, day = parseInt(date[2]);
            }

            if (year < 1921 || year > 2020) {
                return {}
            }

            var total, m, n, k, bit, lunarYear, lunarMonth, lunarDay;
            var isEnd = false;
            var tmp = year;
            if (tmp < 1900) {
                tmp += 1900;
            }
            total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + this.lunar.monthadd[month] + day - 38;
            if (year % 4 == 0 && month > 1) {
                total++;
            }
            for (m = 0;; m++) {
                k = (this.lunar.calendar[m] < 0xfff) ? 11 : 12;
                for (n = k; n >= 0; n--) {
                    bit = (this.lunar.calendar[m] >> n) & 1;
                    if (total <= 29 + bit) {
                        isEnd = true;
                        break;
                    }
                    total = total - 29 - bit;
                }
                if (isEnd) break;
            }
            lunarYear = 1921 + m;
            lunarMonth = k - n + 1;
            lunarDay = total;
            if (k == 12) {
                if (lunarMonth == Math.floor(this.lunar.calendar[m] / 0x10000) + 1) {
                    lunarMonth = 1 - lunarMonth;
                }
                if (lunarMonth > Math.floor(this.lunar.calendar[m] / 0x10000) + 1) {
                    lunarMonth--;
                }
            }

            return {
                lunarYear: lunarYear,
                lunarMonth: lunarMonth,
                lunarDay: lunarDay,
            };
        },

        //获取农历日期
        getLunarDateString(lunarDate) {
            if (!lunarDate.lunarDay) return;
            var data = {},
                lunarYear = lunarDate.lunarYear,
                lunarMonth = lunarDate.lunarMonth,
                lunarDay = lunarDate.lunarDay;

            data.tg = this.lunar.tg.charAt((lunarYear - 4) % 10);
            data.dz = this.lunar.dz.charAt((lunarYear - 4) % 12);
            data.year = this.lunar.year.charAt((lunarYear - 4) % 12);
            data.month = lunarMonth < 1 ? '(闰)' + this.lunar.month.charAt(-lunarMonth - 1) : this.lunar.month.charAt(lunarMonth - 1);

            data.day = (lunarDay < 11) ? "初" : ((lunarDay < 20) ? "十" : ((lunarDay < 30) ? "廿" : "三十"));
            if (lunarDay % 10 != 0 || lunarDay == 10) {
                data.day += this.lunar.number.charAt((lunarDay - 1) % 10);
            }
            return data.month+'月'+data.day;
            // return data;//
        },
        //获取公告
        getAfficheAry(){
            var that = this;
            that.loading = true;
            apiClient.get('ssiteapi/platform/homepage/api/showAnnouncement',{},function(pres){
                if(pres.status == 200){
                    that.newsAry = pres.results.slice(0,5);
                    that.loading = false;
                }
            })
        },
        //获取通告
        getPublicNoticeAry(){
            var that = this;
            that.loading = true;
            apiClient.get('ssiteapi/platform/homepage/api/showAnnouncement',{},function(pres){
                if(pres.status == 200){
                    that.newsAry = pres.results.slice(0,5);
                    that.loading = false;
                }
            })
        },
        //获取新闻
        getNewsAry(){
            var that = this;
            that.loading = true;
            apiClient.get('ssiteapi/platform/homepage/api/showNews',{},function(pres){
                if(pres.status == 200){
                    that.newsAry = pres.results.slice(0,5);
                    that.loading = false;
                }
            })
        },
        //随机个签
        randomIdiograph(){
            var array = [
                '今天也是充满希望的一天',
                '牢牢地把握今天，创造美好明天',
                '看得见的伤口，迟早有一天会痊愈的',
                '成功是因为自已，失败也是因为自已',
                '合理安排时间，就等于节约时间',
                '伟大的力量存在于我们的内心',
                '人生最大的敌人是自已怯懦',
                '永不言败是追究者的最佳品格',
                '不要忽视想象，它是我们创意的源泉',
                '苦难与幸福一样，都是生命盛开的花朵',
                '创新有时起源于身边的小事情',
                '兴之所至，心之所安；尽其在我，顺其自然',
                '见善如不及，见不善如探汤',
                '许多人缺少的不是美，而是自信的气质',
                '别让坚强的生命，成为足下阴魂',
                '用宽容的心征服别人无往不胜',
                '信心孕育信心，从胜利走向胜利',
                '用勤奋实现梦想，用智慧成就人生',
                '生命不等于是呼吸，生命是活动',
                '无所保留的关爱，得到无价的幸福',
                '但愿每次回忆，对生活都不感到负疚',
            ]           //转化为数组
            var value = array[Math.round(Math.random()*(array.length-1))]
            this.Idiograph = value;
        },
        //限号
        getLimitNum(){
            var that = this;
            apiClient.get('ssiteapi/platform/homepage/api/showWeather',{},function(pres){
                if(pres.status == 200){
                    that.limitNum = pres.results.limitNum.split('.')
                }
            })
         },
         //点击公告新闻栏
        changeLeftNav(e){
            var that = this;
            var txt = e.target.innerText;
            that.isActive = txt;
            switch(txt){
                case '公告':
                that.getAfficheAry();
                break;
                case '通告':
                that.getPublicNoticeAry();
                break;
                case '新闻':
                that.getNewsAry();
                break;
            }
        },
        seeMore(){
            var that = this;
            switch(that.isActive){
                case '公告':
                    // window.location.href = 'http://www.baidu.com';
                    window.open('http://www.baidu.com', '_blank');
                break;
                case '通告':
                    // window.location.href = 'http://www.bjbus.com/home/fun_news_list.php?uNewsType=1&uStyle=2&uSec=00000177&uSub=00000178';
                    window.open('http://www.bjbus.com/home/fun_news_list.php?uNewsType=1&uStyle=2&uSec=00000177&uSub=00000178', '_blank');
                break;
                case '新闻':
                    // window.location.href = 'http://www.bjbus.com/home/fun_news_list.php?uNewsType=2&uStyle=1&uSec=00000177&uSub=00000179';
                    window.open('http://www.bjbus.com/home/fun_news_list.php?uNewsType=2&uStyle=1&uSec=00000177&uSub=00000179', '_blank');
                break;
            }
        },
        //获取线图 当日 全部
        getGroupReport(val){
            var that = this;
            apiClient.post('ssiteapi/platform/homepage/api/getWeekVisitsVolume',{},function(pres){
                if(pres.status == 200){
                    that.pageView = pres.results.slice(pres.results.length-7,pres.results.length);
                    if(that.pageView.length>0){
                        setTimeout(function(){
                            that.showLine(that.pageView);
                        },100)
                    }
                }
            });
            apiClient.post('ssiteapi/platform/homepage/api/getVisitsVolume',{},function(pres){
                if(pres.status == 200){
                    that.fwl = pres.results;
                }
            })
        },
        //获取文档数
        getFiles(){
            var that = this;
            apiClient.post('ssiteapi/platform/resdir/weekFile',{},function(pres){
                if(pres.status == 200){
                    that.onLine = pres.results.slice(pres.results.length-7,pres.results.length);
                    if(that.onLine.length>0){
                        setTimeout(function(){
                            that.showFileLine(that.onLine);
                        },100)
                    }
                }
            });
            //当日的
            apiClient.post('ssiteapi/platform/resdir/todayFile',{},function(pres){
                if(pres.status == 200){
                    that.todayFiles = pres.results;
                }
            })
            //总的
            apiClient.post('ssiteapi/platform/resdir/totalFile',{},function(pres){
                if(pres.status == 200){
                    that.totalFiles = pres.results;
                }
            })
        },
        //获取柱图
        getGroupSeriousReport(val){
            var that = this;
            apiClient.post('ssiteapi/platform/homepage/api/getWeekWorkOrderCount',val,function(pres){
               that.workOrder = pres.results;
               if(that.workOrder.length>0){
                    setTimeout(function(){
                        that.showBar(that.workOrder);
                    },100)
                }
            })
            apiClient.post('ssiteapi/platform/homepage/api/getWorkOrderCount',{},function(pres){
                if(pres.status == 200){
                    that.gds = pres.results;
                }
            })
        },
        showFileLine(ary){
            var xAry = [],class1Ary = [];
            ary.forEach(function(item,ind){
                xAry.push(item.login_time);
                class1Ary.push(item.countNum);
            });
            var that = this;
            var line1 = echarts.init(that.$refs['onLine']);
            var option = {
                // tooltip: {
                //     trigger: 'item',
                //     formatter: "时间：{b}<br/>数量： {c}个"
                // },
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
                    },
                    show:false
                },
                legend: {
                    data:[],
                    left:'1%',
                    top:'auto'
                },
                grid: {
                    // left: '1%',
                    // right: '1%',
                    // bottom: '5%',
                    // containLabel: true
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
                            color:'transparent',
                            type:'dashed'
                        }
                    },
                    minInterval: 5,
                    show:false,
                    nameTextStyle:{
                        color:'#f00'
                    }
                },

                series: [{
                    name:'保养一班',
                    data: class1Ary,
                    type: 'line',
                    lineStyle:{
                        color:'#13C2C2',
                        width:1,
                    },
                    areaStyle: {
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#13C2C2' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#13C2C2' // 100% 处的颜色
                            }],
                            // globalCoord: false
                        },
                    },
                    itemStyle:{
                        color:'#13C2C2',
                        // borderColor:'#13C2C2',
                        // borderWidth:3,
                    },
                    smooth: false,
                }]
            };
            line1.setOption(option);
        },
        showLine(ary){
            var xAry = [],class1Ary = [];
            ary.forEach(function(item,ind){
                xAry.push(item.login_time);
                class1Ary.push(item.countNum);
            });
            var that = this;
            var line1 = echarts.init(that.$refs['pageView']);
            var option = {
                // tooltip: {
                //     trigger: 'item',
                //     formatter: "时间：{b}<br/>数量： {c}个"
                // },
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
                    },
                    show:false
                },
                legend: {
                    data:[],
                    left:'1%',
                    top:'auto'
                },
                grid: {
                    // left: '1%',
                    // right: '1%',
                    // bottom: '5%',
                    // containLabel: true
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
                            color:'transparent',
                            type:'dashed'
                        }
                    },
                    minInterval: 5,
                    show:false,
                    nameTextStyle:{
                        color:'#f00'
                    }
                },

                series: [{
                    name:'保养一班',
                    data: class1Ary,
                    type: 'line',
                    lineStyle:{
                        color:'#8543E0',
                        width:1,
                    },
                    areaStyle: {
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#8543E0' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#8543E0' // 100% 处的颜色
                            }],
                            // globalCoord: false
                        },
                    },
                    itemStyle:{
                        color:'#8543E0',
                        // borderColor:'#8543E0',
                        // borderWidth:3,
                    },
                    smooth: false,
                }]
            };
            line1.setOption(option);
        },
        showBar (ary){
            // ary = [
            //     {

            //     }
            // ]
            var ary1 = [],xAry = [];
            ary.forEach(function(item,ind){
                xAry.push(item.date)
                ary1.push(item.value)
            })
            var that = this;
            var bar1 = echarts.init(that.$refs['workOrder']);
            var option = {
                // tooltip: {
                //     trigger: 'item',
                //     formatter: "时间：{b}<br/>数量： {c}个"
                // },
                color: ['#33ABFB'],
                grid: {
                    // left: '3%',
                    // right: '4%',
                    // bottom: '3%',
                    // containLabel: true
                },
                xAxis : [
                    {
                        type : 'time',
                        boundaryGap: false,
                        data: xAry,
                        axisLine:{
                            show:false,
                            lineStyle:{

                            }
                        },
                        axisTick:{
                            show:false,
                        },
                        show:false
                    }
                ],
                yAxis : [
                    {
                        axisLine: {
                            show: false
                        },
                        type : 'value',
                        splitLine:{
                            lineStyle:{
                                color:'transparent',
                                type:'dashed'
                            }
                        },
                        minInterval: 5,
                        show:false,
                    }
                ],
                series : [
                    {
                        name:'123',
                        type:'bar',
                        barWidth: '30%',
                        color:'#33ABFB',
                        data:ary1
                    }
                ]
            }
            bar1.setOption(option);
        },
        //获取天气
        getWeather(){
            var that = this;
            $.ajax({
 				url:"http://wthrcdn.etouch.cn/weather_mini?city=" + encodeURIComponent('北京'),
 				type:"get",
 				success:function(pres){
                    var data = JSON.parse(pres);
                    var weather = data.data.forecast[0].type;
                    that.wind = data.data.forecast[0].fengxiang+data.data.forecast[0].fengli.slice(9,13);
                    that.temperatureScope = data.data.forecast[0].low.slice(2)+'～'+data.data.forecast[0].high.slice(2);
                    that.temperatureNow = data.data.wendu;
                    that.weatherCnName = weather;
                    if(weather.indexOf('晴')>-1){
                        that.weatherEnName = 'qing';
                    }else if(weather.indexOf('云')>-1){
                        that.weatherEnName = 'yun';
                    }else if(weather.indexOf('雨')>-1){
                        that.weatherEnName = 'yu';
                    }else if(weather.indexOf('雪')>-1){
                        that.weatherEnName = 'xue';
                    }else if(weather.indexOf('雾')>-1||weather.indexOf('霾')>-1){
                        that.weatherEnName = 'wu';
                    }else if(weather.indexOf('风')>-1){
                        that.weatherEnName = 'feng';
                    }else{
                        that.weatherEnName = 'yun';
                    }
 				}
             })
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

<style scoped lang='scss'>
.footer{
    text-align: center;
    width: 100%;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    color: #989898;
    background: #efefef;
}
.mainBox {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #efefef;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    .mainLaft {
        width: 60%;
        height: 90%;
        .leftTop{
            height: 225px;
            display: flex;
            justify-content: center;
            .charts{
                flex: 1;
                height: 215px;
                background: #fff;
                float: left;
                padding: 0 20px;
                padding-bottom: 10px;
                margin-right: 10px;
                .cahrtTop{
                    width: 100%;
                    height: 20%;
                    font-size: 12px;
                    color:#666;
                    line-height: 50px;

                    overflow: hidden;
                    .txt{
                        float: left;
                        color:#999;
                    }
                    .eye{
                        float: right;
                        cursor: pointer;
                    }
                }
                .chartNum1{
                    font-size: 24px;
                    color:#333;
                }
                .chartNum2{
                    font-size: 10px;
                    color: #666;
                    line-height: 40px;
                }
                .chart{
                    width: calc(100% );
                    height: 45%;
                    border-bottom: 1px solid #E8E8E8;
                }
                .blankImg{
                    width: 100%;
                    height: 45%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    img{
                        width: 60px;
                        height: 50px;
                    }
                }
                .welText{
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    position: absolute;
                    bottom: 0px;
                    text-align: center;
                    font-size: 12px;
                    color: #666565;
                }
            }
        }
        .leftBottom{
            height: 558px;
            width: 99%;
            background: #fff;
            .title{
                .titIn{
                    height: 48px;
                    line-height: 47px;
                    font-size: 14px;
                    color:#000000;
                    // padding-left: 10px;
                    margin: 0 10px;
                    border-bottom: 1px solid #E8E8E8;
                    .perTit{
                        cursor: pointer;
                        float: left;
                        padding: 0 10px;
                        font-size: 14px;
                        color:#333;
                        &:hover{
                            color:#007AFD;
                            border-bottom: 1px solid #007AFD;
                        }

                    }
                    .active{
                        color:#007AFD;
                        border-bottom: 1px solid #007AFD;
                    }
                }

            }
            .conts {
                // height: 500px;
                position: relative;
                font-size: 14px;
                .perConts{
                    overflow: hidden;
                    border-bottom: 1px solid #E8E8E8;
                    margin: 0 0 0 25px;
                    margin-left: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .icons{
                        // width: 70px;
                        height: 80px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img{
                            width: 32px;
                            height: 32px;
                        }
                    }
                    .news{
                        height: 100%;
                        width: calc(100% - 70px);
                        .newsTit {
                            height: 30px;
                            width: 100%;
                            line-height: 30px;
                            padding: 0 10px;
                            .titLeft {
                                float: left;
                                a{
                                color:#333;
                                    text-decoration: none;
                                    &:hover{
                                        color:#007AFD;
                                    }
                                }
                            }
                            .titRight {
                                float: right;
                                color:#999;
                                margin-right: -15px;
                            }

                        }
                        .newsBody{
                            width: 100%;
                            line-height: 30px;
                            padding: 0 10px;
                            text-overflow: ellipsis;
                            color:#666;
                            overflow: hidden;
                            white-space: nowrap;
                            span{
                                color:#999;
                                font-size: 12px;
                            }
                        }
                    }
                }
                .seeMore{
                    line-height: 30px;
                    height: 30px;
                    right: 10px;
                    width: 100px;
                    float: right;
                    text-align: right;
                    padding-right: 10px;
                    color:#007AFD;
                    font-size: 12px;
                    cursor: pointer;
                    &:hover{
                        text-decoration:underline;
                    }
                }
            }
        }
    }
    .mainRight{
        width: 40%;
        height: 90%;
        .greetinWords{
            width: 100%;
            height: 215px;
            padding: 20px 0;
            background: #fff;
            overflow: hidden;
            display: flex;
            justify-content: initial;
            align-items: center;
            .userImg{
                text-align: center;
                // width: 130px;
                margin:0 35px;
                img {
                    width: 98px;
                    height: 98px;
                }
            }
            .greetinRight {
                .greetinTit {
                    height: 40px;
                    font-size: 20px;
                }
                .greetinCont{
                    color:#999;
                    font-size: 14px;
                }
            }
        }
        .weather{
            width: 100%;
            height: 295px;
            background: #fff;
            margin: 10px 0;
            .weatherTit{
                .titIn{
                    height: 48px;
                    font-size: 14px;
                    line-height: 48px;
                    margin: 0 10px;
                    color:#333;
                    border-bottom: 1px solid #E9E9E9;
                }

            }
            .weatherBody{
                height: calc(100% - 48px);
                display: flex;
                .weatherBdLeft {
                    width: 50%;
                    height: 100%;
                    .weatherBdLeftTit{
                        font-size: 14px;
                        color:#333;
                        text-align: center;
                        height: 50px;
                        line-height: 50px;
                    }
                    .weatherBdLeftBody{
                        height: calc(100% - 60px);
                        margin-bottom: 10px;

                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        border-right: 1px solid #eee;
                        .weatBox {
                            margin-top: 10px;
                            overflow: hidden;
                            width: 100%;
                            color:#666;
                            text-align: center;
                            font-size: 12px;
                            display: flex;
                            justify-content:center;
                            .wbl{
                                font-size: 30px;
                                line-height: 36px;
                                color:#333;
                            }
                            .wbr{
                                line-height: 18px;
                                font-size: 12px;
                                color:#666;
                            }
                        }
                    }
                }
                .weatherBdright {
                    width: 50%;
                    height: 100%;
                    .weatherBdRightTit{
                        font-size: 14px;
                        color:#333;
                        text-align: center;
                        height: 50px;
                        line-height: 50px;
                    }
                    .weatherBdRightBody{
                        height: calc(100% - 60px);
                        margin-bottom: 10px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        img{
                            width: 45px;
                            height: 35px;
                        }
                        .weatBox {
                            margin-top: 10px;
                            overflow: hidden;
                            width: 100%;
                            text-align: center;
                            display: flex;
                            justify-content:center;
                            text-align: center;
                            font-size: 12px;
                            color:#666;
                            .wbl{
                                font-size: 30px;
                                line-height: 36px;
                                color:#333;
                            }
                            .wbc{
                                font-size: 13px;
                                line-height: 36px;
                            }
                            .wbr{
                                line-height: 36px;
                                font-size: 30px;
                                color:#333;
                            }
                        }
                    }
                }
            }
        }
        .QRCode{
            height: 250px;
            background: #fff;
            .RCodeTit{
                .titIn{
                    height: 48px;
                    font-size: 14px;
                    line-height: 48px;
                    margin: 0 10px;
                    color:#333;
                    border-bottom: 1px solid #E9E9E9;
                }
            }
            .QRCodeBody{
                height: calc(100% - 48px);
                .QRCodeBdBox{
                    width: 50%;
                    float: left;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .QRcodeImg{
                        text-align: center;
                        vertical-align: middle;
                        img{
                            width: 130px;
                            height: 130px;
                        }
                    }
                    .QRcodeTxt{
                        color:#666;
                        height: 90px;
                        line-height: 30px;
                        font-size: 14px;
                        padding-left: 10px;
                    }
                }
            }
        }
    }
}
@media (min-width: 1365px) and (max-width: 1680px) {
    .mainBox {
        .mainLaft{
            .leftBottom{
                height: 320px;
                .conts{
                    height: 250px;
                    overflow-y: auto;
                }
            }
        }
        .mainRight{
            .greetinWords{
                height: 104px;
                .userImg{
                    text-align: center;
                    width: 90px;
                    margin:0 20px;
                    img {
                        width: 70px;
                        height: 70px;
                    }
                }
            }
            .weather{
                height: 235px;
                .weatherTit{
                    height: 40px;
                    line-height: 40px;
                }
                .weatherBody {
                    .weatherBdLeft{
                        .weatherBdLeftTit{
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                    .weatherBdright{
                        .weatherBdRightTit{
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                }
            }
            .QRCode{
                height: 185px;
                .RCodeTit{
                    height: 40px;
                    line-height: 40px;
                }
                .QRCodeBody{
                    .QRCodeBdBox{
                        .QRcodeImg{
                            img{
                                width: 100px;
                                height: 100px;
                            }
                        }
                        .QRcodeTxt{
                            padding-top: 0px;
                            line-height: 30px;
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }

}

</style>
