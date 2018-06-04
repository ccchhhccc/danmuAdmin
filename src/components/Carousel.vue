<template>
	<div class="right">
		<div class="head">
			<span>轮播图管理</span>
			<Button type="primary" class="add" @click="showAdd">新增</Button>
		</div>
		<Table :columns="columns1" :data="carousels"></Table>
		
		<!--删除提示对话框-->
		<Modal v-model="modal1" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定要删除这个轮播图么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="error" @click="delBanner">删除</Button>
	        </div>
	    </Modal>
	    
	    <!--新增对话框-->
	    <Modal
	        v-model="modal2" :mask-closable="false" @on-cancel="closeAdd">
	        <p slot="header" style="text-align:center">
	            <span>新增轮播图</span>
	        </p>
	        <Form ref="addBanner" :model="addBanner" id="addBanner" :label-width="80">
		        <FormItem label="标题" required>
		            <Input v-model="addBanner.title" placeholder="请输入轮播图标题" class="forminput"></Input>
		        </FormItem>
		        
			    <FormItem label="上传图片" required>
			    <form  id="uploadForm" >
		        	<div class="upbox">
		        		<input type="file" accept="image/*" id="file" name="banner" @change="showUrl"/>
		        		<img :src="uploadimg" v-if="uploadimg.length > 0"/>
		        	</div>
		        	<a class="delIcon" v-if="uploadimg.length > 0" @click="delBannerUrl">删除</a>
			    </form>
			    </FormItem>
			    <FormItem label="链接" >
		            <Input v-model="addBanner.link" placeholder="请输入链接" class="forminput"></Input>
		        </FormItem>
		        <FormItem label="排序" required>
		            <Input v-model="addBanner.sort" placeholder="请输入排序" class="forminput"></Input>
		        </FormItem>
		    </Form>
		     <div slot="footer" style="text-align:center">
		     	<Button @click="closeAdd" style="margin-right: 20px;">取消</Button>
	            <Button type="primary" @click="toAddBanner">新增</Button>
	        </div>
	    </Modal>
	    
	    <!--修改对话框-->
	    <Modal
	        v-model="modal3">
	        <p slot="header" style="text-align:center" :mask-closable="false" >
	            <span>修改轮播图</span>
	        </p>
	        <Form ref="updateBanner" :model="updateBanner" id="updateBanner" :label-width="80">
		        <FormItem label="标题" required>
		            <Input v-model="updateBanner.title" placeholder="请输入轮播图标题" class="forminput"></Input>
		        </FormItem>
		        
			    <FormItem label="上传图片" required>
			    <form  id="uploadFormupdate" >
		        	<div class="upbox">
		        		<input type="file" accept="image/*" id="file" name="banner" @change="showUrl"/>
		        		<img :src="uploadimg" v-if="uploadimg.length > 0"/>
		        	</div>
		        	<a class="delIcon" v-if="uploadimg.length > 0" @click="delBannerUrl">删除</a>
			    </form>
			    </FormItem>
			    <FormItem label="链接" >
		            <Input v-model="updateBanner.link" placeholder="请输入链接" class="forminput"></Input>
		        </FormItem>
		        <FormItem label="排序" required>
		            <Input v-model="updateBanner.sort" placeholder="请输入排序" class="forminput"></Input>
		        </FormItem>
		    </Form>
		     <div slot="footer" style="text-align:center">
		     	<Button @click="closeUpdate" style="margin-right: 20px;">取消</Button>
	            <Button type="primary" @click="toUpdateBanner">保存</Button>
	        </div>
	    </Modal>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { validateUrl } from '../assets/js/validateUrl'
	export default {
		components:{
			
		},
		data(){
			return {
				//图片上传路径
				uploadimg:'',
				//图片上传
				uploadurl:false,
				//修改轮播图信息
				updateBanner:{
					title:'',
					link:'',
					url:'',
					sort:'',
				},
				//新增轮播图信息
				addBanner:{
					title:'',
					link:'',
					url:'',
					sort:'',
				},
				//修改轮播图对话框
				modal3:false,
				//新增轮播图对话框
				modal2:false,
				//删除bannerid
				delBannerId:'',
				//删除提示对话框
				modal1:false,
				columns1: [
					{
                        title: '排序',
                        key: 'sort'
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '图片',
                        key: 'img',
                        render:(h,params) => {
                        	return h('img',{
                        		attrs:{
                        			src:params.row.url
                        		},
                        		style:{
                        			margin:'10px',
                        			width:'50px',
                        			height:'50px',
                        			display:'block'
                        		}
                        	})
                        }
                    },
                    {
                        title: '链接地址',
                        key: 'link'
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        render: (h, params) => {
                        	var status = params.row.status == 1 ? '停用':'启用'
                        	var color = params.row.status == 1 ? 'error':'primary'
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
                                            	id:params.row.id,
                                            	status:params.row.status === 1? 0:1
                                            })
                                        }
                                    }
                                }, status),
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
                                        	this.delBannerId = params.row.id
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
                                        	this.getBannerDetail(params.row.id)
                                        	this.showUpdate()
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                //轮播图列表
	            carousels:[],
			}
		},
		methods:{
			//修改轮播图
			toUpdateBanner(){
				var that = this
				//去空格
				this.updateBanner.title = this.updateBanner.title.trim()
				this.updateBanner.link = this.updateBanner.link.trim()
				this.updateBanner.sort = (''+this.updateBanner.sort).trim()
				console.log(this.updateBanner)
				//验证
				var reg = /^[1-9]\d*$/
				if(this.updateBanner.title == '' || this.updateBanner.sort == '' || this.uploadimg == ''){
					that.$Message.error('请填必要的信息')
					return
				}
				if(!reg.test(this.updateBanner.sort)){
					that.$Message.error('请输入正确的排序序号')
					return
				}
				that.updateBanner.addtime = new Date().getTime()
				
				console.log(this.uploadimg , that.updateBanner.url)
				//判断是否更新了图片
				if(this.uploadimg != that.updateBanner.url){
					$.ajax({
						url: "http://localhost:2255/upload",
		                type: "POST",
		                processData:false,
		                contentType:false,
		                cache:false,
		                data: new FormData($("#uploadFormupdate")[0]),
		                success:function(data){
		                	if(data === 'err'){
		                		that.$Message.error('图片上传失败，请重新上传')
		                	}else{
		                		var rel = data
		                		that.updateBanner.url = 'http://localhost:2255/uploads/' + rel
		                		$.ajax({
				        			type:"post",
				        			url:"http://localhost:2255/admin/carousels/update",
				        			data:that.updateBanner,
				        			success:function(data){
				        				if(data === 'success'){
				        					that.$Message.success('修改轮播图成功')
				        					that.closeUpdate()
				        					that.getCarousels()
				        				}
				        			}
				        		});
		                	}
		                }
	               })
				}else{
					$.ajax({
	        			type:"post",
	        			url:"http://localhost:2255/admin/carousels/update",
	        			data:that.updateBanner,
	        			success:function(data){
	        				if(data === 'success'){
	        					that.$Message.success('修改轮播图成功')
	        					that.closeUpdate()
	        					that.getCarousels()
	        				}
	        			}
	        		});
				}
				
				
			},
			//关闭修改对话框
			closeUpdate(){
				this.modal3 = false
				this.uploadimg = ''
				$('#file').val('')
			},
			//显示修改对话框
			showUpdate(){
				this.modal3 = true
			},
			//获取轮播图详情
			getBannerDetail(id){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/admin/carousels/detail",
					data:{
						id
					},
					success:function(data){
						console.log(data)
						that.updateBanner = data
						that.uploadimg = that.updateBanner.url
					}
				});
			},
			//新增轮播图
			toAddBanner(){
				var that = this
				//去空格
				this.addBanner.title = this.addBanner.title.trim()
				this.addBanner.link = this.addBanner.link.trim()
				this.addBanner.sort = this.addBanner.sort.trim()
				
				//验证
				var reg = /^[1-9]\d*$/
				if(this.addBanner.title == '' || this.addBanner.sort == '' || this.uploadimg == ''){
					that.$Message.error('请填必要的信息')
					return
				}
				if(!reg.test(this.addBanner.sort)){
					that.$Message.error('请输入正确的排序序号')
					return
				}
				that.addBanner.addtime = new Date().getTime()
				$.ajax({
					url: "http://localhost:2255/upload",
	                type: "POST",
	                processData:false,
	                contentType:false,
	                cache:false,
	                data: new FormData($("#uploadForm")[0]),
	                success:function(data){
	                	if(data === 'err'){
	                		that.$Message.error('图片上传失败，请重新上传')
	                	}else{
	                		var rel = data
	                		that.addBanner.url = 'http://localhost:2255/uploads/' + rel
	                		$.ajax({
	                			type:"post",
	                			url:"http://localhost:2255/admin/carousels/add",
	                			data:that.addBanner,
	                			success:function(data){
	                				if(data === 'success'){
	                					that.$Message.success('新增轮播图成功')
	                					that.closeAdd()
	                					that.getCarousels()
	                				}
	                			}
	                		});
	                	}
	                }
				});
			},
			//删除显示的图片  重新选择
			delBannerUrl(){
				this.uploadimg = ''
				$('#file').val('')
			},
			//改变图片的url
			showUrl(e){
				var url = URL.createObjectURL(e.target.files[0])
				this.uploadimg = url
			},
			//关闭新增轮播图对话框
			closeAdd(){
				this.uploadimg = ''
				$('#file').val('')
				this.addBanner = {
					title:'',
					link:'',
					url:'',
					sort:'',
				}
				this.modal2 = false
			},
			//显示新增轮播图对话框
			showAdd(){
				this.modal2 = true
			},
			//删除轮播图
			delBanner(){
				var that = this
				$.ajax({
					type:"post",
					data:{
						id:that.delBannerId
					},
					url:"http://localhost:2255/admin/carousels/del",
					success:function(data){
						that.$Message.success('删除轮播图成功')
						that.getCarousels()
						that.closeDel()
					}
				});
			},
			//关闭删除对话框
			closeDel(){
				this.modal1 = false
			},
			//显示删除对话框
			showDel(){
				this.modal1 = true
			},
			//获取轮播图列表
			getCarousels(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/admin/carousels",
					success:function(data){
						if(data !== 'err'){
							that.carousels = data.data
						}
					}
				});
			},
			//更改轮播图状态
			changeStatue(obj){
				var that = this
				$.ajax({
					type:"post",
					data:obj,
					url:"http://localhost:2255/admin/carousels/status",
					success:function(data){
						that.$Message.success('更新状态成功')
						that.getCarousels()
					}
				});
			}
		},
		mounted(){
			this.getCarousels()
			validateUrl.call(this)
		}
	}
</script>

<style scoped>
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
	.delIcon{
		float: left;
		margin-top: 10px;
		margin-left: 15px;
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
</style>