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
            v-model="searchUserStr"
            maxlength="64"
            placeholder="Please input user name."
            suffix-icon="el-icon-search"
            @input="onSearchUser"
            clearable
          >
          </el-input>
        </div>
      </div>
      <div>
        <el-table
          :data="displayUserData"
          :max-height="getTableHeight"
          :height="getTableHeight">
          <el-table-column width="35" fixed>
            <template slot-scope="scope">
              <el-radio
                v-model="selectedId"
                :label="scope.row.id"
                @change="onSelectUser(scope.row)"
              >
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="Name"
            width="120"
            prop="name" fixed>
          </el-table-column>
          <el-table-column
            label="Age"
            prop="age"
            width="70">
          </el-table-column>
          <el-table-column
            label="Gender"
            prop="genderStr"
            width="80">
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
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="onDelUser(scope.row.id)"
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
        :rules="userRule"
        ref="createUserForm"
        label-position="left"
        label-width="100px">
        <el-form-item label="Name" prop="name" required>
          <el-input
            v-model="createUser.name"
            maxlength="64"
          ></el-input>
        </el-form-item>
        <el-form-item label="Age" prop="age" required>
          <el-input
            v-model="createUser.age"
            maxlength="4"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="Gender" prop="gender" required>
          <el-select
            v-model="createUser.gender"
            placeholder="Please select your gender"
            style="width: 100%;">
            <el-option label="Male" value="1"></el-option>
            <el-option label="Female" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Phone" prop="phone" required>
          <el-input
            v-model="createUser.phone"
            maxlength="32"
            type="number">
            <template slot="prepend">+971</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="Email"
          prop="email" required>
          <el-input
            maxlength="128"
            v-model="createUser.email"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <div class="form-btn">
            <el-button @click="onCancelCreate" plain>Cancel</el-button>
            <el-button
              type="primary"
              @click="onSubmit"
              plain>Create</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getAllUser, delUser, addUser } from '../api/user';
import { validatePhoneNumber, validateEmail } from '../utils/validate';

const DEFAULT_FORM = {
  name: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
};

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
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Name is a mandatory field.'));
      } else {
        callback();
      }
    };
    const validateAge = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Age is a mandatory field,'));
      } else if (value < 7 || value > 99) {
        callback(new Error('Age should be between 7 and 99.'));
      } else {
        callback();
      }
    };
    const validateGender = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Gender is a mandatory field'));
      } else {
        callback();
      }
    };
    const validatePhoneForm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Phone number is a mandatory field'));
      } else if (!validatePhoneNumber(value)) {
        callback(new Error('Please input correct phone number.'));
      } else {
        callback();
      }
    };
    const validateEmailForm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Email is a mandatory field.'));
      } else if (!validateEmail(value)) {
        callback(new Error('Please input correct Email address'));
      } else {
        callback();
      }
    };
    return {
      isAddUser: false,
      userRule: {
        name: [{ validator: validateName }],
        age: [{ validator: validateAge }],
        gender: [{ validator: validateGender }],
        phone: [{ validator: validatePhoneForm }],
        email: [{ validator: validateEmailForm }],
      },
      createUser: Object.assign({}, DEFAULT_FORM),
      userData: [],
      displayUserData: [],
      selectedId: '',
      searchUserStr: '',
    };
  },
  methods: {
    getUserData() {
      getAllUser().then((data) => {
        const userDataTemp = [];
        data.forEach((user) => {
          const userObj = Object.assign({}, user);
          userObj.genderStr = user.gender === 1 ? 'Male' : 'Female';
          userDataTemp.push(userObj);
        });
        this.userData = userDataTemp;
        this.displayUserData = userDataTemp;
      });
    },
    backToTable() {
      this.isAddUser = false;
      this.$emit('create-event', false);
    },
    onCreateUserBtn() {
      this.isAddUser = true;
      this.$emit('create-event', true);
    },
    onCancelCreate() {
      this.backToTable();
    },
    onSelectUser(user) {
      this.$emit('select-user-event', user);
    },
    onDelUser(userId) {
      this.$confirm('This will permanently delete the user. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        delUser(userId).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed',
          });
          this.getUserData();
        });
      }).catch(() => {
        console.log('delete canceled');
      });
    },
    onSubmit() {
      this.$refs.createUserForm.validate((valid) => {
        if (valid) {
          addUser(this.createUser).then(() => {
            this.backToTable();
            this.getUserData();
            this.createUser = Object.assign({}, DEFAULT_FORM);
          });
        }
      });
    },
    onSearchUser() {
      if (this.searchUserStr === '') {
        this.displayUserData = [...this.userData];
      } else {
        const searchedUserData = [];
        this.userData.forEach((user) => {
          // eslint-disable-next-line max-len
          if (user.name.toLocaleLowerCase().indexOf(this.searchUserStr.toLocaleLowerCase()) !== -1) {
            searchedUserData.push(user);
          }
        });
        this.displayUserData = searchedUserData;
      }
    },
  },
  mounted() {
    this.getUserData();
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
