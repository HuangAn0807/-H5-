<script setup lang='ts' name='Home'>
  import {ref,onMounted} from 'vue'
  import {index} from '@/api'
  import { useRouter } from 'vue-router';
  const search = ref('')
  const router = useRouter()
  // 首页数据
  const homeData = ref({
    hospitals:[],//医院数据
    nav2s:[],
    navs:[],
    now:'',//时间
    slides:[]//轮播图
  })
  onMounted( async () => {
    const res =await index()
    homeData.value = res.data.data
    console.log(homeData.value);
    
  })

  // 订单快捷入口
  const goOrder =  (index) => {
    router.push(`/createOrder?id=${ homeData.value.hospitals[index].id}`) 
  }

  // 订单入口
  const goToOrder = (hospital) => {
    router.push(`/createOrder?id=${ hospital.id}&name=${hospital.name}`) 
  
  }
</script>
<template>
  <!-- 头部区域 -->
  <header class="header">
    <div class="header-left">
      <div class="city">
        <img src="../../assets/h5_images/ic_city.png" alt="">
      </div>
      <h3>中部地区</h3>
      <van-icon name="arrow" size="20px" />
    </div>
    <div class="header-right">
      <van-search shape="round" v-model="search" placeholder="请输入搜索关键词" />
    </div>
  </header>
  <!-- 轮播图 -->
  <div class="swipe">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item
      v-for="item in homeData.slides" :key="item.id"
    >
    <van-image :src="item.pic_image_url"></van-image>
  </van-swipe-item>
    
</van-swipe>
  </div>

  <!-- nav区域 -->
  <van-row justify="space-around">
    <van-col @click="goOrder(index)" v-for="(item,index) in homeData.nav2s" :key="item.id" span="11">
      <van-image :src="item.pic_image_url"/>
    </van-col>
  </van-row>

  <!-- 医院区域 -->
   <main class="hospital-list"> 
    <van-row @click="goToOrder(item)" class="hospital" justify="space-around" v-for="item in homeData.hospitals" :key="item.id">
    <van-col class="img"  span="6">
      <van-image style="width: 100px; height: 90px; vertical-align: middle" :src="item.avatar_url"/>
    </van-col >

    <van-col span="16">
      <h3>{{ item.name }}</h3>
      <div class="label">
        <span>{{ item.rank }}</span>&nbsp;
        <span>{{ item.label }}</span>
      </div>
      <p>{{ item.intro }}</p>
    </van-col>
  </van-row>
   </main>
 
</template>

<style scoped >
/* 头部样式 */
  .header{
    display: flex;
    justify-content: space-around;
    .header-left{
      display: flex;
      align-items: center;
      img{
        width: 20px;
        vertical-align: middle;
      }
      h3{
        padding: 0 5px;
      }
    }
  }
  /* 轮播图样式 */
  .swipe{
    margin:5px;
   
    .my-swipe{
      border-radius: 5px;
      height: 170px;
    }
  }
  .hospital-list{
    padding-bottom: 80px;
    .hospital{
      padding:5px ;
      margin: 10px;
      border-radius: 10px;
      box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 6px 0 rgba(0, 0, 0, 0.04);
    }
    h3{
        font-size: 20px;
        line-height: 30px;
        font-weight: bold;
    }
    .label{
      font-weight: bold;
        line-height: 25px;
        font-size: 15px;
        color: #0ca7ae;
    }
    p{
      font-size: 14px;
      color: #999999;
    }
  }
</style>