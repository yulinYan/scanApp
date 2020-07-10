<template>
	<div>
        <el-drawer title="设置信息" :visible.sync="showDraw" :direction="mLightDirection" :before-close="manageLightClose">	
			<el-form ref="form" :model="lightForm" label-width="80px" style="width:450px">
				<el-form-item label="设备编码">
					<el-input placeholder="录入设备编码" v-model="lightForm.qrCode" >
						<template slot="append"><span class="el-icon-full-screen scann"></span></template>
					</el-input>
				</el-form-item>
				<el-form-item label="设备测试" align="left">
					<el-button >闪烁三次</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">保存配置</el-button>
					<el-button @click="manageLightClose" >取消</el-button>
				</el-form-item>
			</el-form>
		</el-drawer>
	</div>
</template>

<script>
export default {
	name: "ManageLightComponent",
	props:{
	},
	data() {
		return {
			imageHeight: "",
			isCollapse: false,
			showDraw: false,
            direction: "ltr",
			mLightDirection: "rtl",
			lightForm:{
				qrCode:'',
			}
		};
	},
	mounted() {},
	methods: {
		showCfgPanel(){
			this.showDraw = true
		},
        manageLightClose(){
            this.$confirm("确认关闭？")
            .then(_ => {
				this.showDraw = false
                done();
            })
            .catch(_ => {});
        },
		onSubmit(){

		},
		ltrClose(done) {
			this.$confirm("确认关闭？")
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        rtlClose(done) {
			this.$confirm("确认关闭？")
            .then(_ => {
                done();
            })
            .catch(_ => {});
		},
		openLtr() {
            this.showManageLightDraw = true
        }
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scann{
	font-size: 26px;
}
</style>