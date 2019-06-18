<template>
    <div class="associationInfo">
        <common-bread class="topBread" :aryBread="aryBread" ></common-bread>
        <div class="infoContent" style="overflow-x: hidden">
            <div class="topOperField">
                <el-button type="primary" v-if="dataObj.status==1" @click="dialogFormVisible = true" class="btnleft">结单</el-button>
            </div> 
			<el-dialog title="结束工单" :visible.sync="dialogFormVisible" >
				<el-form class="endlist">
						<li>
							<span>工单号：</span>
							<span>{{dataObj.workOrderId||'--'}}</span>
							<span>申请时间：</span>
							<span>{{dataObj.applyTime|dateFormat}}</span>       
						</li>
						<li> 
							<span>工单类型：</span>
							<span>{{dataObj.applyUnitCn || '--'}}</span>
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
				<div slot="footer" class="dialog-footer">
					<el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="checklist">确 定</el-button>
				</div>
			</el-dialog>     
            <div class="infoData"> 
                <ul class="ulsBox" >
                    <span class="iconfont icon-gongdan headerSpan">&nbsp;外协详情</span>
					<li>
						<span>处理状态</span>
                        <span>
                            <span v-if="dataObj.status=='0'" class="unManage">未处理</span>
                            <span v-if="dataObj.status=='1'" class="managing">处理中</span>
                            <span v-if="dataObj.status=='2'" class="complete">已完成</span>
                        </span>
						<span>工单号</span>
                        <span>{{dataObj.workOrderId||'--'}}</span>         
                    </li>
                    <li>    
                        <span>申请单位</span>
                        <span>{{dataObj.applyUnitCn || '--'}}</span>
                        <span>申请时间</span>
                        <span>{{dataObj.applyTime|dateFormat}}</span>
                    </li>
                    <li>    
                        <span>申请人</span>
                        <span>{{dataObj.applicantCn||'--'}}</span>
                        <span>电话号码</span>
                        <span >{{dataObj.applicantTel}}</span>
                    </li>
                    <li>
                        <span>项目负责人</span>
                        <span>{{dataObj.principalCn}}</span>
                        <span>电话号码</span>
                        <span>{{dataObj.principalTel}}</span>
                    </li>
               
					<li>
                        <span>工程工号</span>
                        <span>{{dataObj.projectJobId||'--'}}</span>
						<span>工作地点</span>
                        <span >{{dataObj.workLocaCn||'--'}}</span>
                    </li>
                    <li>
                        <span>工作内容</span>
                        <span>{{dataObj.workContent||'--'}}</span>
						<span>调度员</span>
                        <span>{{dataObj.dispatcherCn||'--'}}</span>
                    </li>
                    <li>    
                        <span>工作开始时间</span>
                        <span>{{dataObj.startTime|dayFormat}}</span>
                        <span>工作结束时间</span>
                        <span>{{dataObj.endTime|dayFormat}}</span>
                    </li>
                    <li style="color:red">
                        <span style="color:red">断电分路</span>
                        <span>{{dataObj.shuntCn||'--'}}</span>
                    </li>
                </ul>       
            </div>

			<div class="right">
				<span class="iconfont icon-rizhi rizhi">流转日志</span>
				<div class="rightBox">
					<ul>
						<li class="circulationLog" v-for="(item,ind) in arrayLog" :key='ind'>
							<div>
								<p class="logTime">{{item.createtime|dayFormat}}</p>
								<p class="logTime">{{item.createtime|timeFormat}}</p>
							</div>
							<div  class="logItem">
								<span class="point"></span>
								<p class="listPer">
									{{(item.processor||'--').split('(')[0]}}
									<span class="job">({{item.taskName}})</span>
								</p>
								<p class="listRem">备注:{{item.memo||'--'}}</p>
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div class="bottom" v-if="dataObj.status=='1' || dataObj.status=='2'">
				<ul class="shutBox">
                    <div class="iconfont icon-duandian2 contTit">断电详情</div>
				</ul>
				<el-table :data="tableObj" border header-row-class-name="stable"  height="100%" max-height="100%" row-class-name="sRow cp">
					<el-table-column prop="startTime" label="停电开始时间">
						<template slot-scope='scope'>
							<span>{{scope.row.startTime | dateFormat }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="endTime" label="停电结束时间">
						<template slot-scope='scope'>
							<span>{{scope.row.endTime | dateFormat }}</span>
						</template>
					</el-table-column>
					<el-table-column property="applicantCn" label="申请人" width="100"></el-table-column>
					<el-table-column property="principalCn" label="负责人" width="100"></el-table-column>
					<el-table-column property="dealtime" label="工作时长" >
						<template slot-scope='scope'>
							<span>{{scope.row.endTime-scope.row.startTime | hourFormat }}</span>
						</template>
					</el-table-column>
					<el-table-column property="dispatcherCn" label="调度员" ></el-table-column>
					<el-table-column property="remark" label="备注" min-width="200"></el-table-column>
				</el-table>
                
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
import scheduleInTo from '@/components/common/commonReelectric'

export default {
  name:'associationInfo',
  data(){
      return{
        numberIndex:0,
        flag:false,
        aryBread:[
            {name:'调度管理',url:'/schedule'},
            {name:'外协调度',url:'/schedule/externalCoordination'},
            {name:'外协详情',url:''},
        ],
		dialogFormVisible: false,
        receiveClassElementdo:'',
        showReTask:false,         
        receiveClassElementdo1:'',
        showPowerDialog:false,
        showReelectricDialog:false,
        taskId:'',
        dataObj:{},
        arrayLog:[],
		tableObj:[],
      }
  },
  components: {
    commonBread,commonFooter,scheduleInTo,
  },
  created() {
	var itemId = this.$route.params.id;
    this.getRushLog(itemId);
  },
  methods:{
      
    //   changeshut(){
    //       var that=this;
    //       if(that.dataObj.status=='0'){
    //           that.showshut=false;
    //       }
    //       return showshut;
    //   },
      checklist:function(){
		var closelist={
			workOrderId:this.dataObj.workOrderId,
			dispatcherCn:this.dataObj.dispatcherCn,
			dispatcherAcct:this.dataObj.dispatcherAcct,
		}
		var that=this;
		apiClient.post('ssiteapi/platform/substation/assistexternal/finishAssist',closelist,function(pres){
			if(pres.results==true){
				that.$message({
					message: '结单成功！',
                    type: 'success'
                })
                that.$router.push('/schedule/externalCoordination');
			}else{
				that.$message({
					message: '结单失败，请重新提交！',
                    type: 'failed'
				})
			}
		that.dialogFormVisible = false;
		})
	  },
	  getRushLog:function(itemId){
		var that=this;
		var obj = {
            workOrderId:itemId,
        }
        //
		// 外协详情获取
        apiClient.get('ssiteapi/platform/substation/assistexternal/getDetail/'+itemId,{},function(pres){
            //
			if(pres.status==200){
				that.dataObj=pres.results[0];
			}
		}) 
		//流转日志获取
		apiClient.post('ssiteapi/platform/substation/assistexternal/getAssistLogs',obj,function(pre){
            if(pre.status==200){
				that.arrayLog=pre.results;
			}	
		}) 
		//断电记录获取    
		apiClient.post('ssiteapi/platform/substation/assistexternal/getList',obj,function(pres){
            // er
			if(pres.status==200){
				that.tableObj=pres.results;
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
    .associationInfo{
        width: 100%;
        height: 100%;
        position: relative;
        background: #efefef;
        padding: 10px 10px 0px 10px;
    }  
    .topOperField {
        padding: 10px 0 0 10px;
    }
	.btnleft{
		margin: 0;
	}
    .infoContent{
        width: 100%;
        height: calc(100% - 90px);
        margin-top: 10px;
        background: #ffffff;
        border-radius: 5px;
        overflow: auto;
		font-size: 6pt;
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
        width: 10% !important;
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

    .unManage{
        color: #d9030e;
    }
    .managing{
        color: #1081fa;
    }
    .complete{
        color: #828282;
    }
    .dialog-footer{
        display: block;
        margin: 0 auto;
        width: 300px;
    }
    .dialog-footer>.confirmBtn{
        width: 100%;
    }
    .headerSpan{
        display: block;
        padding: 10px 10px;
        color: #333333;
        border-bottom:#eeeeee solid 1px;
        
	}
	
    .icon-gongdan:before {
		color:#9e9e9e;
		padding-right:5px;
    }
	.icon-duandian2:before{
		color: #666666;
		padding-right:5px;
	}
    .ulsBox{
        float: left;
        border-right: 1px solid #cdcdcd;
        overflow: auto;
    }
	.ulsBox>span{
		font-size: 14px;
		color:  #333333;
	}
    .ulsBox:last-child{
		border-right: none;
    }
    .ulsBox>li{
        background:#fafafa !important;
        font-size: 12px;
	}
	
	.twolist{
		width: 90% !important;
		border-right: none !important;
	}
	
    .infoData,.right {
        height: 530px;
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
	
	.icon-rizhi{
		display: block;
		line-height: 64px;
		color: #333333;
		border-bottom:#eeeeee solid 1px;
		font-size: 14px;
	}
	.icon-rizhi:before{
		color:#9e9e9e;
		padding-right:5px;
	}
    .rightBox {
		display: flex;
		height:calc( 100% - 65px);
		overflow: hidden;
    }
    .rightBox ul {
		
		margin-top: 10px;
        width: 100%;
        height: 100%;
        overflow-y: auto
    }
    .circulationLog {
		flex-basis: 5%;  
		width: 98%;
        display: flex;
	}

	.bottom{
		margin: 10px 10px;
        float: left;
        width:inherit;
        /* line-height: 42px; */
	}
	.bottom .el-table{
		width: calc(100% - 40px);
	}
	.shutBox{
		float: left;
		width:calc(100% - 40px) ;
		border: 1px solid #e8e8e8;
		border-bottom: none;
	}
    .contTit {
        font-size: 14px;
		line-height: 38px;
        color: #333333;
		padding: 10px 10px;
		background-color: #FFFFFF;
		font-weight: bolder;
	}
	.contTit::before{
		font-weight: normal;
		color: #666666;
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
    
	.time{
		width: 100%;
	}
	
</style>