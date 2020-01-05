<template>
  <div class="container">
    <div>
      <img class="logo-img" src="@/assets/Logo-01.svg"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'index',
  mounted() {
    setTimeout(() => {
      this.$router.push({
        name: 'home',
        params: {
          fromIndex: true,
        },
      });
    }, 3000);
  },
};
</script>
<style scoped>
  .container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #2c3e50;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .logo-img {
    width: 500px;
  }
</style>
