<template>
  <van-panel :title="data.title" :status="data.isWarn ? 'Warning': ''">
    <van-row>
      <van-col span="8">
        <div class="img-container">
          <img class="bike-icon" :src="data.img" />
        </div>
      </van-col>
      <van-col span="8">
        <div class="measurement-content">
          <div class="side-left">Left</div>
        </div>
      </van-col>
      <van-col span="8">
        <div class="measurement-content">
          <div class="side-right">Right</div>
        </div>
      </van-col>
    </van-row>
  </van-panel>
</template>
<script>
export default {
  name: 'MeasurementPanel',
  props: {
    data: {
      type: Object,
    },
  },
};
</script>
<style scoped>
  .measurement-content {
    text-align: left;
  }
  .side-left {
    color: #993c53;
  }
  .side-right {
    color: #1c90bf;
  }
</style>
