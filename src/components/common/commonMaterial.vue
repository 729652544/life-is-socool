<template>
  <el-dialog
    title="物料选择"
    class="commonMaterial"
    :visible.sync="isShow"
    width="900px"
    :before-close="beforeClose"
  >
    <div class="dialogContent">
      <div class="leftBox">
        <el-tree
          ref="modelTree"
          class="dimTree"
          :data="treeData"
          :props="defaultProps"
          accordion
          node-key="id"
          @node-click="nodeClick"
          :default-expanded-keys="[currentTree.id]"
          :default-checked-keys="[2]"
          :highlight-current="true"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.totalNum && data.totalNum > 0">({{ data.totalNum }})</span
            >
          </span>
        </el-tree>
      </div>
      <div class="rightBox">
        <div class="headBox">
          <span class="total">总共已选：<span>{{ allSelectionData.length }}</span></span>
          <div class="fr">
                <div class="infoSearch">
                    <el-input
                    v-model="infoSearch"
                    placeholder="请搜索关键字"
                    @keyup.enter.native="getMaterialList"
                    ></el-input>
                    <span class="iconfont icon-suosou" @click="getMaterialList"></span>
                </div>
            </div>
        </div>
        <div class="tableBox">
          <common-table
            ref="materialTable"
            :tableData="tableData"
            :columnData="columnData"
            :pagination="true"
            :pageNow="pageNow"
            :pageSize="pageSize"
            :total="total"
            :disableAllCheck="disableAllCheck"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
            @select="select"
            @selectAll="selectAll"
            :pageLayout="'prev, pager, next ,sizes'"
          >
          </common-table>
        </div>
      </div>
      <div class="bottomBox">
        <el-button type="info" @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Vue from "vue";
import apiClient from "@/publicJs/apiClient.js";
import commonTable from "@/components/common/commonTable";

