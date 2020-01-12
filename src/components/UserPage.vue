<template>
  <div>
    <div v-if="!isAddUser">
      <div class="user-btn-group">
        <div class="user-btn">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="onCreateUserBtn"
            plain>
            Create New User
          </el-button>
        </div>
        <div class="search-input">
          <el-input
            maxlength="64"
            placeholder="Please input user name."
            suffix-icon="el-icon-search">
          </el-input>
        </div>
      </div>
      <div>
        <el-table
          :data="userData"
          :max-height="getTableHeight"
          :height="getTableHeight">
          <el-table-column width="35" fixed>
            <template slot-scope="scope">
              <el-radio v-model="selectedId" :label="scope.row.id" @change="onSelectUser">
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="Name"
            prop="name" fixed>
          </el-table-column>
          <el-table-column
            label="Age"
            prop="age"
            width="70">
          </el-table-column>
          <el-table-column
            label="Gender"
            prop="gender"
            width="70">
          </el-table-column>
          <el-table-column
            label="Phone"
            prop="phone"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="Email"
            prop="email"
            show-overflow-tooltip>
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
        :model="createUser"
        label-position="left"
        label-width="100px">
        <el-form-item label="Name">
          <el-input v-model="createUser.name"></el-input>
        </el-form-item>
        <el-form-item label="Age">
          <el-input v-model="createUser.age"></el-input>
        </el-form-item>
        <el-form-item label="Gender">
          <el-select
            v-model="createUser.gender"
            placeholder="Please select your gender"
            style="width: 100%;">
            <el-option label="Male" value="shanghai"></el-option>
            <el-option label="Female" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="createUser.phone"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="createUser.email"></el-input>
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
  name: 'UserPage',
  props: {
    maxHeight: {
      type: Number,
      required: true,
    },
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
  data() {
    return {
      isAddUser: false,
      createUser: {
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
      },
      userData: [
        {
          id: 1, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        }, {
          id: 12, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        }, {
          id: 13, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        }, {
          id: 11, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        }, {
          id: 123, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        }, {
          id: 1341, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        }, {
          id: 21, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        }, {
          id: 15, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        }, {
          id: 16, name: 'Carl', age: 43, gender: 'Male', phone: '0555137854', email: 'carlagren33@gmail.com',
        },
      ],
      selectedId: '',
    };
  },
  methods: {
    onCreateUserBtn() {
      this.isAddUser = true;
      this.$emit('create-event', true);
    },
    onCancelCreate() {
      this.isAddUser = false;
      this.$emit('create-event', false);
    },
    onSelectUser(userId) {
      this.$emit('select-user-event', userId);
    },
  },
};
</script>
<style scoped>
  .user-btn-group {
    height: 60px;
    width: 100%;
  }
  .user-btn {
    display: inline-block;
    line-height: 60px;
    float: left;
    vertical-align: middle;
  }
  .search-input {
    display: inline-block;
    line-height: 60px;
    width: 220px;
    float: right;
    vertical-align: middle;
  }
  .create-form {
    margin: 20px;
  }
  .form-btn {
    float: right;
  }
</style>
