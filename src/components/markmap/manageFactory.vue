<template>
	<div>
		<el-drawer title="地点切换" :visible.sync="collapseLtr" :direction="direction" :before-close="ltrClose">
			<el-menu
				default-active="1-4-1"
				class="el-menu-vertical-demo"
				@open="handleOpen"
				@close="handleClose"
				:collapse="isCollapse">
				<el-menu-item index="1" @click="choice()">
					<i class="el-icon-menu"></i>
					<span slot="title">厂房A区</span>
				</el-menu-item>
				<el-menu-item index="2" @click="choice()">
					<i class="el-icon-document"></i>
					<span slot="title">厂房B区</span>
				</el-menu-item>
				<el-menu-item index="3" @click="choice()">
					<i class="el-icon-setting"></i>
					<span slot="title">厂房C区</span>
				</el-menu-item>
			</el-menu>
		</el-drawer>
	</div>
</template>

<script>
import ManageLight from "./manageLight";
export default {
	name: "ManageFactory",
	components:{
		ManageLight
    },
    props:{
        showFactoryDrawer:{
            type: Boolean,
            default: false,
            required:true
        }
    },
	data() {
		return {
			isCollapse: false,
			collapseLtr: false,
            direction: "ltr"
		};
    },
    watch:{
        showFactoryDrawer:'changeShow'
    },
	mounted() {
        
    },
    changeShow(){
        this.collapseLtr = this.showFactoryDrawer
    },
	methods: {
        choice() {
            this.collapseLtr = false
            this.$emit('choicFactory')
        },
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
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
            this.collapseLtr = true
        }
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>