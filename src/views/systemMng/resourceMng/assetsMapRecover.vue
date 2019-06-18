<template>
  <div class="assetsMap">
    <div id="assetsMapField"></div>
    <div class="topBox">
        <!--搜索框  -->
        <div class="searchBox">
            <div class="searchLeft">
                <el-dropdown  @command="handelDrop" class="roadOrNum" trigger="click">
                    <span class="el-dropdown-link">
                        <span v-if="selectType=='0'">街道</span>
                        <span v-else-if="selectType=='1'">杆牌号</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="0">街道</el-dropdown-item>
                        <el-dropdown-item command="1">杆牌号</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <input type="text" v-model="searchText" class="searchText" :placeholder="selectType=='0'?'输入街道':'输入杆牌号'"  v-on:keyup.enter="doSearch"/>
                <div v-show="showSearchList" class="resultList" >
                    
                    <div v-if="streetResults.length==0||selectType=='1'" class="searchNoData">
                        <span v-if="selectType=='0'">未找到相关街道</span>
                        <span v-else-if="selectType=='1'">未找到相关资产</span>
                    </div>
                    <div v-else v-for="(item,index) in streetResults"
                        :key="index"
                        class="perResult"
                        @click="getDataByStreetName(item)"
                        > 
                        <div class="leftIcon">
                            <span class="iconfont icon-dingwei4"></span>
                        </div>
                        <div class="rightInfo">
                            <span class="title" :title="item.streetName">{{item.streetName}}</span>
                            <span class="stitle" :title="item.classGroup">{{item.classGroup}}</span>
                            <!-- <div class="rBtn" size="mini" @click="getDataByStreetName(item)">查看</div> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="searchRight" @click="doSearch">
                <span class="iconfont icon-suosou"></span>
            </div>
        </div>
        <!-- 面包屑 -->
        <div class="breadBox" v-show="searchView==false">
            <span class="breadHead">
                当前范围：
            </span>
            <el-breadcrumb v-if="aryDimBread.length>0" separator-class="el-icon-arrow-right" class="breadItems">
                <el-breadcrumb-item 
                    v-for="(item,index) in aryDimBread"
                    :key="index"
                    >
                    <span class="breadText" @click="clickBread(item,index)">{{item.dimName}}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
            <span v-if="aryDimBread.length==0">全部</span>
        </div>
        <!-- 返回 -->
        <el-button type="primary" v-show="searchView==true" class="backToInit" @click="clickBack"><span class="iconfont icon-fanhui"></span>返回</el-button>
        <!-- 资产概览展开按钮 -->
        <div class="infoOpen" v-show="searchView==false" @click="clickOpenBtn">
            <span class="iconfont icon-zhankai"></span>
        </div>
        <!-- 资产类型 -->
        <div class="assetsType" v-show="!searchView||(searchView&&selectType=='0')">
            <div
                v-for="(item,index) in aryAssetsType"
                :key="index"
                class="perType"
                :class="item.isCheck?'active':''"
                @click="clickAssetsType(item)"
            >
                {{item.classcnname}}
            </div>
        </div>
        
    </div>
    <!-- 视图 -->
    <div class="viewBox"  v-show="searchView==false">
        <div 
            v-for="(item,index) in aryView"
            :key="index"
            class="perView"
            :class="item.isCheck?'active':''"
            @click="clickView(item,index)">
            <span class="iconfont " :class="index==1?'icon-hongqi':'icon-dianzhan'"></span>
            {{item.dimName}}
        </div>
    </div>
    <!-- 资产概览 -->
    <assets-overview :transferDate='JSON.stringify(transferDate)' @closeAts ="closeOverview"></assets-overview>
    <!-- 资产详情 -->
    <assets-detail  :assetsDetail="assetsDetails"></assets-detail>
  </div>
</template>
<script>
import apiClient from '@/publicJs/apiClient.js'
import assetsOverview from "@/components/assetsMng/assetsOverView";
import assetsDetail from '@/components/assetsMng/assetsDetail'

