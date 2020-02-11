<template>
  <div class="page">
    <div class="header">
      <img class="header-logo" src="@/assets/g42-logo.svg"/>
      <img class="header-logo" src="@/assets/Logo-01.svg"/>
      <div class="navbar-btn">
        <el-button
          v-if="!isProcessing"
          type="primary"
          @click="handleStartProcess"
          :disabled="!hasRiderInfo">
          Get Started
          <span class="el-icon-caret-right el-icon--right"></span>
        </el-button>
        <el-button
          v-else
          type="danger"
          :disabled="!isProcessing"
          @click="handleStop">
          Stop
          <span class="el-icon-switch-button el-icon--right"></span>
        </el-button>
        <el-button
          v-if="hasReport"
          type="primary"
          @click="getReport"
        >
          Generate Report
        </el-button>
        <el-dropdown
          class="user-drop-down"
          v-if="hasRiderInfo"
          trigger="click"
          @command="onUserCommand"
        >
          <el-button
            type="primary"
          >
            {{riderInfo.user.name}}
            <span class="el-icon-arrow-down el-icon--right"></span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="logout"
              icon="icon-el-icon-ali-logout"
            >
              Log out
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div v-if="hasRiderInfo" class="panel-body">
      <div class="left-panel">
        <div class="left-panel-row">
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
        <div class="left-panel-row">
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
        <div class="right-panel-item" key="measurement">
          <el-table
            :data="tableData"
            size="mini"
            :max-height="resolution.tableHeight"
            :span-method="processTableSpan"
            :cell-class-name="processCellClass"
            :row-class-name="processRowClass"
            :row-style="resolution.tableRowStyle"
            border
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
            <el-table-column label="Left">
              <el-table-column label="Max Less">
                <template slot-scope="scope">
                  <div v-if="scope.row.isKneePath">
                    <canvas id="knee_path" width="180px" height="320px"></canvas>
                  </div>
                  <span v-else>
                      {{scope.row.lessLeft}}
                    </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="left"
                label="Current"
              >
              </el-table-column>
              <el-table-column
                prop="moreLeft"
                label="Max More"
              >
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="Right"
            >
              <el-table-column
                prop="lessRight"
                label="Max Less"
              >
              </el-table-column>
              <el-table-column
                prop="right"
                label="Current"
              >
              </el-table-column>
              <el-table-column
                prop="moreRight"
                label="Max More"
              >
              </el-table-column>
            </el-table-column>
            <el-table-column
              prop="range"
              label="Range"
            >
            </el-table-column>
            <el-table-column
              prop="units"
              label="Units"
            >
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <div class="login-panel" v-else>
      <el-card :body-style="{height: `${resolution.tableHeight}px`}">
        <log-in-page
          :max-height="resolution.tableHeight"
          @selected-rider-event="onSelectRider">
        </log-in-page>
      </el-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
import VueFabric from '../components/fabric.vue';
import SkeletonCard from '../components/SkeletonCard.vue';
import LogInPage from '../components/LogInPage.vue';
import generateReport from '../utils/report';


const CANVAS_PREFIX = 'canvas_';
const VIDEO_PREFIX = '#video_';
const IMG_PREFIX = 'img_';
const NA_STR = '--';
const DEG_STR = 'deg';

const SIDE = {
  LEFT: 'left',
  RIGHT: 'right',
  FRONT: 'front',
};

const socket = io.connect('http://10.111.137.125:5000', { transports: ['websocket'] });

