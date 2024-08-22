<script setup lang='js' name=''>
import {ref,inject} from 'vue'
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
const router = useRouter()
const userStore = useUserStore()
const show = ref(false)
const changeActive = inject('activeData')
const goOrder = (active) => {
  changeActive(1)

  router.push(`/order?active=${active}`)
}


// 退出登录
const exitLogin = () => {
  userStore.setToken('')
  userStore.setUser({})
  show.value=false
  router.push('/login')
}
</script>
<template>
  <!-- 用户信息 -->
  <header>  
    <div class="user common">
      <van-row class="row">
        <van-col>
          <van-image 
          :src="userStore.user.avatar"
          width="100"
          />
        </van-col>
        <h3>{{ userStore.user.name }}</h3>
      </van-row>
  </div>
  </header>
  <main>
    <section class="common">
      <div class="myOrder">
          <div class="top">
            <p class="my">我的订单</p>
            <p class="all" @click="goOrder('')">全部</p>
          </div>
          <div class="bottom">
            <div @click="goOrder(1)">
              <img src="../../assets/h5_images/od_10.png" alt="">
              <p>待支付</p>
            </div>
            <div @click="goOrder(2)">
              <img src="../../assets/h5_images/od_20.png" alt="">
              <p>待服务</p>
            </div>
            <div @click="goOrder(3)">
              <img src="../../assets/h5_images/od_30.png" alt="">
              <p>已完成</p>
            </div>
            <div @click="goOrder(4)">
              <img src="../../assets/h5_images/od_40.png" alt="">
              <p>已取消</p>
            </div>
          </div>
      </div>
    </section>
    <section class="common">
      <van-cell class="cell"  is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <img class="img" src="../../assets/h5_images/ic_clients.png" alt="">
        <span class="custom-title">服务对象与管理</span>
      </template>
    </van-cell>

    <van-cell  class="cell" is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <img class="img" src="../../assets/h5_images/ic_share.png" alt="">
        <span class="custom-title">分享转发</span>
      </template>
    </van-cell>
    </section>
  </main>
  <footer>
    <van-button class="btn" @click="show=true">退出登录</van-button>
  </footer>
 
 <!-- 退出登录弹窗 -->
 <van-dialog 
 v-model:show="show" 
 title="提示" 
 show-cancel-button
 @cancel="show=false"
 @confirm="exitLogin"
 >
    <p class="tishi">是否确认退出登录</p>
</van-dialog>
</template>

<style scoped >
.common{
  margin: 10px;
  width: calc(100% - 20px);
  border-radius: 10px;
  background-color: #fff;
}
.user{

  .row{
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    h3{
      font-size: 20px;
    }
  }
}
section{
  .top{
    padding: 30px 20px;
    display: flex;
    justify-content: space-between;
    .my{
      font-size: 18px;
      font-weight: 600;
    }
    .all{
      font-size: 16px;
      color: #b8bab9;
    }
  }
  .bottom{
    padding-bottom: 20px;
    display: flex;
    justify-content: space-evenly;
    color: #b8bab9;
    img{
      width: 50px;
    }
  }
}
.cell{
  height: 50px;
  .img{
    margin-right: 5px;
    vertical-align: middle;
    width: 25px;  
  }
  
}
.btn{
  margin: 20px 20px;
  height: 50px;
  color:#f4e0e5;
  background-color: #ca2431;
  width:calc(100% - 40px) ;

}
.tishi{
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>