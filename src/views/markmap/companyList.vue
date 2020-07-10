<template>
  <div class="companyList">
    <div class="header">
      {{ companyname }} -- 施工地图
      <el-button size="mini" class="reflesh" type="text" icon="el-icon-refresh" @click="findAreaList()">刷 新</el-button>
      <el-button size="mini" class="logout" type="text" icon="el-icon-upload2" @click="logout()">退 出</el-button>
    </div>
    <div class="contant">
      <div class="tabs">
        <el-table ref="multipleTable" :data="tableData" size="mini" height="calc(100vh - 60px)" tooltip-effect="dark" show-overflow-tooltip>
          <el-table-column align="center" width="80" label="行号">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="sn" align="center" label="名称">
            <template slot-scope="scope">
              {{ scope.row.area }}
            </template>
          </el-table-column>
          <el-table-column prop="date" width="100" align="center" label="操作">
            <template slot-scope="scope">
              <el-button class="flt" size="mini" type="primary" @click="jumpInfo(scope.row)">切入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-drawer :title="drawName" class="dres" :visible.sync="drawer" direction="rtl" size="100%" @close="setLight()">
      <div class="deras">
        <div id="dv" style="position: relative;">
          <img id="facImage" :src="imgPath" width="100%" />
        </div>
      </div>
      <el-dialog title="灯设置" :visible.sync="dialogVisible" class="dlgsty" width="400px" append-to-body :show-close="false" @closed="closeDialog()">
        <el-row class="rowsty">
          <el-col :span="6" style="margin-bottom: 10px">
            <div class="spsty">
              别名
            </div>
          </el-col>
          <el-col :span="18" style="margin-bottom: 10px">
            <el-input size="mini" v-model="nickName" @input="nickName=nickName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
          </el-col>
          <el-col :span="6">
            <div class="spsty">
              扫码
            </div>
          </el-col>
          <el-col :span="18">
            <el-input size="mini" v-model="codeUrl" disabled />
          </el-col>
          <el-col :span="9" :offset="6" class="spablic">
            <el-button size="mini" type="primary" @click="openScans()">扫 描</el-button>
          </el-col>
          <el-col :span="9" class="spablic1">
            <el-button :disabled="disable" size="mini" type="primary" @click="bindLight()">绑 定</el-button>
          </el-col>
          <el-col v-if="currentId !== '' && this.positionObj[currentId] !== undefined && this.positionObj[currentId].qrValue !== ''" :span="9" :offset="6" class="spablic">
            <el-button size="mini" type="primary" @click="testLight()">测 试</el-button>
          </el-col>
          <el-col v-if="currentId !== '' && this.positionObj[currentId] !== undefined && this.positionObj[currentId].qrValue !== ''" :span="9" class="spablic1">
            <el-button :disabled="disable" size="mini" type="danger" @click="deleteLight()">删 除</el-button>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer spablicx">
          <el-button style="margin-right: -7px;" size="mini" @click="dialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </el-drawer>
    <div v-show="openScan" class="scan">
      <div id="bcid">
        <div style="height:40%"></div>
        <p class="tip">...载入中...</p>
      </div>
      <div class="botmbtn">
        <el-button type="danger" icon="el-icon-switch-button" circle size="mini" @click="closeScan" />
      </div>
    </div>
  </div>
</template>

<script>
let scan = null

