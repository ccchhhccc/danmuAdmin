<template>
	<div class="right">
		<div class="head">
			<span>审核管理</span>
			<Input v-model="search.filter" placeholder="请输入关键词" style="width: 200px;margin-left:10px;"></Input>
			<Select v-model="search.c_id" style="width:160px;margin-left:10px;" placeholder="请选择频道分类">
				<Option value="" key="">请选择频道分类</Option>
		        <Option v-for="item in channels" :value="item.c_id" :key="item.c_id">{{ item.name }}</Option>
		    </Select>
		    <Button type="primary" @click="getVideoList(1)" style="margin-left:10px;">查询</Button>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="videolist"></Table>
		
		<!--分页-->
		<Page :current="search.page" :total="total" simple class="page" :page-size="6"	@on-change="getVideoList"></Page>
		
		<!--视频详情对话框-->
	    <Modal
	        v-model="modal1" :mask-closable="false" @on-cancel="closeAdmin" width="550">
	        <p slot="header" style="text-align:center">
	            <span>视频审核</span>
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
		     	<Button type="error" style="margin-right: 20px;" @click="toReturn">退回</Button>
	            <Button type="primary" @click="toPass">审核通过</Button>
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
				//分页总数
				total:0,
				//审核对话框
				modal1:false,
				//审核id
				videoId:'',
				columns1:[
					{
                        title: '标题',
                        key: 'v_name'
                    },
                    {
                        title: '封面图',
                        key: 'img',
                        render:(h,params) => {
                        	return h('img',{
                        		attrs:{
                        			src:params.row.v_img
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
                        title: '频道分类',
                        key: 'channelname'
                    },
                    {
                        title: '上传时间',
                        key: 'time',
                        render:(h,params) => {
                        	return h('p',DateToString(params.row.v_time))
                        }	
	                },
	                {
                        title: '用户',
                        key: 'username',
	                },
	                {
                        title: '操作',
                        key: 'operate',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        	this.videoId = params.row.id
                                        	this.getVideoById(params.row.id)
                                        	this.showAdmin()
                                        }
                                    }
                                }, '审核')
                            ]);
                        }
	                }
	         
				],
				//频道列表
				channels:[],
				//搜索对象
				search:{
					page:1,
					filter:'',
					c_id:''
				},
				//视频列表
				videolist:[],
				//视频详情
				videodetail:{
					v_name:'',
					v_url:'',
					v_img:'',
					channelname:'',
					username:'',
					v_time:'',
					v_brief:''
				}
			}
			
		},
		methods:{
			//退回视频给用户重新修改
			toReturn(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/video/pass",
					data:{
						id:that.videodetail.id,
						status:2
					},
					async:false,
					success:function(data){
						that.$Message.success('退回成功')
						that.closeAdmin()
						that.getVideoList()
					}
				});
			},
			//审核通过
			toPass(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/video/pass",
					data:{
						id:that.videodetail.id,
						status:1
					},
					async:false,
					success:function(data){
						that.$Message.success('审核成功')
						that.closeAdmin()
						that.getVideoList()
					}
				});
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
			//关闭审核对话框
			closeAdmin(){
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
			//打开审核对话框
			showAdmin(){
				this.modal1 = true
			},
			//获取审核列表
			getVideoList(val){
				//根据页数查询
				if(typeof val === 'number'){
					this.search.page = val
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/video",
					data:that.search,
					async:false,
					success:function(data){
						that.videolist = data.data
						that.search.page = data.currpage
						that.total = data.total
						
						//做个处理
						if(data.data.length === 0 && data.total !== 0){
							that.getVideoList(data.currpage-1)
						}
					}
				});
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
			this.getChannelList()
			this.getVideoList()
			validateUrl.call(this)
		}
	}
</script>

<style scoped>
	.page{
		float: right;
		margin: 20px 0;
	}
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