export default {
  name: "commonMaterial",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    defaultData:{
      type:Array,
      default:function() {
        return [];
      }
    },
    disableAllCheck:{
      type:Boolean,
      default: false,
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "text"
      },
      currentTree: {
        id: "1",
        className: "ResMateriel"
      },
      tableData: [],
      columnData: [
        {
          type: "selection"
        },
        {
          prop: "no",
          label: "序号",
          width: "50px"
        },
        {
          prop: "materielcode",
          label: "物料编码",
          width: "80px"
        },
        {
          prop: "materielname",
          label: "物料名称"
        },
        {
          prop: "materielspec",
          label: "规格型号"
        },
        {
          prop: "materielunit",
          label: "计量单位",
          width: "80px"
        }
      ],
      pageNow: 1,
      pageSize: 10,
      total: 10,
      allSelectionData: [],
      selectionData: [],
      infoSearch:'',
    };
  },
  components: {
    commonTable
  },
  mounted() {},
  watch: {
    isShow: function(newValue, oldValue) {
      if (newValue) {
        this.getLeftTree();
      }
    },
    selectionData: function(newValue, oldValue) {
      this.calPerDataInTree(this.treeData[0].children);
    },
  },
  methods: {
    beforeClose: function(done) {
      this.closeDialog();
    },
    closeDialog: function() {
      this.$emit("closeMaterial", {});
    },
    getLeftTree() {
      let _this = this;
      apiClient.get("ssiteapi/platform/activity/assembly/gettree", {}, function(
        pres
      ) {
        if (pres.status == 200) {
          _this.treeData = [pres.results];
          setTimeout(function() {
            _this.$refs["modelTree"].setCurrentKey("3");
          }, 100);

          _this.currentTree = _this.treeData[0];
          _this.getMaterialList();
          _this.selectionData = _this.defaultData;
          _this.allSelectionData =_this.defaultData;
          _this.calPerDataInTree(_this.treeData[0].children);
          // _this.$refs.materialTable.clearSelection();
          
        }
      });
    },
    nodeClick(data, node, q) {
      this.currentTree = data;
      this.pageNow = 1;
      this.getMaterialList();
    },
    currentChange(val) {
      let _this = this;
      this.pageNow = val;
      // this.storeSelection();
      this.getMaterialList();
    },
    sizeChange(val) {
      this.pageSize = val;
      // this.storeSelection();
      this.getMaterialList();
    },
    select(selection) {
      let _this = this;
      _this.selectionData = selection;
      _this.storeSelection();
    },
    selectAll(selection) {
      let _this = this;
      _this.selectionData = selection;
      _this.storeSelection();
    },
    getMaterialList() {
      let _this = this;
      let param = {
        classname:_this.currentTree.attributes.classname,
        pageNum: _this.pageNow ,
        pageSize:_this.pageSize,
        materielname:_this.infoSearch,
      }
       apiClient.post(
        "ssiteapi/platform/activity/assembly/getByType/",param,
        function(pres) {
          if (pres.status == 200) {
            _this.tableData = pres.results.list;
            _this.total = pres.results.totalRecord;
            setTimeout(function() {
              if (_this.allSelectionData.length > 0) {
                _this.allSelectionData.forEach(item => {
                  _this.tableData.forEach((tItem, index) => {
                    if (item.resId == tItem.resId) {
                      _this.$refs.materialTable.toggleRowSelection(
                        _this.tableData[index],
                        true
                      );
                    }
                  });
                });
              }
            }, 10);
          }
        }
      );
    },
    storeSelection() {
      let _this = this;
      // 当前页无选中数据
      if (_this.allSelectionData.length <= 0) {
        _this.allSelectionData = _this.selectionData;
        return "";
      }

      let idKey = "resId";
      // 总选择里面的key集合
      let selectAllIds = [];
      _this.allSelectionData.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      // 获取当前页选中的id
      let selectIds = [];
      _this.selectionData.forEach(row => {
        selectIds.push(row[idKey]);
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          _this.allSelectionData.push(row);
        }
      });
      // 未选id
      let noSelectIds = [];
      _this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < _this.allSelectionData.length; i++) {
            if (_this.allSelectionData[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              _this.allSelectionData.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    calPerDataInTree(targetAry) {
      let _this = this;
      let allSelection = {};
       _this.allSelectionData.forEach(function(item){
         if(allSelection[item.classname]){
           allSelection[item.classname] = allSelection[item.classname]+1;
         }else{
           allSelection[item.classname] = 1;
         }
       });
      _this.recursion(allSelection,targetAry);
    },
    recursion(allSelection,targetAry){
      var _this = this;
      let totals = 0;
      targetAry.forEach((item, index) => {
        let nums = 0;
        if(item.children && item.children.length > 0){
            let childNum = _this.recursion(allSelection,targetAry[index].children);
            nums += childNum;
        }else{
          if(allSelection[item.attributes.classname]){
            nums = nums+allSelection[item.attributes.classname];
          }
        }
        Vue.set(targetAry[index], "totalNum", nums);
        totals += nums;
      });
      return totals;
    },
    submit() {
      this.$emit("submitMaterial", this.allSelectionData);
      this.closeDialog();
    }
  }
};
</script>
<style scoped lang="less">
.commonMaterial {
  .dialogContent {
    width: 100%;
    height: 550px;
    position: relative;

    .leftBox {
      width: 220px;
      border: 1px solid #eee;
      height: calc(100% - 50px);
      display: inline-block;
      overflow: auto;
    }
    .rightBox {
      width: calc(100% - 230px);
      height: calc(100% - 50px);
      display: inline-block;
      float: right;
      .headBox {
        width: 100%;
        height: 50px;
        line-height: 50px;
        .total {
          color: #007afd;
        }
      }
      .tableBox {
        //  border:1px solid ;rgb(44, 42, 42)
        height: calc(100% - 90px);
        margin-bottom: 10px;
      }
    }
    .bottomBox {
      padding-top: 5px;
      padding-right: 5px;
      height: 50px;
      text-align: right;
    }
  }
}
.infoSearch {
  width: 300px;
  height: 36px;
  background-color: #f6f8fc;
  border-radius: 2px;
  margin-right: 10px;
  display: inline-block;
  line-height: 32px;
  position: relative;
}
.infoSearch input:focus {
  border: none;
  outline: none;
}
.infoSearch span {
  position: absolute;
  top: 3px;
  width: 30px;
  right: 5px;
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  color: #b4b2b2;
}
</style>
<style>
.dimTree .el-tree-node__content {
  height: 40px !important;
  display: block !important;
  line-height: 40px !important;
  position: relative !important;
  color: #666666 !important;
  font-size: 14px !important;
}
.dimTree .el-tree-node__content:hover {
  background-color: #eaf1fb !important;
  height: 40px !important;
  color: #1081fa !important;
}
.dimTree .el-tree-node__content:hover .operField {
  display: inline;
}
.dimTree.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #eaf1fb !important;
  height: 40px !important;
  color: #1081fa !important;
}
.dimTree.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .operField {
  display: inline-block;
}
</style>

