<template>
		<Menu theme="dark" :open-names="['1']" accordion @on-select="test" style="float: left;">
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-paper"></Icon>
                   	 	平台设置
                </template>
                <MenuItem name="carousel" >轮播图管理</MenuItem>
                <MenuItem name="channel">频道管理</MenuItem>
                <MenuItem name="leval">等级管理</MenuItem>
            </Submenu>
            <Submenu name="2">
                <template slot="title">
                    <Icon type="ios-people"></Icon>
                    	用户管理
                </template>
                <MenuItem name="2-1">新增用户</MenuItem>
                <MenuItem name="2-2">活跃用户</MenuItem>
            </Submenu>
            <Submenu name="3">
                <template slot="title">
                    <Icon type="stats-bars"></Icon>
                    	统计分析
                </template>
                <MenuGroup title="使用">
                    <MenuItem name="3-1">新增和启动</MenuItem>
                    <MenuItem name="3-2">活跃分析</MenuItem>
                    <MenuItem name="3-3">时段分析</MenuItem>
                </MenuGroup>
                <MenuGroup title="留存">
                    <MenuItem name="3-4">用户留存</MenuItem>
                    <MenuItem name="3-5">流失用户</MenuItem>
                </MenuGroup>
            </Submenu>
        </Menu>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		methods:{
		  	test(name){
		  		location.href = 'http://localhost:8888/#/admin/'+name
		  	}
		  }
	}
</script>

<style scoped>
	.left{
		float: left;
	}
</style>