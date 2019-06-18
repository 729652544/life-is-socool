<template>
    <div class="drawingManagement">
        <common-bread class="topBread" :aryBread="aryBread"></common-bread>
        <div class="drawingMng-left">
            <div class="topBoxLeft">
                <div class="proSearch">
                    <el-input v-model="filterText" placeholder="请输入工程名称" @keyup.enter.native="searchProject"></el-input>
                    <span class="iconfont icon-suosou" @click="searchProject"></span>
                </div>
                <el-tree
                class="filter-tree"
                :data="projectTree"
                :props="defaultProps"
                node-key="id" 
                highlight-current
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                :default-expanded-keys="['root']"
                ref="projectTree">
                </el-tree>
            </div>
        </div>
        <div class="drawingMng-right">
            <div class="detailedInfo">
                <div class="tableOper">
                    <div class="tableOper_top">
                        <div class="fl">
                            <div class="topBox">
                                <el-button type="primary"  @click="addCheck">新增工程</el-button>
                            </div>
                        </div>
                        <div class="fr">
                            <div class="infoSearch">
                                <el-input v-model="infoSearch" placeholder="请输入检查人/检查对象" @keyup.enter.native="searchSchedule"></el-input>
                                <span class="iconfont icon-suosou" @click="searchSchedule"></span>
                            </div>
                        </div>
                    </div>
                    <div class="tableOper_bottom">
                        <el-checkbox @change="changeChecked" v-model="checked">包含子工程文档</el-checkbox>
                        <div class="docNum">
                            <span>总文件数：{{allDocs}}个</span>
                        </div>
                    </div>

                </div>
                <div class="detInfoList" @scroll="handleScroll">
                    <div class="scrollBox">
                        <el-card class="box-card" v-for="(item,ind) in drawingListAry" :key="ind">
                            <div class="fileCardSingle__title">
                                <span>{{item.qcontent}}</span>
                            </div>
                            <div class="fileCardSingle__remark">
                                <span v-if="item.statusId=='2'" class="red">未通过</span>
                                <span v-if="item.statusId=='1'" class="blue">通过</span>
                                <span class="memot">备注：</span>
                                <span class="memoc">{{item.qremarks}}</span>
                            </div>
                            <div class="fileCardSingle__info">
                                <span class="forEngs">
                                    <span class="">所属工程：</span>
                                    <span>20190503</span>
                                </span>
                                <span class="fileCardSingle__info__block">
                                    <span>安全检查人员：</span>
                                    <span>{{item.quser}}</span>
                                </span>
                                <span class="fileCardSingle__info__block">
                                    <span>创建时间：</span>
                                    <span>{{item.qtime|dateFormat}}</span>
                                </span>
                                <span class="fileCardSingle__info__block">
                                    <span>修改时间：</span>
                                    <span>张某</span>
                                </span>
                                <div class="checkDetail">
                                    <el-button type="primary" @click="seedrawingInfo(item)">详情</el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                        
                </div>
            </div>
            <div class="logo">
                <common-footer></common-footer>
            </div>
        </div>
        <!-- 新增检查记录弹框 -->
        <div class="addCheck">
            <el-dialog title="质量检查" :visible.sync="addCheckDialog" width="50%" @close="closeDialog">
                <el-form ref="addCheckForm" :model="addCheckForm" label-width="130px" label-position="right" :rules="addCheckFormRules">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="质量检查日期:" prop="qtime">
                                <el-date-picker
                                v-model="addCheckForm.qtime"
                                type="date"
                                placeholder="选择检查日期">
                                </el-date-picker>
                            </el-form-item>       
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="质量检查人员:" prop="quser">
                                <el-input placeholder="请输入质检人员" v-model="addCheckForm.quser"></el-input>
                            </el-form-item>     
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label-width="15%" label="质量检查内容:" prop="qcontent">
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    :rows="3"
                                    v-model="addCheckForm.qcontent"
                                    placeholder="请输入检查内容"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label-width="15%" label="质量检查报告:">
                                <a-upload name="multipartFile" :multiple="true" :action="uploadUrl" :headers="headers" @change="docHandleChange">
                                    <a-button>
                                    <a-icon type="upload" /> 上传文件
                                    </a-button>
                                </a-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label-width="15%" label="现场图片:">
                                <div class="clearfix">
                                    <a-upload
                                     name="multipartFile"
                                    :action="uploadUrl"
                                    listType="picture-card"
                                    :fileList="fileList"
                                    @preview="handlePreview"
                                    @change="handleChange"
                                    >
                                        <div v-if="fileList.length <6">
                                            <a-icon type="plus" />
                                            <div class="ant-upload-text">上传照片</div>
                                        </div>
                                    </a-upload>
                                    <el-dialog  title="图片预览" :visible.sync="previewVisible" width="30%" @cancel="handleCancel">
                                        <img alt="example" style="width: 100%" :src="previewImage" />
                                    </el-dialog>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="检查结论:" prop="statusId">
                                <el-radio v-model="addCheckForm.statusId" label="1">通过</el-radio>
                                <el-radio v-model="addCheckForm.statusId" label="2">未通过</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label-width="15%" label="记录说明：">
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    :rows="3"
                                    v-model="addCheckForm.qremarks"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-form-item class="checkButtom">
                        <el-button type='info' @click="cancelSubmit">取消</el-button>
                        <el-button type="primary" @click="onSubmit">确认</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import commonFooter from "@/components/common/commonFooter";
