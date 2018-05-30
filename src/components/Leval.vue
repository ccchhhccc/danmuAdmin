<template>
	<div class="right">
		<div class="head">
			<span>等级管理</span>
			<Button type="primary" class="add" @click="showAdd">新增</Button>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="leval"></Table>
		
		<!--删除提示对话框-->
		<Modal v-model="modal1" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定要删除等级么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="error" @click="delLeval">删除</Button>
	        </div>
	    </Modal>
	    
	    <!--新增对话框-->
	    <Modal
	        v-model="modal2" :mask-closable="false" @on-cancel="closeAdd">
	        <p slot="header" style="text-align:center">
	            <span>新增等级</span>
	        </p>
	        <Form ref="addLeval" :model="addLeval" id="addLeval" :label-width="80">
		        <FormItem label="头衔" required>
		            <Input v-model="addLeval.title" placeholder="请输入头衔" class="forminput"></Input>
		        </FormItem>
		        <FormItem label="经验值" required>
		            <Input v-model="addLeval.value" placeholder="请输入经验值" class="forminput"></Input>
		        </FormItem>
		    </Form>
	        <div slot="footer" style="text-align:center">
		     	<Button  style="margin-right: 20px;" @click="closeAdd">取消</Button>
	            <Button type="primary" @click="toAddLeval">新增</Button>
	        </div>
	    </Modal>
	    
	    <!--修改对话框-->
	    <Modal
	        v-model="modal3" :mask-closable="false" @on-cancel="closeAdd">
	        <p slot="header" style="text-align:center">
	            <span>新增等级</span>
	        </p>
	        <Form ref="updateLeval" :model="updateLeval" id="updateLeval" :label-width="80">
		        <FormItem label="头衔" required>
		            <Input v-model="updateLeval.title" placeholder="请输入头衔" class="forminput"></Input>
		        </FormItem>
		        <FormItem label="经验值" required>
		            <Input v-model="updateLeval.value" placeholder="请输入经验值" class="forminput"></Input>
		        </FormItem>
		    </Form>
	        <div slot="footer" style="text-align:center">
		     	<Button  style="margin-right: 20px;" @click="closeUpdate">取消</Button>
	            <Button type="primary" @click="toUpdateLeval">修改</Button>
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
				//修改对话框
				modal3:false,
				//新增对话框
				modal2:false,
				//删除id
				delId:'',
				//删除提示框
				modal1:false,
				//表格信息
				leval:[],
				//表头
				columns1:[
					{
						title:'等级',
						key:'sort',
						type:'index'
					},{
						title:'头衔',
						key:'title'
					},{
						title:'经验值',
						key:'value'
					},{
	                        title: '操作',
	                        key: 'operate',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('Button', {
	                                    props: {
	                                        type: 'error',
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        marginRight: '5px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.delId = params.row.id
	                                        	this.showDel()
	                                        }
	                                    }
	                                }, '删除'),
	                                h('Button', {
	                                    props: {
	                                        type: 'primary',
	                                        size: 'small'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.getLevalById(params.row.id)
	                                        	this.showUpdate()
	                                        }
	                                    }
	                                }, '修改')
	                            ]);
	                        }
	                }
					
				],
				//新增对象
				addLeval:{
					title:'',
					value:''
				},
				//更新对象
				updateLeval:{
					title:'',
					value:''
				}
			}
			
		},
		methods:{
			//修改等级
			toUpdateLeval(){
				//验证
				var reg = /^[1-9]\d*$/
				if(this.updateLeval.title ==''){
					this.$Message.error('请输入头衔')
					return
				}
				if(this.updateLeval.value ==''){
					this.$Message.error('请输入经验值')
					return
				}
				if(!reg.test(this.updateLeval.value)){
					this.$Message.error('请输入正确的经验值')
					return
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/leval/update",
					data:that.updateLeval,
					success:function(data){
						if(data=='success'){
							that.$Message.success('修改成功')
							that.getLeval()
							that.closeUpdate()
						}
					}
				});
			},
			//关闭新增对话框
			closeUpdate(){
				this.modal3 = false
			},
			//显示新增对话框
			showUpdate(){
				this.modal3 = true
			},
			//获取等级详情
			getLevalById(id){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/leval/id",
					data:{
						id:id
					},
					success:function(data){
						that.updateLeval = data
					}
				});
			},
			//新增等级
			toAddLeval(){
				//验证
				var reg = /^[1-9]\d*$/
				if(this.addLeval.title ==''){
					this.$Message.error('请输入头衔')
					return
				}
				if(this.addLeval.value ==''){
					this.$Message.error('请输入经验值')
					return
				}
				if(!reg.test(this.addLeval.value)){
					this.$Message.error('请输入正确的经验值')
					return
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/leval/add",
					data:that.addLeval,
					success:function(data){
						if(data=='success'){
							that.$Message.success('新增成功')
							that.getLeval()
							that.closeAdd()
						}
					}
				});
			},
			//关闭新增对话框
			closeAdd(){
				this.modal2 = false
				this.addLeval = {
					title:'',
					value:''
				}
			},
			//显示新增对话框
			showAdd(){
				this.modal2 = true
			},
			//确认删除
			delLeval(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/leval/del",
					data:{
						id:that.delId
					},
					success:function(data){
						if(data=='success'){
							that.$Message.success('删除成功')
							that.getLeval()
							that.closeDel()
						}
					}
				});
			},
			//打开删除提示框
			showDel(){
				this.modal1 = true
			},
			//关闭删除提示框
			closeDel(){
				this.modal1 = false
			},
			//获取等级列表并排序
			getLeval(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/leval",
					success:function(data){
						that.leval = data
					}
				});
			}
		},
		mounted(){
			this.getLeval()
			validateUrl.call(this)
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