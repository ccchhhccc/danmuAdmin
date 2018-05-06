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
                <MenuItem name="userList">用户信息</MenuItem>
                <MenuItem name="irregularity">违规账号</MenuItem>
                <MenuItem name="inform">举报管理</MenuItem>
            </Submenu>
            <Submenu name="5">
                <template slot="title">
                    <Icon type="social-snapchat"></Icon>
                    	权限管理
                </template>
                <MenuItem name="adminList">管理员管理</MenuItem>
                <MenuItem name="irregularity">权限分配</MenuItem>
            </Submenu>
        </Menu>
</template>

<script>
	import $ from 'jquery'
	export default {
		data(){
			return {
				
			}
		},
		methods:{
		  	test(name){
		  		location.href = 'http://localhost:8888/#/admin/'+name
		  	},
		  	//验证是否登录
		  	isLogin(){
		  		$.ajax({
		  			type:"post",
		  			url:"http://localhost:2255/admin/isLogin",
		  			async:false,
		  			data:{
		  				id:sessionStorage.getItem('id')
		  			},
		  			success:function(data){
		  				console.log(data)
		  				if(data=='success'){
		  					location.href = 'http://localhost:8888/#/admin/carousel'
		  				}else{
		  					location.href = 'http://localhost:8888'
		  				}
		  			}
		  		});
		  	}
		},
		mounted(){
			this.isLogin()
		}
	}
</script>

<style scoped>
	.left{
		float: left;
	}
</style>