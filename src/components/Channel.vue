<template>
	<div class="right">
		<div class="head">
			<span>频道管理</span>
			<Button type="primary" class="add" @click="showAdd">新增</Button>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="channels" height="538"></Table>
		
		<!--新增对话框-->
	    <Modal
	        v-model="modal1" :mask-closable="false" @on-cancel="closeAdd">
	        <p slot="header" style="text-align:center">
	            <span>新增频道</span>
	        </p>
	        <Form ref="addChannel" :model="addChannel" id="addChannel" :label-width="80">
		        <FormItem label="标题" required>
		            <Input v-model="addChannel.name" placeholder="请输入轮播图标题" class="forminput"></Input>
		        </FormItem>
		        
			    <FormItem label="上传图片" required>
			    <form  id="uploadForm" >
		        	<div class="upbox">
		        		<input type="file" accept="image/*" id="file" name="channel" @change="showUrl"/>
		        		<img :src="uploadimg" v-if="uploadimg.length > 0"/>
		        	</div>
		        	<a class="delIcon" v-if="uploadimg.length > 0" @click="delUrl">删除</a>
			    </form>
			    </FormItem>
			    <FormItem label="简介" >
		            <Input v-model="addChannel.brief" type="textarea" :autosize="{minRows: 4,maxRows: 4}" class="forminput" placeholder="请输入简介"></Input>
		        </FormItem>
		        <FormItem label="排序" required>
		            <Input v-model="addChannel.sort" placeholder="请输入排序" class="forminput"></Input>
		        </FormItem>
		    </Form>
		     <div slot="footer" style="text-align:center">
		     	<Button  style="margin-right: 20px;" @click="closeAdd">取消</Button>
	            <Button type="primary" @click="toAddChannel">新增</Button>
	        </div>
	    </Modal>
	    
	    <!--修改对话框-->
	    <Modal
	        v-model="modal2" :mask-closable="false" @on-cancel="closeUpdate">
	        <p slot="header" style="text-align:center">
	            <span>修改频道</span>
	        </p>
	        <Form ref="updateChannel" :model="updateChannel" id="updateChannel" :label-width="80">
		        <FormItem label="标题" required>
		            <Input v-model="updateChannel.name" placeholder="请输入轮播图标题" class="forminput"></Input>
		        </FormItem>
		        
			    <FormItem label="上传图片" required>
			    <form  id="uploadFormupdate" >
		        	<div class="upbox">
		        		<input type="file" accept="image/*" id="file" name="channel" @change="showUrl"/>
		        		<img :src="uploadimg" v-if="uploadimg.length > 0"/>
		        	</div>
		        	<a class="delIcon" v-if="uploadimg.length > 0" @click="delUrl">删除</a>
			    </form>
			    </FormItem>
			    <FormItem label="简介" >
		            <Input v-model="updateChannel.brief" type="textarea" :autosize="{minRows: 4,maxRows: 4}" class="forminput" placeholder="请输入简介"></Input>
		        </FormItem>
		        <FormItem label="排序" required>
		            <Input v-model="updateChannel.sort" placeholder="请输入排序" class="forminput"></Input>
		        </FormItem>
		    </Form>
		     <div slot="footer" style="text-align:center">
		     	<Button  style="margin-right: 20px;" @click="closeUpdate">取消</Button>
	            <Button type="primary" @click="toUpdateChannel">保存</Button>
	        </div>
	    </Modal>
		
		
		<!--删除提示对话框-->
		<Modal v-model="modal3" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定要删除这个频道么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="error" @click="toDel">删除</Button>
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
				delchannelId:'',
				modal3:false,
				//更新对话框
				modal2:false,
				//更新对象
				updateChannel:{
					name:'',
					brief:'',
					imgurl:'',
					sort:''
				},
				//图片上传路径
				uploadimg:'',
				//图片上传
				uploadurl:false,
				//新增对象
				addChannel:{
					name:'',
					brief:'',
					imgurl:'',
					sort:''
				},
				//新增对话框
				modal1:false,
				channels:[],
				columns1: [
						{
	                        title: '排序',
	                        key: 'sort',
	                        width:70
	                    },
	                    {
	                        title: '标题',
	                        key: 'name',
	                        width:150
	                    },
	                    {
	                        title: '图片',
	                        key: 'title',
	                        width:100,
	                        render:(h,params) => {
	                        	return h('img',{
	                        		attrs:{
	                        			src:params.row.imgurl
	                        		},
	                        		style:{
	                        			margin:'10px 0 ',
	                        			width:'50px',
	                        			height:'50px',
	                        			display:'block'
	                        		}
	                        	})
	                        }
	                    },
	                    {
	                        title: '视频数量',
	                        key: 'count_num',
	                        width:100
	                    },
	                    {
	                        title: '简介',
	                        key: 'brief',
	                        width:220,
	                        render:(h,params) => {
	                        	return h('p',{
	                        		style:{
	                        			width:'200px',
	                        			overflow:'hidden',
	                        			whiteSpace: 'nowrap',
	                        			textOverflow: 'ellipsis'
	                        		}
	                        	},params.row.brief)
	                        }
	                    },
	                    {
	                        title: '添加时间',
	                        key: 'time',
	                        render:(h,params) => {
	                        	return h('p',DateToString(params.row.addtime))
	                        }	
	                    },
	                    {
	                        title: '操作',
	                        key: 'operate',
	                        render: (h, params) => {
	                        	var status = params.row.status == 1 ? '停用':'启用'
	                        	var color = params.row.status == 1 ? 'error':'primary'
	                        	var canDel = params.row.count_num == 0 ? true :false 
	                            return h('div', [
	                                h('Button', {
	                                    props: {
	                                        type: color,
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        marginRight: '5px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                            this.changeStatue({
	                                            	id:params.row.c_id,
	                                            	status:params.row.status === 1? 0:1
	                                            })
	                                        }
	                                    }
	                                }, status),
	                                
	                                h('Button', {
	                                    props: {
	                                        type: 'primary',
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        marginRight: '5px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.getChannelById(params.row.c_id)
	                                        	this.showUpdate()
	                                        }
	                                    }
	                                }, '修改'),
	                                
	                                h('Button', {
	                                    props: {
	                                        type: 'error',
	                                        size: 'small',
	                                        disabled:!canDel
	                                    },
	                                    on: {
	                                        click: () => {
	                                            this.delchannelId = params.row.c_id
	                                            this.modal3 = true
	                                        }
	                                    }
	                                }, '删除')
	                            ]);
	                        }
	                    }
	            	]
			}
			
		},
		methods:{
			//进行删除操作
			toDel(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/channel/del",
					data:{
						id:that.delchannelId
					},
					success:function(data){
						that.closeDel()
						that.$Message.success('删除频道成功')
						that.getChannelList()
					}
				});
			},
			//关闭删除框
			closeDel(){
				this.modal3 = false
			},
			//更新频道
			toUpdateChannel(){
				//去前后空格
				this.updateChannel.name = this.updateChannel.name.trim()
				this.updateChannel.sort = (''+this.updateChannel.sort).trim()
				//验证
				var reg = /^[1-9]\d*$/
				if(this.updateChannel.name == ''){
					this.$Message.error('请输入标题')
					return
				}
				if(this.uploadimg == ''){
					this.$Message.error('请上传图片')
					return
				}
				if(this.updateChannel.sort == ''){
					this.$Message.error('请输入排序')
					return
				}
				if(!reg.test(this.updateChannel.sort)){
					this.$Message.error('请输入正确的排序序号')
					return
				}
				var that = this
				//判断是否更新了图片  如果更新了重新上传图片
				if(this.uploadimg != this.updateChannel.imgurl){
					$.ajax({
						type:"post",
						url:"http://localhost:2255/upload",
						async:false,
						processData:false,
		                contentType:false,
		                cache:false,
		                data: new FormData($("#uploadFormupdate")[0]),
		                success:function(data){
		                	if(data == 'err'){
		                		that.$Message.error('图片上传失败，请重新上传')
		                		return
		                	}else{
		                		that.updateChannel.imgurl = 'http://localhost:2255/uploads/'+data
		                	}
		                }
					});
				}
				
				//上传表单
				$.ajax({
					type:"post",
					url:"http://localhost:2255/channel/update",
					data:that.updateChannel,
					success:function(data){
						that.closeUpdate()
						that.$Message.success('频道修改成功')
						that.getChannelList()
					}
				});
			},
			//关闭修改对话框
			closeUpdate(){
				this.modal2 = false
				this.delUrl()
			},
			//打开修改对话框
			showUpdate(){
				this.modal2 = true
			},
			//获取频道详情
			getChannelById(id){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/channel/id",
					data:{
						id
					},
					success:function(data){
						that.updateChannel = data
						that.uploadimg = data.imgurl
					}
				});
			},
			//关闭新增对话框
			closeAdd(){
				this.modal1 = false
				this.addChannel = {
					name:'',
					brief:'',
					imgurl:'',
					sort:''
				}
				this.delUrl()
			},
			//显示新增对话框
			showAdd(){
				this.modal1 = true
			},
			//删除显示的图片  重新选择
			delUrl(){
				this.uploadimg = ''
				$('#file').val('')
			},
			//新增频道
			toAddChannel(){
				this.addChannel.name = this.addChannel.name.trim()
				this.addChannel.sort = this.addChannel.sort.trim()
				
				if(this.addChannel.name == ''){
					this.$Message.error('请输入标题')
					return
				}
				if(this.uploadimg == ''){
					this.$Message.error('请上传图片')
					return
				}
				if(this.addChannel.sort == ''){
					this.$Message.error('请输入排序')
					return
				}
				var that = this
				//上传图片
				$.ajax({
					url: "http://localhost:2255/upload",
	                type: "POST",
	                processData:false,
	                contentType:false,
	                cache:false,
	                async:false,
	                data: new FormData($("#uploadForm")[0]),
	                success:function(data){
	                	if(data === 'err'){
	                		that.$Message.error('图片上传失败，请重新上传')
	                	}else{
	                		that.addChannel.imgurl = data
	                	}
	                }
				});
				//上传表单
				$.ajax({
        			type:"post",
        			url:"http://localhost:2255/channel/add",
        			data:that.addChannel,
        			success:function(data){
        				if(data === 'success'){
        					that.closeAdd()
        					that.$Message.success('新增频道成功')
        					that.getChannelList()
        				}
        			}
        		});
			},
			//改变图片的url
			showUrl(e){
				var url = URL.createObjectURL(e.target.files[0])
				this.uploadimg = url
			},
			//获取频道列表
			getChannelList(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/channel",
					async:false,
					success:function(data){
						that.channels = data.data
					}
				});
			},
			//更改频道状态
			changeStatue(obj){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/channel/status",
					data:obj,
					success:function(data){
						that.getChannelList()
						that.$Message.success('更新状态成功')
					}
				});
			}
		},
		mounted(){
			this.getChannelList()
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
	.upp{
		float: left;
		margin-left: 20px;
		margin-right: 15px;
	}
	#uploadForm{
		overflow: hidden;
	}
	.upbox{
		width:50px;
		height: 50px;
		border: 1px solid #CCCCCC;
		position: relative;
		float: left;
		cursor: pointer;
	}
	.upbox:hover{
		border: 1px solid #5cadff;
	}
	.upbox input{
		width:100%;
		height: 100%;
		opacity:0;
		
	}
	.upbox img{
		position: absolute;
		width: 100%;
		height: 100%;
		top:0;
		left:0;
	}
	.delIcon{
		float: left;
		margin-top: 10px;
		margin-left: 15px;
	}
</style>