import apiClient from "@/publicJs/apiClient.js";
import UtilService from "@/publicJs/UtilService";
import commonBread from '@/components/common/commonBread';
import $ from 'jquery';
export default {
    name:'drawingManagement',
    data() {
        return {
            aryBread: [{
                    name: '工程管理',
                    url: '/engineerMng/engineerList'
                },
                {
                    name: '质量管理',
                    url: ''
                },
            ],
            drawingMngList:[],
            addCheckForm:{
                eId: '',
                qtime: new Date(),
                createUser: JSON.parse(localStorage.getItem("userInfo")).acountName,
                createUserCn: JSON.parse(localStorage.getItem("userInfo")).username,
                quser: '',
                qcontent: '',
                qremarks: '',
                statusId: '1',
                fileList:[],
            },
            addCheckFormRules:{
                qtime:[
                    {required:true,message:'请选择时间',trigger:'blur'}
                ],
                quser:[
                    {required:true,message:'请输入安检人员',trigger:'blur'}
                ],
                qcontent:[
                    {required:true,message:'请输入安检内容',trigger:'blur'}
                ],
                statusId:[
                    {required:true,message:'请选择检查结论',trigger:'blur'}
                ]
            },
            addCheckDialog: false,
            infoSearch: '',
            filterText: '',
            projectTree: [],
            defaultProps: {
            children: 'children',
            label: 'label'
            },
            previewVisible: false,
            previewImage: '',
            fileList: [],
            headers: {
                authorization: 'authorization-text',
            },
            checked:false,
            fileInfoData:[],
            drawingListAry:[],
            allDocs:0,
            infoType:'add',
            treeChecked:{},
            pageNum:1,
            pageSize:10,
            getType:'update',

        };
    },
    components: {
        commonBread,
        commonFooter
    },

    created(){
        var that = this;
        that.getType = 'update';
        that.getProject();
        that.setUrl();
        that.getdrawingList();
        
    },
    methods: {
        handleScroll(){
            var that = this;
            let scrollTop = $('.detInfoList').scrollTop();
            let scrollHeight = $('.scrollBox').height();
            let windowHeight = $('.detInfoList').height();
            if(scrollTop+windowHeight>=scrollHeight){
                that.getType = 'add';
                that.pageNum++;
                that.getdrawingList();
            }
        },
        getProject(){
            var that = this;
            apiClient.post("ssiteapi/project/drawing/treeProject",{}, function(pres){
                if (pres.status == 200) {
                    that.projectTree = [pres.results];
                }
            });
        },
        //左侧树结构搜索
        searchProject(){
            this.$refs.projectTree.filter(this.filterText);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //点击新增按钮
        addCheck(){
            var that = this;
            that.infoType = 'add';
            that.addCheckForm = {
                eId: '',
                qtime: new Date(),
                createUser: JSON.parse(localStorage.getItem("userInfo")).acountName,
                createUserCn: JSON.parse(localStorage.getItem("userInfo")).username,
                quser: '',
                qcontent: '',
                qremarks: '',
                statusId: '1',
                fileList:[],
            }
            that.addCheckDialog = true;
        },
        setUrl:function(){
            this.uploadUrl = apiClient.fileUrl();
        },
        //文件上传
        docHandleChange(info) {
            var that = this;
            console.log("docHandleChange",info);
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
                that.fileInfoData = info.fileList;
            }
            if (info.file.status === 'done') {
                this.$message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} 上传失败`);
            }
        },
        handleCancel() {
            this.previewVisible = false
        },
        handlePreview (file) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true
        },
        //图片上存
        handleChange (info) {
            var that = this;
            this.fileList = info.fileList;
            if (info.file.status !== 'uploading') {
                that.fileList = info.fileList;
            }
            if (info.file.status === 'done') {
                that.$message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                that.$message.error(`${info.file.name} 上传失败`);
            }
        },
        //取消按钮
        cancelSubmit(){
            var that = this;
            that.closeDialog();
        },
        closeDialog(){
            var that = this;
            that.addCheckDialog = false;
        },
        searchSchedule(){
            var that = this;
            that.getdrawingList();
        },
        changeChecked(){
            var that = this;
            that.getdrawingList();
        },
        handleNodeClick(val,val2){
            var that = this;
            that.treeChecked = val;
            that.getdrawingList();
            that.getFileNum();
        },
        getFileNum(){
            var that = this;
            var param = {
                eid:that.treeChecked.id,
            }
            if(that.checked){
                param.type = 'child';
            }
            apiClient.post('ssiteapi/project/drawing/getFileNum',param,function(pres){
                if(pres.status == 200){
                    that.allDocs = pres.results;
                }
            })
        },
        seedrawingInfo(item){
            var that = this;
            that.infoType = 'edit';
            apiClient.get('ssiteapi/project/drawing/getDetail/'+item.qId,{},function(pres){
                if(pres.status == 200){
                    that.addCheckForm = pres.results;
                    that.addCheckDialog = true;
                }
            })
        },
        //编辑、保存按钮
        onSubmit(){
            var that = this;
            var param = {
                eId:that.addCheckForm.eId,
                createUser:JSON.parse(localStorage.getItem("userInfo")).username,
                createUserCn:JSON.parse(localStorage.getItem("userInfo")).acountName,
                quser:that.addCheckForm.quser,
                qcontent:that.addCheckForm.qcontent,
                qremarks:that.addCheckForm.qremarks,
                statusId:that.addCheckForm.statusId,
                report:[],
                picture:[],
            }
            that.fileInfoData.map((item)=>{
                if(item.response){
                    param.report.push({
                        fileName:item.name,
                        fileType:item.name.split(".")[item.name.split(".").length-1],
                        saveUrl:item.response.results.saveUrl,
                        fileSize:item.response.results.fileSize
                    })
                }
            })
            that.fileList.map((item)=>{
                if(item.response){
                    param.picture.push({
                        fileName:item.name,
                        fileType:item.name.split(".")[item.name.split(".").length-1],
                        saveUrl:item.response.results.saveUrl,
                        fileSize:item.response.results.fileSize
                    })
                }
            })
            if(typeof that.addCheckForm.qtime == 'number'){
                param.qtime = that.addCheckForm.qtime
            }else{
                param.qtime = that.addCheckForm.qtime.getTime()
            }
            that.$refs['addCheckForm'].validate(valid=>{
                if(valid){
                    if(that.infoType == 'add'){
                        apiClient.linkApi('ssiteapi/project/drawing/insertdrawing','put',param,function(pres){
                            if(pres.status == 200){
                                that.$message.success('新增加成功');
                                that.addCheckDialog = false;

                                that.getdrawingList();
                            }
                        })
                    }else if(that.infoType == 'edit'){
                        
                        if(that.addCheckForm.qId!=''){
                            param.qId = that.addCheckForm.qId;
                        }
                        apiClient.post('ssiteapi/project/drawing/updatedrawing',param,function(pres){
                            if(pres.status == 200 && pres.results == true){
                                that.$message.success('修改成功')
                                that.addCheckDialog = false;

                                that.getdrawingList();
                            }else{
                                that.$message.error('修改失败');
                                that.addCheckDialog = false;
                            }
                        })
                    }
                }
            })
        },
        getdrawingList(){
            var that = this;
            var param = {
                pageNum:that.pageNum,
                pageSize:that.pageSize
            }
            if(that.infoSearch.trim()!=''){
                param.quser = that.infoSearch;
            }
            if(that.treeChecked.id&&that.treeChecked.id!=''){
                param.enginId = that.treeChecked.id;
            }
            if(that.checked){
                param.type = 'child'
            }
            if(that.getType == 'add'){
                apiClient.post('ssiteapi/project/drawing/listdrawing',param,function(pres){
                    if(pres.status == 200){
                        if(pres.results.list > 0){
                            that.drawingListAry.push(pres.results.list);
                        }else {
                            that.$message.warning('暂无更多数据！')
                        }
                    }
                })
            }else if(that.getType == 'update'){
                apiClient.post('ssiteapi/project/drawing/listdrawing',param,function(pres){
                    if(pres.status == 200){
                        that.drawingListAry = pres.results.list;
                    }
                })
            }
                
        },
    },
    filters: {
        //时间格式化
        dateFormat: function(value) {
            if (value !== "" && value !== 0) {
                return UtilService.formatDuring(value, "yyyy-MM-dd  HH:mm:ss");
            } else {
                return "暂无";
            }
        }
    }
};
</script>
<style scoped>
.drawingManagement {
    background: #efefef;
    padding: 10px 10px 0px 10px;
    width: 100%;
    height: 100%;
    position: relative;
}
.topBread {
    margin-bottom: 10px;
}
.drawingMng-left {
    width: 300px;
    height: calc(100% - 60px);
    overflow: auto;
    box-sizing: border-box;
    background: #fff;
    position: absolute;
}

.el-form {
    padding: 0 4%;
}

.drawingMng-left .proSearch {
    position: relative;
    padding: 10px 10px 0px 10px;
    border-radius: 3px;
}
.proSearch span{
    position: absolute;
    top: 13px;
    width: 30px;
    right: 13px;
    font-size: 20px;
    cursor: pointer;
    text-align: center;
    color: #b4b2b2;
}
.drawingMng-left .searchicon {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #c0c0c0;
    font-size: 18px;
    cursor: pointer;
}
.drawingMng-left .search {
    width: 100%;
    height: 36px;
    padding-left: 10px;
    margin-bottom: 10px;
    border: 1px solid #d3d3d3;
}

/* 注意点 */
.el-tree-node__expand-icon {
    font-size: 18px;
    color: #828282;
}
/* 右边 */
.drawingMng-right {
    margin-left: 10px;
    background-color: #fff;
    width: calc(100% - 330px);
    height: calc(100% - 60px);
    position: absolute;
    right: 10px;
    overflow: auto;
}
.detailedInfo {
    height: calc(100% - 50px);
}

.detInfoList {
    height: calc(100% - 100px);
    overflow-y: auto;
}
.detInfoList .el-table {
    height: calc(100% - 72px);
    overflow: auto;
}
.box-card{
    width: 98%;
    margin-left: 1%;
    height: 108px;
    margin-bottom: 10px;
}
.detInfoList>.box-card>.el-card__body {
    padding: 10px!important;
}
.fileCardSingle__title{
    color:#333;
    font-size: 14px!important;
    font-weight: bold;
}
.fileCardSingle__remark .red{
    display: inline-block;
    width: 45px;
    text-align: center;
    border-radius: 2px;
    font-size: 12px;
    line-height: 17px;
    background: #F8D5DA;
    color:#D0021B;
}
.fileCardSingle__remark .blue{
    display: inline-block;
    width: 45px;
    text-align: center;
    border-radius: 2px;
    font-size: 12px;
    line-height: 17px;
    background: #D5E9FF;
    color:#007AFD;
}
.fileCardSingle__remark .memot,
.fileCardSingle__remark .memoc{
    font-size: 12px;
    color:#666;
}
.fileCardSingle__info__block{
    font-size: 12px;
    color:#666;
}
.forEngs {
    color:#007AFD;
    font-size: 12px;
}
.checkDetail {
    display: inline-block;
    float: right;
}
.addCheck{
    
}
.addCheck .el-input{
    width: 100%;
}
.ant-upload.ant-upload-drag {
    width: 90%;
}

.filter-tree.el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #eaf1fb !important;
    color: #1081fa !important;
}
.filter-tree .el-tree-node__content:hover {
    background-color: #eaf1fb !important;
    color: #1081fa !important;
    width: calc(100% - 1px);
}
.caozuo .zicon-edit {
    position: absolute;
    right: 30.62%;
    cursor: pointer;
}
.caozuo .zicon-edit:hover {
    color: #1081fa;
}
.caozuo .zicon-delete {
    position: absolute;
    right: 18.26%;
    cursor: pointer;
}
.caozuo .zicon-delete:hover {
    color: #1081fa;
}
.caozuo .zicon-add {
    position: absolute;
    right: 5.869%;
    cursor: pointer;
}
.caozuo .zicon-add:hover {
    color: #1081fa;
}
.topBox {
    display: inline-block;
    font-size: 14px;
    margin-left: 15px;
    height: 48px;
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
.tableOper{
    width: 100%;
}
.tableOper_top{
    width: 100%;
    display: inline-block;
    height: 60px;
    line-height: 60px;
}
.tableOper_bottom {
    display: inline-block;
    height: 35px;
    margin-left: 15px;
}
.tableOper_bottom .el-checkbox{
    display: inline-block;
}
.tableOper_bottom .docNum{
    display: inline-block;
}
.wordCal{
    width: 90%;
}
.checkButtom{
    margin-left: 538px;
}

</style>

