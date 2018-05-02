<template>
		<Menu theme="dark" :open-names="['1']" accordion  @on-select="test" style="float: left;">
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-gear"></Icon>
                   	 	平台设置
                </template>
                <MenuItem name="carousel" >轮播图管理</MenuItem>
                <MenuItem name="channel">频道管理</MenuItem>
                <MenuItem name="leval">等级管理</MenuItem>
            </Submenu>
            <Submenu name="2">
                <template slot="title">
                    <Icon type="ios-videocam"></Icon>
                    	视频管理
                </template>
                <MenuItem name="video">视频审核</MenuItem>
                <MenuItem name="recommend">推荐管理</MenuItem>
                <MenuItem name="rank">排行榜单</MenuItem>
            </Submenu>
            <Submenu name="3">
                <template slot="title">
                    <Icon type="social-youtube-outline"></Icon>
                    	会员视频
                </template>
                <MenuItem name="vipVideo">会员视频</MenuItem>
                <MenuItem name="videoList">视频列表</MenuItem>
            </Submenu>
            <Submenu name="4">
                <template slot="title">
                    <Icon type="ios-people"></Icon>
                    	用户管理
                </template>
                <MenuItem name="vipVideo">违规账号</MenuItem>
                <MenuItem name="videoList">举报管理</MenuItem>
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