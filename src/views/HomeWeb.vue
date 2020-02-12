<template>
  <div class="page">
    <div class="header">
      <img class="header-logo" src="@/assets/g42-logo.svg"/>
      <img class="header-logo" src="@/assets/Logo-01.svg"/>
      <div class="navbar-btn">
        <el-button
          v-if="hasRiderInfo && !isProcessing"
          type="primary"
          @click="handleStartProcess"
          >
          Get Started
          <span class="el-icon-caret-right el-icon--right"></span>
        </el-button>
        <el-button
          v-else-if="hasRiderInfo && isProcessing"
          type="danger"
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
      <el-card class="right-panel"
               :body-style="{height: `${resolution.cardBodyHeight}px`,
               'background-color': '#f3f3f5',
                overflow: 'scroll'}"
      >
        <div class="measurement-header">Fit Angles</div>
        <div class="measurement-item"
             :key="angleIndex" v-for="(data, angleIndex) in measurement.fitAngles">
          <measurement-panel :data="data"></measurement-panel>
        </div>
        <div class="measurement-header">Fit Alignment</div>
        <div class="measurement-item"
             :key="`a${alignIndex}`" v-for="(data, alignIndex) in measurement.fitAlignment">
          <measurement-panel :data="data"></measurement-panel>
        </div>
        <div class="measurement-header">Fit Movement</div>
        <div class="measurement-item"
             :key="`b${moveIndex}`" v-for="(data, moveIndex) in measurement.fitMovement">
          <measurement-panel :data="data"></measurement-panel>
        </div>
        <div class="measurement-header">Marker Path</div>
        <div class="measurement-item">
          <van-panel title="Knee Path">
            <van-row>
              <van-col span="4">
                <div class="img-container">
                  <img class="bike-icon" src="@/assets/img/marker_path.png" />
                </div>
              </van-col>
              <van-col span="20">
                <div>
                  <canvas id="knee_path" width="180px" height="320px"></canvas>
                </div>
              </van-col>
            </van-row>
          </van-panel>
        </div>
      </el-card>
    </div>
    <div class="login-panel" v-else>
      <el-card :body-style="{height: `${resolution.cardBodyHeight}px`}">
        <log-in-page
          :max-height="resolution.cardBodyHeight"
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
import MeasurementPanel from '../components/MeasurementPanel.vue';

import ankleAngle from '../assets/img/ankle_angle.png';
import ankleAngleBottom from '../assets/img/ankle_angle_bottom.png';
import ankleAngleRear from '../assets/img/ankle_angle_rear.png';
import ankleAngleTop from '../assets/img/ankle_angle_top.png';
import ankleAngleFront from '../assets/img/ankle_angle_front.png';
import kneeAngle from '../assets/img/knee_angle.png';
import hipAngle from '../assets/img/hip_angle.png';
import backFromLevel from '../assets/img/back_from_level.png';
import hipShoulderWrist from '../assets/img/hip_shoulder_wrist.png';
import hipShoulderElbow from '../assets/img/hip_shoulder_elbow.png';
import elbowAngle from '../assets/img/elbow_angle.png';
import forearmFromLevel from '../assets/img/forearm_from_level.png';
import kneeFootForward from '../assets/img/knee_to_foot_forward.png';
import kneeFootLateral from '../assets/img/knee_to_feet_lateral.png';
import hipFootLateral from '../assets/img/hip_to_foot_lateral.png';
import shoulderWristLateral from '../assets/img/shoulder_to_wrist_lateral.png';
import footFromLevel from '../assets/img/foot_from_level.png';
import kneeLateralTravel from '../assets/img/knee_lateral_travel.png';
import hipVerticalTravel from '../assets/img/hip_vertical_travel.png';
import hipLateralTravel from '../assets/img/hip_lateral_travel.png';

const CANVAS_PREFIX = 'canvas_';
const VIDEO_PREFIX = '#video_';
const IMG_PREFIX = 'img_';
const NA_STR = '--';

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

