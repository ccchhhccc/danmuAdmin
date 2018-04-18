<template>
	<div class="head">
		<b>后台管理系统</b>
		<a>注销</a>
		<span>欢迎{{username}}</span>
	</div>
</template>

<script>
	export default {
	  name: 'HelloWorld',
	  data () {
	    return {
	      username:''
	    }
	  },
	  mounted:function(){
	  	this.username = sessionStorage.getItem('name')
	  }
	}
</script>

<style scoped>
	.head{
		height: 50px;
		background: #1c2438;
		width: 100%;
		line-height: 50px;
	}
	b{
		font-size: 16px;
		color: #fff;
		margin-left:20px;
	}
	span {
		color:#FFFFFF;
		font-size: 14px;
		float: right;
	}
	a{
		color:#FFFFFF;
		font-size: 14px;
		float: right;
		margin:0 15px;
	}
</style>