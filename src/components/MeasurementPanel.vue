<template>
  <van-panel :title="data.title" :status="data.isWarn ? 'Warning': ''">
    <van-row>
      <van-col span="4">
        <div class="img-container">
          <img class="bike-icon" :src="data.img" />
        </div>
      </van-col>
      <van-col span="10">
        <div class="measurement-content">
          <div class="side-left">Left</div>
          <div>Max Less: {{data.left.less}}</div>
          <div>Current: {{data.left.value}}</div>
          <div>Max More: {{data.left.more}}</div>
        </div>
      </van-col>
      <van-col span="10">
        <div class="measurement-content">
          <div class="side-right">Right</div>
          <div>Max Less: {{data.left.less}}</div>
          <div>Current: {{data.left.value}}</div>
          <div>Max More: {{data.left.more}}</div>
        </div>
      </van-col>
    </van-row>
    <div slot="footer" class="panel-footer">
      <div v-if="data.rangeStart">
        <div v-if="data.unit === 'deg'">
          <span class="range">Range: {{data.rangeStart}}&deg; to {{data.rangeEnd}}&deg;</span>
        </div>
        <div v-else-if="data.unit === 'mm'">
          <span class="range">Range: {{data.rangeStart}}mm to {{data.rangeEnd}}mm</span>
        </div>
      </div>
      <div v-else>
        <span class="range">Range: --</span>
      </div>
    </div>
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
    text-align: center;
  }
  .side-left {
    color: #993c53;
  }
  .side-right {
    color: #1c90bf;
  }
  .bike-icon {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .range {
    float: right;
    padding-right: 40px;
  }
  .panel-footer {
    height: 18px;
  }
</style>
