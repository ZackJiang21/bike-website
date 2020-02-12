<template>
  <el-container>
    <el-aside :style="asideStyle">
      <el-menu>
        <el-menu-item-group>
          <template slot="title">
            <span class="el-icon-user-solid">Users</span>
          </template>
          <span v-for="user in users" :key="user.id">
          <el-menu-item :index="String(user.id)">{{user.name}}</el-menu-item>
        </span>
        </el-menu-item-group>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <el-table
          :height="maxHeight"
          :max-height="maxHeight"
          :data="reportData"
          style="width: 100%; height: 100%"
        >
          <el-table-column
            label="Name"
            prop="name"
          ></el-table-column>
          <el-table-column
            label="Date"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Action"
            width="400"
          >
            <template>
              <el-button
                type="primary"
                size="mini"
                plain>
                Send<i class="icon-el-icon-ali-email el-icon--right"/>
              </el-button>
              <el-button
                type="success"
                size="mini"
                plain>
                Preview<i class="icon-el-icon-ali-preview el-icon--right"/>
              </el-button>
              <el-button
                type="danger"
                size="mini"
                plain>
                Delete<i class="el-icon-delete el-icon--right"/>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { getAllUser } from '../api/user';

export default {
  name: 'ReportPage',
  props: {
    tableHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      users: [],
      reportData: [{
        id: 1,
        name: 'Jiang_Zhang_2020-01-26',
        date: '2020-01-26',
      }, {
        id: 2,
        name: 'Jiang_Zhang_2020-01-26',
        date: '2020-01-26',
      }],
    };
  },
  mounted() {
    this.$nextTick(() => {
      getAllUser().then((res) => {
        this.users = res;
      });
    });
  },
  computed: {
    asideStyle() {
      return {
        height: `${this.tableHeight}px`,
        'background-color': '#D3DCE6',
      };
    },
    tableHeight() {
      const PADDING = 20;
      return this.tableHeight - 2 * PADDING;
    },
  },
};
</script>
<style>
  .el-main {
    background-color: #E9EEF3;
    padding: 0 !important
  }
</style>
