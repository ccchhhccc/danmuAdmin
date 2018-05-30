<template>
	<div class="right">
		<div class="head">
			<span>VIP视频管理</span>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="viplist"></Table>
		
		<!--视频详情对话框-->
	    <Modal
	        v-model="modal1" :mask-closable="false" @on-cancel="closeDetail" width="550">
	        <p slot="header" style="text-align:center">
	            <span>查看视频</span>
	        </p>
	        <p>
	        	<span class="info">标题 :</span>
	        	<span class="content">{{videodetail.v_name}}</span>
	        </p>
	        <p>
	        	<span class="info">频道分类 :</span>
	        	<span class="content">{{videodetail.channelname}}</span>
	        </p>
	        <p>
	        	<span class="info">上传时间 :</span>
	        	<span class="content">{{this.DateToString(videodetail.v_time)}}</span>
	        </p>
	        <p>
	        	<span class="info">用户 :</span>
	        	<span class="content">{{videodetail.username}}</span>
	        </p>
	        <p>
	        	<span class="info" style="float: left;margin-top: 12px;">视频 :</span>
	        	<video :src="videodetail.v_url" controls="controls"></video>
	        </p>
		    <div slot="footer" style="text-align:center">
	            <Button type="primary" @click="closeDetail">确定</Button>
	        </div>
	    </Modal>
	    
	    <!--修改排序对话框-->
	    <Modal
	        v-model="modal2" :mask-closable="false" @on-cancel="closeUpdate" width="550">
	        <p slot="header" style="text-align:center">
	            <span>查看视频</span>
	        </p>
	        <Form  :label-width="80">
		        <FormItem label="排序" required>
		            <Input v-model="updatesort.sort" placeholder="请输入排序"></Input>
		        </FormItem>
	        </Form>
		    <div slot="footer" style="text-align:center">
	            <Button style="margin-right: 20px;" @click="closeUpdate">取消</Button>
	            <Button type="primary" @click="toUpdateSort">保存</Button>
	        </div>
	    </Modal>
	    
	    <!--删除提示对话框-->
		<Modal v-model="modal3" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定要将这个视频从vip列表中删除么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="error" @click="toDelVip">删除</Button>
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
				//删除提示对话框
				modal3:false,
				//修改排序对话框
				modal2:false,
				//修改排序
				updatesort:{
					id:'',
					sort:''
				},
				//视频详情
				videodetail:{
					v_name:'',
					v_url:'',
					v_img:'',
					channelname:'',
					username:'',
					v_time:'',
					v_brief:''
				},
				//查看视频详情
				modal1:false,
				//表格数据
				viplist:[],
				columns1:[
					{
                        title: '排序',
                        key: 'rank',
                        type:'index'
                    },
                    {
                        title: '视频名称',
                        key: 'v_name'
                    },
                    {
                        title: '添加时间',
                        key: 'title',
                        render:(h,params) => {
                        	return h('p',DateToString(params.row.addtime))
                        }
                    },
                    {
                        title: '作者',
                        key: 'username'
                    },
                    {
                        title: '序号',
                        key: 'sort'
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        width:250,
                        render: (h, params) => {
                            return h('div', [
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
                                            this.getVideoById(params.row.v_id)
                                            this.showDetail()
                                        }
                                    }
                                }, '查看'),
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
                                        	this.getDetailById(params.row.id)
                                        	this.showUpdate()
                                        }
                                    }
                                }, '修改排序'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        	this.delvid = params.row.v_id
                                        	this.delid = params.row.id
                                        	this.showDel()
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
				],
				//删除id
				delid:'',
				//删除视频的id
				delvid:''
			}
			
		},
		methods:{
			//删除vip
			toDelVip(){
				var that = this
				//更改状态
				$.ajax({
					type:"post",
					url:"http://localhost:2255/video/pass",
					data:{
						id:that.delvid,
						status:1
					},
					async:false,
					success:function(data){
						
					}
				});
				//删除列表
				$.ajax({
					type:"post",
					url:"http://localhost:2255/vip/del",
					data:{
						id:that.delid
					},
					async:false,
					success:function(data){
						that.$Message.success('删除vip视频成功')
						that.closeDel()
						that.getVipList()
					}
				});
			},
			//关闭删除提示窗
			showDel(){
				this.modal3 = true
			},
			//关闭删除提示窗
			closeDel(){
				this.modal3 = false
			},
			//修改排序
			toUpdateSort(){
				//验证
				var reg = /^[1-9]\d*$/
				this.updatesort.sort = (''+this.updatesort.sort).trim()
				
				if(this.updatesort.sort == ''){
					this.$Message.error('请输入排序')
					return
				}
				if(!reg.test(this.updatesort.sort)){
					this.$Message.error('请输入正确的排序序号')
					return
				}
				
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/vip/update/sort",
					data:that.updatesort,
					async:false,
					success:function(data){
						that.$Message.success('修改排序成功')
						that.closeUpdate()
						that.getVipList()
					}
				});
			},
			//获取详情
			getDetailById(id){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/vip/id",
					data:{
						id:id
					},
					async:false,
					success:function(data){
						that.updatesort = data
					}
				});
			},
			//关闭视频详情对话框
			closeUpdate(){
				this.modal2 = false
			},
			//打开视频详情对话框
			showUpdate(){
				this.modal2 = true
			},
			//关闭视频详情对话框
			closeDetail(){
				this.modal1 = false
				this.videodetail = {
					v_name:'',
					v_url:'',
					v_img:'',
					channelname:'',
					username:'',
					v_time:'',
					v_brief:''
				}
			},
			//打开视频详情对话框
			showDetail(){
				this.modal1 = true
			},
			//获取视频详情
			getVideoById(id){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/video/id",
					data:{
						id:id
					},
					async:false,
					success:function(data){
						that.videodetail = data
					}
				});
			},
			//获取vip列表
			getVipList(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/vip",
					async:false,
					success:function(data){
						that.viplist = data
					}
				});
			},
			DateToString (format) {
				let d = new Date(Number(format))
				let date = (d.getFullYear()) + "-" + 
				           (this.addZero(d.getMonth() + 1)) + "-" +
				           (this.addZero(d.getDate())) + " " + 
				           (this.addZero(d.getHours())) + ":" + 
				           (this.addZero(d.getMinutes()));
				return date
			},
			addZero(i){
				if (i<10) {
					i="0" + i;
				}
				return i;
			}
		},
		mounted(){
			this.getVipList()
			validateUrl.call(this)
		}
	}
</script>

<style scoped>
	video{
		display: inline-block;
		width: 400px;
		height: 250px;
	}
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