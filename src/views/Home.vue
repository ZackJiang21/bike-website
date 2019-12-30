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
            label=""
            width="100"
          fixed>
            <template slot-scope="scope">
              <img :src="scope.row.src" class="bike-icon"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            width="160"
            label="Title"
            fixed
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
const NA_STR = '--';
const DEG_STR = 'deg';

const SIDE = {
  LEFT: 'left',
  RIGHT: 'right',
  FRONT: 'front',
};

const socket = io.connect('http://10.10.1.105:5000', { transports: ['websocket'] });

const VISIBLE_POINT = {
  right: {
    0: { color: '#d70067', radius: 14 },
    2: { color: '#d64700' },
    3: { color: '#d6a300' },
    4: { color: '#d7d600' },
    9: { color: '#02d648' },
    10: { color: '#00d68f' },
    11: { color: '#00d6d6' },
    22: { color: '#00efef' },
  },
  left: {
    0: { color: '#d70067', radius: 14 },
    5: { color: '#8fd500' },
    6: { color: '#33d602' },
    7: { color: '#00d600' },
    12: { color: '#048ed6' },
    13: { color: '#0048d6' },
    14: { color: '#1000d6' },
    19: { color: '#1000d6' },
  },
  front: {
    0: { color: '#d70067', radius: 14 },
    2: { color: '#d64700' },
    3: { color: '#d6a300' },
    4: { color: '#d7d600' },
    9: { color: '#02d648' },
    10: { color: '#00d68f' },
    11: { color: '#00d6d6' },
    22: { color: '#00efef' },
    5: { color: '#8fd500' },
    6: { color: '#33d602' },
    7: { color: '#00d600' },
    12: { color: '#048ed6' },
    13: { color: '#0048d6' },
    14: { color: '#1000d6' },
    19: { color: '#1000d6' },
    1: { color: '#d60113' },
    8: { color: '#99293d' },
  },
};

const LINE_INDEX = {
  right: [
    { line: [0, 2], color: '#990033' },
    { line: [2, 9], color: '#990001' },
    { line: [2, 3], color: '#996601' },
    { line: [3, 4], color: '#989900' },
    { line: [9, 10], color: '#019966' },
    { line: [10, 11], color: '#009999' },
    { line: [11, 22], color: '#009999' },
  ],
  left: [
    { line: [0, 5], color: '#990033' },
    { line: [12, 5], color: '#990001' },
    { line: [6, 5], color: '#339901' },
    { line: [6, 7], color: '#009901' },
    { line: [12, 13], color: '#003399' },
    { line: [13, 14], color: '#080099' },
    { line: [14, 19], color: '#080099' },
  ],
  front: [
    { line: [0, 1], color: '#990033' },
    { line: [1, 2], color: '#993300' },
    { line: [1, 5], color: '#679900' },
    { line: [2, 3], color: '#996601' },
    { line: [3, 4], color: '#989900' },
    { line: [5, 6], color: '#339901' },
    { line: [6, 7], color: '#009901' },
    { line: [1, 8], color: '#990001' },
    { line: [9, 8], color: '#009933' },
    { line: [12, 8], color: '#006699' },
    { line: [9, 10], color: '#019966' },
    { line: [11, 10], color: '#009999' },
    { line: [12, 13], color: '#003399' },
    { line: [13, 14], color: '#080099' },
    { line: [11, 22], color: '#009999' },
    { line: [19, 14], color: '#080099' },
  ],
};

