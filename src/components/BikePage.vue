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
          @row-click="onSelectRow"
          :max-height="getTableHeight"
          :height="getTableHeight">
          <el-table-column width="35">
            <template slot-scope="scope">
              <el-radio
                v-model="selectedId"
                @change="onSelectBike(scope.row)"
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
          <el-table-column label="Operation" width="110">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="onDelBike(scope.row.id)"
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
        :rules="bikeRule"
        ref="createBikeForm"
        label-position="left"
        label-width="100px">
        <el-form-item
          label="Model"
          prop="model"
          required>
          <el-input
            v-model="createBike.model"
            maxlength="32"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="Size" prop="size" required>
          <el-input
            v-model="createBike.size"
            maxlenght="16"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="Year" prop="year" required>
          <el-date-picker
            v-model="createBike.year"
            type="year"
            value-format="yyyy"
            placeholder="Pick a year"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="Type"
          prop="type"
          required>
          <el-input
            v-model="createBike.type"
            maxlength="16"
          >
          </el-input>
        </el-form-item>
        <el-form-item size="large">
          <div class="form-btn">
            <el-button @click="onCancelCreate" plain>Cancel</el-button>
            <el-button
              type="primary"
              @click="onSubmit"
              plain
            >
              Create
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getBikesByUserId, addBike, deleteBikeById } from '../api/bike';

const DEFAULT_FORM = {
  model: '',
  year: '',
  size: '',
  type: '',
};

export default {
  name: 'BikePage',
  props: {
    maxHeight: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      createBike: Object.assign({}, DEFAULT_FORM),
      isCreateBike: false,
      bikeData: [],
      selectedId: '',
      bikeRule: {
        model: [{ required: true, message: 'Model is a mandatory field', trigger: 'blur' }],
        size: [{ required: true, message: 'Size is a mandatory field', trigger: 'blur' }],
        year: [{ required: true, message: 'Year is a mandatory field', trigger: 'blur' }],
        type: [{ required: true, message: 'Type is a mandatory field', trigger: 'blur' }],
      },
    };
  },
  computed: {
    getTableHeight() {
      const headerHeight = 45;
      const stepHeight = 46;
      const btnGrpHeight = 60;
      const bottomHeight = 60;
      return this.maxHeight - stepHeight - headerHeight - btnGrpHeight - bottomHeight;
    },
  },
  watch: {
    userId(userId) {
      getBikesByUserId(userId).then((res) => {
        this.bikeData = res;
        // after change userId, selected bike id needs to be initialized
        this.selectedId = '';
      });
    },
  },
  methods: {
    backToTable() {
      this.isCreateBike = false;
      this.$emit('create-event', false);
    },
    getBikeData() {
      getBikesByUserId(this.userId).then((data) => {
        this.bikeData = data;
      });
    },
    onCreateBikeBtn() {
      this.isCreateBike = true;
      this.$emit('create-event', true);
    },
    onCancelCreate() {
      this.backToTable();
    },
    onSelectBike(bike) {
      this.$emit('select-bike-event', bike);
    },
    onSelectRow(row) {
      this.selectedId = row.id;
      this.$emit('select-bike-event', row);
    },
    onSubmit() {
      this.$refs.createBikeForm.validate((valid) => {
        if (valid) {
          addBike(this.createBike, this.userId).then(() => {
            this.backToTable();
            this.getBikeData();
            this.createBike = Object.assign({}, DEFAULT_FORM);
          });
        }
      });
    },
    onDelBike(bikeId) {
      this.$confirm('This will permanently delete the bike. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        deleteBikeById(bikeId).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed',
          });
          this.getBikeData();
        });
      }).catch(() => {
        console.log('delete canceled');
      });
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
