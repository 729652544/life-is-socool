<template>
    <div>
        <el-dialog title="结单" :visible="show" :before-close="closeFinishOrder" width="800px">
            <div>
                <el-form :model="finishData" :rules="finishDataRule" ref="finishDataRule" label-width="120px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工单号">
                                <span>{{finishData.flawNo}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="缺陷类型">
                                <span v-if="finishData.flawType == '1273'">硬件设备</span>
                                <span v-if="finishData.flawType == '1274'">软件设备</span>
                                <span v-if="finishData.flawType == '1275'">其他设备</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="缺陷地点">
                                <span>{{finishData.flawCnLoca}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上报来源">
                                <span>{{finishData.flawCnLoca}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="上报时间">
                                <span>{{finishData.reportTime|dateFormat}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上报单位">
                                <span>{{finishData.reportDept}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="上报人名">
                                <span>{{finishData.reportMan}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="缺陷描述">
                                <span>{{finishData.flawCnLoca}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="使用物料"  prop="useMateriels">
                                <el-radio-group v-model="finishData.useMateriels" @change="changeMaterialUse">
                                    <el-radio :label='1'>有使用</el-radio>
                                    <el-radio :label='2'>未使用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item v-if="finishData.useMateriels==1">
                                <el-button @click="addMaterial">请选择使用物料</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item>
                                <p v-for="(item,ind) in materials" :key="ind"  class="defectDevice">
                                    <span>{{item.name}}*{{item.num}}</span> 
                                    <span @click="delDevice(item,ind)" class="icon-cha-copy iconfont delDevice"></span>
                                </p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item prop="accidentCause" label="故障原因">
                                <div v-for="item in accidentCause" :key="item" class="tResonBox">
                                    <span class="reasonText" :title="item">{{item}}</span>
                                    <span class="iconfont icon-guanbianniu" @click="reasonClick(item)"></span>
                                </div>
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    :rows="3"
                                    v-model="tempReason"
                                    placeholder="故障原因以分号分隔，例如：车行线网抽；"
                                    ref="tempReason"
                                ></el-input>
                                <div class="wordCal">{{tempReason.length}}/100 &nbsp;您还可以输入{{100-tempReason.length}}个字</div>
                                <div class="selectReason">
                                    <div
                                    v-for="item in aryAcause"
                                    :key="item.id"
                                    :class="item.have==true?'active':''"
                                    class="perReson"
                                    :title="item.name"
                                    @click="nativeReasonClick(item.name)"
                                    >{{item.name}}</div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="更换设备编码">
                                <el-input v-model="finishData.equipmentCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="处理备注">
                                <el-input v-model="finishData.processMemo" placeholder="结单描述"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="缺陷是否处理" prop="isSolve">
                                <el-radio-group v-model="finishData.isSolve">
                                    <el-radio :label="0">已处理完成</el-radio>
                                    <el-radio :label="1">未处理完成</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row> 
                </el-form>
                <p style="textAlign:center;">
                    <el-button type="info" @click="closeFinishOrder">取消</el-button>
                    <el-button type="primary" @click="confirmFinishOrder">确认</el-button>
                </p>
            </div>
        </el-dialog>
        <el-dialog :visible.sync='showAddMaterialDialog' :title="'添加物料'" top="15%" width='500px'>
            <el-form :model="addMaterForm" ref="addMaterForm" :rules="addMaterFormRule" label-width="120px">
                <el-form-item prop="name" label="物料名称">
                    <el-input v-model="addMaterForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="num" label="物料数量">
                    <el-input v-model="addMaterForm.num"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="calcleAddMaterial">取消</el-button>
                    <el-button @click="confirmAddMaterial">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- <div v-show='materialShow' class="dialogShade">
            <div class="materialDialog">
                <div class="dialogTitle">
                    <p>配料选择</p><span @click='closeMetailDialog' class="iconfont icon-guanbi2"></span>
                </div>
                <div class="partsList">
                    <span class="partCla" v-show='listShow'>请选择配件</span>
                    <div v-show='!listShow'>
                        <div class="showList">
                            <div class="listLeft">
                                <span>物料名称：</span>
                                <span>{{listName}}</span>
                            </div>
                            <div class="listRight">
                                <span>数量：</span>
                                <span class="listNum">
                                    <button @click="delNum">-</button>
                                    <input
                                    v-model="materialNum" class="num">
                                    <button @click="addNum">+</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialogContent">
                    <div class="contentLeft">
                        <el-tree
                        :data="materialTree"
                        :props="defaultProps"
                        accordion
                        node-key='id'
                        @node-click="treeClick"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[2]"
                        highlight-current
                       >
                        </el-tree>

                    </div>
                    <div class="contentRight">
                        <div class="tableField">
                                <el-table
                                @row-click='rowClick'
                                :data="tableData"
                                height="100%"
                                :border="true"
                                row-class-name="sRow cp"
                                style="width: 100%">
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="no"
                                    width="80"
                                    label="序号">
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="materielcode"
                                    label="物料编码">
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="materielname"
                                    label="物料名称">
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="materielspec"
                                    label="规格型号">
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="materielunit"
                                    label="计量单位">
                                </el-table-column>
                            </el-table>
                            <el-pagination
                                v-show="total>10?true:false"
                                class="sPage" @current-change="handleCurrentChange"
                                :current-page.sync="pageNum" :page-size="pageSize"
                                :prev-text="'上一页'" :next-text="'下一页'"
                                layout="prev, pager, next"
                                :total="total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div class="addParts">
                    <el-button type="info" @click='closeMetailDialog'>取消</el-button>
                    <el-button type="primary" @click="confirmDialog">确认</el-button>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import apiClient from '@/publicJs/apiClient.js'
import UtilService from '@/publicJs/UtilService'
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false,
        },
        orderId:{
            type:String,
            default:''
        }
    },
    data(){

        var accRule = (value,rule,callback) => {
            if(this.accidentCause.length>0){
                callback();
            }else {
                callback(new Error('请输入故障原因'))
            }
            
        }
        var numRule = (rule, value, callback) => {
            var reg=/^\d+(\.\d{0,2})?$/;
            if(!reg.test(value)){
                callback(new Error('请输入数字，小数点后最多两位！'))
            }else{
                callback()
            }
        }
        return{
            radio:'1',
            tempReason:'',
            accidentCause:[],
            aryAcause:[],
            flowobj:{},
            finishData:{
                useMateriels:1,
                isSolve:0,
            },
            listShow:true,
            listName:'',
            materialNum:1,
            materialTree:[],
            defaultProps: {
                children: 'children',
                label: 'text'
            },
            tableData:[],
            pageSize:10,
            pageNum:1,
            total:0,
            showAddMaterialDialog:false,
            materials:[],
            addMaterForm:{
                num:0,
                name:'',
            },
            // materialShow:false,
            materialInfo:[],
            finishDataRule:{
                useMateriels:[
                    {required:true,message:'请选择是否使用物料',trigger:'blur'}
                ],
                isSolve:[
                    {required:true,message:'请选择缺陷是否处理',trigger:'blur'}
                ],
                accidentCause:[
                    {required:true,validator:accRule,trigger:'blur'},
                    // {validator:accRule,trigger:'blur'}
                ]
            },
            addMaterFormRule:{
                name:[
                    {required:true,message:'请输入名称',trigger:'blur'}
                ],
                num:[
                    {required:true,message:'请输入数量',trigger:'blur'},
                    { validator:numRule,trigger:'blur'}
                ]
            }
        }
    },
    watch:{

        //输入分号增加故障原因
        tempReason(val){
            var that = this;
            var lastLetter = val.split("")[val.length - 1];
            var a = val.split(";").join("").trim();
            var b = val.split("；").join("").trim();
            if (a !== "" && b !== "") {
                if (lastLetter === ";") {
                    this.accidentCause.push(val.split(";").join(""));
                    this.tempReason = "";
                } else if (lastLetter === "；") {
                    this.accidentCause.push(val.split("；").join(""));
                    this.tempReason = "";
                }
            }
        },
        materialNum:function(val){
            var strVal = val+'';
            var num = 0;
            if(strVal.length==1){
                num = strVal.replace(/[^1-9]/g,'')-0;
            }else{
                num = strVal.replace(/\D/g,'')-0;
            }
            if(num>0&&num<9999){
                this.materialNum = num;
            }else {
                if(num<1){
                    this.materialNum = 1;
                }else if(num >9999) {
                    this.materialNum = 9999;
                }
            }
           
        },
    },
    computed:{
        show(){
            var that = this;
            if(that.orderId){
                //打开弹框，先查详情
                that.getOrderInfo();
                //查询当前账号角色
                that.getRole();
            }
            return this.isShow;
        }
    },
methods:{
    // 点击删除原因
    reasonClick: function(item) {
        var that = this;
        var preAry = this.accidentCause;
        preAry.splice($.inArray(item, preAry), 1);

        $.each(that.aryAcause, function(j) {
            if (item == that.aryAcause[j].name) {
            that.aryAcause[j].have = false;
            }
        });
    },
    changeMaterialUse(val){
        var that = this;
        if(val == 2){
            that.materialInfo = []
        }
    },
    // 点击可选原因
    nativeReasonClick: function(name) {
        var that = this;
        var ary = this.accidentCause;
        if ($.inArray(name, ary) == -1) {
            ary.push(name);
        }
        $.each(that.aryAcause, function(j) {
            if (name == that.aryAcause[j].name) {
            that.aryAcause[j].have = true;
            }
        });
    },
    closeFinishOrder(){
        this.$emit('close',{})
    },
    // closeMetailDialog(){
    //         this.materialTree = [];
    //         this.materialShow = false;
    //     },
    //查详情接口
    getOrderInfo(){
        var that = this;
        apiClient.get('ssiteapi/platform/substation/flaw/api/detail/'+that.orderId,{},function(pres){
            if(pres.status == 200){
                that.finishData = pres.results.itemData;
                that.flowobj = pres.results;
            }
        })
    },
    confirmAddMaterial(){
        var that = this;
        that.$refs['addMaterForm'].validate( valid => {
            if(valid){
                that.materials.push({
                    name:that.addMaterForm.name,
                    num:that.addMaterForm.num
                });
                that.$refs['addMaterForm'].resetFields();
                that.showAddMaterialDialog = false;
            }
        })
    },
    calcleAddMaterial(){
        this.showAddMaterialDialog = false;
    },
    addMaterial(){
        var that = this
        that.showAddMaterialDialog = true;









        
        // var that = this
        // that.stat = '新建';
        // that.materialShow = true;
        
        // that.listShow = true;
        // apiClient.get('ssiteapi/platform/activity/assembly/gettree',{},function(pres){
        //     if(pres.status == 200){
        //         that.className = pres.results.attributes.classname;
        //         that.materialTree = [pres.results];
        //         apiClient.get('ssiteapi/platform/activity/assembly/getByType/'+that.className+'/'+that.pageNum+'/'+that.pageSize,{},function(pres){
        //             if(pres.status == 200){
        //                 that.tableData = pres.results.list;
        //                 that.total = pres.results.totalRecord;
        //             }
        //         })
        //     }
        // })
    },
    // confirmDialog(){
    //     var that = this;
    //     if(!that.listShow){
    //         var isHave = false;
    //         that.materialShow = false;
    //         that.middleData.materielNum = that.materialNum;
    //         that.materialInfo.push(that.middleData);
                
    //     }else {
    //         that.$message({
    //             type:'warning',
    //             message:'您还没有选择物料哦'
    //         })
    //     }
        
    // },
    // rowClick(data){
    //     var that = this;
    //     var obj = {};
    //     that.materialNum = 1;
    //     obj.materielId = data.res_id;
    //     obj.materielName = data.materielname;
    //     obj.materielCode = data.materielcode;
    //     obj.materielSpec = data.materielspec;
    //     obj.materielType = that.className;
    //     obj.materielUnit = data.materielunit;
    //     obj.classname = data.classname;
    //     that.middleData = obj;
    //     that.middleData.materielNum = that.materialNum;
    //     that.listShow = false;
    //     that.listName = data.materielname;
    // },
    // addNum(){
    //     var that = this;
    //     that.materialNum = that.materialNum-0;
    //     that.materialNum++;
        
    // },
    // delNum(){
    //         this.materialNum = this.materialNum-0;
    //     if(this.materialNum>1){
    //         this.materialNum--;
    //     }
    // },
    // treeClick(obj){
    //     var that = this;
    //     that.pageNum = 1;
    //     that.className = obj.attributes.classname;
    //     apiClient.get('ssiteapi/platform/activity/assembly/getByType/'+that.className+'/'+that.pageNum+'/'+that.pageSize,{},function(pres){
    //         if(pres.status == 200){
    //             that.tableData = pres.results.list;
    //             that.total = pres.results.totalRecord;
    //         }
    //     })
    // },
    // handleCurrentChange(val){
    //     var that = this;
    //     that.pageNum = val;
    //     apiClient.get('ssiteapi/platform/activity/assembly/getByType/'+that.className+'/'+that.pageNum+'/'+that.pageSize,{},function(pres){
    //         if(pres.status == 200){
    //             that.tableData = pres.results.list;
    //             that.total = pres.results.totalRecord;
    //         }
    //     })
    // },
    
    //删除缺陷设备
    delDevice(item,ind){
        var that = this;
        that.materials.splice(ind,1);
    },
    getRole(){
        var that = this;
        that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(that.userInfo.roles.length>0){
            that.userInfo.roles.forEach(function(item,ind){
                if(item.roleName == 'tsmanager'){
                    that.userInfo.roleName = 'tsmanager'
                }
            })
        }
    },
    confirmFinishOrder(){
        var that = this;
        that.$refs['finishDataRule'].validate(valid=>{
            if(valid){
                if(that.finishData.useMateriels == 1){
                    if(that.materials.length<1){
                        that.$message({
                            type:'warning',
                            message:'请选择使用物料'
                        })
                    }else {
                        if(that.accidentCause.length<1){
                            that.$message({
                                message:'请输入故障原因，以‘；’结尾。',
                                type:'warning'
                            })
                        }else {
                            var str = '';
                            if(that.materials&&that.materials.length>0){
                                that.materials.forEach(function(item,ind){
                                    str += ';'+item.name+'*'+item.num;
                                })
                            }
                            var param = {
                                taskid: that.flowobj.taskId,
                                processId: that.flowobj.processId,
                                flawNo: that.finishData.flawNo,
                                operateID: 9,
                                processor: that.userInfo.username,
                                processorRole: that.userInfo.roleName,
                                processPerson: that.userInfo.acountName,
                                processAccount: that.userInfo.username,
                                isSolve: that.finishData.isSolve,
                                equipmentCode: that.finishData.equipmentCode,
                                faultCause: that.accidentCause.join(','),
                                useMaterials: str.slice(1),
                                processMemo: that.finishData.processMemo,
                                resultValue: that.finishData.isSolve == '0' ? '1' : '2',//
                                flawProcessNo:1,
                            }
                            apiClient.post('ssiteapi/platform/substation/flaw/submitFlawItem',param,function(pres){
                                if(pres.status == 200){
                                    that.$message({
                                        type:'success',
                                        message:'结单成功'
                                    })
                                    that.show = false;
                                    that.$emit('close',{})
                                }
                            })
                        }
                    }
                        
                }else{
                    if(that.accidentCause.length<1){
                            that.$message({
                                message:'请输入故障原因，以‘；’结尾。',
                                type:'warning'
                            })
                        }else {
                            var str = '';
                            // if(that.materials&&that.materials.length>0){
                            //     that.materials.forEach(function(item,ind){
                            //         str += ';'+item.name+'*'+item.num;
                            //     })
                            // }
                            var param = {
                                taskid: that.flowobj.taskId,
                                processId: that.flowobj.processId,
                                flawNo: that.finishData.flawNo,
                                operateID: 9,
                                processor: that.userInfo.username,
                                processorRole: that.userInfo.roleName,
                                processPerson: that.userInfo.acountName,
                                processAccount: that.userInfo.username,
                                isSolve: that.finishData.isSolve,
                                equipmentCode: that.finishData.equipmentCode,
                                faultCause: that.accidentCause.join(','),
                                useMaterials: str.slice(1),
                                processMemo: that.finishData.processMemo,
                                resultValue: that.finishData.isSolve == '0' ? '1' : '2',//
                                flawProcessNo:1,
                            }
                            apiClient.post('ssiteapi/platform/substation/flaw/submitFlawItem',param,function(pres){
                                if(pres.status == 200){
                                    that.$message({
                                        type:'success',
                                        message:'结单成功'
                                    })
                                    that.show = false;
                                    that.$emit('close',{})
                                }
                            })
                        }
                }
                    
                    
            }
        })
                
    },
},
    filters:{
        dateFormat: function (value) {  
          if(value!==null&&value!==0&&value!==undefined&&value!==""){
            return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
          }else {
            return '--'
          }
        },
    },
}
</script>

<style scoped>
.tResonBox {
  min-width: 100px;
  padding: 0px 10px;
  height: 34px;
  line-height: 34px;
  display: inline-block;
  text-align: center;
  color: #ffffff;
  float: left;
  background: #1081fa;
  position: relative;
  border-radius: 2px;
  margin-right: 10px;
  margin-bottom: 15px;
}
.tResonBox .reasonText {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  display: inline-block;
}
.tResonBox .iconfont {
  position: absolute;
  display: inline-block;
  font-size: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  top: -19px;
  right: -8px;
  color: #faa622;
}
.dialogShade {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.2);
    z-index: 9999;
    top: 0;
    left: 0;
}
.tableField {
    height: calc(100% - 50px) ;
}
@media (min-width: 1600px) {
    .materialDialog {
    width: 850px;
    height: 709px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%)
}
.dialogTitle {
    width: 100%;
    height: 46px;
    padding-left: 20px;
    border-bottom: 1px solid #e5e5e5;
    color: #333333;
    font-size: 14px;
    position: relative; 
}
.dialogTitle p{
    line-height: 46px;
}
.dialogTitle span {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(-50%,-50%)
}
.partsList {
    width: 96%;
    height: 46px;
    line-height: 46px;
    padding-left: 18px;
    margin-left: 18px;
    color: #cccccc;
    font-size: 15px;
    background: #f6f6f6;
    border: solid 1px #e8e8e8;
    margin-top: 10px;
}
.dialogContent {
    width: 100%;
    height: 450px;
    margin-top: 15px;
    padding-left: 18px;
}
.contentLeft {
    width: 286px;
    height: 450px;
    margin-right: 13px;
    float: left;
    border: solid 1px #e8e8e8;
    overflow-y: auto;
}
.contentRight {
    width: 515px;
    height: 450px;
    float: left;
    font-size: 12px;
    border: solid 1px #e8e8e8;
}
.addParts {
    width: 100%;
    margin-top: 22px;
    padding-left: 664px;
}
}
@media (max-width: 1599px){
    .materialDialog {
    width: 800px;
    height: 570px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%)
}
.dialogTitle {
    width: 100%;
    height: 46px;
    padding-left: 20px;
    border-bottom: 1px solid #e5e5e5;
    color: #333333;
    font-size: 17px;
    position: relative; 
}
.dialogTitle p{
    line-height: 46px;
}
.dialogTitle span {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(-50%,-50%)
}
.partsList {
    width: 96%;
    height: 46px;
    line-height: 46px;
    padding-left: 18px;
    margin-left: 18px;
    color: #cccccc;
    font-size: 15px;
    background: #f6f6f6;
    border: solid 1px #e8e8e8;
    margin-top: 10px;
}
.dialogContent {
    width: 100%;
    height: 360px;
    margin-top: 15px;
    padding-left: 18px;
}
.contentLeft {
    width: 240px;
    height: 360px;
    margin-right: 13px;
    float: left;
    border: solid 1px #e8e8e8;
    overflow-y: auto;
}
.contentRight {
    width: 515px;
    height: 360px;
    float: left;
    font-size: 12px;
    border: solid 1px #e8e8e8;
    overflow: hidden;
}
.addParts {
    width: 100%;
    margin-top: 10px;
    padding-left: 620px;
}
}
.partCla {
    color:#333;
}
.showList {
    display: flex;
    height: 46px;
    color:#666;
    font-size: 14px;
}
.listLeft{
    width: 77%;
}
.listLeft span:nth-child(1),.listRight span:nth-child(1){
    color:#333;
}
.listLeft span:nth-child(2),.listRight span:nth-child(2){
    color:#666;
}
.listRight{
    border-top: 1px solid transparent;
}
.listNum {
    display: inline-block;
    height: 36px;
}
.num {
    display: inline-block;
    width: 36px;
    text-align: center;
    border:none;
    outline: none;
    height: 36px;
}
.listNum button {
    border:none;
    outline: none;
    width: 36px;
    height: 36px;
    cursor: pointer;
}

.defectDevice {
    width: 180px;
    height: 36px;
    padding-left: 10px;
    margin: 5px 3px;
    line-height: 36px;
    border: 1px solid #EDEDEE;
    background: #F7F7F7;
    float: left;
    position: relative;
    overflow: hidden;
}
.defectDevice span{
    
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.delDevice {
    margin-left: 10px;
    color:#f00;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 0;
}
</style>
