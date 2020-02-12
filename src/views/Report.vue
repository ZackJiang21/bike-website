<template>
  <div>
    <bike-header></bike-header>
    <el-container class="report-container">
      <el-aside :style="asideStyle">
        <el-menu :default-active="activeIndex">
          <el-menu-item-group>
            <template slot="title">
              <span class="el-icon-user-solid">Users</span>
            </template>
            <el-menu-item v-for="user in users" :key="user.id"
                          :index="String(user.id)">{{user.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-table
            :height="tableHeight"
            :max-height="tableHeight"
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
  </div>
</template>
<script>
import { getAllUser } from '../api/user';
import BikeHeader from '../components/BikeHeader.vue';

export default {
  name: 'report',
  components: { BikeHeader },
  data() {
    return {
      tableHeight: 0,
      sideHeight: 0,
      activeIndex: 0,
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
      this.calHeight();
      getAllUser()
        .then((res) => {
          this.users = res;
          if (res.length > 0) {
            this.activeIndex = String(res[0].id);
          }
        });
    });
  },
  computed: {
    asideStyle() {
      return {
        height: `${this.sideHeight}px`,
        'background-color': '#D3DCE6',
      };
    },
  },
  methods: {
    calHeight() {
      const windowHeight = window.innerHeight;
      const PADDING_TOP = 80;
      const PADDING_BOTTOM = 50;
      const PADDING_MAIN = 40;
      this.sideHeight = windowHeight - PADDING_TOP - PADDING_BOTTOM;
      this.tableHeight = windowHeight - PADDING_TOP - PADDING_BOTTOM - PADDING_MAIN;
    },
  },
};
</script>
<style>
  .report-container {
    padding-top: 80px;
  }
</style>
