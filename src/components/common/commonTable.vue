<template>
  <div class="commonTable">
    <el-table
      :data="tableData"
      row-class-name="sRow cp"
      header-row-class-name="sHeader"
      style="width: 100%"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @row-click="rowClick"
      @selection-change="selectionChange"
      @select="select"
      @select-all="selectAll"
      height="100%"
      max-height="100%" 
      ref="tableRef"
      :row-key="rowKey"
      :expand-row-keys="expandRowKeys"
    >
    <template  v-for="(item, index) in columnData">
      <el-table-column
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable"
        :column-key="item.prop"
        :filters="item.filters"
        :type="item.type"
        :width="item.width"
        filter-placement="bottom-end"
        :show-overflow-tooltip="true"
        min-width="100px"
        :fixed="item.fixed"
        v-if="item.type!=='selection'&&(item.hide==undefined||item.hide==false)"
      >
        <template slot-scope="scope">
            <template v-if="!item.slots"
              ><span>{{ scope.row[item.prop] }}</span></template
            >
            <template v-else>
              <slot :name="item.slots" :row="scope.row" :index="scope.$index"></slot>
            </template>
        </template>
      </el-table-column>
      <el-table-column
        :key="index"
         v-if="item.type=='selection'&&(item.hide==undefined||item.hide==false)"
        :selectable='isDisabled'
        type="selection"
      >
      </el-table-column>
    </template>
      
    </el-table>
    <!--       v-if="pagination&&total>pageSize" -->
    <el-pagination
      class="sPage"
      v-if="pagination&&total>10"
      @current-change="currentChange"
      @size-change="sizeChange"
      :current-page="pageNow"
      :page-size="pageSize"
      :prev-text="'〈  上一页'"
      :next-text="'下一页  〉'"
      :layout="pageLayout"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import Vue from "vue"

export default {
  name: "commonTable",
  props: {
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    columnData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    pagination: {
      type: Boolean,
      default: false
    },
    pageNow:{
      type: Number,
      default: 1
    },
    pageSize:{
      type: Number,
      default: 10
    },
    total:{
      type: Number,
      default: 100
    },
    pageLayout:{
      type:String,
      default:'total ,prev, pager, next ,sizes',
    },
    tableRef:{
      type:String,
      default:'total ,prev, pager, next ,sizes',
    },
    disableAllCheck:{
      type:Boolean,
      default: false,
    },
    rowKey:{
      type:String,
      default: 'id',
    },
    expandRowKeys:{
      type:Array,
      default: function() {
        return ['011a400c-c3a0-4adb-ae5b-5b405148fd90'];
      }
    }
  },
  data() {
    return {
      
    };
  },
  components: {},
  mounted() {},
  methods: {
    // 排序改变
    sortChange(prop) {
      this.$emit('sortChange',prop);
    },
    // 筛选改变
    filterChange(filters) {
      this.$emit('filterChange',filters);
    },
    // 页数变化
    currentChange(val) {
      this.$emit('currentChange',val);
    },
    rowClick(row, column, event){
      this.$emit('rowClick',row,column, event);
    },
    sizeChange(val){
      this.$emit('sizeChange',val);
    },
    clearSelection(){
      this.$refs.commonTable.clearSelection();
    },
    selectionChange(selection){
      this.$emit('selectionChange',selection);
    },
    select(selection, row){
       this.$emit('select',selection);
    },
    selectAll(selection){
        this.$emit('selectAll',selection);
    },
    toggleRowSelection(row, selected){
      this.$refs.tableRef.toggleRowSelection(row,selected);
    },
    toggleRowExpansion(row,expanded){
      this.$refs.tableRef.toggleRowExpansion(row,expanded);
    },
    isDisabled(row,index){
      return !this.disableAllCheck;
    }
  }
};
</script>
<style scoped>
.commonTable{
  width: 100%;
  height: 100%;
}
</style>


