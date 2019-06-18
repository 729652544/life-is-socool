<template>
  <div class="commonMsg">
    <div class="msgBox" v-show="showMsgBox">
      <div class="boxHeader">
        <span class="turnSoundOff">
          <i class="iconfont icon-lababofang"></i>
        </span>
        <audio v-show='0' id="msgAudio" :src="require('@/assets/audio/msg.mp3')" controls="controls" preload></audio>
        <audio v-show='0' id="msgAudio2" :src="require('@/assets/audio/msg2.mp3')" controls="controls" preload></audio>
        <span class="acceptData">有新消息&nbsp;&nbsp;({{msgObj.length}})</span>
        <span class="iconfont icon-guanbi1 fr cp" @click="closeMsgBox"></span>
      </div>
      <div class="msgBody">
        <div v-for="(item,ind) in msgObj" :key="ind" class="boxContent">
          <p v-if="item.type == 'material'||item.msg == '班组审核'||item.msg == '队长审核'||item.msg == '库管审核'" class="msgContent">&nbsp;&nbsp;您有一条物料申请工单需要处理</p>  
          <p v-else class="msgContent">&nbsp;&nbsp;{{item.sender}}，发来一条
            <span v-if="item.msgStatus=='transfer'" class="gaiapi">改派</span>
            <span v-if="item.type=='accident'">故障单</span>
            <span v-if="item.type=='maintain'">计划单</span> 
            <span v-if="item.msgStatus!=='transfer'">{{item.topic}}</span>
          </p> 
          <span class="seeInfo" @click="seeDetail(item,ind)">查看详情</span>
        </div>
      </div>
    </div>

    <div class="taskDialog" v-if="showTaskDialog">
      <div class="dgHeader">
        <span>任务详情</span>
        <span class="closeIcon iconfont icon-guanbi1" @click="closeTaskDialog"></span>
      </div>
      <div class="dialogContent">
        <ul>
          <li>
            <span>处理状态：</span>
            <span>
              <span v-if="objTask.currentStatus==1" class="unManage">未处理</span>
              <span v-if="objTask.currentStatus==2" class="managing">处理中</span>
              <span v-if="objTask.currentStatus==3" class="unReAssign">已完成</span>
              <span v-if="objTask.currentStatus==4" class="complete">已撤销</span>
            </span>
            <span>工 单 号 ：</span>
            <span>{{objTask.id||'--'}}</span>
          </li>
          <li>
            <span>工单类型：</span>
            <span v-if="objTask.itemtype=='accident'">故障单</span>
            <span>工单来源：</span>
            <span v-if="objTask.itemsource=='disroom'">调度室</span>
          </li>
          <li>
            <span>调 度 员 ：</span>
            <span>{{objTask.dispatchPerson||'--'}}</span>
            <span>故障地点：</span>
            <span>{{objTask.accidentSite||'--'}}</span>
          </li>
          <li v-if="objTask.itemtype=='accident'">
            <span>报修时间：</span>
            <span>{{objTask.informTime|dateFormat}}</span>
            <span>报修单位：</span>
            <span :title="objTask.receiveRoleName">{{objTask.receiveRoleName||'--'}}</span>
          </li>
          <li v-if="objTask.itemtype=='accident'">
            <span>肇事司机：</span>
            <span>{{objTask.wreckerDriver||'--'}}</span>
            <span>肇事车牌：</span>
            <span>{{objTask.wreckerPlate||'--'}}</span>
          </li>
          <li>
            <span>抢修单位：</span>
            <span>{{objTask.receiveRoleName||'--'}}</span>
            <span>负 责 人 ：</span>
            <span :title="receiveClassElementdo">{{(receiveClassElementdo||'--').split('(')[0]}}</span>
          </li>
          <li>
            <span>出车时间：</span>
            <span>{{objTask.receiveTime|dateFormat}}</span>
            <span>班组成员：</span>
            <span :title="objTask.receiveClassElement">{{objTask.receiveClassElement||'--'}}</span>
          </li>
          <li>
            <span>停电时间：</span>
            <span>{{objTask.blackoutTime|dateFormat}}</span>
            <span>断电分路：</span>
            <span class="redCont">{{objTask.blackoutSectionName||'--'}}</span>
          </li>
          <li>
            <span>恢复时间：</span>
            <span>{{objTask.powerTime|dateFormat}}</span>
            <span>停电时长：</span>
            <span>{{objTask.blackoutDuration|hourFormat}}</span>
          </li>
          <li>
            <span>故障原因：</span>
            <span :title="objTask.accidentCauseApp">{{objTask.accidentCauseApp||'--'}}</span>
            <span>抢修时长：</span>
            <span>{{objTask.repairLong|hourFormat}}</span>
          </li>
          <li>
            <span>故障对象：</span>
            <span >
                <span v-if="objTask.breakDownObject==''||objTask.breakDownObject==null">--</span>
                <span v-else>
                    <span v-for="(item,index) in JSON.parse(objTask.breakDownObject)"
                        :key="index">
                        {{item.typeName+'-'+item.valueName+'；'}}
                    </span>
                </span>
            </span>
            <span>报修原因：</span>
            <span :title="objTask.accidentCause">{{objTask.accidentCause||'--'}}</span>
          </li>
          <li>
            <span>更换物料：</span>
            <span :title="objTask.useMaterial">{{objTask.useMaterial||'无'}}</span>
            <span></span><span></span>
          </li>
          <li>
            <span class="fl">现场照片：</span>
            <div v-if="objTask.beginPicture||objTask.endPicture">
              <img 
               v-for="(item,ind) in objTask.pictureAry"
               :src="imgBath+item" 
               @click="imgAlertPhoto(ind)"
               :key="ind"
                class="imgShow" />
            </div>
            <div v-else class="unbuilt">
              <img src="../../assets/image/unbuilt.png" alt="">
            </div>
          </li>
        </ul>
      </div>

    </div>
    <div class="taskDialog" v-if="showMaintainDetail">
      <div class="dgHeader">
        <span>任务详情</span>
        <span class="closeIcon iconfont icon-guanbi1" @click="closeMaintainDetail"></span>
      </div>
      <div class="dialogContent">
        <ul >
            <li v-if="objTask2.maintainstatus=='1'" class="closeMaintainBtn">
              <el-button @click="confirmMaintainDetail">确认</el-button>
            </li>
            <li>
                <span>处理状态：</span>
                <span>
                  <span v-if="objTask2.maintainstatus=='1'" class="unManage">未处理</span>
                  <span v-if="objTask2.maintainstatus=='2'" class="managing">处理中</span>
                  <span v-if="objTask2.maintainstatus=='3'" class="unReAssign">已完成</span>
                  <span v-if="objTask2.maintainstatus=='4'" class="complete">已撤销</span>
                </span> 
                <span>工 单 号 ：</span>
                <span>{{objTask2.id||'--'}}</span>
                                  
            </li>
            <li>    
                <span>工单类型：</span>
                <span>{{objTask2.itemType&&objTask2.itemType=='maintain'?'计划工单':'--'}}</span>
                <span>工单来源：</span>
                <span>{{objTask2.itemsource||'--'}}</span>
            </li>
            <li>    
                <span>工作班组：</span>
                <span>{{objTask2.maintainClassGroup||'--'}}</span>
                <span>已 停 电 ：</span>
                <span >{{objTask2.isAlreadyPowerFail=='1'?'是':'否'}}</span>
            </li>
            <li>
                <span>申请时间：</span>
                <span>{{objTask2.applyTime|dateFormat}}</span>
                <span>计划时间：</span>
                <span>{{objTask2.plantime|dateFormat}}</span>
            </li>
            <li>
                <span>工作地点：</span>
                <span>{{objTask2.maintainSection||'--'}}</span>
                <span>负 责 人 ：</span>
                <span>{{(objTask2.personLiable||'--').split('(')[0]}}</span>
            </li>
            <li>
                <span>工作内容：</span>
                <span>{{objTask2.maintainRemarks||'--'}}</span>
                <span>调 度 员 ：</span>
                <span>{{objTask2.dispatcherAccount||'--'}}</span>
            </li>
            <li>
                <span>断电分路：</span>
                <span class="redCont">{{objTask2.powerbreak||'--'}}</span>
                <span>出车时间：</span> 
                <span>{{objTask2.receiveTime|dateFormat}}</span>
                
            </li>
            <li>
                <span>停电时间：</span>
                <span>{{objTask2.blackoutTime|dateFormat}}</span>
                <span>恢复时间：</span>
                <span>{{objTask2.recoveryTime|dateFormat}}</span>
            </li>
            
            <li>
                <span>停电时长：</span>
                <span>{{objTask2.powerOutage|hourFormat}}</span>
                <span>更换物料：</span>
                <span :title="objTask2.useMaterial">{{objTask2.useMaterial||'无'}}</span>
            </li>
            <li>
              <span>备  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
              <span>{{objTask2.memo||'--'}}</span>
            </li>
            <li>
                <span class="fl">现场照片：</span>
                <div v-if="objTask2.beginPicture||objTask2.endPicture">
                    <img v-for="(item,index) in objTask2.pictureAry"
                        :key="index"
                        :src="imgBath+item"
                        @click="imgAlertPhoto(index)"
                        class="imgShow" />
                </div> 
                <div v-else class="unbuilt">
                    <img src="../../assets/image/unbuilt.png" alt="">
                </div>
            </li>
            
        </ul>       
      </div>

    </div>
    <div v-if="showImgBox" class="photoDetail">
      <span @click="showImgBox=false" class="closePhotoDetail iconfont icon-cha-copy"></span>
      <div class="photoLeft">
        <div class="imgBox">
          <img class="beginImg" @mousedown="move($event)" :src="imgBath+photoInfo.beginPicture" alt="">
          
        </div>
        <div @click="editImg($event)" class="editImage">
          <span class="iconfont icon-fangda1"></span><span class="iconfont icon-suoxiao"></span><span class="iconfont icon-youxuanzhuan"></span><span class="iconfont icon-zuoxuanzhuan"></span><span class="iconfont icon-shuaxin2"></span>
        </div>
      </div>
      <div class="photoRight">
        <p class="photoInfo">照片详情</p>
        <ul class="infoList">
          <li><span>工单号：</span><span>{{photoInfo.id}}</span></li>
          <li><span>故障地点：</span><span>{{photoInfo.accidentSite||photoInfo.maintainSection||'--'}}</span></li>
          <li><span>照片类型：</span><span>施工前</span></li>
          <li><span>故障原因：</span><span>{{photoInfo.accidentCause||photoInfo.maintainRemarks||'--'}}</span></li>
          <li><span>抢修单位：</span><span>{{photoInfo.receiveRoleName||photoInfo.maintainClassGroup||'--'}}</span></li>
          <li><span>上传时间：</span><span>{{receiveImgTime|dateFormat}}</span></li>
        </ul>
      </div>
    </div>
    <common-power :isShow="showPowerDialog" :processid="processid" @finishWarns="showFinishWarnDialog" @close="closePowerDialog"></common-power>
    <open-door-application :isShow="openDoorDialog" :processid="processid" @close="closeDoorDialog"></open-door-application>
    <common-reelectric :isShow="showReelectricDialog" :processid="processid" @finishWarns="showFinishWarnDialog" @close="closeReelectricDialog"></common-reelectric>
    <maintain-interrupt :isShow="maintainDialog" :processid="processid" @finishWarns="showFinishWarnDialog" @close="closeMaintainPowerDialog"></maintain-interrupt>
    <maintain-reelectric :isShow="reelectricDialog" :processid="processid" @finishWarns="showFinishWarnDialog" @close="closeMaintainReelectricDialog"></maintain-reelectric>
    <commonBroadcast v-if="imgShow" :imageSrc='orderType=="故障单"?objTask.pictureAry:objTask2.pictureAry' :numberIndex='numberIndex' :flag='imgShow' v-on:turnElasticLayer="turnElasticLayer"></commonBroadcast>
    <finish-warn @close='closefinishWarnDialog' :dataObj='dataObj' :isShow='finishWarnDialog'></finish-warn>
    <defect-power-break :isShow="showDefectPowerDialog" :processid="processid" @close="closeDefectPowerDialog"></defect-power-break>
    <defect-power-transmission :isShow="showTransmissionDialog" :processid="processid" @close="closeTransmissionDialog"></defect-power-transmission>
    <shakedown-test :isShow="showShakedownTest" :orderId='processid' @close="closeShakedownTest"></shakedown-test>
  </div>
