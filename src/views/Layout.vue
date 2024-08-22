<script setup lang='js' name='Layout'>
import {ref,onMounted,provide} from 'vue'
import { useRouter ,useRoute} from 'vue-router';
const active = ref(0)
const router = useRouter()
const route = useRoute()
const tabbar = ref([])
  onMounted(() => {
    tabbar.value = router.options.routes[0].children
    active.value =  tabbar.value.findIndex(item=>'/'+item.path===route.path)
  })
  const changeActive = (value) => {
    active.value = value
  }
  provide('activeData',changeActive)
</script>
<template>
  <RouterView/>
<!-- 路由出口 -->

  <van-tabbar v-model="active">
    <!-- 根据路由中的数据遍历tabbar导航栏 -->
    <van-tabbar-item 
    v-for="(item) in tabbar" :icon="item.meta.icon" 
    :key="item.meta.name"
    :url="`/${item.path}`"
    >
    {{item.meta.name}}
  </van-tabbar-item>
    
  </van-tabbar>

</template>

<style scoped >

</style>