export default {
  name: 'home',
  components: {
    VueFabric,
    SkeletonCard,
    LogInPage,
    MeasurementPanel,
  },
  data() {
    return {
      hasReport: false,
      isShowFabric: true,
      resolution: {
        originVideoWidth: 180,
        originVideoHeight: 320,
        cardBodyHeight: 0,
        cardWidth: 0,
        cardHeight: 0,
      },
      ratio: 1,
      isProcessing: false,
      measurement: this.getMeasurement({ angles: {}, distance: {} }),
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
      this.measurement = this.getMeasurement(data);
    });

    socket.on('image', (data) => {
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
      // generateReport(this.riderInfo, this.fittingData);
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
      this.resolution.cardBodyHeight = windowHeight - MARGIN_BOTTOM - MARGIN_TOP - CARD_PADDING;
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
    getFittingValObj(object, key, side) {
      return {
        value: this.getFittingValue(object, key, side),
        less: this.getFittingValue(object, key, `${side}_less_than_range`),
        more: this.getFittingValue(object, key, `${side}_more_than_range`),
        warning: this.getFittingValue(object, key, `${side}_exceed_range`, true),
      };
    },
    isWarning(object, key) {
      return this.getFittingValue(object, key, 'left_exceed_range', true)
        || this.getFittingValue(object, key, 'right_exceed_range', true);
    },
    getMeasurement(data) {
      const { angles, distance } = data;
      return {
        fitAngles: [
          {
            title: 'Ankle Angle Min',
            img: ankleAngle,
            left: this.getFittingValObj(angles, 'Ankle_Angle_Min', 'left'),
            right: this.getFittingValObj(angles, 'Ankle_Angle_Min', 'right'),
            rangeStart: 65,
            rangeEnd: 75,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Ankle_Angle_Min'),
          },
          {
            title: 'Ankle Angle Max',
            img: ankleAngle,
            left: this.getFittingValObj(angles, 'Ankle_Angle_Max', 'left'),
            right: this.getFittingValObj(angles, 'Ankle_Angle_Max', 'right'),
            rangeStart: 90,
            rangeEnd: 100,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Ankle_Angle_Max'),
          },
          {
            title: 'Ankle Angle Range',
            img: ankleAngle,
            left: this.getFittingValObj(angles, 'Ankle_Angle_Range', 'left'),
            right: this.getFittingValObj(angles, 'Ankle_Angle_Range', 'right'),
            rangeStart: 20,
            rangeEnd: 30,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Ankle_Angle_Range'),
          },
          {
            title: 'Ankle Angle at Bottom',
            img: ankleAngleBottom,
            left: this.getFittingValObj(angles, 'Ankle_Angle_Bottom', 'left'),
            right: this.getFittingValObj(angles, 'Ankle_Angle_Bottom', 'right'),
            rangeStart: 90,
            rangeEnd: 100,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Ankle_Angle_Bottom'),
          },
          {
            title: 'Ankle Angle at Rear',
            img: ankleAngleRear,
            left: this.getFittingValObj(angles, 'Ankle_Angle_Rear', 'left'),
            right: this.getFittingValObj(angles, 'Ankle_Angle_Rear', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Ankle Angle at Top',
            img: ankleAngleTop,
            left: this.getFittingValObj(angles, 'Ankle_Angle_Top', 'left'),
            right: this.getFittingValObj(angles, 'Ankle_Angle_Top', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Ankle Angle at Front',
            img: ankleAngleFront,
            left: this.getFittingValObj(angles, 'Ankle_Angle_Forward', 'left'),
            right: this.getFittingValObj(angles, 'Ankle_Angle_Forward', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Knee Angle Flexion',
            img: kneeAngle,
            left: this.getFittingValObj(angles, 'Knee_Angle_Max', 'left'),
            right: this.getFittingValObj(angles, 'Knee_Angle_Max', 'right'),
            rangeStart: 107,
            rangeEnd: 113,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Knee_Angle_Max'),
          },
          {
            title: 'Knee Angle Extension',
            img: kneeAngle,
            left: this.getFittingValObj(angles, 'Knee_Angle_Min', 'left'),
            right: this.getFittingValObj(angles, 'Knee_Angle_Min', 'right'),
            rangeStart: 33,
            rangeEnd: 42,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Knee_Angle_Min'),
          },
          {
            title: 'Knee Angle Range',
            img: kneeAngle,
            left: this.getFittingValObj(angles, 'Knee_Angle_Range', 'left'),
            right: this.getFittingValObj(angles, 'Knee_Angle_Range', 'right'),
            rangeStart: 70,
            rangeEnd: 75,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Knee_Angle_Range'),
          },
          {
            title: 'Hip Angle Closed',
            img: hipAngle,
            left: this.getFittingValObj(angles, 'Hip_Angle_Min', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Angle_Min', 'right'),
            rangeStart: 46,
            rangeEnd: 56,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Hip_Angle_Min'),
          },
          {
            title: 'Hip Angle Open',
            img: hipAngle,
            left: this.getFittingValObj(angles, 'Hip_Angle_Max', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Angle_Max', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Hip Angle Range',
            img: hipAngle,
            left: this.getFittingValObj(angles, 'Hip_Angle_Range', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Angle_Range', 'right'),
            rangeStart: 40,
            rangeEnd: 45,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Hip_Angle_Range'),
          },
          {
            title: 'Back From Level',
            img: backFromLevel,
            left: this.getFittingValObj(angles, 'Back_From_Level', 'left'),
            right: this.getFittingValObj(angles, 'Back_From_Level', 'right'),
            rangeStart: 20,
            rangeEnd: 35,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Back_From_Level'),
          },
          {
            title: 'Back From Level Mean',
            img: backFromLevel,
            left: this.getFittingValObj(angles, 'Back_From_Level_Average', 'left'),
            right: this.getFittingValObj(angles, 'Back_From_Level_Average', 'right'),
            rangeStart: 20,
            rangeEnd: 35,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Back_From_Level_Average'),
          },
          {
            title: 'Shoulder Angle Wrist',
            img: hipShoulderWrist,
            left: this.getFittingValObj(angles, 'Hip_Shoulder_Wrist', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Shoulder_Wrist', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Shoulder Angle Wrist Mean',
            img: hipShoulderWrist,
            left: this.getFittingValObj(angles, 'Hip_Shoulder_Wrist_Average', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Shoulder_Wrist_Average', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Shoulder Angle Elbow',
            img: hipShoulderElbow,
            left: this.getFittingValObj(angles, 'Hip_Shoulder_Elbow', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Shoulder_Elbow', 'right'),
            rangeStart: 70,
            rangeEnd: 80,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Hip_Shoulder_Elbow'),
          },
          {
            title: 'Shoulder Angle Elbow Mean',
            img: hipShoulderElbow,
            left: this.getFittingValObj(angles, 'Hip_Shoulder_Elbow_Average', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Shoulder_Elbow_Average', 'right'),
            rangeStart: 70,
            rangeEnd: 80,
            unit: 'deg',
            isWarn: this.isWarning(angles, 'Hip_Shoulder_Elbow_Average'),
          },
          {
            title: 'Elbow Angle',
            img: elbowAngle,
            left: this.getFittingValObj(angles, 'Elbow_Angle', 'left'),
            right: this.getFittingValObj(angles, 'Elbow_Angle', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Elbow Angle Mean',
            img: elbowAngle,
            left: this.getFittingValObj(angles, 'Elbow_Angle_Average', 'left'),
            right: this.getFittingValObj(angles, 'Elbow_Angle_Average', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Forearm Angle',
            img: forearmFromLevel,
            left: this.getFittingValObj(angles, 'Forearm_From_Level', 'left'),
            right: this.getFittingValObj(angles, 'Forearm_From_Level', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Forearm Angle Mean',
            img: forearmFromLevel,
            left: this.getFittingValObj(angles, 'Forearm_From_Level_Average', 'left'),
            right: this.getFittingValObj(angles, 'Forearm_From_Level_Average', 'right'),
            unit: 'deg',
            isWarn: false,
          },
        ],
        fitAlignment: [
          {
            title: 'Knee Forward of Foot',
            img: kneeFootForward,
            left: this.getFittingValObj(distance, 'Knee_to_Foot_Forward', 'left'),
            right: this.getFittingValObj(distance, 'Knee_to_Foot_Forward', 'right'),
            rangeStart: 65,
            rangeEnd: 75,
            unit: 'mm',
            isWarn: this.isWarning(distance, 'Knee_to_Foot_Forward'),
          },
          {
            title: 'Knee to Foot Lateral',
            img: kneeFootLateral,
            left: this.getFittingValObj(distance, 'Knee_to_Foot_Lateral', 'left'),
            right: this.getFittingValObj(distance, 'Knee_to_Foot_Lateral', 'right'),
            unit: 'mm',
            isWarn: false,
          },
          {
            title: 'Hip to Foot Lateral',
            img: hipFootLateral,
            left: this.getFittingValObj(distance, 'Hip_to_Foot_Lateral', 'left'),
            right: this.getFittingValObj(distance, 'Hip_to_Foot_Lateral', 'right'),
            unit: 'mm',
            isWarn: false,
          },
          {
            title: 'Shoulder to Wrist Lateral',
            img: shoulderWristLateral,
            left: this.getFittingValObj(distance, 'Shoulder_to_Wrist_Lateral', 'left'),
            right: this.getFittingValObj(distance, 'Shoulder_to_Wrist_Lateral', 'right'),
            unit: 'mm',
            isWarn: false,
          },
        ],
        fitMovement: [
          {
            title: 'Foot from Level',
            img: footFromLevel,
            left: this.getFittingValObj(angles, 'Foot_From_Level', 'left'),
            right: this.getFittingValObj(angles, 'Foot_From_Level', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Foot from Level Mean',
            img: footFromLevel,
            left: this.getFittingValObj(angles, 'Foot_From_Level_Average', 'left'),
            right: this.getFittingValObj(angles, 'Foot_From_Level_Average', 'right'),
            unit: 'deg',
            isWarn: false,
          },
          {
            title: 'Knee Lateral Travel',
            img: kneeLateralTravel,
            left: this.getFittingValObj(angles, 'Knee_Lateral_Travel', 'left'),
            right: this.getFittingValObj(angles, 'Knee_Lateral_Travel', 'right'),
            rangeStart: 5,
            rangeEnd: 36,
            unit: 'mm',
            isWarn: this.isWarning(distance, 'Knee_Lateral_Travel'),
          },
          {
            title: 'Hip Vertical Travel',
            img: hipVerticalTravel,
            left: this.getFittingValObj(angles, 'Hip_Vertical_Travel', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Vertical_Travel', 'right'),
            unit: 'mm',
            isWarn: false,
          },
          {
            title: 'Hip Lateral Travel',
            img: hipLateralTravel,
            left: this.getFittingValObj(angles, 'Hip_Lateral_Travel', 'left'),
            right: this.getFittingValObj(angles, 'Hip_Lateral_Travel', 'right'),
            rangeStart: 5,
            rangeEnd: 20,
            unit: 'mm',
            isWarn: this.isWarning(angles, 'Hip_Lateral_Travel'),
          },
        ],
      };
    },
    handleStartProcess() {
      this.clearFabricCanvas();
      this.isProcessing = true;
      this.hasReport = false;
      socket.emit('start_process', 'start');
    },
    handleStop() {
      this.clearFabricCanvas();
      this.isProcessing = false;
      this.hasReport = true;
      socket.emit('cancel_process');
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
  .user-drop-down {
    margin-left: 10px;
  }
  .el-radio__label {
    display: none !important;
  }
  .measurement-item {
    margin: 10px 0px;
  }
</style>
