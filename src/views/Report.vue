<template>
  <div>
    <bike-header></bike-header>
    <el-container v-if="!isPreview" class="report-container">
      <el-aside :style="asideStyle">
        <el-menu
          :default-active="activeUserId"
          @select="onSelectUser"
        >
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
                <span style="margin-left: 10px">
                  {{ moment(scope.row.create_time * 1000).format('YYYY-MM-DD hh:mm a')}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="Action"
              width="400"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="onSendReport(scope.row.id)"
                  plain>
                  Send<i class="icon-el-icon-ali-email el-icon--right"/>
                </el-button>
                <el-button
                  type="success"
                  size="mini"
                  @click="onPreview(scope.row.id)"
                  plain>
                  Preview<i class="icon-el-icon-ali-preview el-icon--right"/>
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="onDelReport(scope.row.id)"
                  plain>
                  Delete<i class="el-icon-delete el-icon--right"/>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <div v-else class="report-container">
      <el-page-header @back="onBack" content="Preview Report">
      </el-page-header>
      <iframe
        :src="reportUri" width="100%" :height="pdfHeight">
        This browser does not support PDFs.
      </iframe>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { getAllUser } from '../api/user';
import { getReportByUserId, deleteReport, sendReport } from '../api/report';
import BikeHeader from '../components/BikeHeader.vue';

export default {
  name: 'report',
  components: { BikeHeader },
  data() {
    return {
      moment,
      isPreview: false,
      reportUri: '',
      tableHeight: 0,
      sideHeight: 0,
      pdfHeight: 0,
      activeUserId: '',
      users: [],
      reportData: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.calHeight();
      getAllUser()
        .then((res) => {
          this.users = res;
          if (res.length > 0) {
            this.activeUserId = String(res[0].id);
            this.getReportData();
          }
        });
    });
    window.onresize = this.calHeight;
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
    getReportData() {
      getReportByUserId(this.activeUserId).then((reports) => {
        this.reportData = reports;
      });
    },
    calHeight() {
      const windowHeight = window.innerHeight;
      const HEADER = 24;
      const PADDING_TOP = 80;
      const PADDING_BOTTOM = 50;
      const PADDING_MAIN = 40;
      this.sideHeight = windowHeight - PADDING_TOP - PADDING_BOTTOM;
      this.tableHeight = windowHeight - PADDING_TOP - PADDING_BOTTOM - PADDING_MAIN;
      this.pdfHeight = windowHeight - PADDING_TOP - PADDING_BOTTOM - HEADER;
    },
    onSelectUser(userId) {
      this.activeUserId = userId;
      this.getReportData();
    },
    onDelReport(reportId) {
      this.$confirm('This will permanently delete the report. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        deleteReport(reportId).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed',
          });
          this.getReportData();
        });
      }).catch(() => {
        console.log('delete canceled');
      });
    },
    onPreview(reportId) {
      this.isPreview = true;
      this.reportUri = `http://10.111.137.125:5000/api/report/${reportId}`;
    },
    onBack() {
      this.isPreview = false;
    },
    onSendReport(reportId) {
      const loading = this.$loading({
        lock: true,
        text: 'Sending',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      sendReport(reportId).then(() => {
        loading.close();
        this.$message({
          type: 'success',
          message: 'Send report to email successful.',
        });
      }).catch(() => {
        loading.close();
      });
    },
  },
};
</script>
<style>
  .report-container {
    padding-top: 80px;
  }
</style>
