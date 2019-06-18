<template>
    <div class="commonDefPage">
        <div class="defPageContent">
            <div class="defPageImg netErro" v-show="isShow">
                <img src="../../assets/image/defPage.png" alt="">
                <div class="defPageWord">{{defPageInfo}}</div>
            </div>
            <div class="defPageImg unbuilt" v-show="!isShow">
                <img src="../../assets/image/unbuilt.png" alt="">
                <div class="defPageWord UnbuiltInfo">{{defPageInfo}}</div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            defPageInfo: "",
            isShow: false
        };
    },
    mounted: function() {
        this.getMessage();
    },
    methods: {
        getMessage: function() {
            // console.info(this.$route.params);
            this.defPageInfo = this.$route.params.info;
            if ((this.$route.params.status = 500)) {
                this.isShow = true;
            } else if ((this.$route.params.status = 404)) {
                this.isShow = false;
            } else {
                this.isShow = true;
            }
        }
    }
};
</script>
<style scoped>
.commonDefPage {
    width: 100%;
    height: 100%;
    position: relative;
}
.defPageContent {
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
}
.defPageImg {
}
.netErro {
}

.UnbuiltInfo {
    position: absolute;
    top: 75%;
    left: 33%;
}.unbuilt {
    padding: 10px 10px;
}.unbuilt>img {
    width: 90px;
    height: 80px;
}
.defPageWord {
    text-align: center;
    color: #474747;
}
</style>