const VISIBLE_POINT = {
  right: {
    0: {
      color: '#d70067',
      radius: 14,
    },
    2: { color: '#d64700' },
    3: { color: '#d6a300' },
    4: { color: '#d7d600' },
    9: { color: '#02d648' },
    10: { color: '#00d68f' },
    11: { color: '#00d6d6' },
    22: { color: '#00efef' },
  },
  left: {
    0: {
      color: '#d70067',
      radius: 14,
    },
    5: { color: '#8fd500' },
    6: { color: '#33d602' },
    7: { color: '#00d600' },
    12: { color: '#048ed6' },
    13: { color: '#0048d6' },
    14: { color: '#1000d6' },
    19: { color: '#1000d6' },
  },
  front: {
    0: {
      color: '#d70067',
      radius: 14,
    },
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
    {
      line: [0, 2],
      color: '#990033',
    },
    {
      line: [2, 9],
      color: '#990001',
    },
    {
      line: [2, 3],
      color: '#996601',
    },
    {
      line: [3, 4],
      color: '#989900',
    },
    {
      line: [9, 10],
      color: '#019966',
    },
    {
      line: [10, 11],
      color: '#009999',
    },
    {
      line: [11, 22],
      color: '#009999',
    },
  ],
  left: [
    {
      line: [0, 5],
      color: '#990033',
    },
    {
      line: [12, 5],
      color: '#990001',
    },
    {
      line: [6, 5],
      color: '#339901',
    },
    {
      line: [6, 7],
      color: '#009901',
    },
    {
      line: [12, 13],
      color: '#003399',
    },
    {
      line: [13, 14],
      color: '#080099',
    },
    {
      line: [14, 19],
      color: '#080099',
    },
  ],
  front: [
    {
      line: [0, 1],
      color: '#990033',
    },
    {
      line: [1, 2],
      color: '#993300',
    },
    {
      line: [1, 5],
      color: '#679900',
    },
    {
      line: [2, 3],
      color: '#996601',
    },
    {
      line: [3, 4],
      color: '#989900',
    },
    {
      line: [5, 6],
      color: '#339901',
    },
    {
      line: [6, 7],
      color: '#009901',
    },
    {
      line: [1, 8],
      color: '#990001',
    },
    {
      line: [9, 8],
      color: '#009933',
    },
    {
      line: [12, 8],
      color: '#006699',
    },
    {
      line: [9, 10],
      color: '#019966',
    },
    {
      line: [11, 10],
      color: '#009999',
    },
    {
      line: [12, 13],
      color: '#003399',
    },
    {
      line: [13, 14],
      color: '#080099',
    },
    {
      line: [11, 22],
      color: '#009999',
    },
    {
      line: [19, 14],
      color: '#080099',
    },
  ],
};

const DATA_FIELD_NUM = 8;

