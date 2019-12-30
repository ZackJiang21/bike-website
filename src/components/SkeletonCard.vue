<template>
  <div class="card" :style="cardStyle">
    <div v-if="!opacityTitle" class="card-title">
      <span>{{title}}</span>
    </div>
    <div v-else class="card-title-opacity">
      <span>{{title}}</span>
    </div>
    <slot class="card-body"></slot>
  </div>
</template>


<script>
export default {
  name: 'SkeletonCard',
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    opacityTitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    cardStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
      };
    },
  },
};
</script>
<style scoped>
  .card {
    position: relative;
    border: 1px solid #EBEEF5;
    background-color: #2c3e50;
    color: #303133;
    border-radius: 5px;
    -webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1)
  }
  .card-title {
    position: absolute;
    top: 15px;
    left: 0;
    height: 22px;
    font-size: 14px;
    font-weight: 500;
    width: 130px;
    background-color: #b9dbff;
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
    z-index: 900;
  }
  .card-title-opacity {
    position: absolute;
    top: 15px;
    left: 0;
    height: 22px;
    font-size: 14px;
    font-weight: 500;
    width: 130px;
    background-color: #d6d2cf;
    opacity: 0.4;
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
    z-index: 900;
  }
  .card-body {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
