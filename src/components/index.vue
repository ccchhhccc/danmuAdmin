<template>
		<div>
			<Head/>
			<div>
				<Tab/>
				<router-view></router-view>
			</div>
			
		</div>
</template>

<script>
	import VueRouter from 'vue-router';
	import Head from './Head.vue'
	import Tab from './Tab.vue'
	export default {
		components:{
			Tab,
			Head
		}
	}
</script>

<style>
</style>