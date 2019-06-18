<template>
    <div class="bigbox">
        <div class="rotate" @click="rotateImg(imgIndex)"> <i class="iconfont icon-youxuanzhuan"></i></div>
        <div class="turnOffCast iconfont icon-guanbi2" @click="turnElasticLayer">      
        </div> 
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide"  v-for="(item,index) in imageSrc" :key="index">
                    <img v-if="reg1.test(item)" v-bind:src="imgBath+item" alt="" class="pictureRotation">
                    <video v-if="reg2.test(item)" class="video" :src="imgBath+item" controls>
                        your browser does not support the video tag
                    </video>
                </div>    
            </div>             
           <div class="swiper-pagination" slot="pagination" id="pagination"></div>
            <div class="swiper-button-next">
                <span @click="changeIndex($event)" class="circleClassificationLeft iconfont icon-right1"></span>
            </div>     
            <div class="swiper-button-prev">
                 <span @click="changeIndex($event)" class="circleClassificationRight iconfont icon-fanhui"></span>
            </div>
        </div> 
    </div>
</template>
<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import Constants from '@/publicJs/Constants.js'

export default {
   data(){
       return{
            reg1:/(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/,
            reg2:/(.*)\.(mp4|rm|rmvb|mov|mtv|wmv|avi|amv|flv|dmv)$/,
            imgBath:Constants.imgUrl,
            rotateDegArr:[0,0],
            imgIndex:this.numberIndex
       }
   },
  props: ["imageSrc","numberIndex","flag"],
  mounted() {
    var mySwiper = new Swiper('.swiper-container', {
        initialSlide: this.numberIndex,    
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        autoplay: {
          delay: 30000000,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
    })
  },
  methods:{
      turnElasticLayer:function(){
         this.$emit('turnElasticLayer',false)
      },
      rotateImg(ind){
        var that = this;
        that.rotateDegArr[ind]+=90;
        var img = document.getElementsByClassName('pictureRotation');
        img[ind].style.transform = 'translate(-50%,-50%)'+'rotate('+ that.rotateDegArr[ind] +'deg)';
        
      },
      changeIndex(e){
          var that = this;
          var a = e.currentTarget.className.indexOf('icon-right1');
          var b = e.currentTarget.className.indexOf('icon-fanhui');
          if (b>0){
              that.imgIndex--;
          }else if(a>0){
              that.imgIndex++
          }
      }
  }
};
</script>
<style scoped>
.bigbox {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;
}
.swiper-button-next{
    background-image: none;
}
.swiper-button-prev{
    background-image: none;
}
.swiper-slide{
    width: 100%;
    height: 100%;
    position: relative;
}

.pictureRotation{
    width: 22%;
    height: 80%;;
    position: relative;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%)
    
}
.circleClassificationLeft{
    position: fixed;
    top: 50%;
    right:23%;
    width: 33px;
	height: 33px;
	border: 1px solid #ffffff;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
}
.circleClassificationRight{
    position: fixed;
    top: 50%;
    left:23%;
    width: 33px;
	height: 33px;
	border: 1px solid #ffffff;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
}
.turnOffCast{
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    position: fixed;
    right: 20%;
    top: 18%;
    font-size: 18px;
    cursor: pointer;
    z-index: inherit;
}
.swiper-container{
    height: 100%;
}
.swiper-pagination{
    position: absolute;;
    top: 94%;
    left: 48%;
    width: 100px;
    height: 30px;
    
}
.swiper-pagination>.swiper-pagination-bullet{
    background: red !important;
}
.rotate {
    width: 30px;
    height: 30px;
    position: fixed;
    right: 22%;
    top: 17.3%;
    cursor: pointer;
    z-index: inherit;
}
.icon-youxuanzhuan {
    font-size: 28px;
    color:#fff;
}
.video {
    position: relative;
    left: 50%;
    top: 50%;
    width: 50%;
    height: 50%;
    transform: translate(-50%,-50%)
}
</style>

