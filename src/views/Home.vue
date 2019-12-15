<template>
  <div class="home">
    <vue-fabric class="canvas" ref="canvas" :width="950" :height="950"></vue-fabric>
  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';

const socket = io('http://10.10.1.149:5000');

const UNVISIBLE_POINT = [15, 16, 17, 18];

const LINE_INDEX = [
  [0, 1],
  [1, 2],
  [1, 5],
  [1, 8],
  [2, 3],
  [3, 4],
  [5, 6],
  [6, 7],
  [8, 9],
  [8, 12],
  [9, 10],
  [12, 13],
  [10, 11],
  [13, 14],
  [11, 24],
  [14, 21],
  [11, 22],
  [14, 19],
  [22, 23],
  [19, 20],
];

export default {
  name: 'home',
  components: {
  },
  mounted() {
    socket.on('connect', () => {
      console.log('socket connected');
    });

    socket.on('test', (data) => {
      this.$refs.canvas.clear();
      this.drawLines(data);
      data.forEach((point, index) => {
        if (point[2] > 0 && UNVISIBLE_POINT.indexOf(index) === -1) {
          const radius = index === 0 ? 30 : 6;
          this.drawPoint(point[0], point[1], radius);
        }
      });
    });
    this.$nextTick(() => {
      socket.emit('start_process', 'start');
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
  },
};
</script>
<style>
  .canvas {
    border: 1px solid #000;
    width: 950px;
    height: 950px;
  }
</style>
