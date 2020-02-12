<template>
  <div class="header">
    <img class="header-logo" src="@/assets/g42-logo.svg"/>
    <img class="header-logo" src="@/assets/Logo-01.svg"/>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'BikeHeader',
};
</script>
<style scoped>
  .header {
    height: 80px;
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background-color: #2c3e50;
    padding: 0 20px;
    z-index: 999;
    box-sizing: border-box;
  }

  .header-logo {
    display: inline-block;
    float: left;
    height: 60px;
    padding: 8px 0;
    margin-left: 20px;
  }
</style>
