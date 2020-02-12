<template>
  <div>
    <bike-header></bike-header>
    <div class="def-body">
      <definition-page :max-height="maxHeight"></definition-page>
    </div>
  </div>
</template>
<script>
import DefinitionPage from '../components/DefinitionPage.vue';
import BikeHeader from '../components/BikeHeader.vue';

export default {
  name: 'definition',
  components: {
    BikeHeader,
    DefinitionPage,
  },
  data() {
    return {
      maxHeight: 0,
    };
  },
  methods: {
    calHeight() {
      const WINDOW_HEIGHT = window.innerHeight;
      const PADDING_TOP = 80;
      const PADDING_BOTTOM = 50;
      this.maxHeight = WINDOW_HEIGHT - PADDING_BOTTOM - PADDING_TOP;
    },
  },
  mounted() {
    this.$nextTick(this.calHeight);
    window.onresize = this.calHeight;
  },
};
</script>
<style scoped>
  .def-body {
    padding-top: 80px;
    padding-bottom: 50px;
  }
</style>
