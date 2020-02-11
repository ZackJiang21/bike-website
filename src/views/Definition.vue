<template>
  <div>
    <div class="header">
      <img class="header-logo" src="@/assets/g42-logo.svg"/>
      <img class="header-logo" src="@/assets/Logo-01.svg"/>
    </div>
    <div class="def-body">
      <definition-page :max-height="maxHeight"></definition-page>
    </div>
  </div>
</template>
<script>
import DefinitionPage from '../components/DefinitionPage.vue';

export default {
  name: 'definition',
  components: {
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
  .def-body {
    padding-top: 80px;
    padding-bottom: 50px;
  }
</style>
