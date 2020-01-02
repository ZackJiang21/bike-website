<template>
  <div>
    <el-table
    :data="definitions"
    size="mini"
    :max-height="maxHeight"
    style="width: 100%; height: 100%"
    :row-style="{height: '200px'}"
    >
      <el-table-column label="Key" width="250">
        <template slot-scope="scope">
          <div class="def-img-container">
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
export default {
  name: 'DefinitionPage',
  props: {
    maxHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      definitions: [{
        image: '../../static/img/ankle_angle.png',
        definition: {
          'Ankle Minimum': 'Maximum dorsiflexion at any point in the pedal stroke defined by the knee-ankle line and the heel-foot-line.',
          'Ankle Maximun': 'Maximum plantarflexion at any point in the pedal stroke defined by the knee-ankle line and the heel-foot-line.',
        },
      }, {
        image: '../../static/img/ankle_angle.png',
        definition: { 'Ankle Range': 'The difference between ankle maximum and ankle minimum.' },
      }, {
        image: '../../static/img/ankle_angle_top.png',
        definition: { 'Ankle Angle at Top': 'The ankle angle at the top of the pedal stroke (0 degrees).' },
      }, {
        image: '../../static/img/ankle_angle_front.png',
        definition: { 'Ankle Angle at Front': 'The ankle angle at the front of the pedal stroke (90 degrees).' },
      }, {
        image: '../../static/img/ankle_angle_bottom.png',
        definition: { 'Ankle Angle at Bottom': 'The ankle angle at the bottom of the pedal stroke (180 degrees).' },
      }, {
        image: '../../static/img/ankle_angle_rear.png',
        definition: { 'Ankle Angle at Rear': 'The ankle angle at the rear of the pedal stroke (270 degrees).' },
      }, {
        image: '../../static/img/knee_angle.png',
        definition: {
          'Maximum Knee Flexion': 'Maximum flexion of the knee joint at any point in the pedal stroke defined by the hip-knee line and the knee-ankle line',
          'Maximum Knee Extension': 'Maximum extension of the knee joint at any point in the pedal stroke defined by the hip-knee line and the knee-ankle line',
        },
      }, {
        image: '../../static/img/knee_angle.png',
        definition: { 'Knee Angle Range': 'The difference between knee angle flexion and knee angle extension.' },
      }, {
        image: '../../static/img/hip_angle.png',
        definition: {
          'Hip Angle Closed': 'The most closed angle of the hip joint defined by the knee, hip and shoulder marker.',
          'Hip Angle Open': 'The most open angle of the hip joint defined by the knee, hip and shoulder marker.',
          'Hip Angle Range': 'The difference between hip angle open and closed.',
        },
      }, {
        image: '../../static/img/back_from_level.png',
        definition: { 'Back Angle': 'The angle of the back relative to the horizon defined by the hip and shoulder marker' },
      }, {
        image: '../../static/img/hip_shoulder_elbow.png',
        definition: {
          'Shoulder Angle to Wrist': 'The angle of the shoulder joint defined by the hip, shoulder, and wrist markers.',
          'Shoulder Angle to Elbow': 'The angle of the shoulder joint defined by the hip, shoulder, and elbow markers.',
        },
      }, {
        image: '../../static/img/elbow_angle.png',
        definition: { 'Elbow Angle': 'The angle of the elbow joint defined by the shoulder, elbow, and wrist marker' },
      }, {
        image: '../../static/img/forearm_from_level.png',
        definition: { 'Forearm Angle': 'The angle of the forearm relative to the horizon defined by the elbow and wrist markers. A positive number indicates the wrist is higher than the elbow' },
      }, {
        image: '../../static/img/knee_forward_of_foot.png',
        definition: { 'Knee Forward of Foot': 'The fore/aft offset of the knee marker relative to the foot marker captured at the forward part of the pedal stroke (3 o\'clock or 90 degrees down). A negative number indicates a knee that is aft of neutral.' },
      }, {
        image: '../../static/img/knee_forward_of_foot.png',
        definition: { 'Knee Forward of Spindle': 'The fore/aft offset of the knee marker relative to the pedal spindle at 3 o\'clock in the pedal stroke (90 degrees in the downstroke).' },
      }, {
        image: '../../static/img/knee_to_feet_lateral.png',
        definition: { 'Knee Varus/Valgus (prior KFLO)': 'The lateral offset between the knee and foot markers. A negative number indicates the knee is in valgus. A positive number indicates the knee is in varus.' },
      }, {
        image: '../../static/img/hip_to_foot_lateral.png',
        definition: { 'Hip to Foot Lateral Offset': 'The lateral offset between the hip and foot marker. A negative number indicates the hip is outside the foot. A positive number indicates that the hip is inside the foot.' },
      }, {
        image: '../../static/img/shoulder_to_wrist_lateral.png',
        definition: { 'Shoulder to Wrist Lateral Offset': 'The lateral offset between the shoulder and wrist markers. A negative number indicates the wrist is inside the shoulder (TT bike). A positive number indicates the wrist is outside the shoulder (MTB).' },
      }, {
        image: '../../static/img/foot_from_level.png',
        definition: { 'Foot from Level Mean': 'The angle of the foot relative to the horizon defined by the heel and forefoot marker' },
      }, {
        image: '../../static/img/foot_angle.png',
        definition: { 'Foot Rotation Minimum': 'The minimum rotational angle of the foot relative to the bike plane defined by the heel and forefoot marker. A negative number indicates that the foot is externally rotated (heel closer to the bike than the forefoot). A positive number indicates the foot is internally rotated (forefoot closer to the bike than the heel).' },
      }, {
        image: '../../static/img/foot_angle.png',
        definition: { 'Foot Rotation Maximum': 'The maximum rotational angle of the foot relative to the bike plane defined by the heel and forefoot marker. A negative number indicates that the foot is externally rotated (heel closer to the bike than the forefoot). A positive number indicates the foot is internally rotated (forefoot closer to the bike than the heel)' },
      }, {
        image: '../../static/img/foot_angle.png',
        definition: { 'Foot Rotation Mean': 'The average rotational angle of the foot relative to the bike plane defined by the heel and foot marker. A negative number indicates that the foot is externally rotated (heel closer to the bike than the forefoot). A positive number indicates that the foot is internally rotated (forefoot closer to the bike than the heel)' },
      }, {
        image: '../../static/img/knee_travel_tilt.png',
        definition: { 'Knee Travel Tilt': 'The frontal plane angle of the tracing created by the moving knee marker with respect to vertical. A positive number indicates a knee that tracks away from the bike in the upstroke. A negative number represents a knee that tracks towards the bike in the upstroke. See the front view of the knee path for visual representation of this measurement.' },
      }, {
        image: '../../static/img/knee_lateral_travel.png',
        definition: { 'Knee Lateral Travel': 'The magnitude of the lateral movement of the knee' },
      }, {
        image: '../../static/img/hip_vertical_travel.png',
        definition: { 'Hip Vertical Travel': 'The magnitude of the vertical movement of the hip' },
      }, {
        image: '../../static/img/hip_lateral_travel.png',
        definition: { 'Hip Lateral Travel': 'The magnitude of the lateral movement of the hip' },
      }, {
        image: '../../static/img/cadence.png',
        definition: {
          'Thigh Length': 'The length of the hip/knee segment',
          'Shin Length': 'The length of the knee/ankle segment',
        },
      }, {
        image: '../../static/img/hip_to_elbow.png',
        definition: {
          'Hip to Elbow Vertical': 'The vertical offset of the elbow relative to the hip marker.',
          'Hip to Elbow Horizontal': 'The horizontal offset of the elbow relative to the hip marker',
        },
      }],
    };
  },
};
</script>
<style scoped>
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
