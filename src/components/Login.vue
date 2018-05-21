<template>
  <div>
  	<img src="../assets/bg.jpg"  class="loginBg"/>
  	<div class="main">
  			<h3>管理员登录</h3>
  			<Form ref="user" :model="user" :label-width="46" :rules="ruleInline">
	        <FormItem label="账号" prop="name">
	            <Input v-model="user.name" placeholder="请输入账号"></Input>
	        </FormItem>
	        <FormItem label="密码" prop="password">
	            <Input v-model="user.password" type="password" placeholder="请输入密码"></Input>
	        </FormItem>
	    </Form>
	    <div>
	    	<Button type="primary" @click="login">登录</Button>
	    </div>
  	</div>
  </div>
</template>

<script>
import routes from '../router/index'
import $ from 'jquery'
export default {
  name: 'HelloWorld',
  data () {
    return {
      user: {
	        name: '',
	        password: ''
	    },
	    ruleInline: {
	        name: [
	            { required: true, message: '请输入账号', trigger: 'blur' }
	        ],
	        password: [
	            { required: true, message: '请输入密码', trigger: 'blur' }
	        ]
	    }
    }
  },
  methods:{
  	login(){
  		var that = this
  		this.$refs['user'].validate((valid) => {
        if (valid) {
            $.ajax({
            	url:'http://localhost:2255/admin/login',
            	type:'post',
            	data:that.user,
            	async:false,
            	success:function(data){
            		if(data.msg == 'success'){
            			//将用户名存进临时会话中
            			sessionStorage.setItem('name',data.name)
            			sessionStorage.setItem('id',data.id)
            			that.$Message.success('欢迎'+data.name+'登录');
            			location.href = location.href + 'admin'
            		}else{
            			that.$Message.error('账号或密码错误')
            		}
            	}
            })
        }
    })
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginBg{
	position: absolute;
	left: 0;
	top: 0;
	z-index: -1;
	width: 100%;
	height: 100%;
}
.main{
	padding: 10px 20px;;
	text-align: center;
	background: #FFF;
	width: 300px;
	height: 240px;
	position: absolute;
	left: 50%;
	margin-left:-150px;
	top:50%;
	margin-top:-150px;
}
h3{
	padding: 20px 0 ;
}
</style>
