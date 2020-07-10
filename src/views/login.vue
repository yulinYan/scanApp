<template>
  <div :style="{ backgroundImage: 'url(' + require('../img/denglu-beijing.png') + ')' }" class="loginsty">
    <el-row class="fromsty">
      <el-col :span="12" :offset="12" class="cose">
        <div class="bakgen">
          <div class="header">
            <img src="../img/logo-noText.png" alt="">
            <div>智慧照明施工平台</div>
          </div>
          <div class="loginFrom">
            <el-form ref="machineForm" :model="machineForm" :rules="rules" label-width="0px">
              <el-form-item label="" prop="customerCode">
                <el-input v-model="machineForm.customerCode" size="mini" placeholder="请输入客户编码" maxlength="25" onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
              </el-form-item>
              <el-form-item label="" prop="account">
                <el-input v-model="machineForm.account" size="mini" placeholder="请输入用户名" maxlength="25" onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
              </el-form-item>
              <el-form-item label="" prop="pwd">
                <el-input v-model="machineForm.pwd" size="mini" placeholder="请输入密码" type="password" maxlength="25" />
              </el-form-item>
              <div class="logsubmit">
                <el-button type="primary" size="mini" @click="submitForm('machineForm')">登录</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      machineForm: {
        customerCode: localStorage.getItem('customerCode') ? localStorage.getItem('customerCode') : '',
        account: localStorage.getItem('account') ? localStorage.getItem('account') : '',
        pwd: ''
      },
      rules: {
        customerCode: [
          {
            required: true,
            message: '请输入客户编码',
            trigger: 'blur'
          }
        ],
        account: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    document.body.style.width = window.screen.width + 'px'
    document.body.style.height = window.screen.height + 'px'
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.$axios({
          method: 'post',
          url: this.API.baseUrl + this.API.loginUrl,
          params: {
            loginName: this.machineForm.account,
            tenantCode: this.machineForm.customerCode,
            password: this.$md5(this.machineForm.pwd)
          }
        })
          .then(res => {
            if (res.data.code === 0) {
              localStorage.setItem('account', this.machineForm.account)
              localStorage.setItem('customerCode', this.machineForm.customerCode)
              sessionStorage.setItem('user', JSON.stringify(res.data.data.loginUser))
              sessionStorage.setItem('token', res.data.data.token)
              this.$router.push('/companyList')
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
          .catch(error => {
            console.log(error) //请求失败返回的数据
          })
        // this.$router.push('/companyList')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.loginsty {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  text-align: center;
  background-image: url(/static/img/denglu-beijing.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .bakgen {
    background: #fff;
    padding: 10px 0px;
    width: 80%;
    border-radius: 5px;
  }
  .fromsty {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .cose {
      display: flex;
      justify-content: center;
    }
  }
  .header {
    font-size: 14px;
    margin-bottom: 15px;
    & img {
      height: 20px;
      margin-bottom: 5px;
    }
  }
  .loginFrom {
    text-align: center;
    display: flex;
    justify-content: center;
    font-size: 12px;
    height: 160px;
    /deep/ .el-form {
      width: 80%;
    }
    /deep/ .el-form-item__content {
      line-height: 18px;
    }
    /deep/ .el-input__inner {
      height: 20px;
      line-height: 20px;
    }
    /deep/ .el-input--mini {
      font-size: 10px;
    }
    /deep/ .el-form-item__error {
      font-size: 10px;
    }
    /deep/ input {
      border: 0px;
      border-bottom: 1px solid #c0c4cc;
      background-color: rgba(255, 255, 255, 0);
      &::-ms-input-placeholder {
        color: #666;
      }
      &::-webkit-input-placeholder {
        color: #666;
      }
    }
    & button {
      height: 20px;
      line-height: 20px;
      padding: 0px 15px;
      & span {
        font-size: 12px;
      }
    }
    .logsubmit {
      text-align: center;
      & button {
        width: 80%;
      }
    }
  }
}
</style>