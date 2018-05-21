<template>
	<div class="right">
		<div class="head">
			<span>更改密码</span>
		</div>
		<!--修改密码表单-->
		<div class="up">
			<Form :model="update" :label-width="100">
				<FormItem label="原密码" required style="height: 33px;">
		            <Input v-model="update.oldpwd" type="password" placeholder="请输入原密码" class="forminput"></Input>
		        </FormItem>
		        <FormItem label="新密码" required style="height: 33px;">
		            <Input v-model="update.newpwd" type="password" placeholder="请输入新密码" class="forminput"></Input>
		        </FormItem>
		        <FormItem label="确认新密码" required style="height: 33px;">
		            <Input v-model="update.againpwd"  type="password" placeholder="请再次输入新密码" class="forminput"></Input>
		        </FormItem>
	       </Form>
	       <p class="p">
	       		<Button type="primary" @click="toUpdatePwd">确认</Button>
	       </p>
		</div>
		
		<!--更改成功提示对话框-->
		<Modal v-model="modal1" width="360" :closable="false" :mask-closable="false"> 
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>密码更改提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>您已成功修改密码，请重新登录</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button type="primary"  @click="closeDel">确定</Button>
	        </div>
	    </Modal>
	</div>
</template>

<script>
	import $ from 'jquery'
	export default {
		components:{
			
		},
		data(){
			return {
				modal1:false,
				update:{
					oldpwd:'',
					newpwd:'',
					againpwd:''
				}
			}
			
		},
		methods:{
			
			//更改密码成功   退出重新登录
			closeDel(){
				//移除session
		  		sessionStorage.removeItem('name')
		  		sessionStorage.removeItem('id')
		  		//页面跳转至登录页
		  		location.href  = 'http://localhost:8888/#/'
			},
			//更新密码
			toUpdatePwd(){
				//空值判断
				if(!this.validate()){
					this.$Message.error('请输入必填信息')
					return 
				}
				if(!this.isEqual()){
					this.$Message.error('两次输入的新密码必须相等')
					return 
				}
				var that = this
				$.ajax({
	            	url:'http://localhost:2255/admin/updatePwd',
	            	type:'post',
	            	data:{
	            		id:sessionStorage.getItem('id'),
	            		oldpwd:that.update.oldpwd,
	            		newpwd:that.update.newpwd,
	            	},
	            	async:false,
	            	success:function(data){
	            		if(data=='success'){
	            			that.modal1 = true
	            		}else{
	            			that.$Message.error('原密码错误')
	            		}
	            	}
				})
			},
			//验证
			validate(){
				this.update.oldpwd = this.update.oldpwd.trim()
				this.update.newpwd = this.update.newpwd.trim()
				this.update.againpwd = this.update.againpwd.trim()
				
				if(this.update.oldpwd=='' || this.update.newpwd =='' || this.update.againpwd==''){
					return false
				}else{
					return true
				}
			},
			//验证两次密码是否相等
			isEqual(){
				if(this.update.newpwd==this.update.againpwd){
					return true
				}else{
					return false
				}
			}
		},
		mounted(){
		}
	}
</script>

<style scoped>
	.head{
		height: 30px;
		line-height: 30px;
		margin-bottom: 20px;
		text-align: center;
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
	.up{
		width: 500px;
		margin: 0 auto;
	}
	.p{
		text-align: center;
	}
</style>