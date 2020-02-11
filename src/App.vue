<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <van-tabbar v-if="$route.meta.showNav" route>
      <van-tabbar-item replace to="/web">
        <van-icon class="iconfont" class-prefix='icon' name='measure'/>
        Measurement
      </van-tabbar-item>
      <van-tabbar-item replace to="/def">
        <van-icon class="iconfont" class-prefix='icon' name='Note'/>
        Definition
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
};

</script>

<style>
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
