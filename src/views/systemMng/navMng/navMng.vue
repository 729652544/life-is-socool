<template>
  <div class="navMng">
    <common-bread :aryBread="aryBread"></common-bread>
    <div class="contentField">
      <div class="tableOper">
        <div>
          <el-button type="primary" @click="clickAddModel">新建</el-button>
        </div>
      </div>
      <div class="tableBox">
        <el-table :data="tableData"
        ref="tableBox"
        style="width: 100%;margin-bottom: 20px;"
        header-row-class-name="sHeader"
        :row-class-name="rowClassName"
        @row-click="rowClick"
        :row-key="rowKeyAry"
        @expand-change='changeToggle'
        :expand-row-keys="expendAry">
          <el-table-column prop="name" label="导航名称" width="180"></el-table-column>
          <el-table-column prop="resourceId" label="权限ID" width="180"></el-table-column>
          <el-table-column prop="url" label="导航URL" width="180"></el-table-column>
          <el-table-column prop="resourceType" label="导航类型">
            <template slot-scope="scope">
              <span v-if="scope.row.resourceType == 1">pc</span>
              <span v-if="scope.row.resourceType == 0">app</span>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope='scope'>
              <span class="operateBtn" v-if="scope.row.id!=='root_123456'" @click="seeInfo(scope.row)">查看</span>
              <span class="operateBtn" v-if="scope.row.id!=='root_123456'" @click="editNav(scope.row)">编辑</span>
              <span class="operateBtn" v-if="scope.row.id!=='root_123456'" @click="delNav(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
import apiClient from "@/publicJs/apiClient.js";
import commonBread from "@/components/common/commonBread";
import commonFooter from "@/components/common/commonFooter";
import Vue from 'vue' 
export default {
  data() {
    return {
      aryBread: [
        { name: "系统设置", url: "/systemHome" },
        { name: "导航管理", url: "" }
      ],
      tableData: [],
      currentRow:{},
      rowKeyAry(row){
        return row.id;
      },
      expendAry:['root_123456']
    }
  },
  components: {
    commonBread,
    commonFooter
  },
  created(){
    this.getNavList();
    // this.toggleRowExpansion();
  },
  mounted(){
    var that = this;
  },
  methods: {
    changeToggle(row, expandedRows){
      var that = this;
      that.$refs['tableBox'].toggleRowExpansion(row,true)
    },
    // 查列表
    getNavList(){
      var that = this;
      apiClient.post('ssiteapi/authm/premission/listOmpPremission',{},function(pres){
        if(pres.status == 200){
          that.tableData = pres.results.children;
          
        }
      })
    },
    
    // toggleRowExpansion(row,expanded){
    // },
    //新建导航
    clickAddModel() {
      var that = this;
      if(that.currentRow.id){
            // that.currentRow.clickType='create';
            that.$router.push('/systemHome/navAdd/'+that.currentRow.id+'/create');
      }else {
          // that.$message({
          //     message:"请选择父节点",
          //     type:'error'
          // })
          that.$router.push('/systemHome/navAdd/root_123456/create');
      }
    },
    rowClassName:function(row,rowIndex){
        var str = '';
        if(row.row.id==this.currentRow.id){
            str = ' active'
        }
        return 'sRow cp'+str;
    },
    rowClick:function(row, event, column){
        this.currentRow = row;
    },
    seeInfo(row){
      var that = this;
      that.$router.push({
        name:'navInfo',
        params:row
      })
    },
    editNav(row){
      var that = this;
      that.$router.push('/systemHome/navAdd/'+row.id+'/edit');
    },
    delNav(row){
      var that = this;
      if(row.children&&row.children.length>0){
        that.$message({
          message:'当前节点有子级导航，不可删除，请先删除子节点',
          type:'error'
        })
      }else {
        that.$confirm('确定删除此导航节点？删除后不可恢复！','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(function(){
          apiClient.linkApi('ssiteapi/authm/premission/delete/'+row.id,'delete',{},function(pres){
            if(pres.status == 200 && pres.results == true){
              that.$message({
                message:'删除成功',
                type:'success'
              })
              that.getNavList();
            }
          })
        })
      }
    },
  }
};
</script>

<style scoped lang='scss'>
.navMng {
  width: 100%;
  height: 100%;
  // background: #fff;
  background: #efefef;
  padding: 10px 10px 0px 10px;
  border-top: solid 1px #e6e6e6;
  .contentField {
    width: 100%;
    height: calc(100% - 90px);
    margin-top: 10px;
    background: #ffffff;
    border-radius: 2px 2px 0px 0px;
    box-shadow: 0px 0px 9px 0px rgba(16, 129, 250, 0.1);
    .tableOper {
      width: 100%;
      height: 60px;
      padding: 0px 10px;
      line-height: 60px;
      // .fr {
      //   margin-right: 5px;
      // }
    }
    .tableBox{
      width: 100%;
      height: calc(100% - 60px);
      overflow-y: auto; 
      .operateBtn{
        color:#1081fa;
        cursor: pointer;
      }
    }
  }
}
</style>