</template>
<script>
  import apiClient from '@/publicJs/apiClient.js'
  import sockjs from 'sockjs-client';
  import stompjs from 'stompjs';
  import Constants from '@/publicJs/Constants.js'
  import UtilService from '@/publicJs/UtilService'
  import eventBus from '@/publicJs/eventBus.js'
  import commonPower from '@/components/common/commonPower'
  import commonReelectric from '@/components/common/commonReelectric'
  import maintainInterrupt from '@/components/common/maintainInterrupt'
  import maintainReelectric from '@/components/common/maintainReelectric'
  import finishWarn from '@/components/common/finishWarn'
  import commonBroadcast from '@/components/common/commonBroadcast'
  import defectPowerBreak from '@/components/common/defectPower/defectPowerBreak'
  import defectPowerTransmission from '@/components/common/defectPower/defectPowerTransmission'
  import shakedownTest from '@/components/common/defectPower/shakedownTest'
  import openDoorApplication from '@/components/common/openDoorApplication'
  export default {
    name: 'commonMsg',
    data() {
      return {
        user:JSON.parse(localStorage.getItem('userInfo')).acountName,
        imgBath:Constants.imgUrl,
        username: '',
        showMsgBox: false,
        msgContent: '',
        msgTime: '',
        msgObj:[],
        openDoorDialog:false,
        showPowerDialog: false,
        showReelectricDialog: false,
        maintainDialog: false,
        reelectricDialog: false,
        processid: '',
        roleName:[],
        finishWarnDialog:false,
        dataObj:{},
        showTaskDialog:false,
        showMaintainDetail:false,
        showDefectPowerDialog:false,
        showTransmissionDialog:false,
        showShakedownTest:false,
        objTask:{
        },
        objTask2:{
          pictruePath:'{}',
        },
        imgShow:false,
        receiveClassElementdo:'',
        orderType:'',
        stompClient:{},
        audios:'',
        audios2:'',
        showImgBox:false,
        photoInfo:{},
        receiveImgTime:'',
        rotateDeg:0,
        enlargementFactor:1,
      }
    },
    components: {
      openDoorApplication,
      commonPower,
      commonReelectric,
      maintainInterrupt,
      maintainReelectric,
      finishWarn,
      commonBroadcast,
      defectPowerBreak,
      defectPowerTransmission,
      shakedownTest,
    },
    mounted() {
      var that = this;
      // window.localStorage.setItem('audioMsg', 'true');
      var userObj = JSON.parse(localStorage.getItem('userInfo'));
      that.audios = document.getElementById('msgAudio');
      that.audios2 = document.getElementById('msgAudio2');
      if (userObj) {
        this.username = userObj.username;
        this.roleName = userObj.roles;
        this.clientSocket();
        this.getCurrentUnread();
      }
      eventBus.$on('clientSocket', (e) => {
        that.username = userObj.username;
        that.roleName = userObj.roles;
        that.clientSocket();
      })
      eventBus.$on('closeSocket',function(){
        that.closesocket()
      })
    },
    watch:{
      objTask:function(){
          if(this.objTask.receiveClassElement==''){
              this.receiveClassElementdo = '';
          }else{
            var ary = this.objTask.receiveClassElement.split(',');
            this.receiveClassElementdo = ary.join(',');
          }
      },
    },
    methods: {
      move(e){
        if(e.preventDefault){
          e.preventDefault(); 
        }else {
          window.event.returnValue=fale;
        }
        let odiv = e.target;        //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        document.onmousemove = (e)=>{       //鼠标按下并移动的事件
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;    
            let top = e.clientY - disY;
            //移动当前元素
            odiv.style.left = left + 'px';
            odiv.style.top = top + 'px';
        };
        document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
      },
      editImg(e){
        var that = this;
        var img = document.getElementsByClassName('beginImg')[0];
        // var imgBox = document.getElementsByClassName('imgBox')[0];
        if(e.target.className.indexOf('icon-zuoxuanzhuan')>-1){
          that.rotateDeg-=90;
          img.style.transform = 'rotate('+ that.rotateDeg +'deg)'+'scale('+that.enlargementFactor+')';
        }else if(e.target.className.indexOf('icon-youxuanzhuan')>-1){
          that.rotateDeg+=90;
          img.style.transform = 'rotate('+ that.rotateDeg +'deg)'+'scale('+that.enlargementFactor+')';
        }else if(e.target.className.indexOf('icon-fangda1')>-1){
          that.enlargementFactor+=0.1;
          img.style.transform = 'scale('+that.enlargementFactor+')'+'rotate('+ that.rotateDeg +'deg)';
        }else if(e.target.className.indexOf('icon-suoxiao')>-1){
          if(that.enlargementFactor>0.1){
            that.enlargementFactor-=0.1;
            img.style.transform = 'scale('+that.enlargementFactor+')'+'rotate('+ that.rotateDeg +'deg)';
          }
          
        }else {
          var odiv = document.getElementsByClassName('beginImg')[0];
          odiv.style.left = '140px';
          odiv.style.top = '0px';
          that.enlargementFactor = 1;
          that.rotateDeg = 0;
          img.style.transform = 'scale('+that.enlargementFactor+')'+'rotate('+ that.rotateDeg +'deg)'
        }
      },
      turnElasticLayer(flag){
        this.imgShow = flag;
      },
      imgAlertPhoto(index){
        var that = this;
        that.imgShow = true;
        that.numberIndex=index;
      },
      closesocket(){
        var that = this;
        this.stompClient.disconnect();
        that.msgObj = [];
        that.showMsgBox = false;
        that.showTaskDialog = false;
        that.showMaintainDetail = false;
      },
      closeTaskDialog(){
        var that = this;
        that.showTaskDialog = false;
        if (that.$route.name == 'scheduleMap' || that.$route.name == 'scheduleRecord'||that.$route.name == 'scheduleInTo') {
            eventBus.$emit('getAgain',{});
        }
      },
      closeMaintainDetail(){
        var that = this;
        that.showMaintainDetail = false;
        if(that.$route.name == 'maintain'||that.$route.name == 'maintainInfo'){
          eventBus.$emit('getAgain',{});
        };
      },
      confirmMaintainDetail(){
        var that = this;
        var objUser =  JSON.parse(localStorage.getItem('userInfo'));
        var obj = {
          processid:that.objTask2.processid,
          dispatcherAccount:objUser.username,
          accountName:objUser.acountName,
          maintainSection:that.objTask2.maintainSection
        }
        that.showMaintainDetail = false;
        if(that.$route.name == 'maintain'||that.$route.name == 'maintainInfo'){
          eventBus.$emit('getAgain',{});
        };
        apiClient.post('ssiteapi/platform/maintain/api/sendItemConfirm',obj,function(pres){
        })
      },
      clientSocket: function () {
        var that = this;
        var model = 'pc';
        var socket = new sockjs(Constants.apiBaseUrl + 'endpointMessage');
        that.stompClient = Stomp.over(socket);
        // 向服务器发起websocket连接并发送CONNECT帧
        that.stompClient.connect({},
          function connectCallback(frame) {
            that.stompClient.subscribe('/user/' + that.username + model + '/message', function (message) {
              console.log("收到消息：" + message); //body中为具体消息内容
            });

            that.stompClient.subscribe('/role/all/pc', function (message) {
              eventBus.$emit('runTrendRefresh', JSON.parse(message.body));
            });
            // 按角色名 依次创建连接
            $.each(that.roleName,function(i){
              var url = '/role/'+that.roleName[i].roleName+'/'+model;
              that.msgTime = new Date().toLocaleString();
              that.stompClient.subscribe(url, function(message){
                // debugger
                var msg = JSON.parse(message.body);
                if(that.user != msg.sender){
                  that.msgObj.push(msg);
                  if (that.$route.name !== 'login'&&that.$route.name !== 'runTrend') {
                    var length = that.msgObj.length - 1;
                    if(that.roleName[i].roleName=='disroom'){  //调度室角色
                      var lastMsgStatus = that.msgObj[length].msgStatus;
                      var lastMsgType = that.msgObj[length].type;
                      var lastMsgTopic = that.msgObj[length].topic;
                      switch(lastMsgStatus){
                        // 断电消息：显示消息框 播放声音
                        case 'blackout':
                          that.showMsgBox = true;
                          that.playSound();
                          break;
                        // 复电消息：显示消息框 播放声音
                        case 'powerRe':
                          that.showMsgBox = true;
                          that.playSound();
                          break;
                        // 刷新消息
                        case 'flash':
                          if(lastMsgType=='accident'){  //故障单刷新  若在调度模块  刷新页面数据 
                              if (that.$route.name == 'scheduleMap' || that.$route.name == 'scheduleRecord'||that.$route.name == 'scheduleInTo') {
                                eventBus.$emit('getAgain',{});
                              }
                              that.msgObj.splice(length,1);
                          }else if(lastMsgType=="maintain"){ // 保养单刷新
                            if(lastMsgTopic == '创建工单'){ // 创建  弹出详情框 播放声音
                              that.playSound();
                              that.getMaintainDetail(that.msgObj[length].itemid);
                              that.msgObj.splice(length,1);
                            }else if(lastMsgTopic == '确认出班'){ //出班 播放声音 显示消息框
                              that.showMsgBox = true;
                              that.playSound();
                            }else{ //其余 若在保养模块  刷新页面数据
                              if (that.$route.name == 'maintain'||that.$route.name == 'maintainInfo') {
                                eventBus.$emit('getAgain',{});
                              }
                              that.msgObj.splice(length,1);
                            }
                          }
                          
                          break;
                          // 施工完成消息
                          case 'workend':
                          if(lastMsgType=='accident'){
                            if(that.$route.name == "scheduleRecord"||that.$route.name == 'scheduleInTo'){
                              eventBus.$emit('getAgain');
                            }
                          }else if(lastMsgType=="maintain"){
                            if (that.$route.name == 'maintain'||that.$route.name == 'maintainInfo') {
                              eventBus.$emit('getAgain');
                            }
                          }
                          that.msgObj.splice(length,1);
                          break; 
                        //撤销消息
                        case 'Cancel':
                          if(lastMsgType=="maintain"){
                            if (that.$route.name == 'maintain'||that.$route.name == 'maintainInfo') {
                              eventBus.$emit('getAgain');
                            }
                          }
                          that.msgObj.splice(length,1);
                          break;
                        //提交消息
                        case 'submit': 
                          if(lastMsgType == 'accident'){
                            that.playSound();
                            that.getObjTask(that.msgObj[length].itemid)
                          }else if(lastMsgType == 'maintain'){
                            that.playSound();
                            that.getMaintainDetail(that.msgObj[length].itemid)
                          }
                          that.msgObj.splice(length,1);
                          break; 
                        // 转派消息
                        case 'transfer': 
                          if(lastMsgType == 'accident'){
                            that.playSound();
                            that.showMsgBox = true;
                            if (that.$route.name == 'scheduleMap' || that.$route.name == 'scheduleRecord'||that.$route.name == 'scheduleInTo') {
                                eventBus.$emit('getAgain',{});
                            }
                          }
                          break;
                        case 'photo':
                          that.playSound();
                          that.showMsgBox = true;
                          that.receiveImgTime = new Date().getTime();
                          break;
                        //申请进站
                        default:

                          that.playSound();
                          that.showMsgBox = true;
                      }
                    }else if(that.roleName[i].roleName=='tsmanager'||that.roleName[i].roleName=='mcmanager'){
                      var lastMsgStatus = that.msgObj[length].msgStatus;
                      var lastMsgType = that.msgObj[length].type;
                      var lastMsgTopic = that.msgObj[length].topic;
                      if (that.$route.name == 'defectList' || that.$route.name == 'defectInfo') {
                          eventBus.$emit('getAgain',{});
                      }  
                      switch(lastMsgStatus){
                        case 'create'://缺陷上报
                          that.showMsgBox = true;
                          that.playSound();                  
                        break;
                        case 'blackoutApply'://断电
                          that.showMsgBox = true;
                          that.playSound();
                        break;
                        case 'powerRecoveryApply'://送电
                          that.showMsgBox = true;
                          that.playSound();
                        break;
                        case 'complete'://施工完成
                          that.showMsgBox = true;
                          that.playSound();
                        break;
                        case 'debugApply'://调试
                          that.showMsgBox = true;
                          that.playSound();
                        break;
                        case 'taskClassify'://任务归类
                          that.showMsgBox = true;
                          that.playSound();
                        break;
                        case 'taskReceive'://任务处理
                          that.showMsgBox = true;
                          that.playSound();
                        break;
                        case 'submitItem'://补全信息
                          that.showMsgBox = true;
                          that.playSound();
                        break;
                        case 'entryStationApply'://开门申请
                          that.showMsgBox = true;
                          that.playSound();
                          if(that.$route.name == 'inboundManagementList'){
                            eventBus.$emit('getAgain',{});
                          }
                        break;
                        case 'patrolMsg':
                          that.showMsgBox = true;
                          that.playSound();
                        break;
                      }
                    }else if(that.roleName[i].roleName=='mcheck01'){ //班组审核角色
                      if(that.msgObj[length].result == "撤销物料申请工单"){
                        eventBus.$emit('getAgain',{});
                        that.msgObj.splice(length,1);
                      }else {
                        that.showMsgBox = true;
                        that.playSound();
                      }
                    }else if(that.roleName[i].roleName=='mcheck02'){ //队长审核角色
                      that.showMsgBox = true;
                      that.playSound();
                    }else if(that.roleName[i].roleName=='mcheck03'){ //库管审核角色
                      that.showMsgBox = true;
                      that.playSound();
                    }else if(that.roleName[i].roleName=='r1'){//r1审核角色
                      that.showMsgBox = true;
                      that.playSound();
                      if(that.$route.name == 'externalCoordination'){
                        eventBus.$emit('getAgain',{});
                      }
                    }else if(that.roleName[i].roleName=='externalaudit'){//externalaudit审核角色
                      that.showMsgBox = true;
                      that.playSound();
                      if(that.$route.name == 'externalCoordination'){
                        eventBus.$emit('getAgain',{});
                      }
                    }else{ 
                      console.log(new Date().getTime()+'收到消息'+url+':' + message);
                    }
                  }
                }
                  
             });
              
            })
            
          },
          function errorCallBack(error) {
            // 连接失败时（服务器响应 ERROR 帧）的回调方法
            console.log("连接失败");
            that.clientSocket();
          }
        );
      },
      // 获取当前未读消息数量
      getCurrentUnread: function () {
        var that = this;
        var param = {
          "operate": "count",
          accountid: that.username,
          "status": '1',
        }
        apiClient.post('ssiteapi/platform/activity/ms/commonlist', param, function (pres) {
          that.$emit('unReadChange', pres.results.total);
        });
      },
      //获取故障单详情
      getObjTask(itemId){
        var that = this;
        that.orderType = '故障单'
        apiClient.post('ssiteapi/platform/activity/api/qItemHisDetail', {"processid": itemId}, function (pres) {
          if (pres.status == '200') {
            that.objTask = pres.results;
            that.objTask.pictureAry = [];
            if(that.objTask.beginPicture){
              that.objTask.pictureAry.push(that.objTask.beginPicture);
            }
            if(that.objTask.endPicture){
              that.objTask.pictureAry.push(that.objTask.endPicture);
            }
            that.showTaskDialog = true;
          }
        })
      },
      //获取保养单详情
      getMaintainDetail(itemId){
        var that=this;
          var obj = {
            processId:itemId,
          }
          that.orderType = '计划单'
          apiClient.post('ssiteapi/platform/maintain/api/getDetailById',obj,function(pres){
            if(pres.results.itemData.pictruePath==null){
              pres.results.itemData.pictruePath = '{}';
            }
            that.objTask2 = pres.results.itemData;
            that.objTask2.pictureAry = [];
            if(that.objTask2.beginPicture){
              that.objTask2.pictureAry.push(that.objTask2.beginPicture);
            }
            if(that.objTask2.endPicture){
              that.objTask2.pictureAry.push(that.objTask2.endPicture);
            }
            var arr = [],str = '';
            var dictionaryArr = JSON.parse(localStorage.getItem('dictionaryArr'));
            if(that.objTask2.powerbreak!==""){
              arr = that.objTask2.powerbreak.split(';')
              arr.forEach(function(item,ind){
                var a;
                dictionaryArr.forEach(function(item2,ind2){
                  if(item2.itemId == item){
                    a = item2.itemName;
                  }
                })
                str += ','+a;
              })
              that.objTask2.powerbreak = str.slice(1);
            }
            that.showMaintainDetail = true;
          })   
      },
      getPhotoInfo(item){
        var that = this;
        var obj = {};
        if(item.type == 'accident'){
          obj = {
            processid:item.itemid
          }
          apiClient.post('ssiteapi/platform/activity/api/qItemHisDetail',obj,function(pres){
            if(pres.status == 200){
              that.photoInfo = pres.results
            }
          })
        }else if (item.type == 'maintain'){
          obj = {
            processId:item.itemid
          }
          apiClient.post('ssiteapi/platform/maintain/api/getDetailById',obj,function(pres){
            if(pres.status == 200){
              that.photoInfo = pres.results.itemData;
            }
          })
        }
        
      },
      // 查看详情
      seeDetail: function (item,ind) {
        var that = this;
        //把本条记录从消息列表删除
        that.msgObj.splice(ind,1);
        //如果本次消息是断电/送电消息
        if(item.msgStatus == 'blackout'||item.msgStatus == 'powerRe'||item.msgStatus == 'powerRecoveryApply'||item.msgStatus == 'blackoutApply'){
          //如果消息列表不为空，遍历消息列表看看还有没有断电/送电消息
          if(that.msgObj.length>0){
              that.msgObj.forEach(function(item,ind){
                //如果还有，继续响
                if(item.msgStatus == 'blackout'||item.msgStatus == 'powerRe'){
                  that.audios2.play();
                  that.audios2.loop = true;
                }else {//如果没有断电/送电消息  关闭声音
                  that.audios2.pause();
                  that.audios2.load();
                }
              });
          }else {
            that.audios2.pause();
            that.audios2.load();
          }
        }else {
          that.audios.pause();
          that.audios.load();
        }
        //如果本次消息属于物料消息
        if(item.type == 'material'||item.msg == '班组审核'||item.msg == '队长审核'||item.msg == '库管审核'){
          
          if(item.msg == '班组审核'){
            if(that.$route.name !== 'groupApply'){
              that.$router.push('/material');
            }else {
              eventBus.$emit('getAgain',{});
            }
          }else if(item.msg == '队长审核'){
            if(that.$route.name !== 'captainAuditing'){
              that.$router.push('/material/captainAuditing');
            }else {
              eventBus.$emit('getAgain',{});
            }
          }else if (item.msg == '库管审核'){
            
            if(that.$route.name !== 'tubeAuditing'){
              that.$router.push('/material/tubeAuditing');
            }else {
              eventBus.$emit('getAgain',{});
            }
          }
        }else{//如果不是属于物料消息
          if (item.msgStatus == 'blackout') {
            if(item.type == 'maintain'){
              that.processid = item.itemid;
              that.maintainDialog = true;
            }else {
              that.processid = item.itemid;
              that.showPowerDialog = true;
            }
          } else if (item.msgStatus == 'powerRe') {
            if(item.type == 'maintain'){
              that.processid = item.itemid;
              that.reelectricDialog = true;
            }else {
              that.processid = item.itemid;
              that.showReelectricDialog = true;
            }
          } else if (item.msgStatus == 'flash'){
            if(that.$route.name == 'maintain'){
              eventBus.$emit('getAgain',{});
            }else {
              that.$router.push('/schedule/maintain/1');
            }
          }else if(item.msgStatus == 'transfer'){
            if(that.$route.name == 'scheduleRecord'){
              eventBus.$emit('getAgain',{});
            }else {
              that.$router.push('/schedule/scheduleRecord/1');
            }
          }else if (item.msgStatus == 'returnCompany'){
            that.$confirm(item.content+'--'+that.msgTime,'提示',{
              confirmButtonText: '确定',
              cancelButtonText: null,
              type: 'success',
              showCancelButton:false
            }).then(function(){
              eventBus.$emit('getAgain',{});
            })
          }else if(item.msgStatus == 'photo') {
            that.showImgBox = true;
            that.getPhotoInfo(item)
          }else if(item.msgStatus == 'blackoutApply'){//缺陷断电
            if(item.type == 'flaw'){
              that.processid = item.itemid;
              that.showDefectPowerDialog = true;
            }
          }else if(item.msgStatus == 'powerRecoveryApply'){
            if(item.type == 'flaw'){
              that.processid = item.itemid;
              that.showTransmissionDialog = true;
            }
          }else if(item.msgStatus == 'debugApply'){
            if(item.type == 'flaw'){
              that.processid = item.itemid;
              that.showShakedownTest = true;
            }
          }else if(item.msgStatus == 'taskClassify'){
            if(item.type == 'flaw'){
              if(that.$route.name == 'defectList'){
                eventBus.$emit('getAgain',{});
              }else {
                that.$router.push('/powerTransformation/defectList/1');
              }
            }
          }else if(item.msgStatus == 'taskReceive'){
            if(item.type == 'flaw'){
              if(that.$route.name == 'defectList'){
                eventBus.$emit('getAgain',{});
              }else {
                that.$router.push('/powerTransformation/defectList/1');
              }
            }
          }
           else if(item.msgStatus == 'complete'){
            if(item.type == 'flaw'){
              if(that.$route.name == 'defectList'){
                eventBus.$emit('getAgain',{});
              }else {
                that.$router.push('/powerTransformation/defectList/1');
              }
            }
          }else if(item.msgStatus == 'approveAssist'){
            if(that.$route.name == 'externalCoordination'){
                eventBus.$emit('getAgain',{});
              }else {
                that.$router.push('/externalAssistance/externalCoordination');
              }
            
          }
          else if(item.msgStatus == 'create'){
            if(item.type == 'flaw'){
              if(that.$route.name == 'defectList'){
                eventBus.$emit('getAgain',{});
              }else {
                that.$router.push('/powerTransformation/defectList/1');
              }
            }
          }
        }
        //进站申请
        if(item.type == 'entryStation'){
          that.openDoorDialog = true;
          that.processid = item.itemid
        }
        if(that.msgObj.length < 1){
          that.showMsgBox = false;
        }
      },
      //关闭进站弹窗
      closeDoorDialog(){
          var that = this;
          that.openDoorDialog = false;
      },
      // 关闭故障断电框
      closePowerDialog() {
        this.showPowerDialog = false;
        eventBus.$emit('getAgain',{});
      },
      closeDefectPowerDialog(){
        var that = this;
        that.showDefectPowerDialog = false;
        eventBus.$emit('getAgain',{});
      },
      closeTransmissionDialog(){
        var that = this;
        that.showTransmissionDialog = false;
        eventBus.$emit('getAgain',{});
      },
      closeShakedownTest(){
        var that = this;
        that.showShakedownTest = false;
        eventBus.$emit('getAgain',{});
      },
      // 关闭故障复电框
      closeReelectricDialog() {
        this.showReelectricDialog = false;
        eventBus.$emit('getAgain',{});
      },
      //关闭工作断电
      closeMaintainPowerDialog() {
        this.maintainDialog = false;
        eventBus.$emit('getAgain',{});
      },
      //关闭工作复电
      closeMaintainReelectricDialog() {
        this.reelectricDialog = false;
        eventBus.$emit('getAgain',{});
      },
      //展示已被操作弹框
      showFinishWarnDialog(a){
          this.dataObj = a
          this.finishWarnDialog = true
          eventBus.$emit('getAgain',{});
      },
      //关闭已被操作弹框
      closefinishWarnDialog(){
        var that = this;
        // if (that.$route.name == 'maintain' || that.$route.name == 'scheduleRecord'|| that.$route.name == 'scheduleMap'|| that.$route.name == 'interruptRecord') {
          eventBus.$emit('getAgain',{});
          that.finishWarnDialog = false;
          that.showPowerDialog = false;
          that.showReelectricDialog = false;
          that.maintainDialog = false;
          that.reelectricDialog = false;
          that.showDefectPowerDialog = false;
          that.showTransmissionDialog = false;
          that.showShakedownTest = false;
        // }
    },
      closeMsgBox() {
        var that = this;
        that.showMsgBox = false;
        that.msgObj = [];
        that.audios.pause();
        that.audios.load();
        that.audios2.pause();
        that.audios2.load();
        eventBus.$emit('getAgain',{})
        if (that.$route.name == 'maintain' || that.$route.name == 'scheduleRecord') {
          eventBus.$emit('getAgain',{});
        }
      },
      // 播放声音
      playSound(){
        var that = this;
        var length = that.msgObj.length - 1;
          //如果消息是断电申请或者送电申请 循环播放声音2
          if(that.msgObj[length].msgStatus=='blackout'||that.msgObj[length].msgStatus=='powerRe'){
            that.audios2.play();
              if(that.msgObj.length>0){
                  that.msgObj.forEach(function(item,ind){
                    if(item.msgStatus == 'blackout'||item.msgStatus == 'powerRe'){
                        that.audios2.play();
                        that.audios2.loop = true;
                    }
                  });
              }
            //如果都不是 播放声音1
          }else {
            that.audios.play();
              if(that.msgObj.length>0){
                  that.msgObj.forEach(function(item,ind){
                    if(item.msgStatus == 'blackout'||item.msgStatus == 'powerRe'){
                        that.audios2.play();
                        that.audios2.loop = true;
                    }
                  });
              }
          }
      }
    },
    filters: {
      //时间格式化
      timeFormat: function (value) {
        if (value !== '' && value !== 0) {
          return UtilService.formatDuring(value, 'HH:mm:ss');
        } else {
          return '--'
        }
      },
      dateFormat: function (value) {
        if (value !== '' && value !== 0) {
          return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
        } else {
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
  .msgBox {
    width: 400px;
    background: #ffffff;
    position: fixed;
    right: 10px;
    bottom: 10px;
    border-radius: 3px 3px 0px 0px;
    box-shadow: 0px 3px 9px 0px rgba(5, 4, 4, 0.15);
    z-index: 10;
  }

  .boxHeader {
    width: 100%;
    height: 40px;
    background: #fff;
    border-radius: 3px 3px 0px 0px;
    color: #333;
    line-height: 40px;
    padding: 0px 10px;
    font-size: 16px;
  }
  .msgBody {
    max-height: 300px;
    overflow-y: auto;
  }
  .boxContent {
    padding: 5px 20px 15px 10px;
    line-height: 35px;
    margin: 0 10px;
    position: relative;
  }

  .breakContent>ul {
    width: 100%;
    line-height: 50px;
    color: #666;
  }

  .breakContent>ul>li {
    height: 50px;
    display: block;
    width: 100%;
  }

  .breakContent>ul>li>span {
    float: left;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .breakContent>ul>li>span:nth-child(1) {
    width: 20%;
    text-align: center;
  }

  .breakContent>ul>li>span:nth-child(2) {
    width: 30%;
    text-align: left;
  }

  .breakContent>ul>li>span:nth-child(3) {
    width: 20%;
    text-align: center;
  }

  .breakContent>ul>li>span:nth-child(4) {
    width: 30%;
    text-align: left;
  }
  .icon-lababofang {
    color:#1081fa;
    font-weight: bold;
  }
  .seeInfo {
    display: inline-block;
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
    font-family: MicrosoftYaHei;
    text-decoration: underline;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #1081fa;
  }

  .acceptData {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
  }

  .msgContent {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #666666;
  }

  .dialog-footer {
    display: block;
    margin: 0 auto;
    width: 300px;
  }

  .dialog-footer>.confirmBtn {
    width: 100%;
  }

  .turnSoundOff {
    cursor: pointer;

  }

  .turnSoundOpen>i {

    cursor: pointer;
  }
  .hello {
    color:#716f6f;
    font-size: 14px;
  }
  .photoDetail{
    width: 1000px;
    height: 600px;
    position: absolute;
    top: 50%;
    left:50%;
    font-size: 14px;
    border-radius: 2px;
    margin-left: -500px;
    margin-top:-300px;
    background: rgba(0, 0, 0, .5); 
    z-index: 10;
    box-shadow: 1px 2px 9px 0px 
    rgba(155, 152, 152, 0.63);
  }
  .photoLeft {
    width: 700px;
    height: 100%;
    background: #fff;
    float: left;
    position: relative;
  }
  .photoLeft .imgBox {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 20px;
    right: 0;
    margin: auto;
    width: 560px;
    height: 480px;
    overflow: hidden;
  }
  .imgBox .beginImg {
    width: 50%;
    height: 100%;
    left: 140px;
    position: absolute;
  }
  .editImage {
    position: absolute;
    width: 280px;
    height: 40px;
    position: absolute;
    bottom: 10px;
    left: 220px;
    z-index: 0;
    color:#666;
  }
  .editImage .iconfont {
    font-size: 28px;
    margin:0 10px;
    cursor: pointer;
  }
  .photoRight {
    position: absolute;
    right: 0;
    width: 300px;
    height: 100%;
    background: #fff;
    float: left;
    border-left: 1px solid #e1e1e1;
    margin-left: 10px;
  }
  .photoRight ul{
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
    border: 1px solid #e1e1e1;
    border-left: none;
    border-bottom: none;
  }
  .photoRight ul li{
    background:#ffffff;
    display: flex;
    min-height: 30px;
    line-height: 30px;
  }
  .photoRight ul li span {
    display: inline-block;
  }
  .photoRight ul li span:nth-child(1){
    width: 80px;
    border: 1px solid #e1e1e1;
    background: #f5f5f5;
    font-size: 12px;
    color: #333;
    text-align: center;
    border-top: none;
  }
  .photoRight ul li span:nth-child(2){
    width: 195px;
    padding-left: 10px;
    border-bottom: 1px solid #e1e1e1;
    font-size: 12px;
    color:#666;
  }
  .photoInfo {
    margin: 20px 0 0 15px;
    font-weight: bold;
    width: 90%;
  }
  .closePhotoDetail {
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 20px;
    z-index: 1;
    cursor: pointer;
  }
  .taskDialog{
    width: 630px;
    height: 540px;
    position: absolute;
    top: 50%;
    left:50%;
    font-size: 14px;
    border-radius: 2px;
    margin-left: -300px;
    margin-top:-270px;
    background: #ffffff; 
    z-index: 10;
    box-shadow: 1px 2px 9px 0px 
    rgba(155, 152, 152, 0.63);
    padding-top: 50px;
  }
 .taskDialog ul{
    width: 100%;
    /* height: 28px; */
    line-height: 28px;
    padding: 10px;
    color: #666;
}
.taskDialog ul>li{
    background:#ffffff;
    display: block;
    min-height:35px;
}
.taskDialog ul>li>span{
    display: inline-block;
    float: left;
    word-break:keep-all;
    white-space:nowrap;
    overflow:hidden;  
    text-overflow:ellipsis;
    height:35px;
    font-size: 12px
}
.taskDialog ul>li>span:nth-child(1){
    text-indent: 10px;
    width: 12.5%;
    text-align: right;
    color: #333333;
}
.taskDialog ul>li>span:nth-child(2){
    width: 37.5%;
    text-align: left;
    border-right: 1px solid #e5e5e5;
    color: #666666;
}
.taskDialog ul>li>span:nth-child(3){
    text-indent: 10px;
    width: 12.5%;
    text-align: right;
    color: #333333;
}
.taskDialog ul>li>span:nth-child(4){
    width: 37.5%;
    text-align: left;
    color: #666666;
}
.dgHeader{
    width: 100%;
    height: 46px;
    line-height: 46px;
    color: #333333;
    font-size: 14px;
    padding: 0px 20px;
    position: absolute;
    top: 0;
    border-bottom: 1px solid #e5e5e5;
 }
  .dialogContent{
     width: 100%;
     height: 100%;
     overflow: auto;
 }
  .closeIcon{
    float: right;
    cursor: pointer;
    font-size: 14px;
 }
 .closeIcon:hover{
     color: #1081fa;
 }
 .unbuilt {
      padding: 10px 10px;
  }
  .unbuilt>img {
      width: 90px;
      height: 80px;
  }
  .imgShow{
        width: 128px;
        height: 104px;
        margin: 10px 10px 0px 0px;
        display: inline-block;
        border-radius: 2px;
        cursor: pointer;
    }
  .gaiapi {
    color:#1081fa;
    font-weight: bold;
  }
  .closeMaintainBtn {
    padding-left: 82%;
  }
</style>
