<template>
  <div>
    <el-page-header @back="onBack"></el-page-header>
    <el-steps :active="stepActive" process-status="process" finish-status="success" simple>
      <el-step title="Choose User" icon="el-icon-user-solid">
      </el-step>
      <el-step title="Choose Bike" icon="icon-el-icon-ali-bike"></el-step>
    </el-steps>
    <div v-show="stepActive===0">
      <user-page
        :max-height="maxHeight"
        @select-user-event="onSelectUser"
        @create-event="onCreateEvent">
      </user-page>
    </div>
    <div v-show="stepActive===1">
      <bike-page
        :max-height="maxHeight"
        :user-id="userId"
        @select-bike-event="onSelectBike"
        @create-event="onCreateEvent">
      </bike-page>
    </div>
    <div class="step-btn">
      <el-button
        v-if="isPreviousBtn"
        type="primary"
        @click="onPreviousStep"
        icon="el-icon-arrow-left"
        plain>
        Previous
      </el-button>
      <el-button
        v-if="isNextBtn"
        @click="onNextStep"
        type="primary"
        :disabled="isNextDisable"
        plain>
        Next<i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
      <el-button
        v-if="isFinBtn"
        type="success"
        @click="onFinish"
        :disabled="isFinDisable"
        plain>
        Finish<i class="el-icon-finished el-icon--right"/>
      </el-button>
    </div>
  </div>
</template>
<script>
import UserPage from './UserPage.vue';
import BikePage from './BikePage.vue';

const FINAL_STEP = 1;

const UNSELECT_USER_ID = -1;

export default {
  name: 'LogInPage',
  props: {
    maxHeight: {
      type: Number,
      required: true,
    },
  },
  components: {
    UserPage,
    BikePage,
  },
  comments: {
    UserPage,
  },
  data() {
    return {
      stepActive: 0,
      userId: UNSELECT_USER_ID,
      user: {},
      bikeId: '',
      bike: {},
      isShowBtn: true,
    };
  },
  computed: {
    isPreviousBtn() {
      return this.stepActive !== 0 && this.isShowBtn;
    },
    isNextBtn() {
      return this.stepActive !== FINAL_STEP && this.isShowBtn;
    },
    isFinBtn() {
      return this.stepActive === FINAL_STEP && this.isShowBtn;
    },
    isNextDisable() {
      return this.userId === UNSELECT_USER_ID;
    },
    isFinDisable() {
      return this.bikeId === '';
    },
  },
  methods: {
    onBack() {
      this.$emit('log-in-back');
    },
    onNextStep() {
      this.stepActive += 1;
    },
    onPreviousStep() {
      this.stepActive -= 1;
    },
    onCreateEvent(isCreate) {
      this.isShowBtn = !isCreate;
    },
    onSelectUser(user) {
      this.userId = user.id;
      this.user = user;
      // After modify the userId, bikeId should be clear
      this.bikeId = '';
    },
    onSelectBike(bike) {
      this.bikeId = bike.id;
      this.bike = bike;
    },
    onFinish() {
      const rider = {
        user: this.user,
        bike: this.bike,
      };
      this.$emit('selected-rider-event', rider);
    },
  },
};
</script>
<style scoped>
  .step-btn {
    display: inline-block;
    line-height: 60px;
    float: right;
    vertical-align: middle;
  }
</style>
