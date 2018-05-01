<template>
	<div class="right">
		<div class="head">
			<span>排行榜</span>
			<Select v-model="search.c_id" style="width:160px;margin-left:10px;" placeholder="请选择频道分类">
				<Option value="" key="">请选择频道分类</Option>
		        <Option v-for="item in channels" :value="item.c_id" :key="item.c_id">{{ item.name }}</Option>
		    </Select>
		    <Select v-model="search.sortname" style="width:160px;margin-left:10px;" >
		        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
		    <Button type="primary" @click="getVideoList(1)" style="margin-left:10px;">查询</Button>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="videolist"></Table>
		<!--分页-->
		<Page :current="search.page" :total="total" simple class="page" :page-size="6"	@on-change="getVideoList"></Page>
		
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
	    
	    <!--删除提示对话框-->
		<Modal v-model="modal2" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="help" color="#5cadff"></Icon>
	            <span>添加提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定将这个视频添加到推荐列表中么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="primary" @click="toAddRecomment">确定</Button>
	        </div>
	    </Modal>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { DateToString } from '../assets/js/common'
	export default {
		components:{
			
		},
		data(){
			return {
				//添加到推荐id
				addRecommentId:'',
				//添加到推荐提示对话框
				modal2:false,
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
				//视频详情对话框
				modal1:false,
				//数据总数
				total:0,
				//表格数据
				videolist:[],
				columns1:[
					{
                        title: '排行',
                        key: 'rank',
                        width:60,
                        render:(h,params) => {
                        	var num = (this.search.page-1)*6+params.row._index+1
                        	return h('p',num)
                        }
                    },
					{
                        title: '标题',
                        key: 'v_name',
                        width:180,
                        render:(h,params) => {
	                        	return h('p',{
	                        		style:{
	                        			width:'150px',
	                        			overflow:'hidden',
	                        			whiteSpace: 'nowrap',
	                        			textOverflow: 'ellipsis'
	                        		}
	                        	},params.row.v_name)
	                        }
                    },
                    {
                        title: '封面图',
                        key: 'img',
                        width:90,
                        render:(h,params) => {
                        	return h('img',{
                        		attrs:{
                        			src:params.row.v_img
                        		},
                        		style:{
                        			margin:'10px 0',
                        			width:'50px',
                        			height:'50px',
                        			display:'block'
                        		}
                        	})
                        }
                    },
                    {
                        title: '频道分类',
                        key: 'channelname',
                        width:85,
                    },
                    {
                        title: '播放量/硬币量',
                        key: 'num',
                        width:115,
                        render:(h,params) => {
                        	return h('p',params.row.v_num+' / '+params.row.v_coin)
                        }
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
                        	var flag = true
                        	for(var i in this.recommend){
                        		if(this.recommend[i].v_id === params.row.id){
                        			flag = false
                        		}
                        	}
                            return h('div', [
	                            h('Button', {
	                                    props: {
	                                        type: 'primary',
	                                        size: 'small'
	                                    },
	                                    style:{
	                                    	marginRight:'10px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.getVideoById(params.row.id)
	                                            this.showDetail()
	                                        }
	                                    }
	                                }, '查看'),
	                                h('Button', {
	                                    props: {
	                                        type: 'primary',
	                                        size: 'small',
	                                        disabled:!flag
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.addRecommentId = params.row.id
	                                        	this.modal2 = true
	                                        }
	                                    }
	                                }, '添加到推荐')
                            ]);
                        }
	                }
	         
				],
				//排序分类
				cityList: [
                    {
                        value: 'v_num',
                        label: '播放排行榜'
                    },
                    {
                        value: 'v_coin',
                        label: '硬币排行榜'
                    },
                ],
				//频道分类
				channels:[],
				search:{
					c_id:'',
					page:1,
					sortname:'v_num'
				},
				//推荐列表
				recommend:[]
			}
			
		},
		methods:{
			//添加到推荐
			toAddRecomment(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/recommend/add",
					data:{
						v_id:that.addRecommentId
					},
					async:false,
					success:function(data){
						console.log(data)
						that.$Message.success('添加到推荐列表成功')
						that.closeDel()
						that.getRecommendList()
						that.getVideoList()
					}
				});
			},
			//关闭提示框
			closeDel(){
				this.modal2 = false
			},
			//获取推荐列表
			getRecommendList(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/recommend",
					async:false,
					success:function(data){
						that.recommend = data
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
			//获取分页列表
			getVideoList(val){
				if(typeof val === 'number'){
					this.search.page = val
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/video/sort",
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
			this.getRecommendList()
			this.getVideoList()
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