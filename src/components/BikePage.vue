<template>
  <div>
    <div v-if="!isCreateBike">
      <div class="bike-btn-grp">
        <div class="bike-btn">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="onCreateBikeBtn"
            plain>
            Create New Bike
          </el-button>
        </div>
      </div>
      <div>
        <el-table
          :data="bikeData"
          :max-height="getTableHeight"
          :height="getTableHeight">
          <el-table-column width="35" fixed>
            <template slot-scope="scope">
              <el-radio
                v-model="selectedId"
                @change="onSelectBike"
                :label="scope.row.id">
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="Model"
            prop="model"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="Size"
            prop="size">
          </el-table-column>
          <el-table-column
            label="Year"
            prop="year">
          </el-table-column>
          <el-table-column
            label="Type"
            prop="type">
          </el-table-column>
          <el-table-column label="Operation" width="110" fixed="right">
            <template>
              <el-button
                type="danger"
                size="mini"
                plain>
                Delete<i class="el-icon-delete el-icon--right"/>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else class="create-form">
      <el-form
        :model="createBike"
        label-position="left"
        label-width="100px">
        <el-form-item label="Model">
          <el-input v-model="createBike.model"></el-input>
        </el-form-item>
        <el-form-item label="Size">
          <el-input v-model="createBike.size"></el-input>
        </el-form-item>
        <el-form-item label="Year">
          <el-input v-model="createBike.year"></el-input>
        </el-form-item>
        <el-form-item label="Type">
          <el-input v-model="createBike.type"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <div class="form-btn">
            <el-button @click="onCancelCreate" plain>Cancel</el-button>
            <el-button type="primary" plain>Create</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BikePage',
  props: {
    maxHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      createBike: {
        model: '',
        year: '',
        size: '',
        type: '',
      },
      isCreateBike: false,
      bikeData: [{
        id: 1, model: 'Boardman,9.9Air', size: 'M 54', year: '2017', type: 'Triathlon',
      }],
      selectedId: '',
    };
  },
  computed: {
    getTableHeight() {
      const headerHeight = 24;
      const stepHeight = 46;
      const btnGrpHeight = 60;
      const bottomHeight = 60;
      return this.maxHeight - stepHeight - headerHeight - btnGrpHeight - bottomHeight;
    },
  },
  methods: {
    onCreateBikeBtn() {
      this.isCreateBike = true;
      this.$emit('create-event', true);
    },
    onCancelCreate() {
      this.isCreateBike = false;
      this.$emit('create-event', false);
    },
    onSelectBike(bikeId) {
      this.$emit('select-bike-event', bikeId);
    },
  },
};
</script>
<style scoped>
  .bike-btn-grp {
    height: 60px;
    width: 100%;
  }
  .bike-btn {
    display: inline-block;
    line-height: 60px;
    float: left;
    vertical-align: middle;
  }
  .create-form {
    margin: 20px;
  }
  .form-btn {
    float: right;
  }
</style>
