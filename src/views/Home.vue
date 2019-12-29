<template>
  <div class="page">
    <div class="header">
      <span class="header-title">Bike Fitting System</span>
      <div class="navbar-btn">
        <el-button
          v-if="!isProcessing"
          type="primary"
          class="bike-btn start-btn"
          @click="handleStartProcess">
          Get Started
          <span class="el-icon-caret-right"></span>
        </el-button>
        <el-button
          v-else
          type="danger"
          class="bike-btn"
          :disabled="!isProcessing"
          :round="true"
         @click="handleStop">
          Stop
        </el-button>
      </div>
    </div>
    <div class="body">
      <div class="left-panel">
        <div class="left-panel-row" >
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
        <div class="left-panel-row" >
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
      </div>
      <el-card class="right-panel">
        <el-table
          :data="tableData"
          size="mini"
          :max-height="resolution.tableHeight"
          :span-method="processTableSpan"
          :cell-class-name="processCellClass"
          :row-style="resolution.tableRowStyle"
          style="width: 100%; height: 100%">
          <el-table-column
            label="Measurement"
            width="160"
          >
            <template slot-scope="scope">
              <img :src="scope.row.src" class="bike-icon"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            width="210"
            label="Measurement Title"
          >
          </el-table-column>
          <el-table-column
            prop="left"
            label="Left"
          >
          </el-table-column>
          <el-table-column
            prop="right"
            label="Right"
          >
          </el-table-column>
          <el-table-column
            prop="units"
            label="Units"
          >
          </el-table-column>
          <el-table-column
            prop="range"
            label="Range"
          >
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
import VueFabric from '../components/fabric.vue';
import SkeletonCard from '../components/SkeletonCard.vue';

const CANVA_PREFIX = 'canvas_';
const VIDEO_PREFIX = '#video_';
const IMG_PREFIX = 'img_';
const NA_STR = 'N/A';
const DEG_STR = 'deg';

const SIDE = {
  LEFT: 'left',
  RIGHT: 'right',
  FRONT: 'front',
};

const socket = io.connect('http://10.10.1.105:5000', { transports: ['websocket'] });

const VISIBLE_POINT = {
  right: [0, 2, 3, 4, 9, 10, 11, 22],
  left: [0, 5, 6, 7, 12, 13, 14, 19],
  front: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 22],
};

const LINE_INDEX = {
  right: [
    [0, 2],
    [2, 9],
    [2, 3],
    [3, 4],
    [9, 10],
    [10, 11],
    [11, 22],
  ],
  left: [
    [0, 5],
    [5, 12],
    [5, 6],
    [6, 7],
    [12, 13],
    [13, 14],
    [14, 19],
  ],
  front: [
    [0, 1],
    [2, 1],
    [5, 1],
    [2, 3],
    [3, 4],
    [5, 6],
    [7, 6],
    [1, 8],
    [9, 8],
    [12, 8],
    [9, 10],
    [11, 10],
    [12, 13],
    [14, 13],
    [11, 22],
    [14, 19],
  ],
};

const TABLE_HEADER_INDEX = [0, 300];
const DATA_START_INDEX = [];
// eslint-disable-next-line no-restricted-syntax,no-plusplus
for (let i = 0; i < TABLE_HEADER_INDEX.length; i++) {
  if (i === TABLE_HEADER_INDEX.length - 1) {
    break;
  }
  const nextHeaderIndex = TABLE_HEADER_INDEX[i + 1];
  let temp = i + 1;
  while (temp < nextHeaderIndex) {
    DATA_START_INDEX.push(temp);
    temp += 3;
  }
}

const DATA_IMG_INDEX = [];

DATA_START_INDEX.forEach((item) => {
  DATA_IMG_INDEX.push(item + 1);
  DATA_IMG_INDEX.push(item + 2);
});

