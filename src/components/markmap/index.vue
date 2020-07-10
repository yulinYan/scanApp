<template>
	<div>
		<div class="left-panel">
			<el-button type="text" icon="left-tool-icon el-icon-s-tools" @click="openLtr()"></el-button>
		</div>
		<div id="dv">
			<!-- <img id="facImage" src="https://bluemobi-lanyu.oss-cn-shanghai.aliyuncs.com/static/map.png"
				:height="imageHeight"
				width="100%" /> -->
			<img id="facImage" src="http://localhost:92/map.png"
				:height="imageHeight"
				width="100%" />
		</div>
		<ManageFactory  ref="refMangeFac" v-if="showManageFactory"  @choicFactory="choicFactory" :showFactoryDrawer="showFactoryDrawer" />
        <ManageLight ref="refMangeLight"  v-if="showManageLight"  />
	</div>
</template>

<script>
import ManageLight from "./manageLight";
import ManageFactory from "./manageFactory";
export default {
	name: "ImageMain",
	components:{
		ManageLight,ManageFactory
	},
	data() {
		return {
			showManageFactory:false,
			showFactoryDrawer:false,
			showManageLightDraw: false,
			showManageLight:false,
			imageHeight: "",
			isCollapse: false,
			collapseLtr: false,
            direction: "ltr",
			mLightDirection: "rtl",
			positionObj:[]
		};
	},
	mounted() {
		this.imageHeight = parseInt(window.innerHeight) - 20 + "px";
		this.$nextTick(()=>{
			this.imgRegClick()
		})
	},
	methods: {
		imgRegClick(){
			let scope = this
			document.getElementById('facImage').onclick = function (e) {
				e = e || window.event;
				var x = e.offsetX || e.layerX, y = e.offsetY || e.layerY;
				scope.createMarker(x, y);
				
			}
		},
		createMarker(x, y ,divId ,qr) {
			let scope = this
			let div = document.createElement('div');
			
			div.className = 'el-icon-sunrise marker normal-tip'; 
			div.style.position= 'absolute'
            div.style.left = parseInt(x)-10 + 'px'; 
            div.style.top = parseInt(y)-10 + 'px';
            let qrValue = qr == undefined ? '' : qr;
            div.setAttribute('qrValue',qrValue)
            let id = divId
            if(id == undefined){
                let dt = new Date()
                id = "dhlk_div_mk" + dt.getTime();
            }

            div.id = id;
            this.positionObj.push({
                'left':x + 'px',
                'top':y + 'px',
                'id':id,
                'qrValue': qrValue
            });
			document.getElementById('dv').appendChild(div)
			scope.showManageLight = true
			scope.$nextTick(()=>{
				scope.$refs.refMangeLight.showCfgPanel()
			})
			document.getElementById(id).onclick = function(e){
				scope.$nextTick(()=>{
					scope.$refs.refMangeLight.showCfgPanel()
				})
			}
			
		},
		getObjById(id){
			for(let i = 0 ; i < this.positionObj.length ; i++){

			}
		},
        manageLightClose(){
            this.$confirm("确认关闭？")
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        choicFactory() {
            this.showManageLight = true
        },
		clkRadion() {
			console.log(this.isCollapse);
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
			let scope = this
			//this.showFactoryDrawer = true
			this.showManageFactory = true
			this.$nextTick(()=>{
				scope.$refs.refMangeFac.openLtr()
			})
        }
	}
};
</script>

<style>
.marker{
	position: absolute;
	left: 1017px;
	top: 418px;
	font-size: 40px;
	font-weight: bold;
}

.normal-tip {
	color: #00BFFF;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.left-panel {
	position: absolute;
}

h1,h2 {
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


</style>