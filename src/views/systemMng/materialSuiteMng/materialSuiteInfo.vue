<template>
    <div class='materialSuiteInfo'>
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="materialContent">
            <div class="materialTop">
                <div class='topBox'>
                    <el-button @click='addMaterial' class="addMaterial">添加物料套件</el-button>
                    <div class="searchBox">
                        <el-input @keyup.enter.native="getResList" v-model="searchText" placeholder="请输入套件名称" ></el-input>
                        <span @click='getResList' class="searchicon el-icon-search"></span>
                    </div>
                </div>
            </div>
            <div class="materialBody">
                <div class="detInfoList">
                    <!-- 表格 -->
                    <el-table :data="userList" row-class-name="sRow cp" style="width: 100%"  header-row-class-name="sHeader">
                        <el-table-column width="20px"></el-table-column>
                        <el-table-column align="left" width="80" prop="no" label="序号" show-overflow-tooltip></el-table-column>
                        <el-table-column align="left" prop="assemblyName" label="物料套件" show-overflow-tooltip></el-table-column>
                        <el-table-column label="套件构成" align="left" prop="assemblyItems">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="bottom" width="auto">
                                    <div>
                                        <el-table :data="scope.row.assemblyItems" row-class-name="sRow cp"  style="width: 100%" max-height="300" header-row-class-name="hHeader">
                                            <el-table-column width="140px" align="left" prop="materielName" label="物料名称"></el-table-column>
                                            <el-table-column align="left" prop="materielSpec" label="规格型号"></el-table-column>
                                            <el-table-column align="left" prop="materielUnit" label="计量单位"></el-table-column>
                                            <el-table-column align="left" prop="materielNum" label="数量"></el-table-column>
                                        </el-table>
                                    </div>
                                    <span slot="reference" class="name-wrapper elli">{{ scope.row.assemblyTypeStr }}</span>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="规格型号" align="left" prop='assemblyType' show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{scope.row.assemblyType || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column align="left" prop="deptName" label="创建部门" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                {{scope.row.deptName || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column align="left" prop="remark" label="创建人" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                {{scope.row.remark || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column align="left" prop="assemblyTags" label="标签" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                {{scope.row.assemblyTags || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column align="left" prop="createDate" label="创建时间" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ scope.row.createDate|dateFormat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" prop="sort" label="排序" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" align="left">
                            <template slot-scope="scope">
                                <span class="edit" @click="editMaterial(scope.row)">编辑</span>
                                <span class="edit" @click.stop='delMaterial(scope.row.id)'>删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页器 -->
                    <el-pagination
                        v-show="total>10?true:false"
                        class="sPage" @current-change="handleCurrentChange"
                        :current-page.sync="pageNum" :page-size="pageSize"
                        :prev-text="'〈  上一页'" 
                        :next-text="'下一页  〉'"
                        layout="prev, pager, next"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
            <div class="logo">
                <common-footer></common-footer>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
import UtilService from '@/publicJs/UtilService'
export default {
name:'materialSuiteinfo',
data(){
    return {
        aryBread:[
            {name:'系统设置',url:'/systemHome'},
            {name:'套件管理',url:'/systemHome/materialSuiteMng/materialSuiteInfo'},
        ],
        pageNum:1,
        pageSize:10,
        total:0,
        searchText:'',
        userList:[],
        type:''
    }
},
created(){
    var that = this
    this.getMaterial()   
},
methods:{
    //点击添加物料套件
    addMaterial(){
        var that = this;
        that.type = 'addMaterial'
        this.$router.push('/systemHome/materialSuiteMng/materialEdit/'+that.type)
    },
    //点击删除列表
    delMaterial(id){
        var that = this;
        this.$confirm('确定要删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    apiClient.linkApi('ssiteapi/platform/activity/assembly/delete/'+id,'delete',{},function(pres){
                        if(pres.status == 200){
                            that.$message({
                                type: 'success',
                                message: '删除成功',
                            });
                            that.handleCurrentChange();
                        }
                    })
                })
        
    },
    editMaterial(data){
        var that = this;
        that.type = 'editMaterial';
        apiClient.post('ssiteapi/platform/activity/assembly/update',data,function(pres){
            if(pres.status == 200){
                window.sessionStorage.setItem('suiteData',JSON.stringify(data));
                that.$router.push('materialEdit/'+that.type);
            };
            
        })
    },
    handleCurrentChange(val){
        this.getMaterial();
    },
    getResList(){
        this.getMaterial();
    },
    //获取列表数据
    getMaterial(){
        var that = this
        var obj = {
            assemblyName:that.searchText.trim(),
            pageNum:that.pageNum,
            pageSize:10
        }
        apiClient.post('ssiteapi/platform/activity/assembly/get',obj,function(pres){
            if(pres.status == 200){
                var ary = pres.results.list;
                ary.forEach(function(item,index){
                    var assemblyTypeStr  = ''
                    var ary2 = item.assemblyItems
                    ary2.forEach(function(v){
                        assemblyTypeStr+=','+v.materielName
                    })
                    ary[index].assemblyTypeStr = assemblyTypeStr.slice(1);
                })
                that.userList = ary;
                that.total = pres.results.totalRecord
            }
        })
    }
},
components:{
    commonBread,
    commonFooter
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
}
</script>

<style scoped>
.materialSuiteInfo {
    width: 100%;
    height: 100%;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    border-top: solid 1px #e6e6e6;
}
/* 大盒子 */
.materialContent {
    width: 100%;
    height: calc(100% - 60px);
    margin-top: 10px;
    background: #f60;
    border-radius: 2px 2px 0px 0px;
    box-shadow: 0px 0px 9px 0px rgba(16, 129, 250, 0.1);
}
.materialTop {
    width: 100%;
    height: 60px;
    background: #fff;
}
.topBox {
    background: #fff;
}
.topBox .addMaterial {
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
    background: #1081fa;
    border:1px solid #1081fa;
    margin:12px 0 0 10px;
}
.topBox .searchBox{
    float: right;
    margin:12px 10px 0 0;
    height: 36px;
    width: 330px;
    position: relative;
}
.searchicon {
    position: absolute;
    height: 100%;
    right: 10px;
    top: 10px;
    cursor: pointer;
}
.suiteName {
    width: 330px;
    height: 36px;
}
.materialBody {
    width: 100%;
    height: calc(100% - 90px);
    background: #fff;
}
.detInfoList {
    height: 100%;
}

.detInfoList .el-table {
    height: calc(100% - 72px);
    overflow: auto;
}
.edit {
    color: #1081fa;
    cursor: pointer;
    margin-right: 8px;
}
.edit:active {
    color: #0172ec;
}
.sRow:hover>td {
    color: #1081fa;
    background-color: #eaf1fb!important;
}
.hHeader .el-table_8_column_35  {
    font-size: 12px!important;
    width:100%;
    word-break:keep-all!important;/* 不换行 */
    white-space:nowrap!important;/* 不换行 */
}
.elli {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    white-space: nowrap;
}
</style>
