<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
body {
  margin: 0px;
  overflow: hidden;
  /* height: 100vh;
  width: 100%; */
  /deep/ .el-message {
    padding: 5px 10px;
    min-width: 200px;
    .el-message__content {
      font-size: 12px;
    }
  }
}
:focus {
  outline: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
