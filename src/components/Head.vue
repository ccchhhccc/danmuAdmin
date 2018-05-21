<template>
	<div class="head">
		<b>后台管理系统</b>
		<a @click="showDel">注销</a>
		<span class="span">欢迎{{username}}</span>
		
		<!--注销提示对话框-->
		<Modal v-model="modal1" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>注销提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定要退出登录么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="error" @click="layout">确定</Button>
	        </div>
	    </Modal>
	</div>
</template>

<script>
	export default {
	  name: 'HelloWorld',
	  data () {
	    return {
	      username:'',
	      modal1:false
	    }
	  },
	  methods:{
	  	//打开窗口
	  	showDel(){
	  		this.modal1 = true
	  	},
	  	//关闭窗口
	  	closeDel(){
	  		this.modal1 = false
	  	},
	  	//注销
	  	layout(){
	  		//移除session
	  		sessionStorage.removeItem('name')
	  		sessionStorage.removeItem('id')
	  		//页面跳转至登录页
	  		location.href  = 'http://localhost:8888/#/'
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
	.span {
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