export default {
    name:'assetsMap',
    data(){
        return{
            map:{},
            selectType:'0',
            searchText:'',
            searchView:false,
            showSearchList:false,
            streetResults:[],
            aryView:[],
            aryAssetsType:[],
            transferDate:{
                dimId:'',
                assetsTypeArr:[],
                overViewTitle:'全部',
                isShowOverview: false,
            }, 
            assetsDetails:{
                assetsId:'',
                className:'',
                isOpen:false,
            },
            currentDim:{},
            aryDimBread:[],
            isShowDetail:false,
        }
    },
    components:{
       assetsOverview,
       assetsDetail
    },
    mounted(){
      this.initMap();
      this.getBasicData();
      this.showNowDim();
    },
    watch:{
        searchText:function(newValue, oldValue){
            if(newValue==''){
                this.showSearchList = false;
            }
       },
    },
    methods:{
        // 初始化地图
        initMap:function(){
            this.map = new BMap.Map("assetsMapField");    
            var point = new BMap.Point(116.404, 39.915);    
            this.map.setCurrentCity('北京市');
            this.map.centerAndZoom(point, 12);    
            this.map.enableScrollWheelZoom(true);
            var bottom_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_LARGE}); 
            var bottom_right_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT})
            this.map.addControl(bottom_right_navigation);    
            this.map.addControl( bottom_right_control);   
        },
        handelDrop:function(command){
            this.selectType = command;
            this.showSearchList = false;
        },
        // 搜索视图点击返回
        clickBack(){
            var that = this;
            that.searchView = false;
            that.searchText = '';
            that.aryDimBread = [];
            
            that.map.clearOverlays();
            that.currentDim = that.aryView[0];
            that.clickView(that.aryView[0]);
            that.assetsDetails.isOpen = false;
            that.selectType = '0';
        },
        // 打开资产概览
        clickOpenBtn(){
            this.transferDate.isShowOverview = true;
        },
        // 点击视图
        clickView:function(obj){
            var that = this;
            // 所以分类默认全选
            that.aryAssetsType.forEach(function(item,index){
                item.isCheck = true;
            })
            that.aryView.forEach(function(item,index){
                item.isCheck = false;
            })
            that.aryDimBread = [];

            obj.isCheck = true;
            that.currentDim = obj;
            // 概览
            that.transferDate.assetsTypeArr = that.aryAssetsType;
            that.transferDate.isShowOverview = true;
            that.transferDate.dimId = obj.dimId;
            that.transferDate.overViewTitle = '全部';
            // 面包屑
            that.aryDimBread.push(obj);

            var point = new BMap.Point(116.404, 39.915);    
            that.map.centerAndZoom(point, 12);  

            that.getDimData();
        },
        // 点击资产类型
        clickAssetsType:function(item){
            var that = this;
            var checkedNum = 0;
            that.aryAssetsType.forEach(function(item,inxdex){
                if(item.isCheck){
                    checkedNum++;
                }
            });      
            if(checkedNum==1){
                // 最少留一个类型
                item.isCheck = true; 
            }else{
                item.isCheck = !item.isCheck;
            }
            if(that.searchView){
                that.getDataByStreetName()
            }else{
                if(that.currentDim.isLastNode){
                    that.getAssetsDetails(that.currentDim);
                }else{
                    that.getDimData();
                }
                var aryCheck = [];
                that.aryAssetsType.forEach(function(item,inxdex){
                    if(item.isCheck){
                        aryCheck.push(item);
                    }
                });   
                that.transferDate.assetsTypeArr = aryCheck;
            }
            
        },
        //  // 关闭概览
        closeOverview: function(data) {
            this.transferDate.isShowOverview = data;
        },
        // 点击面包屑
        clickBread:function(item,index){
            var that = this;
            that.transferDate.isShowOverview = false;
            that.assetsDetails.isOpen = false;
            that.aryDimBread = that.aryDimBread.slice(0,index+1);
            that.currentDim = item;
            if(that.currentDim.isLastNode){
                that.getAssetsDetails(that.currentDim);
            }else{
                that.getDimData();
            }
        },
        // 搜索
        doSearch:function(){
            var that = this;
            if(that.selectType=='0'){
                that.searchByStreetName();
            }else{
                that.searchByNum();
            }
            that.assetsDetails.isOpen = false;
        },
        // 按街道搜索
        searchByStreetName(){
            var that = this;
            var tableName = [];
            that.aryAssetsType.forEach(function(item,index){
                if(item.isCheck){
                    tableName.push(item.tableName);
                }
            })
            var param = {
                streetName:that.searchText,
                tableName:tableName
            }
            apiClient.post('ssiteapi/platform/asset/map/listStreetName',param,function(pres){
                if(pres.status==200){
                    that.showSearchList = true;
                    var ary = pres.results;
                    that.streetResults = ary.slice(0,5);
                }
            })
        },
        // 通过街道名搜索街道资产
        getDataByStreetName(item){
            var that = this;
            that.searchView = true;
            that.transferDate.isShowOverview = false;
            var tableName = [];
            that.aryAssetsType.forEach(function(item1,index){
                if(item1.isCheck){
                    tableName.push(item1.tableName);
                }
            })
            var currentDim = {};
            var streetName = '';
            if(item){
                that.searchText = item.streetName;
                streetName = item.streetName; 
            }else{
                streetName = that.searchText;
            }
            var param = {
                streetName:streetName,
                tableName:tableName,
                dimId:59,
                dimName:'班组',
                filterArray:[{"tn":"ResDimClassGroup","alias":"t1530696998582","content":"t1530696998582.firstTeam in ('保一班','保二班')"}]
            } 
            apiClient.post('ssiteapi/platform/asset/map/listAssetDetails',param,function(pres){
                if(pres.status == 200){
                    that.showSearchList = false;
                    that.showCurrentAssets(pres.results);
                }
            })          
        },
        // 展示维度下资产信息
        showCurrentAssets(ary){
            var that = this;
            that.map.clearOverlays();
            that.transferDate.isShowOverview = false;
            var aryPoint = [];
            ary.data.forEach(function(item,index){
                var point = new BMap.Point(item.coordinate.split(';')[0],item.coordinate.split(';')[1]);    
                var imgName = 'pole.png';
                if(item.className=='ResPole'){
                    imgName = 'pole.png';
                }else if(item.className=='ResSluiceBox'){
                    imgName = 'brakeBox.png';
                }else if(item.className=='ResSubstation'){
                    imgName = 'substation.png';
                }
                var icon = new BMap.Icon(require('@/assets/image/assetsMap/'+imgName), new BMap.Size(30,45),{
                    imageOffset: new BMap.Size(0,0)
                });
                var marker = new BMap.Marker(point,{icon:icon,title:item.poleNum}); 
                that.map.addOverlay(marker);
                 
                // var labels = new BMap.Label(item.poleNum,{offset:new BMap.Size(20,20),title:''});
               
                // marker.addEventListener('mouseover',function () {
                //     marker.setLabel(labels);
                // })
                // marker.addEventListener('mouseout',function () {
                //     marker.setLabel(null);
                // })
                marker.addEventListener('click',function () {
                     that.transferDate.isShowOverview = false;
                    that.assetsDetails.assetsId = item.incode;
                    that.assetsDetails.className = item.className;
                    that.assetsDetails.isOpen = true;
                })
                aryPoint.push(point);
                marker.enableDragging();
                marker.addEventListener('dragend',function (type, target, pixel, point) {
                    
                    var item1 = item;
                    var param = {
                        res_id:item1.res_id,
                        coordinate:type.point.lng+';'+type.point.lat,
                    }
                     that.$confirm('确定要移动吗?', '撤销提醒', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var loading = that.$loading({
                            lock: true,
                            text: '保存中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(255,255, 255, 0.6)'
                        });
                        apiClient.post('ssiteapi/platform/asset/info/updateCoordinate',param,function(pres){
                            loading.close();
                            if(pres.status==200){
                                that.$message({
                                    type: 'success',
                                    message: '保存成功',
                                });
                            }
                        })
                    }).catch(action => {
                        var point = new BMap.Point(item.coordinate.split(';')[0],item.coordinate.split(';')[1]);
                        marker.setPosition(point);
                    });
                    
                })
            });
            if(that.searchView){

            }else{
                if(that.aryDimBread.length>1){
                    var obj = that.aryDimBread[that.aryDimBread.length-1];
                    var point = new BMap.Point(obj.centerCoordinate.x,obj.centerCoordinate.y);
                    var marker = new BMap.Marker(point);  
                    that.map.addOverlay(marker);             
                    var label = new BMap.Label("<div class='textMapLabel'>"+obj.dimName+"</div>",{offset:new BMap.Size(-10,-30)});
                    label.setStyle({   
                        border:"none",
                        backgroundColor:'none',
                    });
                    marker.setLabel(label);
                     marker.addEventListener('mouseover',function () {
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        // label.setAnimation(BMAP_ANIMATION_BOUNCE);
                    })
                     marker.addEventListener('mouseout',function () {
                        marker.setAnimation(null);
                        // label.setAnimation(null);
                    })
                    aryPoint.push(point);
                }
            }
            that.map.setViewport(aryPoint);
        },
        // 按资产编号搜索
        searchByNum(){
            var that = this;
            if(that.searchText!==''){
                 var loading = that.$loading({
                    lock: true,
                    text: '加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255,255, 255, 0.6)'
                });
                apiClient.get('ssiteapi/platform/asset/map/getDataByPoleNum/'+that.searchText,'',function(pres){
                    that.map.clearOverlays();
                    if(pres.results){
                        that.showSearchList = false;
                        that.searchView = true;
                        that.transferDate.isShowOverview = false;
                        var point = new BMap.Point(pres.results.coordinate.split(';')[0],pres.results.coordinate.split(';')[1]);    
                        var icon = new BMap.Icon(require('@/assets/image/assetsMap/pole.png'), new BMap.Size(30,45),{
                            imageOffset: new BMap.Size(0,0)
                        });
                        var marker = new BMap.Marker(point,{icon:icon});       
                        that.map.addOverlay(marker); 
                        that.map.setViewport([point]);
                         marker.addEventListener('click',function () {
                            that.transferDate.isShowOverview = false;
                            that.assetsDetails.assetsId = pres.results.incode;
                            that.assetsDetails.className = pres.results.className;
                            that.assetsDetails.isOpen = true;
                        })
                    }else{
                        that.showSearchList = true;
                    }
                    loading.close();
                });
            }
        },  
        // 在地图上展示当前维度
        showNowDim:function(aryData){
            var that = this;
            that.map.clearOverlays();
            var  aryPoint = [];
            $.each(aryData,function(i){
                if(aryData[i].centerCoordinate.y){
                    var point = new BMap.Point(aryData[i].centerCoordinate.x,aryData[i].centerCoordinate.y);
                    aryPoint.push(point);
                    var opts = {
                        position : point,   
                        offset   : new BMap.Size(0, 0)  
                    }

                    var label ;
                    if(aryData[i].isLastNode){
                        label = new BMap.Label("<div class='recMapLabel'><span class='num'>"+aryData[i].num+"</span><span class='title'>"+aryData[i].dimName+"</span></div>", opts);  // 创建文本标注对象
                        label.setStyle({
                        padding:"10px",
                            color : "#ffffff",
                            backgroundImage:"linear-gradient(0deg, rgba(16, 129, 250, 0.9) 0%, rgba(0, 192, 250, 0.9) 100%)",
                            height : "36px",
                            minWidth:"70px",
                            lineHeight : "36px",
                            cursor:"pointer",
                            border:"none",
                            padding:0,
                        });
                    }else{
                        label = new BMap.Label("<div class='circleMapLabel'><p class='title'>"+aryData[i].dimName+"</p><p>"+aryData[i].num+"</p></div>", opts);  // 创建文本标注对象
                        label.setStyle({
                        padding:"10px",
                            color : "#ffffff",
                            backgroundImage:"linear-gradient(0deg, rgba(16, 129, 250, 0.9) 0%, rgba(0, 192, 250, 0.9) 100%)",
                            height : "100px",
                            width:"100px",
                            borderRadius:"50%",
                            lineHeight : "30px",
                            cursor:"pointer",
                            border:"none",
                            opacity: 0.95,
                            boxShadow:'0px 0px 3px 0px rgba(66, 67, 67, 0.57)',
                        });
                    }
                    var aryPolygon = [];
                    $.each(aryData[i].coordinates,function(j){
                        var point2 = new BMap.Point(aryData[i].coordinates[j].x,aryData[i].coordinates[j].y)
                        aryPolygon.push(point2);
                        aryPoint.push(point2);
                    })
                    // 除了最后一级维度都展示范围
                    if(!aryData[i].isLastNode){ 
                        var polygon = new BMap.Polygon(aryPolygon,
                        {
                            strokeColor:"#1081fa", 
                            fillColor:"#1081fa",
                            fillOpacity:0.3,
                            strokeWeight:1, 
                            strokeOpacity:0.5,
                            });  //创建多边形
                        that.map.addOverlay(polygon); 
                        polygon.hide(); 
                    }
                    label.addEventListener('mouseover',function () {
                        if(aryData[i].dimId!== that.transferDate.dimId||that.transferDate.isShowOverview==false){
                            that.transferDate.isShowOverview = false;
                            that.transferDate.dimId = aryData[i].dimId;
                            that.transferDate.overViewTitle = aryData[i].dimName;
                            setTimeout(() => {
                                that.transferDate.isShowOverview = true;
                                that.assetsDetails.isOpen = false;
                            }, 500);
                        }
                        label.setStyle({
                            backgroundImage:"linear-gradient(0deg, rgba(233, 132, 20, 0.9) 0%, rgba(248, 182, 64, 0.9) 100%)",
                        });
                        if(!aryData[i].isLastNode){
                            polygon.show();
                        }
                    })
                    label.addEventListener('mouseout',function () {
                        label.setStyle({
                            backgroundImage:"linear-gradient(0deg, rgba(16, 129, 250, 0.9) 0%, rgba(0, 192, 250, 0.9) 100%)",
                        })
                        if(!aryData[i].isLastNode){
                            polygon.hide();
                        }
                    })
                    label.addEventListener('click',function () {
                        that.currentDim = aryData[i];
                        that.aryDimBread.push(aryData[i]);
                        if(aryData[i].isLastNode){
                            that.getAssetsDetails(aryData[i]);
                        }else{
                            that.getDimData();
                        }
                    })
                    that.map.addOverlay(label);   
                }
            })
            if(that.aryDimBread.length>1){
                var obj = that.aryDimBread[that.aryDimBread.length-1];
                var point = new BMap.Point(obj.centerCoordinate.x,obj.centerCoordinate.y);
                var marker = new BMap.Marker(point);  
                
                that.map.addOverlay(marker);             
                var label = new BMap.Label("<div class='textMapLabel'>"+obj.dimName+"</div>",{offset:new BMap.Size(-10,-30)});
                label.setStyle({   
                    border:"none",
                    backgroundColor:'none',
                });
                marker.setLabel(label);
                marker.addEventListener('mouseover',function () {
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                    // label.setAnimation(BMAP_ANIMATION_BOUNCE);
                })
                marker.addEventListener('mouseout',function () {
                    marker.setAnimation(null);
                    // label.setAnimation(null);
                })
            }
            that.map.setViewport(aryPoint);
            that.map.setViewport(aryPoint);
        },
        // 搜索该维度下资产详情
        getAssetsDetails:function(obj){
            var that = this;
            var loading = that.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(255,255, 255, 0.6)'
            });
            var tableName = [];
            that.aryAssetsType.forEach(function(item,index){
                if(item.isCheck){
                    tableName.push(item.tableName);
                }
            })
            var param = {
                dimId:obj.dimId,
                dimName:obj.dimName,
                filterArray:obj.filterArray,
                tableName:tableName,
            }
            apiClient.post('ssiteapi/platform/asset/map/listAssetDetails',param,function(pres){
                var ary = pres.results;
                that.showCurrentAssets(ary);
                loading.close();
            })

        },
        // 获取基本数据    资产类型和默认视图
        getBasicData(){
            var that = this;
            var loading = that.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(255,255, 255, 0.6)'
            });
            apiClient.get('ssiteapi/platform/asset/map/listFirstAssetClass','',function(pres){
                if(pres.status==200){ 
                    var results = pres.results;
                    var ary = [];
                    results.forEach(function(item,index){
                        if(item.className=='ResPole'){
                            item.isCheck = true;
                            item.icon = 'icon--diangan';
                            ary.push(item);
                        }else if(item.className=='ResSluiceBox'){
                            item.isCheck = true;
                            item.icon = 'icon-dianzha';
                            ary.push(item);
                        }else if(item.className=='ResSubstation'){
                            item.isCheck = true;
                            item.icon = 'icon-dianzhan';
                            ary.push(item);
                        }else if (item.className == 'ResWell') {
                            item.isCheck = true;
                            item.icon = 'icon-dianzhan';
                            ary.push(item);
                        }
                    })
                    that.aryAssetsType = ary;
                    that.transferDate.assetsTypeArr = ary;
                 
                    apiClient.get('ssiteapi/platform/asset/map/listFirstAssetDim','',function(pres){
                        loading.close();
                        pres.results[0].isCheck = true;
                        that.aryView = pres.results;
                        that.currentDim = that.aryView[0];
                        that.transferDate.dimId = that.aryView[0].dimId;
                        that.transferDate.isShowOverview = true;
                        that.assetsDetails.isOpen = false;
                        that.getDimData(that.aryView[0]);
                        that.aryDimBread.push(that.aryView[0]);
                    })
                }else{
                    loading.close();
                }
            })
        },
        // 获取维度数据
        getDimData(){
            var that  = this;
            var loading = that.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(255,255, 255, 0.6)'
            });
            var tableName = [];
            that.aryAssetsType.forEach(function(item,index){
                if(item.isCheck){
                    tableName.push(item.tableName);
                }
            })
            var param = {
                dimId:that.currentDim.dimId,
                dimName:that.currentDim.dimName,
                tableName:tableName,
            }
            apiClient.post('ssiteapi/platform/asset/map/listAssetCount',param,function(pres){
                that.showNowDim(pres.results);
                loading.close();
            })
        },
       
    }
}
</script>
<style scoped src="../../../css/assetsMng/assetsMap.css"></style>
<style>
 .circleMapLabel{
    font-size: 14px;
    text-align: center;
    color: #ffffff;
    width: 100%;
    height: 100%;
    padding-top: 10px;
 }
 .circleMapLabel .title{
     font-size: 16px;
 }
 .recMapLabel{
     font-size: 14px;
     line-height: 34px;
     box-shadow: 0px 0px 3px 0px rgba(66, 67, 67, 0.57);
     background: linear-gradient(0deg,rgba(16,129,250,0.9),20%,rgba(0,192,250,0.9));
 }
 .recMapLabel .num{
     padding:0px 10px;
 }
 .recMapLabel .title{
    display: inline-block;
    background: #ffffff;
    color: #6b6969;
    margin: 2px;
    height: 31px;
    border-radius: 2px;
    padding: 0px 5px;
 }
 .recMapLabel .arrow{
     width: 10px;
     height: 10px;
 }
 .textMapLabel{
    background-image: linear-gradient(0deg, 
		#cd0000 0%, 
		#ff1a00 100%);
	border-radius: 2px;
    color: #ffffff;
    height: 25px;
    line-height: 25px;
    padding:0px 10px;
 }
</style>
