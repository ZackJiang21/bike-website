<template>
  <div>
    <el-table
    :data="definitions"
    size="mini"
    style="width: 100%; height: 100%"
    >
      <el-table-column label="Key">
        <template slot-scope="scope">
          <img :src="scope.row.key1">
        </template>
      </el-table-column>
      <el-table-column label="Definition">
<!--        <template slot-scope="scope">-->
<!--        </template>-->
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'DefinitionPage',
  data() {
    return {
      definitions: [{
        key1: '@/assets/img/ankle_angle.png',
        value1: [{
          'Ankle Minimum': 'Maximum dorsiflexion at any point in the pedal stroke defined by the knee-ankle line and the heel-foot-line.',
          'Ankle Maximun': 'Maximum plantarflexion at any point in the pedal stroke defined by the knee-ankle line and the heel-foot-line.',
        }],
        key2: '@/assets/img/ankle_angle.png',
        value2: [{
          'Ankle Range': 'The difference between ankle maximum and ankle minimum.',
        }],
      }],
    };
  },
};
</script>
<style scoped>
</style>
