<template>
  <div>
    <van-nav-bar title="Measurement"></van-nav-bar>
    <div class="content-container">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div slot="title">
            <van-icon class="iconfont" class-prefix='icon' name='body' color="#66b1ff" />Skeleton
          </div>
          <div class="panel-row">
            <skeleton-card
              class="bike-card"
              :width="resolution.cardWidth"
              :height="resolution.cardHeight"
              title="Right Skeleton"
            >
              <vue-fabric
                v-if="isShowFabric"
                id="skeleton_right"
                ref="canvas_right"
                :width="resolution.cardWidth"
                :height="resolution.cardHeight"
              />
            </skeleton-card>
            <skeleton-card
              class="bike-card"
              :width="resolution.cardWidth"
              :height="resolution.cardHeight"
              title="Front Skeleton"
            >
              <vue-fabric
                v-if="isShowFabric"
                id="skeleton_front"
                ref="canvas_front"
                :width="resolution.cardWidth"
                :height="resolution.cardHeight"
              />
            </skeleton-card>
            <skeleton-card
              class="bike-card"
              :width="resolution.cardWidth"
              :height="resolution.cardHeight"
              title="Left Skeleton"
            >
              <vue-fabric
                v-if="isShowFabric"
                id="skeleton_left"
                ref="canvas_left"
                :width="resolution.cardWidth"
                :height="resolution.cardHeight"
              />
            </skeleton-card>
          </div>
        </van-collapse-item>
        <van-collapse-item name="2">
          <div slot="title"><van-icon color="#66b1ff" name="tv-o" />Video</div>
          <div class="panel-row">
            <skeleton-card
              class="bike-card"
              :width="resolution.cardWidth"
              :height="resolution.cardHeight"
              :opacity-title="true"
              title="Right Video"
            >
              <canvas
                id="video_right"
                :width="resolution.cardWidth"
                :height="resolution.cardHeight"/>
            </skeleton-card>
            <skeleton-card
              class="bike-card"
              :width="resolution.cardWidth"
              :height="resolution.cardHeight"
              :opacity-title="true"
              title="Front Video"
            >
              <canvas
                id="video_front"
                :width="resolution.cardWidth"
                :height="resolution.cardHeight"/>
            </skeleton-card>
            <skeleton-card
              class="bike-card"
              :width="resolution.cardWidth"
              :height="resolution.cardHeight"
              :opacity-title="true"
              title="Left Video"
            >
              <canvas
                id="video_left"
                :width="resolution.cardWidth"
                :height="resolution.cardHeight"/>
            </skeleton-card>
          </div>
        </van-collapse-item>
        <van-collapse-item name="3">
          <div slot="title"><van-icon color="#66b1ff" name="bar-chart-o" />Data</div>
          <div class="measurement-header">Fit Angles</div>
          <div class="data-title" :key="index" v-for="(data, index) in fittingData.fitAngles">
            <measurement-panel :data="data"></measurement-panel>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>
<script>
import VueFabric from '../components/fabric.vue';
import SkeletonCard from '../components/SkeletonCard.vue';
import MeasurementPanel from '../components/MeasurementPanel.vue';

import ankleAngle from '../assets/img/ankle_angle.png';

export default {
  name: 'Measurement',
  components: { MeasurementPanel, SkeletonCard, VueFabric },
  comments: {
    SkeletonCard,
    VueFabric,
    MeasurementPanel,
  },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      isShowFabric: true,
      resolution: {
        cardWidth: 0,
        cardHeight: 0,
      },
      fittingData: this.getFittingData(),
    };
  },
  mounted() {
    this.$nextTick(this.calculateHeight);
    window.onresize = this.calculateHeight;
  },
  methods: {
    calculateHeight() {
      const windowWidth = window.innerWidth;
      const PADDING = 16;
      this.resolution.cardWidth = parseInt((windowWidth - 4 * PADDING) / 3, 10);
      this.resolution.cardHeight = parseInt(16 * this.resolution.cardWidth / 9, 10);
      this.reload();
    },
    reload() {
      this.isShowFabric = false;
      this.$nextTick(() => {
        this.isShowFabric = true;
      });
    },
    getFittingData() {
      return {
        fitAngles: [
          {
            title: 'Ankle Angle Min',
            img: ankleAngle,
            range: '65 to 75',
            isWarn: false,
          },
        ],
      };
    },
  },
};
</script>
<style>
  .van-nav-bar {
    background-color: #66b1ff !important;
  }
  .van-collapse-item__content {
    background-color: #f3f3f5 !important;
  }
  .van-cell__title {
    text-align: left !important;
  }
  .content-container {
    height: 100%;
    margin-bottom: 50px;
  }
  .panel-row {
    display: flex;
    flex-direction: row-reverse;
  }
  .panel-row .bike-card {
    margin-left: 16px;
  }
  .measurement-header {
    background-color: #b9dbff !important;
    border-radius: 10px !important;
    font-weight: bolder;
    padding-left: 20px !important;
    border-bottom-width: 0 !important;
    text-align: left !important;
  }
  .data-title {
    margin: 10px;
  }
  .img-container {
    overflow: hidden;
    position: relative;
    width: 90px;
    height: 90px;
    background-color: #fff !important;
    margin-left: 16px;
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
</style>