const TABLE_HEADER_INDEX = [0, 37, 50, 300];
const DATA_START_INDEX = [];
// eslint-disable-next-line no-restricted-syntax,no-plusplus
for (let i = 0; i < TABLE_HEADER_INDEX.length; i++) {
  if (i === TABLE_HEADER_INDEX.length - 1) {
    break;
  }
  const nextHeaderIndex = TABLE_HEADER_INDEX[i + 1];
  let temp = TABLE_HEADER_INDEX[i] + 1;
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
        tableRowStyle: { height: '30px', 'font-size': '10px' },
      },
      ratio: 1,
      isProcessing: false,
      images: {
        left: new Image(),
        front: new Image(),
        right: new Image(),
      },
      tableData: this.getFittingData({ angles: {}, distance: {} }),
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
        this.tableData = this.getFittingData(data);
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
        if (point[2] && VISIBLE_POINT[side][index]) {
          this.drawPoint(point, VISIBLE_POINT[side][index], side);
        }
      });
    },
    renderVideo(data, side) {
      const url = `data:image/jpeg;base64,${data[IMG_PREFIX + side]}`;
      const ctx = document.querySelector(VIDEO_PREFIX + side).getContext('2d');

      this.images[side].src = url;
      this.images[side].onload = () => {
        ctx.drawImage(this.images[side], 0, 0,
          this.resolution.cardWidth, this.resolution.cardHeight);
      };
    },
    drawPoint(point, attr, side) {
      const radius = attr.radius ? attr.radius : 3;
      this.$refs[CANVA_PREFIX + side].createCircle({
        left: point[0] - radius,
        top: point[1] - radius,
        fillColor: attr.color,
        color: attr.color,
        radius,
        selectable: false,
      });
    },
    drawLines(points, side) {
      LINE_INDEX[side].forEach((lineIndex) => {
        if (points[lineIndex.line[0]] && points[lineIndex.line[1]]
          && points[lineIndex.line[0]][2] && points[lineIndex.line[1]][2]) {
          this.$refs[CANVA_PREFIX + side].drawDottedline({
            x: points[lineIndex.line[0]][0],
            y: points[lineIndex.line[0]][1],
            x1: points[lineIndex.line[1]][0],
            y1: points[lineIndex.line[1]][1],
            color: lineIndex.color,
            selectable: false,
            drawWidth: 5,
            empty: 0,
          });
        }
      });
    },
    getFittingData(data) {
      const { angles, distance } = data;
      return [
        { title: 'Fit Angles' }, {
          src: '../../static/img/ankle_angle.png',
          title: 'Ankle Angle Min',
          left: angles.Ankle_Angle_Min_left ? angles.Ankle_Angle_Min_left : NA_STR,
          right: angles.Ankle_Angle_Min_right ? angles.Ankle_Angle_Min_right : NA_STR,
          units: DEG_STR,
          range: '65 to 75',
        }, {
          title: 'Ankle Angle Max',
          left: angles.Ankle_Angle_Max_left ? angles.Ankle_Angle_Max_left : NA_STR,
          right: angles.Ankle_Angle_Max_right ? angles.Ankle_Angle_Max_right : NA_STR,
          units: DEG_STR,
          range: '90 to 100',
        }, {
          title: 'Ankle Angle Range',
          left: angles.Ankle_Angle_Range_left ? angles.Ankle_Angle_Range_left : NA_STR,
          right: angles.Ankle_Angle_Range_right ? angles.Ankle_Angle_Range_right : NA_STR,
          units: DEG_STR,
          range: '20 to 30',
        }, {
          src: '../../static/img/ankle_angle_bottom.png',
        }, {
          title: 'Ankle Angle At Bottom',
          left: angles.Ankle_Angle_Bottom_left ? angles.Ankle_Angle_Bottom_left : NA_STR,
          right: angles.Ankle_Angle_Bottom_right ? angles.Ankle_Angle_Bottom_right : NA_STR,
          units: DEG_STR,
          range: '90 to 100',
        }, {}, {
          src: '../../static/img/ankle_angle_rear.png',
        }, {
          title: 'Ankle Angle At Rear',
          left: angles.Ankle_Angle_Rear_left ? angles.Ankle_Angle_Rear_left : NA_STR,
          right: angles.Ankle_Angle_Rear_right ? angles.Ankle_Angle_Rear_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/ankle_angle_top.png',
        }, {
          title: 'Ankle Angle At Top',
          left: angles.Ankle_Angle_Top_left ? angles.Ankle_Angle_Top_left : NA_STR,
          right: angles.Ankle_Angle_Top_right ? angles.Ankle_Angle_Top_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/ankle_angle_front.png',
        }, {
          title: 'Ankle Angle At Front',
          left: angles.Ankle_Angle_Forward_left ? angles.Ankle_Angle_Forward_left : NA_STR,
          right: angles.Ankle_Angle_Forward_right ? angles.Ankle_Angle_Forward_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/knee_angle.png',
          title: 'Knee Angle Flexion',
          left: angles.Knee_Angle_Flexion_left ? angles.Knee_Angle_Flexion_left : NA_STR,
          right: angles.Knee_Angle_Flexion_right ? angles.Knee_Angle_Flexion_right : NA_STR,
          units: DEG_STR,
          range: '107 to 113',
        }, {
          title: 'Knee Angle Extension',
          left: angles.Knee_Angle_Extension_left ? angles.Knee_Angle_Extension_left : NA_STR,
          right: angles.Knee_Angle_Extension_right ? angles.Knee_Angle_Extension_right : NA_STR,
          units: DEG_STR,
          range: '33 to 42',
        }, {
          title: 'Knee Angle Range',
          left: angles.Knee_Angle_Range_left ? angles.Knee_Angle_Range_left : NA_STR,
          right: angles.Knee_Angle_Range_right ? angles.Knee_Angle_Range_right : NA_STR,
          units: DEG_STR,
          range: '70 to 75',
        }, {
          src: '../../static/img/hip_angle.png',
          title: 'Hip Angle Closed',
          left: angles.Hip_Angle_Closed_left ? angles.Hip_Angle_Closed_left : NA_STR,
          right: angles.Hip_Angle_Closed_right ? angles.Hip_Angle_Closed_right : NA_STR,
          units: DEG_STR,
          range: '46 to 56',
        }, {
          title: 'Hip Angel Open',
          left: angles.Hip_Angle_Open_left ? angles.Hip_Angle_Open_left : NA_STR,
          right: angles.Hip_Angle_Open_right ? angles.Hip_Angle_Open_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Hip Angle Range',
          left: angles.Hip_Angle_Range_left ? angles.Hip_Angle_Range_left : NA_STR,
          right: angles.Hip_Angle_Range_right ? angles.Hip_Angle_Range_right : NA_STR,
          units: DEG_STR,
          range: '40 to 45',
        }, {
          src: '../../static/img/back_from_level.png',
          title: 'Back From Level',
          left: angles.Back_From_Level_left ? angles.Back_From_Level_left : NA_STR,
          right: angles.Back_From_Level_right ? angles.Back_From_Level_right : NA_STR,
          units: DEG_STR,
          range: '20 to 35',
        }, {
          title: 'Back From Level Mean',
          left: angles.Back_From_Level_Average_left ? angles.Back_From_Level_Average_left : NA_STR,
          right: angles.Back_From_Level_Average_right ? angles.Back_From_Level_Average_right
            : NA_STR,
          units: DEG_STR,
          range: '20 to 35',
        }, {}, {
          src: '../../static/img/hip_shoulder_wrist.png',
          title: 'Shoulder Angle Wrist',
          left: angles.Hip_Shoulder_Wrist_left ? angles.Hip_Shoulder_Wrist_left : NA_STR,
          right: angles.Hip_Shoulder_Wrist_right ? angles.Hip_Shoulder_Wrist_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Shoulder Angle Wrist Mean',
          // eslint-disable-next-line max-len
          left: angles.Hip_Shoulder_Wrist_Average_left ? angles.Hip_Shoulder_Wrist_Average_left : NA_STR,
          // eslint-disable-next-line max-len
          right: angles.Hip_Shoulder_Wrist_Average_right ? angles.Hip_Shoulder_Wrist_Average_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/hip_shoulder_elbow.png',
          title: 'Shoulder Angle Elbow',
          left: angles.Hip_Shoulder_Elbow_left ? angles.Hip_Shoulder_Elbow_left : NA_STR,
          right: angles.Hip_Shoulder_Elbow_right ? angles.Hip_Shoulder_Elbow_right : NA_STR,
          units: DEG_STR,
          range: '70 to 80',
        }, {
          title: 'Shoulder Angle Elbow Mean',
          // eslint-disable-next-line max-len
          left: angles.Hip_Shoulder_Elbow_Average_left ? angles.Hip_Shoulder_Elbow_Average_left : NA_STR,
          // eslint-disable-next-line max-len
          right: angles.Hip_Shoulder_Elbow_Average_right ? angles.Hip_Shoulder_Elbow_Average_right : NA_STR,
          units: DEG_STR,
          range: '70 to 80',
        }, {}, {
          src: '../../static/img/elbow_angle.png',
          title: 'Elbow Angle',
          left: angles.Elbow_Angle_left ? angles.Elbow_Angle_left : NA_STR,
          right: angles.Elbow_Angle_right ? angles.Elbow_Angle_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Elbow Angle Mean',
          left: angles.Elbow_Angle_Average_left ? angles.Elbow_Angle_Average_left : NA_STR,
          right: angles.Elbow_Angle_Average_right ? angles.Elbow_Angle_Average_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/forearm_from_level.png',
          title: 'Forearm Angle',
          left: angles.Forearm_From_Level_left ? angles.Forearm_From_Level_left : NA_STR,
          right: angles.Forearm_From_Level_right ? angles.Forearm_From_Level_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Forearm From Level Mean',
          // eslint-disable-next-line max-len
          left: angles.Forearm_From_Level_Average_left ? angles.Forearm_From_Level_Average_left : NA_STR,
          // eslint-disable-next-line max-len
          right: angles.Forearm_From_Level_Average_right ? angles.Forearm_From_Level_Average_right : NA_STR,
          units: DEG_STR,
          range: NA_STR,
        }, {},
        { title: 'Fit Alignment' }, {
          src: '../../static/img/knee_to_foot_forward.png',
        }, {
          title: 'Forearm Angle',
          left: distance.Knee_to_Foot_Forward_left ? distance.Knee_to_Foot_Forward_left : NA_STR,
          right: distance.Knee_to_Foot_Forward_right ? distance.Knee_to_Foot_Forward_right : NA_STR,
          units: 'mm',
          range: '50 to 120',
        }, {}, {
          src: '../../static/img/knee_to_feet_lateral.png',
        }, {
          title: 'Knee to Foot Lateral',
          left: distance.Knee_to_Foot_Lateral_left ? distance.Knee_to_Foot_Lateral_left : NA_STR,
          right: distance.Knee_to_Foot_Lateral_right ? distance.Knee_to_Foot_Lateral_right : NA_STR,
          units: 'mm',
          range: NA_STR,
        }, {}, {
          src: '../../static/img/hip_to_foot_lateral.png',
        }, {
          title: 'Hip to Foot Lateral',
          left: distance.Hip_to_Foot_Lateral_left ? distance.Hip_to_Foot_Lateral_left : NA_STR,
          right: distance.Hip_to_Foot_Lateral_right ? distance.Hip_to_Foot_Lateral_right : NA_STR,
          units: 'mm',
          range: NA_STR,
        }, {}, {
          src: '../../static/img/shoulder_to_wrist_lateral.png',
        }, {
          title: 'Shoulder to Wrist Lateral',
          left: distance.Shoulder_to_Wrist_Lateral_left ? distance.Shoulder_to_Wrist_Lateral_left
            : NA_STR,
          right: distance.Shoulder_to_Wrist_Lateral_right ? distance.Shoulder_to_Wrist_Lateral_right
            : NA_STR,
          units: 'mm',
          range: NA_STR,
        }, {},
        { title: 'Fit Movement' }, {
          src: '../../static/img/foot_from_level.png',
          title: 'Foot from Level',
          left: angles.Foot_From_Level_left ? angles.Foot_From_Level_left
            : NA_STR,
          right: angles.Foot_From_Level_right ? angles.Foot_From_Level_right
            : NA_STR,
          units: 'mm',
          range: NA_STR,
        }, {
          title: 'Foot from Level Mean',
          left: angles.Foot_From_Level_Average_left ? angles.Foot_From_Level_Average_left
            : NA_STR,
          right: angles.Foot_From_Level_Average_right ? angles.Foot_From_Level_Average_right
            : NA_STR,
          units: 'mm',
          range: NA_STR,
        }, {}, {
          src: '../../static/img/knee_lateral_travel.png',
        }, {
          title: 'Knee Lateral Travel',
          left: distance.Knee_Lateral_Travel_left ? distance.Knee_Lateral_Travel_left
            : NA_STR,
          right: distance.Knee_Lateral_Travel_right ? distance.Knee_Lateral_Travel_right
            : NA_STR,
          units: 'deg',
          range: '5 to 36',
        }, {}, {
          src: '../../static/img/hip_vertical_travel.png',
        }, {
          title: 'Hip Vertical Travel',
          left: distance.Hip_Vertical_Travel_left ? distance.Hip_Vertical_Travel_left
            : NA_STR,
          right: distance.Hip_Vertical_Travel_right ? distance.Hip_Vertical_Travel_right
            : NA_STR,
          units: 'mm',
          range: NA_STR,
        }, {}, {
          src: '../../static/img/hip_lateral_travel.png',
        }, {
          title: 'Hip Lateral Travel',
          left: distance.Hip_Lateral_Travel_left ? distance.Hip_Lateral_Travel_left
            : NA_STR,
          right: distance.Hip_Lateral_Travel_right ? distance.Hip_Lateral_Travel_right
            : NA_STR,
          units: 'mm',
          range: '5 to 20',
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
      return 'bike-table-cell';
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
    font-size: 16px !important;
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
    width: 126px;
    height: 90px;
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
  .bike-table-cell {
    padding: 3px 0 !important;
  }
</style>
