<template>
	<div class="right">
		<div class="head">
			<span>管理员管理</span>
			<Button type="primary" class="add" @click="showAdd">新增</Button>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="adminList" ></Table>
		
		
		
	    <!--新增对话框-->
	    <Modal
	        v-model="modal1" :mask-closable="false"  width="400">
	        <p slot="header" style="text-align:center">
	            <span>新增管理员</span>
	        </p>
	        <Form :model="addAdmin" :label-width="80">
		        <FormItem label="登录名" required>
		            <Input v-model="addAdmin.loginname" placeholder="请输入登录名"></Input>
		        </FormItem>
		        <FormItem label="密码" required>
		            <Input v-model="addAdmin.password" placeholder="请输入密码"></Input>
		        </FormItem>
		        <FormItem label="名字" required>
		            <Input v-model="addAdmin.name" placeholder="请输入名字"></Input>
		        </FormItem>
		        <Row>
		        	<Col span="12">
				        <FormItem label="系统设置" require>
				            <i-switch v-model="addAdmin.setting" ></i-switch>
				        </FormItem>
			        </Col>
			        <Col span="12">
				        <FormItem label="视频管理" require>
				            <i-switch v-model="addAdmin.video" ></i-switch>
				        </FormItem>
			        </Col>
		        </Row>
		        <Row>
		        	<Col span="12">
				        <FormItem label="vip管理" require>
				            <i-switch v-model="addAdmin.vip" ></i-switch>
				        </FormItem>
			        </Col>
			        <Col span="12">
				        <FormItem label="用户管理" require>
				            <i-switch v-model="addAdmin.user" ></i-switch>
				        </FormItem>
		        	</Col>
		        </Row>
		        <FormItem label="权限管理" require>
		            <i-switch v-model="addAdmin.management" ></i-switch>
		        </FormItem>
		    </Form>
		    <div slot="footer" style="text-align:center">
		    	<Button style="margin-right: 10px;" @click="closeAdd">取消</Button>
	            <Button type="primary" @click="toAddAdmin">新增</Button>
	        </div>
	    </Modal>
	    
	    <!--删除提示对话框-->
		<Modal v-model="modal2" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定要删除这个管理员账号么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="error" @click="toDelAdmin">确定</Button>
	        </div>
	    </Modal>
	    
	    <!--修改对话框-->
	    <Modal
	        v-model="modal3" :mask-closable="false"  width="400">
	        <p slot="header" style="text-align:center">
	            <span>修改管理员</span>
	        </p>
	        <Form :model="updateAdmin" :label-width="80">
		        <FormItem label="名字" required>
		            <Input v-model="updateAdmin.name" placeholder="请输入名字"></Input>
		        </FormItem>
		        <Row>
		        	<Col span="12">
				        <FormItem label="系统设置" require>
				            <i-switch v-model="updateAdmin.setting" ></i-switch>
				        </FormItem>
			        </Col>
			        <Col span="12">
				        <FormItem label="视频管理" require>
				            <i-switch v-model="updateAdmin.video" ></i-switch>
				        </FormItem>
			        </Col>
		        </Row>
		        <Row>
		        	<Col span="12">
				        <FormItem label="vip管理" require>
				            <i-switch v-model="updateAdmin.vip" ></i-switch>
				        </FormItem>
			        </Col>
			        <Col span="12">
				        <FormItem label="用户管理" require>
				            <i-switch v-model="updateAdmin.user" ></i-switch>
				        </FormItem>
		        	</Col>
		        </Row>
		        <FormItem label="权限管理" require>
		            <i-switch v-model="updateAdmin.management" ></i-switch>
		        </FormItem>
		    </Form>
		    <div slot="footer" style="text-align:center">
		    	<Button style="margin-right: 10px;" @click="closeUpdate">取消</Button>
	            <Button type="primary" @click="toUpdateAdmin">保存</Button>
	        </div>
	    </Modal>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { DateToString } from '../assets/js/common'
	import { validateUrl } from '../assets/js/validateUrl'
	export default {
		components:{
			
		},
		data(){
			return {
				//修改
				updateAdmin:{
					loginname:'',
					name:'',
					password:'',
					setting:0,
					video:false,
					vip:false,
					user:false,
					management:false,
					height:0
				},
				modal2:false,
				modal3:false,
				//新增
				addAdmin:{
					loginname:'',
					name:'',
					password:'',
					setting:0,
					video:false,
					vip:false,
					user:false,
					management:false,
					height:0
				},
				modal1:false,
				//管理员账号
				adminList:[],
				
                columns1:[
                    {
                        title: '用户名',
                        key: 'name',
                        width:100
                    },
                    {
                        title: '登录名',
                        key: 'loginname'
                    },
                    {
                        title: '系统设置权限',
                        key: 'setting',
                        align: 'center',
                        width:120,
                        render:(h,params) => {
                        	var flag = params.row.setting=='1'?true:false
                        	return h('div', [
	                            h('div', {
                                    style:{
                                    	width:'15px',
	                        			height:'15px',
	                        			background:flag ? 'blue':'red',
	                        			borderRadius:'50%',
	                        			display:'inline-block',
	                        			marginRight:'8px'
                                    }
                                })
                            ]);
                        	
                        }
                    },
                    {
                        title: '视频管理权限',
                        key: 'video',
                        align: 'center',
                        width:120,
                        render:(h,params) => {
                        	var flag = params.row.video=='1'?true:false
                        	return h('div', [
	                            h('div', {
                                    style:{
                                    	width:'15px',
	                        			height:'15px',
	                        			background:flag ? 'blue':'red',
	                        			borderRadius:'50%',
	                        			display:'inline-block',
	                        			marginRight:'8px'
                                    }
                                })
                            ]);
                        	
                        }
                    },
                    {
                        title: 'vip视频管理权限',
                        key: 'vip',
                        align: 'center',
                        width:130,
                        render:(h,params) => {
                        	var flag = params.row.vip=='1'?true:false
                        	return h('div', [
	                            h('div', {
                                    style:{
                                    	width:'15px',
	                        			height:'15px',
	                        			background:flag ? 'blue':'red',
	                        			borderRadius:'50%',
	                        			display:'inline-block',
	                        			marginRight:'8px'
                                    }
                                })
                            ]);
                        	
                        }
                    },
                    {
                        title: '用户管理权限',
                        key: 'user',
                        align: 'center',
                        width:120,
                        render:(h,params) => {
                        	var flag = params.row.user=='1'?true:false
                        	return h('div', [
	                            h('div', {
                                    style:{
                                    	width:'15px',
	                        			height:'15px',
	                        			background:flag ? 'blue':'red',
	                        			borderRadius:'50%',
	                        			display:'inline-block',
	                        			marginRight:'8px'
                                    }
                                })
                            ]);
                        	
                        }
                    },
                    {
                        title: '权限管理',
                        key: 'management',
                        align: 'center',
                        width:120,
                        render:(h,params) => {
                        	var flag = params.row.management=='1'?true:false
                        	return h('div', [
	                            h('div', {
                                    style:{
                                    	width:'15px',
	                        			height:'15px',
	                        			background:flag ? 'blue':'red',
	                        			borderRadius:'50%',
	                        			display:'inline-block',
	                        			marginRight:'8px'
                                    }
                                })
                            ]);
                        	
                        }
                    },
	                {
                        title: '操作',
                        key: 'operate',
                        render: (h, params) => {
                        	var flag = params.row.height==1?true:false
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:flag
                                    },
                                    style:{
                                    	marginRight:'10px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.delId = params.row.id
                                        	this.getAdminById()
                                        	this.modal3 = true
                                        }
                                    }
                                }, '修改权限'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        disabled:flag
                                    },
                                    on: {
                                        click: () => {
                                        	this.delId = params.row.id
                                        	this.showDel()
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
	                }
	         
				],
				//删除id
				delId:''
			}	
		},
		methods:{
			//更新
			toUpdateAdmin(){
				this.updateAdmin.name = this.updateAdmin.name.trim()
				if(this.updateAdmin.name==''  ){
					this.$Message.error('请填写必填信息')
					return
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/admin/update",
					data:that.updateAdmin,
					success:function(data){
						that.$Message.success('修改管理员权限成功')
						that.closeUpdate()
						that.getAdminList()
					}
				});
			},
			//关闭更新对话框
			closeUpdate(){
				this.modal3 = false
			},
			//获取管理员详情
			getAdminById(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/admin/id",
					data:{
						id:that.delId
					},
					success:function(data){
						that.updateAdmin = data
						that.updateAdmin.setting = that.updateAdmin.setting==1?true:false
						that.updateAdmin.video = that.updateAdmin.video==1?true:false
						that.updateAdmin.vip = that.updateAdmin.vip==1?true:false
						that.updateAdmin.user = that.updateAdmin.user==1?true:false
						that.updateAdmin.management = that.updateAdmin.management==1?true:false
					}
				});
			},
			showDel(){
				this.modal2 = true
			},
			closeDel(){
				this.modal2 = false
			},
			//删除
			toDelAdmin(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/admin/del",
					data:{
						id:that.delId
					},
					success:function(data){
						that.closeDel()
						that.$Message.success('删除成功')
						that.getAdminList()
					}
				});
			},
			//新增管理员
			toAddAdmin(){
				this.addAdmin.loginname = this.addAdmin.loginname.trim()
				this.addAdmin.name = this.addAdmin.name.trim()
				this.addAdmin.password = this.addAdmin.password.trim()
				if(this.addAdmin.loginname=='' ||this.addAdmin.name=='' ||this.addAdmin.password==''  ){
					this.$Message.error('请填写必填信息')
					return
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/admin/add",
					data:that.addAdmin,
					success:function(data){
						if(data=='success'){
							that.$Message.success('新增管理员账号成功')
							that.closeAdd()
							that.getAdminList()
						}else{
							that.$Message.error('登录名重复，请重新输入登录名')
						}
						
					}
				});
			},
			closeAdd(){
				this.modal1 = false
				this.addAdmin = {
					loginname:'',
					name:'',
					password:'',
					setting:0,
					video:false,
					vip:false,
					user:false,
					management:false,
					height:0
				}
			},
			showAdd(){
				this.modal1 = true
			},
			//获取管理员列表
			getAdminList(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/admin",
					success:function(data){
						that.adminList = data
					}
				});
			}
			
		},
		mounted(){
			this.getAdminList()
			validateUrl.call(this)
		}
	}
</script>

<style scoped>
	p{
		margin:5px 0;
	}
	.info{
		display: inline-block;
		width: 80px;
		text-align: right;
		margin-right: 15px;
		font-size: 15px;
	}
	.content{
		font-size: 15px;
	}
	.page{
		float: right;
		margin: 20px 0;
	}
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