export default {
  name: 'home',
  components: {
    VueFabric,
    SkeletonCard,
  },
  data() {
    return {
      isShowFabric: true,
      resolution: {
        originVideoWidth: 360,
        originVideoHeight: 640,
        tableHeight: 0,
        cardWidth: 0,
        cardHeight: 0,
        tableRowStyle: { height: '40px' },
      },
      ratio: 1,
      isProcessing: false,
      images: {
        left: new Image(),
        front: new Image(),
        right: new Image(),
      },
      tableData: this.getFittingData({}),
    };
  },
  mounted() {
    socket.on('connect', () => {
      window.console.log('socket connected');

      socket.on('points', (data) => {
        if (!this.isProcessing) {
          return;
        }
        this.clearFabricCanvas();
        Object.keys(SIDE).forEach((key) => {
          const side = SIDE[key];
          this.renderFabric(data, side);
        });
        this.tableData = this.getFittingData(data.angles);
      });

      socket.on('image', (data) => {
        Object.keys(SIDE).forEach((key) => {
          const side = SIDE[key];
          this.renderVideo(data, side);
        });
      });
    });

    this.$nextTick(this.calculateHeight);
    window.onresize = this.calculateHeight;
  },
  methods: {
    calculateHeight() {
      const MARGIN_TOP = 100;
      const MARGIN_BOTTOM = 40;
      const CARD_PADDING = 40;
      const CARD_MARGIN = 10;
      const windowHeight = window.innerHeight;
      // eslint-disable-next-line max-len
      this.resolution.cardHeight = parseInt((windowHeight - MARGIN_TOP - MARGIN_BOTTOM - CARD_MARGIN) / 2, 10);
      this.resolution.cardWidth = parseInt(9 * this.resolution.cardHeight / 16, 10);
      this.resolution.tableHeight = windowHeight - MARGIN_BOTTOM - MARGIN_TOP - CARD_PADDING;
      this.ratio = this.resolution.cardHeight / this.resolution.originVideoHeight;
      this.reload();
    },
    clearFabricCanvas() {
      Object.keys(SIDE).forEach((key) => {
        this.$refs[CANVA_PREFIX + SIDE[key]].clear();
      });
    },
    renderFabric(data, side) {
      const points = data[side].map(input => [
        input[0] * this.ratio, input[1] * this.ratio, input[2]]);
      this.drawLines(points, side);
      points.forEach((point, index) => {
        if (point[2] && VISIBLE_POINT[side].indexOf(index) !== -1) {
          const radius = index === 0 ? 20 : 6;
          this.drawPoint(point[0], point[1], radius, side);
        }
      });
    },
    renderVideo(data, side) {
      const base64Str = btoa(String.fromCharCode.apply(null,
        new Uint8Array(data[IMG_PREFIX + side])));
      const url = `data:image/jpeg;base64,${base64Str}`;
      const ctx = document.querySelector(VIDEO_PREFIX + side).getContext('2d');

      this.images[side].src = url;
      this.images[side].onload = () => {
        ctx.drawImage(this.images[side], 0, 0,
          this.resolution.cardWidth, this.resolution.cardHeight);
      };
    },
    drawPoint(x, y, r, side) {
      this.$refs[CANVA_PREFIX + side].createCircle({
        left: x - r,
        top: y - r,
        fillColor: '#409eff',
        color: 'aliceblue',
        radius: r,
        selectable: false,
      });
    },
    drawLines(points, side) {
      LINE_INDEX[side].forEach((lineIndex) => {
        if (points[lineIndex[0]] && points[lineIndex[1]]
          && points[lineIndex[0]][2] && points[lineIndex[1]][2]) {
          this.$refs[CANVA_PREFIX + side].drawDottedline({
            x: points[lineIndex[0]][0],
            y: points[lineIndex[0]][1],
            x1: points[lineIndex[1]][0],
            y1: points[lineIndex[1]][1],
            color: 'aliceblue',
            selectable: false,
            drawWidth: 5,
            empty: 0,
          });
        }
      });
    },
    getFittingData(angle) {
      return [
        { title: 'Fit Angles' }, {
          src: '../../static/img/ankle_angle.png',
          title: 'Ankle Angle Min',
          left: angle.Ankle_Angle_Min_left ? angle.Ankle_Angle_Min_left : NA_STR,
          right: angle.Ankle_Angle_Min_right ? angle.Ankle_Angle_Min_right : NA_STR,
          units: DEG_STR,
          range: '65 to 75',
        }, {
          title: 'Ankle Angle Max',
          left: angle.Ankle_Angle_Max_left ? angle.Ankle_Angle_Max_left : NA_STR,
          right: angle.Ankle_Angle_Max_right ? angle.Ankle_Angle_Max_right : NA_STR,
          units: DEG_STR,
          range: '90 to 100',
        }, {
          title: 'Ankle Angle Range',
          left: angle.Ankle_Angle_Range_left ? angle.Ankle_Angle_Range_left : NA_STR,
          right: angle.Ankle_Angle_Range_right ? angle.Ankle_Angle_Range_right : NA_STR,
          units: DEG_STR,
          range: '20 to 30',
        }, {
          src: '../../static/img/ankle_angle_bottom.png',
        }, {
          title: 'Ankle Angle At Bottom',
          left: angle.Ankle_Angle_Bottom_left ? angle.Ankle_Angle_Bottom_left : NA_STR,
          right: angle.Ankle_Angle_Bottom_right ? angle.Ankle_Angle_Bottom_right : NA_STR,
          units: DEG_STR,
          range: '90 to 100',
        }, {}, {
          src: '../../static/img/ankle_angle_rear.png',
        }, {
          title: 'Ankle Angle At Rear',
          left: angle.Ankle_Angle_Rear_left ? angle.Ankle_Angle_Rear_left : NA_STR,
          right: angle.Ankle_Angle_Rear_right ? angle.Ankle_Angle_Rear_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/ankle_angle_top.png',
        }, {
          title: 'Ankle Angle At Top',
          left: angle.Ankle_Angle_Top_left ? angle.Ankle_Angle_Top_left : NA_STR,
          right: angle.Ankle_Angle_Top_right ? angle.Ankle_Angle_Top_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/ankle_angle_front.png',
        }, {
          title: 'Ankle Angle At Front',
          left: angle.Ankle_Angle_Forward_left ? angle.Ankle_Angle_Forward_left : NA_STR,
          right: angle.Ankle_Angle_Forward_right ? angle.Ankle_Angle_Forward_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/knee_angle.png',
          title: 'Knee Angle Flexion',
          left: angle.Knee_Angle_Flexion_left ? angle.Knee_Angle_Flexion_left : NA_STR,
          right: angle.Knee_Angle_Flexion_right ? angle.Knee_Angle_Flexion_right : NA_STR,
          units: DEG_STR,
          range: '107 to 113',
        }, {
          title: 'Knee Angle Extension',
          left: angle.Knee_Angle_Extension_left ? angle.Knee_Angle_Extension_left : NA_STR,
          right: angle.Knee_Angle_Extension_right ? angle.Knee_Angle_Extension_right : NA_STR,
          units: DEG_STR,
          range: '33 to 42',
        }, {
          title: 'Knee Angle Range',
          left: angle.Knee_Angle_Range_left ? angle.Knee_Angle_Range_left : NA_STR,
          right: angle.Knee_Angle_Range_right ? angle.Knee_Angle_Range_right : NA_STR,
          units: DEG_STR,
          range: '70 to 75',
        }, {
          src: '../../static/img/hip_angle.png',
          title: 'Hip Angle Closed',
          left: angle.Hip_Angle_Closed_left ? angle.Hip_Angle_Closed_left : NA_STR,
          right: angle.Hip_Angle_Closed_right ? angle.Hip_Angle_Closed_right : NA_STR,
          units: DEG_STR,
          range: '46 to 56',
        }, {
          title: 'Hip Angel Open',
          left: angle.Hip_Angle_Open_left ? angle.Hip_Angle_Open_left : NA_STR,
          right: angle.Hip_Angle_Open_right ? angle.Hip_Angle_Open_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Hip Angle Range',
          left: angle.Hip_Angle_Range_left ? angle.Hip_Angle_Range_left : NA_STR,
          right: angle.Hip_Angle_Range_right ? angle.Hip_Angle_Range_right : NA_STR,
          units: DEG_STR,
          range: '40 to 45',
        }, {
          src: '../../static/img/back_from_level.png',
        }, {
          title: 'Back Angle',
          left: angle.Back_From_Level_left ? angle.Back_From_Level_left : NA_STR,
          right: angle.Back_From_Level_right ? angle.Back_From_Level_right : NA_STR,
          units: DEG_STR,
          range: '20 to 35',
        }, {}, {
          src: '../../static/img/hip_shoulder_wrist.png',
        }, {
          title: 'Shoulder Angle Wrist',
          left: angle.Hip_Shoulder_Wrist_left ? angle.Hip_Shoulder_Wrist_left : NA_STR,
          right: angle.Hip_Shoulder_Wrist_right ? angle.Hip_Shoulder_Wrist_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/hip_shoulder_elbow.png',
        }, {
          title: 'Shoulder Angle Elbow',
          left: angle.Hip_Shoulder_Elbow_left ? angle.Hip_Shoulder_Elbow_left : NA_STR,
          right: angle.Hip_Shoulder_Elbow_right ? angle.Hip_Shoulder_Elbow_right : NA_STR,
          units: DEG_STR,
          range: '70 to 80',
        }, {}, {
          src: '../../static/img/elbow_angle.png',
        }, {
          title: 'Elbow Angle',
          left: angle.Elbow_Angle_left ? angle.Elbow_Angle_left : NA_STR,
          right: angle.Elbow_Angle_right ? angle.Elbow_Angle_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/forearm_from_level.png',
        }, {
          title: 'Forearm Angle',
          left: angle.Forearm_From_Level_left ? angle.Forearm_From_Level_left : NA_STR,
          right: angle.Forearm_From_Level_right ? angle.Forearm_From_Level_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {},
      ];
    },
    handleStartProcess() {
      this.isProcessing = true;
      socket.emit('start_process', 'start');
    },
    handleStop() {
      this.isProcessing = false;
      socket.emit('cancel_process');
    },
    processTableSpan(table) {
      // is data header
      if (TABLE_HEADER_INDEX.indexOf(table.rowIndex) > -1) {
        if (table.columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 6,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
      // is image cell
      if (DATA_START_INDEX.indexOf(table.rowIndex) > -1 && table.columnIndex === 0) {
        return {
          rowspan: 3,
          colspan: 1,
        };
      }
      if (DATA_IMG_INDEX.indexOf(table.rowIndex) > -1 && table.columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
      return {
        rowspan: 1,
        colspan: 1,
      };
    },
    processCellClass(row) {
      if (TABLE_HEADER_INDEX.indexOf(row.rowIndex) > -1) {
        return 'measurement-header';
      }
      if (DATA_START_INDEX.indexOf(row.rowIndex) > -1 && row.columnIndex === 0) {
        return 'img-container';
      }
      return '';
    },
    reload() {
      this.isShowFabric = false;
      this.$nextTick(() => { this.isShowFabric = true; });
    },
  },
};
</script>
<style>
  html {
    background-color: #f3f3f5;
  }
  .page {
    height: 100%;
  }
  .bike-btn {
    border-radius: 10px !important;
    padding: 12px 23px;
  }
  .start-btn {
    background-color: #66b1ff !important;
    border-color: #66b1ff !important;
    color: #2b3e4e !important;
  }
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
  .header-title {
    color: aliceblue;
    line-height: 80px;
    font-weight: bolder;
    font-size: 39px;
    vertical-align: middle;
    float: left;
  }
  .navbar-btn {
    display: inline-block;
    line-height: 80px;
    float: right;
    vertical-align: middle;
  }
  .body {
    margin-top: 100px;
    display: flex;
    flex-direction: row;
    padding: 0 20px;
  }
  .left-panel-row {
    display: flex;
    flex-direction: row-reverse;
  }
  .left-panel {
    display: flex;
    flex-direction: column;
  }
  .right-panel {
    flex: 1;
  }
  .left-panel .left-panel-row:not(:first-child) {
    margin-top: 10px;
  }
  .left-panel-row .bike-card {
    margin-right: 10px;
  }
  .measurement-header {
    background-color: #b9dbff !important;
    border-radius: 10px !important;
    font-weight: bolder;
    padding-left: 20px !important;
    border-bottom-width: 0 !important;
  }
  .img-container {
    overflow: hidden;
    position: relative;
    width: 159px;
    height: 144px;
    background-color: #fff !important;
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