export default {
  data() {
    return {
      codeUrl: '',
      openScan: false,
      drawer: false,
      dialogVisible: false,
      isCollapse: false,
      collapseLtr: false,
      openScan: false,
      disable: false,
      codes: '',
      companyname: '',
      drawName: '',
      nickName: '',
      imgPath: '',
      positionObj: {},
      currentId: '',
      updateId: '',
      areaInfo: null,
      tableData: []
    }
  },
  mounted() {
    this.companyname = ''
    if (sessionStorage.getItem('user')) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      this.companyname = user.name
    }
    this.findAreaList()
  },
  methods: {
    setLight() {
      for (const obj in this.positionObj) {
        var e = document.getElementById(obj)
        document.getElementById('dv').removeChild(e)
      }
      this.positionObj = {}
    },
    findAreaList() {
      this.$axios({
        method: 'get',
        url: this.API.baseUrl + this.API.getAreaUrl
      })
        .then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data
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
    },
    logout() {
      this.$confirm('确定退出吗?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios({
            method: 'get',
            url: this.API.baseUrl + this.API.loginOutUrl
          })
            .then(res => {
              if (res.data.code === 0) {
                sessionStorage.removeItem('user')
                sessionStorage.removeItem('token')
                this.$router.push('/')
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
        })
        .catch(() => {
          //取消
        })
    },
    jumpInfo(row) {
      this.areaInfo = row
      this.drawName = row.area
      this.imgPath = this.API.baseUrl + row.imagePath
      this.drawer = true
      this.positionObj = {}
      this.$nextTick(() => {
        this.imgRegClick()
      })
      setTimeout(() => {
        this.getLightList()
        // document.getElementById('dv').style.top = window.screen.height + 'px'
      }, 200)
    },
    testLight() {
      this.$axios({
        method: 'post',
        url: this.API.baseUrl + this.API.testLight,
        params: {
          sns: this.positionObj[this.currentId].qrValue.sn
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '指令已发送!'
            })
            this.dialogVisible = false
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
    },
    deleteLight() {
      this.$confirm('确定删除该灯吗?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.disable = true
          //退出系统
          this.$axios({
            method: 'get',
            url: this.API.baseUrl + this.API.deleteLight,
            params: {
              id: this.currentId.substring(11)
            }
          })
            .then(res => {
              this.disable = false
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.dialogVisible = false
                this.findAreaList()
                this.closeDialog()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
            .catch(error => {
              this.disable = false //请求失败返回的数据
            })
        })
        .catch(() => {
          //取消
        })
    },
    upDateLight(data) {
      this.$axios({
        method: 'post',
        url: this.API.baseUrl + this.API.updateLightUrl,
        data: data
      })
        .then(res => {
          this.disable = false
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '绑定成功!'
            })
            this.dialogVisible = false
            this.findAreaList()
            this.closeDialog()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(error => {
          this.disable = false //请求失败返回的数据
        })
    },
    saveLight(data) {
      this.$axios({
        method: 'post',
        url: this.API.baseUrl + this.API.saveLightUrl,
        data: data
      })
        .then(res => {
          this.disable = false
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '绑定成功!'
            })
            this.dialogVisible = false
            this.findAreaList()
            this.closeDialog()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(error => {
          this.disable = false //请求失败返回的数据
        })
    },
    bindLight() {
      if (this.codeUrl.length > 0) {
        this.disable = true
        if (this.updateId === '') {
          this.saveLight({
            areaId: this.areaInfo.id,
            sn: this.codeUrl,
            alias: this.nickName,
            xaxis: this.positionObj[this.currentId].left,
            yaxis: this.positionObj[this.currentId].top
          })
        } else {
          this.upDateLight({
            areaId: this.areaInfo.id,
            sn: this.codeUrl,
            alias: this.nickName,
            id: this.updateId,
            xaxis: this.positionObj[this.currentId].left,
            yaxis: this.positionObj[this.currentId].top
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '请先扫描设备SN'
        })
      }
    },
    imgRegClick() {
      this.codeUrl = ''
      let scope = this
      document.getElementById('facImage').onclick = function(e) {
        e = e || window.event
        var x = e.offsetX || e.layerX,
          y = e.offsetY || e.layerY
        scope.createMarker((x - 22) / e.currentTarget.clientWidth, (y - 22) / e.currentTarget.clientHeight)
      }
    },
    randomString(len) {
      //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var tempLen = chars.length,
        tempStr = ''
      for (var i = 0; i < len; ++i) {
        tempStr += chars.charAt(Math.floor(Math.random() * tempLen))
      }
      return tempStr
    },
    createMarker(x, y, divId, qr) {
      let scope = this
      let div = document.createElement('div')

      div.className = 'el-icon-sunrise marker normal-tip'
      div.style.position = 'absolute'
      div.style.left = parseFloat(x + '') * 100 + '%'
      div.style.top = parseFloat(y + '') * 100 + '%'
      let qrValue = qr === undefined ? '' : qr
      // div.setAttribute('qrValue', qrValue)
      let id = divId
      if (id === undefined) {
        let dt = new Date()
        id = 'dhlk_div_mk' + dt.getTime()
      }

      div.id = id
      this.positionObj[id] = {
        left: x,
        top: y,
        id: id,
        qrValue: qrValue
      }
      document.getElementById('dv').appendChild(div)
      // scope.showManageLight = true
      if (divId === undefined) {
        scope.$nextTick(() => {
          scope.setLightInfo(id)
        })
      }
      document.getElementById(id).onclick = function(e) {
        scope.$nextTick(() => {
          scope.setLightInfo(id)
        })
      }
    },
    setLightInfo(id) {
      this.codeUrl = '' // this.randomString(10)
      this.nickName = ''
      this.updateId = ''
      if (this.positionObj[id].qrValue !== '') {
        this.codeUrl = this.positionObj[id].qrValue.sn
        this.updateId = this.positionObj[id].qrValue.id
      }
      if (this.positionObj[id].qrValue.alias) {
        this.nickName = this.positionObj[id].qrValue.alias
      }
      var self = this
      this.currentId = id
      this.dialogVisible = true
    },
    closeDialog() {
      for (const obj in this.positionObj) {
        var e = document.getElementById(obj)
        document.getElementById('dv').removeChild(e)
      }
      this.positionObj = {}
      this.getLightList()
    },
    getLightList() {
      var self = this
      this.tableData.map(function(obj, index) {
        if (obj.id === self.areaInfo.id) {
          obj.leds.forEach(element => {
            self.createMarker(element.xaxis, element.yaxis, 'dhlk_div_mk' + element.id, element)
          })
        }
      })
    },
    openScans() {
      this.openScan = true
      let self = this
      setTimeout(() => {
        self.startRecognize()
      }, 500)
    },
    // 创建扫描控件
    startRecognize() {
      let that = this
      if (!window.plus) return
      var filters = [plus.barcode.QR, plus.barcode.CODE128, plus.barcode.CODE39, plus.barcode.EAN13, plus.barcode.EAN8]
      var styles = {
        frameColor: '#29E52C',
        scanbarColor: '#29E52C',
        background: ''
      }
      scan = new plus.barcode.Barcode('bcid', filters, styles)
      scan.onmarked = onmarked
      setTimeout(() => {
        that.startScan()
      }, 2000)
      function onmarked(type, result, file) {
        switch (type) {
          case plus.barcode.QR:
            type = 'QR'
            break
          case plus.barcode.EAN13:
            type = 'EAN13'
            break
          case plus.barcode.EAN8:
            type = 'EAN8'
            break
          default:
            type = '其它' + type
            break
        }
        result = result.replace(/\n/g, '')
        that.codeUrl = result
        that.closeScan()
      }
    },
    // 开始扫描
    startScan() {
      if (!window.plus) return
      scan.start()
    },
    // 关闭扫描
    cancelScan() {
      if (!window.plus) return
      this.openScan = false
      scan.cancel()
    },
    // 关闭条码识别控件
    closeScan() {
      if (!window.plus) return
      scan.close()
      this.openScan = false
    }
  }
}
</script>
<style lang="scss" scoped>
.dlgsty {
  /deep/ .el-dialog__header {
    padding: 10px;
  }
  /deep/ .el-dialog__title {
    font-size: 14px;
  }
  /deep/ .el-dialog__body {
    padding: 15px;
  }
  /deep/ .el-dialog__footer {
    padding-bottom: 10px;
  }
  /deep/ .rowsty {
    margin-top: -15px;
    margin-bottom: -15px;
  }
  /deep/ .spsty {
    font-size: 12px;
    padding-top: 5px;
    text-align: center;
  }
  /deep/ .el-input__inner {
    height: 25px;
    line-height: 25px;
  }
  /deep/ .spablic {
    padding-top: 15px;
    & button {
      height: 20px;
      line-height: 20px;
      padding: 0px 15px;
      & span {
        font-size: 12px;
      }
    }
  }
  /deep/ .spablicx {
    padding-top: 15px;
    & button {
      height: 20px;
      line-height: 20px;
      padding: 0px 15px;
      & span {
        font-size: 12px;
      }
    }
  }
  /deep/ .spablic1 {
    padding-top: 15px;
    text-align: right;
    & button {
      height: 20px;
      line-height: 20px;
      padding: 0px 15px;
      & span {
        font-size: 12px;
      }
    }
  }
}
.dres {
  /deep/ .el-drawer__header {
    margin-bottom: 5px;
    padding-top: 5px;
    & span {
      font-size: 15px;
    }
  }
  /deep/ .el-drawer__body {
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .deras {
    width: 100vw;
    height: calc(100vh - 32px);
    top: 0px;
    left: 0px;
    margin-top: 32px;
    overflow: auto;
    position: fixed;
    .marker {
      position: absolute;
      left: 1017px;
      top: 418px;
      font-size: 25px;
      font-weight: bold;
    }
    .normal-tip {
      color: #00bfff;
    }
    .left-panel {
      position: absolute;
    }

    h1,
    h2 {
      font-weight: normal;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      display: inline-block;
      margin: 0 10px;
    }
    a {
      color: #42b983;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
  }
}
.companyList {
  padding: 5px;
  .scan {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #ffffff;
    z-index: 9999;
    #bcid {
      width: 100%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      text-align: center;
      color: #fff;
      background: #ccc;
      height: calc(100vh - 30px);
    }
    .botmbtn {
      position: absolute;
      text-align: center;
      bottom: 0px;
      width: 100%;
    }
  }
  .header {
    width: 100%;
    text-align: center;
    font-size: 15px;
    margin-bottom: 10px;
    .reflesh {
      position: absolute;
      right: 80px;
      /deep/ i {
        transform: rotate(-90deg);
      }
    }
    .logout {
      position: absolute;
      right: 15px;
      /deep/ i {
        transform: rotate(-90deg);
      }
    }
  }
  .contant {
    .titel {
      border: 1px solid #bebebe;
      font-size: 14px;
      text-align: left;
      padding: 5px;
    }
    .tabs {
      border: 1px solid #bebebe;
      padding: 0px 5px;
      /deep/ .cell {
        font-size: 12px;
      }
      /deep/ .el-button--mini {
        padding: 3px 10px;
        & span {
          font-size: 12px;
        }
      }
      .el-table td,
      .el-table th.is-leaf,
      .el-table--border,
      .el-table--group {
        border-color: #bebebe;
        line-height: 25px;
        font-size: 14px;
      }
      .el-table--border::after,
      .el-table--group::after,
      .el-table::before {
        background-color: #bebebe;
      }
      /deep/ .is-leaf {
        border-bottom: 1px solid #bebebe;
        padding: 2px 0px;
        // border-right: 1px solid #bebebe;
      }
      /deep/ .el-table__row td {
        border-bottom: 1px solid #bebebe;
        padding: 2px 0px;
        // border-right: 1px solid #bebebe;
      }
    }
  }
}
</style>