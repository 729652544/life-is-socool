<template>
    <div class="cSelect">
         <el-select v-model="itemData.value" filterable :placeholder="'请选择'+itemData.name">
            <el-option
            v-for="item in options"
            :key="item.res_id"
            :label="item.res_name"
            :value="item.res_id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import Vue from 'vue' 
import apiClient from '@/publicJs/apiClient.js'
export default {
    name:'cMount',
    props:{
        itemData:{
            type:Object,
            default:function(){
                return {
                    name: "属性名称",
				    type: "属性类型",
				    IsRequired: 0,
				    value:''
                }
            },
        }
    },
    data(){
      return {
        options: [],
      };
    },
    created(){
        this.getItemInfoById();
    },
    methods:{
       getItemInfoById:function(){
          var that = this;
          var a = that.itemData;
          var classname = this.$route.params.classname;
          apiClient.get('ssiteapi/platform/asset/info/listMountByClassName/'+classname,{},function(pres){
            that.options = pres.results;
            var value = that.itemData.value;
              setTimeout(function(){
                  if(value!==null&&value!==''){
                       if(value=='0'){
                            Vue.set(that.itemData, 'value', '')  
                       }else{
                            Vue.set(that.itemData, 'value', value)  
                       }
                      
                  }
              },300)
        });

      }
    } 
}
</script>

<style>

</style>