const TABLE_HEADER_INDEX = [0, 37, 50, 63, 300];
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
    LogInPage,
  },
  computed: {
  },
  data() {
    return {
      hasReport: false,
      isShowFabric: true,
      resolution: {
        originVideoWidth: 180,
        originVideoHeight: 320,
        tableHeight: 0,
        cardWidth: 0,
        cardHeight: 0,
        tableRowStyle: {
          height: '30px',
          'font-size': '10px',
        },
      },
      ratio: 1,
      isProcessing: false,
      fittingData: {
        angles: {},
        distance: {},
        images: {},
        skeleton: {},
      },
      tableData: this.getFittingData({
        angles: {},
        distance: {},
      }),
      hasRiderInfo: false,
      riderInfo: {},
    };
  },
  mounted() {
    socket.on('connect', () => {
      window.console.log('socket connected');
    });

    socket.on('points', (data) => {
      Object.keys(SIDE)
        .forEach((key) => {
          const side = SIDE[key];
          this.renderFabric(data, side);
        });
      this.fittingData.angles = data.angles;
      this.fittingData.distance = data.distance;
      this.tableData = this.getFittingData(data);
    });

    socket.on('image', (data) => {
      this.fittingData.images = data;
      Object.keys(SIDE)
        .forEach((key) => {
          const side = SIDE[key];
          this.renderVideo(data, side);

          const url = `data:image/jpeg;base64,${data.img_knee_path}`;
          const ctx = document.querySelector('#knee_path')
            .getContext('2d');

          const image = new Image();
          image.src = url;
          image.onload = () => {
            ctx.drawImage(image, 0, 0,
              180, 320);
          };
        });
    });

    socket.on('disconnect', () => {
      window.console.log('disconnect');
    });

    this.$nextTick(this.calculateHeight);
    window.onresize = this.calculateHeight;
  },
  methods: {
    getReport() {
      generateReport(this.riderInfo, this.fittingData);
      this.hasReport = false;
    },
    onUserCommand(command) {
      if (command === 'logout') {
        this.hasRiderInfo = false;
        this.riderInfo = {};
      }
    },
    onSelectRider(rider) {
      this.riderInfo = rider;
      this.hasRiderInfo = true;
    },
    calculateHeight() {
      const MARGIN_TOP = 100;
      const MARGIN_BOTTOM = 70;
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
      Object.keys(SIDE)
        .forEach((key) => {
          this.$refs[CANVAS_PREFIX + SIDE[key]].clear();
        });
    },
    renderFabric(data, side) {
      const points = data[side].map(input => [
        input[0] * this.ratio, input[1] * this.ratio, input[2]]);
      // eslint-disable-next-line no-restricted-syntax
      for (const idx in VISIBLE_POINT[side]) {
        if (!points[idx][2]) {
          return;
        }
      }
      this.$refs[CANVAS_PREFIX + side].clear();
      this.drawLines(points, side);
      points.forEach((point, index) => {
        if (point[2] && VISIBLE_POINT[side][index]) {
          this.drawPoint(point, VISIBLE_POINT[side][index], side);
        }
      });
    },
    renderVideo(data, side) {
      const url = `data:image/jpeg;base64,${data[IMG_PREFIX + side]}`;
      const ctx = document.querySelector(VIDEO_PREFIX + side)
        .getContext('2d');

      const image = new Image();
      image.src = url;
      image.onload = () => {
        ctx.drawImage(image, 0, 0,
          this.resolution.cardWidth, this.resolution.cardHeight);
      };
    },
    drawPoint(point, attr, side) {
      const radius = attr.radius ? attr.radius : 3;
      this.$refs[CANVAS_PREFIX + side].createCircle({
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
          this.$refs[CANVAS_PREFIX + side].drawDottedline({
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
    getFittingValue(object, key, secondKey, isBool) {
      if (object[key] && object[key][secondKey]) {
        return object[key][secondKey];
      }
      return isBool ? false : NA_STR;
    },
    getFittingData(data) {
      const { angles, distance } = data;
      return [
        { title: 'Fit Angles' }, {
          src: '../../static/img/ankle_angle.png',
          title: 'Ankle Angle Min',
          left: this.getFittingValue(angles, 'Ankle_Angle_Min', 'left'),
          lessLeft: this.getFittingValue(angles, 'Ankle_Angle_Min', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Ankle_Angle_Min', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Ankle_Angle_Min', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Ankle_Angle_Min', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Ankle_Angle_Min', 'right'),
          warning: this.getFittingValue(angles, 'Ankle_Angle_Min', 'left_exceed_range', true) || this.getFittingValue(angles, 'Ankle_Angle_Min', 'right_exceed_range', true),
          units: DEG_STR,
          range: '65 to 75',
        }, {
          title: 'Ankle Angle Max',
          left: this.getFittingValue(angles, 'Ankle_Angle_Max', 'left'),
          lessLeft: this.getFittingValue(angles, 'Ankle_Angle_Max', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Ankle_Angle_Max', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Ankle_Angle_Max', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Ankle_Angle_Max', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Ankle_Angle_Max', 'right'),
          warning: this.getFittingValue(angles, 'Ankle_Angle_Max', 'left_exceed_range', true) || this.getFittingValue(angles, 'Ankle_Angle_Max', 'right_exceed_range', true),
          units: DEG_STR,
          range: '90 to 100',
        }, {
          title: 'Ankle Angle Range',
          left: this.getFittingValue(angles, 'Ankle_Angle_Range', 'left'),
          lessLeft: this.getFittingValue(angles, 'Ankle_Angle_Range', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Ankle_Angle_Range', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Ankle_Angle_Range', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Ankle_Angle_Range', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Ankle_Angle_Range', 'right'),
          warning: this.getFittingValue(angles, 'Ankle_Angle_Range', 'left_exceed_range', true) || this.getFittingValue(angles, 'Ankle_Angle_Range', 'right_exceed_range', true),
          units: DEG_STR,
          range: '20 to 30',
        }, {
          src: '../../static/img/ankle_angle_bottom.png',
        }, {
          title: 'Ankle Angle At Bottom',
          left: this.getFittingValue(angles, 'Ankle_Angle_Bottom', 'left'),
          lessLeft: this.getFittingValue(angles, 'Ankle_Angle_Bottom', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Ankle_Angle_Bottom', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Ankle_Angle_Bottom', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Ankle_Angle_Bottom', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Ankle_Angle_Bottom', 'right'),
          warning: this.getFittingValue(angles, 'Ankle_Angle_Bottom', 'left_exceed_range', true) || this.getFittingValue(angles, 'Ankle_Angle_Bottom', 'right_exceed_range', true),
          units: DEG_STR,
          range: '90 to 100',
        }, {}, {
          src: '../../static/img/ankle_angle_rear.png',
        }, {
          title: 'Ankle Angle At Rear',
          left: this.getFittingValue(angles, 'Ankle_Angle_Rear', 'left'),
          lessLeft: this.getFittingValue(angles, 'Ankle_Angle_Rear', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Ankle_Angle_Rear', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Ankle_Angle_Rear', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Ankle_Angle_Rear', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Ankle_Angle_Rear', 'right'),
          warning: this.getFittingValue(angles, 'Ankle_Angle_Rear', 'left_exceed_range', true) || this.getFittingValue(angles, 'Ankle_Angle_Rear', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/ankle_angle_top.png',
        }, {
          title: 'Ankle Angle At Top',
          left: this.getFittingValue(angles, 'Ankle_Angle_Top', 'left'),
          lessLeft: this.getFittingValue(angles, 'Ankle_Angle_Top', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Ankle_Angle_Top', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Ankle_Angle_Top', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Ankle_Angle_Top', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Ankle_Angle_Top', 'right'),
          warning: this.getFittingValue(angles, 'Ankle_Angle_Top', 'left_exceed_range', true) || this.getFittingValue(angles, 'Ankle_Angle_Top', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/ankle_angle_front.png',
        }, {
          title: 'Ankle Angle At Front',
          left: this.getFittingValue(angles, 'Ankle_Angle_Forward', 'left'),
          lessLeft: this.getFittingValue(angles, 'Ankle_Angle_Forward', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Ankle_Angle_Forward', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Ankle_Angle_Forward', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Ankle_Angle_Forward', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Ankle_Angle_Forward', 'right'),
          warning: this.getFittingValue(angles, 'Ankle_Angle_Forward', 'left_exceed_range', true) || this.getFittingValue(angles, 'Ankle_Angle_Forward', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/knee_angle.png',
          title: 'Knee Angle Flexion',
          left: this.getFittingValue(angles, 'Knee_Angle_Max', 'left'),
          lessLeft: this.getFittingValue(angles, 'Knee_Angle_Max', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Knee_Angle_Max', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Knee_Angle_Max', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Knee_Angle_Max', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Knee_Angle_Max', 'right'),
          warning: this.getFittingValue(angles, 'Knee_Angle_Max', 'left_exceed_range', true) || this.getFittingValue(angles, 'Knee_Angle_Max', 'right_exceed_range', true),
          units: DEG_STR,
          range: '107 to 113',
        }, {
          title: 'Knee Angle Extension',
          left: this.getFittingValue(angles, 'Knee_Angle_Min', 'left'),
          lessLeft: this.getFittingValue(angles, 'Knee_Angle_Min', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Knee_Angle_Min', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Knee_Angle_Min', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Knee_Angle_Min', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Knee_Angle_Min', 'right'),
          warning: this.getFittingValue(angles, 'Knee_Angle_Min', 'left_exceed_range', true) || this.getFittingValue(angles, 'Knee_Angle_Min', 'right_exceed_range', true),
          units: DEG_STR,
          range: '33 to 42',
        }, {
          title: 'Knee Angle Range',
          left: this.getFittingValue(angles, 'Knee_Angle_Range', 'left'),
          lessLeft: this.getFittingValue(angles, 'Knee_Angle_Range', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Knee_Angle_Range', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Knee_Angle_Range', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Knee_Angle_Range', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Knee_Angle_Range', 'right'),
          warning: this.getFittingValue(angles, 'Knee_Angle_Range', 'left_exceed_range', true) || this.getFittingValue(angles, 'Knee_Angle_Range', 'right_exceed_range', true),
          units: DEG_STR,
          range: '70 to 75',
        }, {
          src: '../../static/img/hip_angle.png',
          title: 'Hip Angle Closed',
          left: this.getFittingValue(angles, 'Hip_Angle_Min', 'left'),
          lessLeft: this.getFittingValue(angles, 'Hip_Angle_Min', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Hip_Angle_Min', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Hip_Angle_Min', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Hip_Angle_Min', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Hip_Angle_Min', 'right'),
          warning: this.getFittingValue(angles, 'Hip_Angle_Min', 'left_exceed_range', true) || this.getFittingValue(angles, 'Hip_Angle_Min', 'right_exceed_range', true),
          units: DEG_STR,
          range: '46 to 56',
        }, {
          title: 'Hip Angel Open',
          left: this.getFittingValue(angles, 'Hip_Angle_Max', 'left'),
          lessLeft: this.getFittingValue(angles, 'Hip_Angle_Max', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Hip_Angle_Max', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Hip_Angle_Max', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Hip_Angle_Max', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Hip_Angle_Max', 'right'),
          warning: this.getFittingValue(angles, 'Hip_Angle_Max', 'left_exceed_range', true) || this.getFittingValue(angles, 'Hip_Angle_Max', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Hip Angle Range',
          left: this.getFittingValue(angles, 'Hip_Angle_Range', 'left'),
          lessLeft: this.getFittingValue(angles, 'Hip_Angle_Range', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Hip_Angle_Range', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Hip_Angle_Range', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Hip_Angle_Range', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Hip_Angle_Range', 'right'),
          warning: this.getFittingValue(angles, 'Hip_Angle_Range', 'left_exceed_range', true) || this.getFittingValue(angles, 'Hip_Angle_Range', 'right_exceed_range', true),
          units: DEG_STR,
          range: '40 to 45',
        }, {
          src: '../../static/img/back_from_level.png',
          title: 'Back From Level',
          left: this.getFittingValue(angles, 'Back_From_Level', 'left'),
          lessLeft: this.getFittingValue(angles, 'Back_From_Level', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Back_From_Level', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Back_From_Level', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Back_From_Level', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Back_From_Level', 'right'),
          warning: this.getFittingValue(angles, 'Back_From_Level', 'left_exceed_range', true) || this.getFittingValue(angles, 'Back_From_Level', 'right_exceed_range', true),
          units: DEG_STR,
          range: '20 to 35',
        }, {
          title: 'Back From Level Mean',
          left: this.getFittingValue(angles, 'Back_From_Level_Average', 'left'),
          lessLeft: this.getFittingValue(angles, 'Back_From_Level_Average', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Back_From_Level_Average', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Back_From_Level_Average', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Back_From_Level_Average', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Back_From_Level_Average', 'right'),
          warning: this.getFittingValue(angles, 'Back_From_Level_Average', 'left_exceed_range', true) || this.getFittingValue(angles, 'Back_From_Level_Average', 'right_exceed_range', true),
          units: DEG_STR,
          range: '20 to 35',
        }, {}, {
          src: '../../static/img/hip_shoulder_wrist.png',
          title: 'Shoulder Angle Wrist',
          left: this.getFittingValue(angles, 'Hip_Shoulder_Wrist', 'left'),
          lessLeft: this.getFittingValue(angles, 'Hip_Shoulder_Wrist', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Hip_Shoulder_Wrist', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Hip_Shoulder_Wrist', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Hip_Shoulder_Wrist', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Hip_Shoulder_Wrist', 'right'),
          warning: this.getFittingValue(angles, 'Hip_Shoulder_Wrist', 'left_exceed_range', true) || this.getFittingValue(angles, 'Hip_Shoulder_Wrist', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Shoulder Angle Wrist Mean',
          // eslint-disable-next-line max-len
          left: this.getFittingValue(angles, 'Hip_Shoulder_Wrist_Average', 'left'),
          lessLeft: this.getFittingValue(angles, 'Hip_Shoulder_Wrist_Average', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Hip_Shoulder_Wrist_Average', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Hip_Shoulder_Wrist_Average', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Hip_Shoulder_Wrist_Average', 'right_more_than_range'),
          // eslint-disable-next-line max-len
          right: this.getFittingValue(angles, 'Hip_Shoulder_Wrist_Average', 'right'),
          warning: this.getFittingValue(angles, 'Hip_Shoulder_Wrist_Average', 'left_exceed_range', true) || this.getFittingValue(angles, 'Hip_Shoulder_Wrist_Average', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/hip_shoulder_elbow.png',
          title: 'Shoulder Angle Elbow',
          left: this.getFittingValue(angles, 'Hip_Shoulder_Elbow', 'left'),
          lessLeft: this.getFittingValue(angles, 'Hip_Shoulder_Elbow', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Hip_Shoulder_Elbow', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Hip_Shoulder_Elbow', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Hip_Shoulder_Elbow', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Hip_Shoulder_Elbow', 'right'),
          warning: this.getFittingValue(angles, 'Hip_Shoulder_Elbow', 'left_exceed_range', true) || this.getFittingValue(angles, 'Hip_Shoulder_Elbow', 'right_exceed_range', true),
          units: DEG_STR,
          range: '70 to 80',
        }, {
          title: 'Shoulder Angle Elbow Mean',
          // eslint-disable-next-line max-len
          left: this.getFittingValue(angles, 'Hip_Shoulder_Elbow_Average', 'left'),
          lessLeft: this.getFittingValue(angles, 'Hip_Shoulder_Elbow_Average', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Hip_Shoulder_Elbow_Average', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Hip_Shoulder_Elbow_Average', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Hip_Shoulder_Elbow_Average', 'right_more_than_range'),
          // eslint-disable-next-line max-len
          right: this.getFittingValue(angles, 'Hip_Shoulder_Elbow_Average', 'right'),
          warning: this.getFittingValue(angles, 'Hip_Shoulder_Elbow_Average', 'left_exceed_range', true) || this.getFittingValue(angles, 'Hip_Shoulder_Elbow_Average', 'right_exceed_range', true),
          units: DEG_STR,
          range: '70 to 80',
        }, {}, {
          src: '../../static/img/elbow_angle.png',
          title: 'Elbow Angle',
          left: this.getFittingValue(angles, 'Elbow_Angle', 'left'),
          lessLeft: this.getFittingValue(angles, 'Elbow_Angle', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Elbow_Angle', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Elbow_Angle', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Elbow_Angle', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Elbow_Angle', 'right'),
          warning: this.getFittingValue(angles, 'Elbow_Angle', 'left_exceed_range', true) || this.getFittingValue(angles, 'Elbow_Angle', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Elbow Angle Mean',
          left: this.getFittingValue(angles, 'Elbow_Angle_Average', 'left'),
          lessLeft: this.getFittingValue(angles, 'Elbow_Angle_Average', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Elbow_Angle_Average', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Elbow_Angle_Average', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Elbow_Angle_Average', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Elbow_Angle_Average', 'right'),
          warning: this.getFittingValue(angles, 'Elbow_Angle_Average', 'left_exceed_range', true) || this.getFittingValue(angles, 'Elbow_Angle_Average', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {}, {
          src: '../../static/img/forearm_from_level.png',
          title: 'Forearm Angle',
          left: this.getFittingValue(angles, 'Forearm_From_Level', 'left'),
          lessLeft: this.getFittingValue(angles, 'Forearm_From_Level', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Forearm_From_Level', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Forearm_From_Level', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Forearm_From_Level', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Forearm_From_Level', 'right'),
          warning: this.getFittingValue(angles, 'Forearm_From_Level', 'left_exceed_range', true) || this.getFittingValue(angles, 'Forearm_From_Level', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {
          title: 'Forearm From Level Mean',
          // eslint-disable-next-line max-len
          left: this.getFittingValue(angles, 'Forearm_From_Level_Average', 'left'),
          lessLeft: this.getFittingValue(angles, 'Forearm_From_Level_Average', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Forearm_From_Level_Average', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Forearm_From_Level_Average', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Forearm_From_Level_Average', 'right_more_than_range'),
          // eslint-disable-next-line max-len
          right: this.getFittingValue(angles, 'Forearm_From_Level_Average', 'right'),
          warning: this.getFittingValue(angles, 'Forearm_From_Level_Average', 'left_exceed_range', true) || this.getFittingValue(angles, 'Forearm_From_Level_Average', 'right_exceed_range', true),
          units: DEG_STR,
          range: NA_STR,
        }, {},
        { title: 'Fit Alignment' }, {
          src: '../../static/img/knee_to_foot_forward.png',
        }, {
          title: 'Knee Forward of Foot',
          left: this.getFittingValue(distance, 'Knee_to_Foot_Forward', 'left'),
          lessLeft: this.getFittingValue(distance, 'Knee_to_Foot_Forward', 'left_less_than_range'),
          moreLeft: this.getFittingValue(distance, 'Knee_to_Foot_Forward', 'left_more_than_range'),
          lessRight: this.getFittingValue(distance, 'Knee_to_Foot_Forward', 'right_less_than_range'),
          moreRight: this.getFittingValue(distance, 'Knee_to_Foot_Forward', 'right_more_than_range'),
          right: this.getFittingValue(distance, 'Knee_to_Foot_Forward', 'right'),
          units: 'mm',
          range: '50 to 120',
        }, {}, {
          src: '../../static/img/knee_to_feet_lateral.png',
        }, {
          title: 'Knee to Foot Lateral',
          left: this.getFittingValue(distance, 'Knee_to_Foot_Lateral', 'left'),
          lessLeft: this.getFittingValue(distance, 'Knee_to_Foot_Lateral', 'left_less_than_range'),
          moreLeft: this.getFittingValue(distance, 'Knee_to_Foot_Lateral', 'left_more_than_range'),
          lessRight: this.getFittingValue(distance, 'Knee_to_Foot_Lateral', 'right_less_than_range'),
          moreRight: this.getFittingValue(distance, 'Knee_to_Foot_Lateral', 'right_more_than_range'),
          right: this.getFittingValue(distance, 'Knee_to_Foot_Lateral', 'right'),
          units: 'mm',
          range: NA_STR,
        }, {}, {
          src: '../../static/img/hip_to_foot_lateral.png',
        }, {
          title: 'Hip to Foot Lateral',
          left: this.getFittingValue(distance, 'Hip_to_Foot_Lateral', 'left'),
          lessLeft: this.getFittingValue(distance, 'Hip_to_Foot_Lateral', 'left_less_than_range'),
          moreLeft: this.getFittingValue(distance, 'Hip_to_Foot_Lateral', 'left_more_than_range'),
          lessRight: this.getFittingValue(distance, 'Hip_to_Foot_Lateral', 'right_less_than_range'),
          moreRight: this.getFittingValue(distance, 'Hip_to_Foot_Lateral', 'right_more_than_range'),
          right: this.getFittingValue(distance, 'Hip_to_Foot_Lateral', 'right'),
          units: 'mm',
          range: NA_STR,
        }, {}, {
          src: '../../static/img/shoulder_to_wrist_lateral.png',
        }, {
          title: 'Shoulder to Wrist Lateral',
          left: this.getFittingValue(distance, 'Shoulder_to_Wrist_Lateral', 'left'),
          lessLeft: this.getFittingValue(distance, 'Shoulder_to_Wrist_Lateral', 'left_less_than_range'),
          moreLeft: this.getFittingValue(distance, 'Shoulder_to_Wrist_Lateral', 'left_more_than_range'),
          lessRight: this.getFittingValue(distance, 'Shoulder_to_Wrist_Lateral', 'right_less_than_range'),
          moreRight: this.getFittingValue(distance, 'Shoulder_to_Wrist_Lateral', 'right_more_than_range'),
          right: this.getFittingValue(distance, 'Shoulder_to_Wrist_Lateral', 'right'),
          units: 'mm',
          range: NA_STR,
        }, {},
        { title: 'Fit Movement' }, {
          src: '../../static/img/foot_from_level.png',
          title: 'Foot from Level',
          left: this.getFittingValue(angles, 'Foot_From_Level', 'left'),
          lessLeft: this.getFittingValue(angles, 'Foot_From_Level', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Foot_From_Level', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Foot_From_Level', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Foot_From_Level', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Foot_From_Level', 'right'),
          warning: this.getFittingValue(angles, 'Foot_From_Level', 'left_exceed_range', true) || this.getFittingValue(angles, 'Foot_From_Level', 'right_exceed_range', true),
          units: 'deg',
          range: NA_STR,
        }, {
          title: 'Foot from Level Mean',
          left: this.getFittingValue(angles, 'Foot_From_Level_Average', 'left'),
          lessLeft: this.getFittingValue(angles, 'Foot_From_Level_Average', 'left_less_than_range'),
          moreLeft: this.getFittingValue(angles, 'Foot_From_Level_Average', 'left_more_than_range'),
          lessRight: this.getFittingValue(angles, 'Foot_From_Level_Average', 'right_less_than_range'),
          moreRight: this.getFittingValue(angles, 'Foot_From_Level_Average', 'right_more_than_range'),
          right: this.getFittingValue(angles, 'Foot_From_Level_Average', 'right'),
          warning: this.getFittingValue(angles, 'Foot_From_Level_Average', 'left_exceed_range', true) || this.getFittingValue(angles, 'Foot_From_Level_Average', 'right_exceed_range', true),
          units: 'deg',
          range: NA_STR,
        }, {}, {
          src: '../../static/img/knee_lateral_travel.png',
        }, {
          title: 'Knee Lateral Travel',
          left: this.getFittingValue(distance, 'Knee_Lateral_Travel', 'left'),
          lessLeft: this.getFittingValue(distance, 'Knee_Lateral_Travel', 'left_less_than_range'),
          moreLeft: this.getFittingValue(distance, 'Knee_Lateral_Travel', 'left_more_than_range'),
          lessRight: this.getFittingValue(distance, 'Knee_Lateral_Travel', 'right_less_than_range'),
          moreRight: this.getFittingValue(distance, 'Knee_Lateral_Travel', 'right_more_than_range'),
          right: this.getFittingValue(distance, 'Knee_Lateral_Travel', 'right'),
          units: 'mm',
          range: '5 to 36',
        }, {}, {
          src: '../../static/img/hip_vertical_travel.png',
        }, {
          title: 'Hip Vertical Travel',
          left: this.getFittingValue(distance, 'Hip_Vertical_Travel', 'left'),
          lessLeft: this.getFittingValue(distance, 'Hip_Vertical_Travel', 'left_less_than_range'),
          moreLeft: this.getFittingValue(distance, 'Hip_Vertical_Travel', 'left_more_than_range'),
          lessRight: this.getFittingValue(distance, 'Hip_Vertical_Travel', 'right_less_than_range'),
          moreRight: this.getFittingValue(distance, 'Hip_Vertical_Travel', 'right_more_than_range'),
          right: this.getFittingValue(distance, 'Hip_Vertical_Travel', 'right'),
          units: 'mm',
          range: NA_STR,
        }, {}, {
          src: '../../static/img/hip_lateral_travel.png',
        }, {
          title: 'Hip Lateral Travel',
          left: this.getFittingValue(distance, 'Hip_Lateral_Travel', 'left'),
          lessLeft: this.getFittingValue(distance, 'Hip_Lateral_Travel', 'left_less_than_range'),
          moreLeft: this.getFittingValue(distance, 'Hip_Lateral_Travel', 'left_more_than_range'),
          lessRight: this.getFittingValue(distance, 'Hip_Lateral_Travel', 'right_less_than_range'),
          moreRight: this.getFittingValue(distance, 'Hip_Lateral_Travel', 'right_more_than_range'),
          right: this.getFittingValue(distance, 'Hip_Lateral_Travel', 'right'),
          units: 'mm',
          range: '5 to 20',
        }, {},
        { title: 'Marker Path' }, {
          src: '../../static/img/marker_path.png',
          title: 'Front View of Knee Path',
          isKneePath: true,
        },
      ];
    },
    handleStartProcess() {
      this.clearFabricCanvas();
      this.isProcessing = true;
      this.hasReport = false;
      socket.emit('start_process', 'start');
    },
    handleStop() {
      Object.keys(SIDE).forEach((key) => {
        const side = SIDE[key];
        this.fittingData.skeleton[side] = this.$refs[CANVAS_PREFIX + side].toDataUrl();
      });
      console.log(this.fittingData.skeleton);
      this.clearFabricCanvas();
      this.isProcessing = false;
      this.hasReport = true;
      socket.emit('cancel_process');
    },
    processTableSpan(table) {
      // is Knee Path
      if (table.row.isKneePath) {
        if (table.columnIndex === 1 || table.columnIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1,
          };
        }
        if (table.columnIndex === 2) {
          return {
            rowspan: 3,
            colspan: DATA_FIELD_NUM,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
      // is data header
      if (TABLE_HEADER_INDEX.indexOf(table.rowIndex) > -1) {
        if (table.columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: DATA_FIELD_NUM + 2,
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
    processCellClass({ columnIndex, rowIndex }) {
      if (TABLE_HEADER_INDEX.indexOf(rowIndex) > -1) {
        return 'measurement-header';
      }
      if (DATA_START_INDEX.indexOf(rowIndex) > -1 && columnIndex === 0) {
        return 'img-container';
      }
      return 'bike-table-cell';
    },
    processRowClass({ row }) {
      if (row.warning === true) {
        return 'warning-row';
      }
      return '';
    },
    reload() {
      this.isShowFabric = false;
      this.$nextTick(() => {
        this.isShowFabric = true;
      });
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

  .navbar-btn {
    display: inline-block;
    line-height: 80px;
    float: right;
    vertical-align: middle;
  }

  .panel-body {
    margin-top: 100px;
    display: flex;
    flex-direction: row;
    padding: 0 20px;
  }
  .login-panel {
    padding-top: 100px;
    margin: 0 20px;
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
    position: relative;
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
    width: 90px;
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

  .el-table .warning-row {
    background: oldlace;
  }

  .right-panel-item {
    position: absolute;
    top: 20px;
    left: 20px;
    bottom: 20px;
    right: 20px;
  }
  .user-drop-down {
    margin-left: 10px;
  }
  .el-radio__label {
    display: none !important;
  }
</style>
