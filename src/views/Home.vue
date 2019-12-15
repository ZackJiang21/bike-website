<template>
  <div class="page">
    <el-row type="flex" class="btn-group">
      <el-button v-if="!isProcessing" type="primary" @click="handleStartProcess">Start</el-button>
      <el-button v-else type="danger" :disabled="!isProcessing" @click="handleStop">Stop</el-button>
    </el-row>
    <div class="container">
      <div class="panel-right">
        <el-card>
          <vue-fabric
            class="canvas"
            ref="canvas"
            :width="950 * this.ratio"
            :height="950 * this.ratio"/>
        </el-card>
      </div>
      <el-card class="panel-left">
      </el-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';

const socket = io('http://10.10.1.149:5000');

const VISIBLE_POINT = [0, 2, 3, 4, 9, 10, 11, 22, 23, 24];

const LINE_INDEX = [
  [0, 2],
  [2, 9],
  [2, 3],
  [3, 4],
  [9, 10],
  [10, 11],
  [11, 24],
  [11, 22],
  [22, 23],
];

export default {
  name: 'home',
  components: {
  },
  data() {
    return {
      ratio: 0.5,
      isProcessing: false,
    };
  },
  mounted() {
    socket.on('connect', () => {
      console.log('socket connected');
    });

    socket.on('test', (data) => {
      if (!this.isProcessing) {
        return;
      }
      this.$refs.canvas.clear();
      const points = data.map(input => [input[0] * this.ratio, input[1] * this.ratio, input[2]]);
      this.drawLines(points);
      points.forEach((point, index) => {
        if (point[2] > 0 && VISIBLE_POINT.indexOf(index) !== -1) {
          const radius = index === 0 ? 20 : 6;
          this.drawPoint(point[0], point[1], radius);
        }
      });
    });
  },
  methods: {
    drawPoint(x, y, r) {
      this.$refs.canvas.createCircle({
        left: x - r,
        top: y - r,
        fillColor: '#748aad',
        radius: r,
        selectable: false,
      });
    },
    drawLines(points) {
      LINE_INDEX.forEach((lineIndex) => {
        if (points[lineIndex[0]][2] !== 0 && points[lineIndex[1]][2] !== 0) {
          this.$refs.canvas.drawDottedline({
            x: points[lineIndex[0]][0],
            y: points[lineIndex[0]][1],
            x1: points[lineIndex[1]][0],
            y1: points[lineIndex[1]][1],
            selectable: false,
            drawWidth: 5,
            empty: 0,
          });
        }
      });
    },
    handleStartProcess() {
      this.isProcessing = true;
      socket.emit('start_process', 'start');
    },
    handleStop() {
      this.isProcessing = false;
    },
  },
};
</script>
<style>
  .page {
    padding: 10px;
  }
  .btn-group {
    margin-bottom: 10px;
  }
  .container {
    display: flex;
    flex-direction: row-reverse;
  }
  .panel-right {
    margin-left: 10px;
  }
  .panel-left {
    flex: 1;
  }
</style>
