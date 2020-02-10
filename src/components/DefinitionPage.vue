<template>
  <div>
    <el-table
    :data="definitions"
    size="mini"
    :max-height="maxHeight"
    style="width: 100%; height: 100%"
    :row-class-name="getRowClass"
    >
      <el-table-column label="Key" width="250">
        <template slot-scope="scope">
          <div v-if="!scope.row.isSkeleton" class="def-img-container">
            <img :src="scope.row.image" class="bike-icon">
          </div>
          <div v-else>
            <img :src="scope.row.image" class="bike-icon">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Definition">
        <template slot-scope="scope">
          <div :key="key" v-for="(value, key) in scope.row.definition">
            <div class="def-title">
              <u>{{key}}</u>
            </div>
            <div class="def-content">{{value}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import KeyPointImg from '../assets/keypoints_pose_25.jpg';
import ankleAngle from '../assets/img/ankle_angle.png';
import ankleAngleBottom from '../assets/img/ankle_angle_bottom.png';
import ankleAngleRear from '../assets/img/ankle_angle_rear.png';
import ankleAngleAtTop from '../assets/img/ankle_angle_top.png';
import ankleAngleAtFront from '../assets/img/ankle_angle_front.png';
import kneeAngle from '../assets/img/knee_angle.png';
import hipAngle from '../assets/img/hip_angle.png';
import backFromLevel from '../assets/img/back_from_level.png';
import shoulderAnkleWrist from '../assets/img/hip_shoulder_wrist.png';
import elbowAngle from '../assets/img/hip_shoulder_elbow.png';
import forearmAngle from '../assets/img/forearm_from_level.png';
import kneeFootForward from '../assets/img/knee_to_foot_forward.png';
import kneeFootLateral from '../assets/img/knee_to_feet_lateral.png';
import hipFootLateral from '../assets/img/hip_to_foot_lateral.png';
import shoulderWristLateral from '../assets/img/shoulder_to_wrist_lateral.png';
import footFromLevel from '../assets/img/foot_from_level.png';
import kneeLateralTravel from '../assets/img/knee_lateral_travel.png';
import hipVerticalTravel from '../assets/img/hip_vertical_travel.png';
import hipLateralTravel from '../assets/img/hip_lateral_travel.png';
import markerPath from '../assets/img/marker_path.png';

export default {
  name: 'DefinitionPage',
  props: {
    maxHeight: {
      type: Number,
      required: true,
    },
  },
  methods: {
    getRowClass({ row }) {
      if (row.isSkeleton) {
        return 'skeleton-row';
      }
      return 'def-row';
    },
  },
  data() {
    return {
      definitions: [{
        image: KeyPointImg,
        isSkeleton: true,
        definition: {
          'Illustration of Skeleton': '',
        },
      }, {
        image: ankleAngle,
        definition: {
          'Ankle Minimum': 'Maximum dorsiflexion at any point in the pedal stroke defined by the knee-ankle line and the heel-foot-line.',
          'Ankle Maximun': 'Maximum plantarflexion at any point in the pedal stroke defined by the knee-ankle line and the heel-foot-line.',
        },
      }, {
        image: ankleAngle,
        definition: { 'Ankle Range': 'The difference between ankle maximum and ankle minimum.' },
      }, {
        image: ankleAngleAtTop,
        definition: { 'Ankle Angle at Top': 'The ankle angle at the top of the pedal stroke (0 degrees).' },
      }, {
        image: ankleAngleAtFront,
        definition: { 'Ankle Angle at Front': 'The ankle angle at the front of the pedal stroke (90 degrees).' },
      }, {
        image: ankleAngleBottom,
        definition: { 'Ankle Angle at Bottom': 'The ankle angle at the bottom of the pedal stroke (180 degrees).' },
      }, {
        image: ankleAngleRear,
        definition: { 'Ankle Angle at Rear': 'The ankle angle at the rear of the pedal stroke (270 degrees).' },
      }, {
        image: kneeAngle,
        definition: {
          'Maximum Knee Flexion': 'Maximum flexion of the knee joint at any point in the pedal stroke defined by the hip-knee line and the knee-ankle line',
          'Maximum Knee Extension': 'Maximum extension of the knee joint at any point in the pedal stroke defined by the hip-knee line and the knee-ankle line',
        },
      }, {
        image: kneeAngle,
        definition: { 'Knee Angle Range': 'The difference between knee angle flexion and knee angle extension.' },
      }, {
        image: hipAngle,
        definition: {
          'Hip Angle Closed': 'The most closed angle of the hip joint defined by the knee, hip and shoulder marker.',
          'Hip Angle Open': 'The most open angle of the hip joint defined by the knee, hip and shoulder marker.',
          'Hip Angle Range': 'The difference between hip angle open and closed.',
        },
      }, {
        image: backFromLevel,
        definition: { 'Back Angle': 'The angle of the back relative to the horizon defined by the hip and shoulder marker' },
      }, {
        image: shoulderAnkleWrist,
        definition: {
          'Shoulder Angle to Wrist': 'The angle of the shoulder joint defined by the hip, shoulder, and wrist markers.',
          'Shoulder Angle to Elbow': 'The angle of the shoulder joint defined by the hip, shoulder, and elbow markers.',
        },
      }, {
        image: elbowAngle,
        definition: { 'Elbow Angle': 'The angle of the elbow joint defined by the shoulder, elbow, and wrist marker' },
      }, {
        image: forearmAngle,
        definition: { 'Forearm Angle': 'The angle of the forearm relative to the horizon defined by the elbow and wrist markers. A positive number indicates the wrist is higher than the elbow' },
      }, {
        image: kneeFootForward,
        definition: { 'Knee Forward of Foot': 'The fore/aft offset of the knee marker relative to the foot marker captured at the forward part of the pedal stroke (3 o\'clock or 90 degrees down). A negative number indicates a knee that is aft of neutral.' },
      }, {
        image: kneeFootForward,
        definition: { 'Knee Forward of Spindle': 'The fore/aft offset of the knee marker relative to the pedal spindle at 3 o\'clock in the pedal stroke (90 degrees in the downstroke).' },
      }, {
        image: kneeFootLateral,
        definition: { 'Knee Varus/Valgus (prior KFLO)': 'The lateral offset between the knee and foot markers. A negative number indicates the knee is in valgus. A positive number indicates the knee is in varus.' },
      }, {
        image: hipFootLateral,
        definition: { 'Hip to Foot Lateral Offset': 'The lateral offset between the hip and foot marker. A negative number indicates the hip is outside the foot. A positive number indicates that the hip is inside the foot.' },
      }, {
        image: shoulderWristLateral,
        definition: { 'Shoulder to Wrist Lateral Offset': 'The lateral offset between the shoulder and wrist markers. A negative number indicates the wrist is inside the shoulder (TT bike). A positive number indicates the wrist is outside the shoulder (MTB).' },
      }, {
        image: footFromLevel,
        definition: { 'Foot from Level Mean': 'The angle of the foot relative to the horizon defined by the heel and forefoot marker' },
      }, {
        image: kneeLateralTravel,
        definition: { 'Knee Travel Tilt': 'The frontal plane angle of the tracing created by the moving knee marker with respect to vertical. A positive number indicates a knee that tracks away from the bike in the upstroke. A negative number represents a knee that tracks towards the bike in the upstroke. See the front view of the knee path for visual representation of this measurement.' },
      }, {
        image: kneeLateralTravel,
        definition: { 'Knee Lateral Travel': 'The magnitude of the lateral movement of the knee' },
      }, {
        image: hipVerticalTravel,
        definition: { 'Hip Vertical Travel': 'The magnitude of the vertical movement of the hip' },
      }, {
        image: hipLateralTravel,
        definition: { 'Hip Lateral Travel': 'The magnitude of the lateral movement of the hip' },
      }, {
        image: markerPath,
        definition: {
          'Front View of Knee Path': 'Knee tracking measurement; green is downstroke; red is upstroke. The blue cone represents +/- 3 degrees on the knee travel tilt angle.',
        },
      }],
    };
  },
};
</script>
<style scoped>
  .skeleton-img-container {
    overflow: hidden;
    position: relative;
    width: 300px;
    height: 520px;
  }
  .def-img-container {
    overflow: hidden;
    position: relative;
    width: 220px;
    height: 150px;
    background-color: #fff !important;
  }
  .def-title {
    font-size: 14px;
    font-weight: bold;
  }
  .def-content {
    word-break: break-word;
  }
</style>
<style>
  .skeleton-row {
    height: 400px;
  }
  .def-row {
    height: 200px;
  }
</style>
