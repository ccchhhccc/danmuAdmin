<template>
	<div class="right">
		<div class="head">
			<span>频道管理</span>
			<Button type="primary" class="add" >新增</Button>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="channels"></Table>
		
	</div>
</template>

<script>
	import $ from 'jquery'
	import { DateToString } from '../assets/js/common'
	export default {
		components:{
			
		},
		data(){
			return {
				
			}
			
		},
		methods:{
			
		},
		mounted(){
			this.getChannelList()
		}
	}
</script>

<style scoped>
	.head{
		height: 30px;
		line-height: 30px;
		margin-bottom: 20px;
	}
	.right{
		margin-left:240px;
		padding:20px;
	}
	span{
		color:#5cadff;
		font-size: 18px;
	}
	.add{
		float: right;
	}
	.forminput{
		width:350px;
	}

</style>