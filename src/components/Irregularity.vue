<template>
	<div class="right">
		<div class="head">
			<span>封禁账号</span>
			<Input v-model="search.fiter" placeholder="请输入搜索关键词" style="width: 200px;margin-left:10px;"></Input>
		    <Select v-model="search.sortname" style="width:160px;margin-left:10px;">
		        <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
			<Button type="primary" style="margin-left:10px;" @click="getUserList(1)">查找</Button>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="userlist" :page-size="6"></Table>
		<!--分页-->
		<Page :current="search.page" :total="total" simple class="page" :page-size="6"	@on-change="getUserList"></Page>
		
		<!--封禁提示对话框-->
		<Modal v-model="modal1" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定要解封这个账号么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="error" @click="toBlockUser">确定</Button>
	        </div>
	    </Modal>
	    
	    <!--用户详情对话框-->
	    <Modal
	        v-model="modal2" :mask-closable="false" @on-cancel="closeInfo" width="550">
	        <p slot="header" style="text-align:center">
	            <span>用户详情</span>
	        </p>
	        <p>
	        	<span class="info">用户名 :</span>
	        	<span class="content">{{userInfo.name}}</span>
	        </p>
	        <p>
	        	<span class="info" style="float: left;">头像 :</span>
	        	<img :src="userInfo.headurl" style="width:60px;height: 60px;"/>
	        </p>
	        <p>
	        	<span class="info">注册时间 :</span>
	        	<span class="content">{{this.DateToString(userInfo.registertime)}}</span>
	        </p>
	        <p>
	        	<span class="info">等级 :</span>
	        	<span class="content">{{userInfo.leval}}</span>
	        </p>
	        <p>
	        	<span class="info">个性签名 :</span>
	        	<span class="content">{{userInfo.signname}}</span>
	        </p>
	        <p>
	        	<span class="info">简介 :</span>
	        	<span class="content">{{userInfo.brief}}</span>
	        </p>
		    <div slot="footer" style="text-align:center">
	            <Button type="primary" @click="closeInfo">确定</Button>
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
				//用户详情对话框
				modal2:false,
				//解封id
				delId:'',
				//确定对话框
				modal1:false,
				total:1,
				//搜索对象
				search:{
					fiter:'',
					page:1,
					sortname:'registertime',
					status:''
				},
				cityList: [
                    {
                        value: '1',
                        label: '正常'
                    },
                    {
                        value: '2',
                        label: '封禁'
                    }
                ],
                sortList: [
                    {
                        value: '',
                        label: '请选择排序方式'
                    },
                    {
                        value: 'registertime',
                        label: '注册时间'
                    },
                    {
                        value: 'leval',
                        label: '等级'
                    }
                ],
                //用户列表
                userlist:[],
                columns1:[
					{
                        title: '排序',
                        key: 'sort',
                        width:80,
                        render:(h,params) => {
                        	var num = (this.search.page-1)*6+params.row._index+1
                        	return h('p',num)
                        }
                    },
                    {
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: '手机号码',
                        key: 'phone'
                    },
                    {
                        title: '开始时间',
                        key: 'starttime',
                        render:(h,params) => {
                        	return h('p',DateToString(params.row.starttime))
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'time',
                        render:(h,params) => {
                        	return h('p',DateToString(Number(params.row.starttime) + Number(params.row.time)))
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render:(h,params) => {
                        	var flag = params.row.status=='1'?true:false
                        	return h('div', [
	                            h('div', {
                                    style:{
                                    	width:'5px',
	                        			height:'5px',
	                        			background:flag ? 'blue':'red',
	                        			borderRadius:'50%',
	                        			display:'inline-block',
	                        			marginRight:'8px'
                                    }
                                }),
                                h('span', flag?'正常':'已封禁')
                            ]);
                        	
                        }
                    },
                    
                    {
                        title: '注册时间',
                        key: 'time',
                        render:(h,params) => {
                        	return h('p',DateToString(params.row.registertime))
                        }	
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
                                    style:{
                                    	marginRight:'10px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.showInfo()
                                        	this.getInfoById(params.row.id)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                    },
                                    on: {
                                        click: () => {
                                        	this.delId = params.row.id
                                        	this.showDel()
                                        }
                                    }
                                }, '解封')
                            ]);
                        }
	                }
	         
				],
				//用户详情
				userInfo:{
					brief:'',
					headurl:'',
					id:'',
					leval:'',
					name:'',
					phone:'',
					registertime:'',
					sex:'',
					signname:'',
					status:''
				}
			}
			
		},
		methods:{
			//获取用户详情
			getInfoById(id){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/user/getInfo",
					data:{
						id:id
					},
					async:false,
					success:function(data){
						that.userInfo = data.data
					}
				});
			},
			//关闭用户详情对话框
			closeInfo(){
				this.modal2 = false
			},
			//打开用户详情对话框
			showInfo(){
				this.modal2 = true
			},
			//解封账号
			toBlockUser(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/user/status",
					data:{
						id:that.delId,
						status:1,
					},
					async:false,
					success:function(data){
						that.$Message.success('解账号成功')
						that.closeDel()
						that.getUserList()
					}
				});
			},
			//打开确认对话框
			showDel(){
				this.modal1 = true
			},
			//关闭确认对话框
			closeDel(){
				this.modal1 = false
			},
			//获取用户分页列表
			getUserList(val){
				if(typeof val === 'number'){
					this.search.page = val
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/user/irregularity",
					data:that.search,
					async:false,
					success:function(data){
						that.userlist = data.data
						that.search.page = data.currpage
						that.total = data.total
						
						//做个处理
						if(data.data.length === 0 && data.total !== 0){
							that.getUserList(data.currpage-1)
						}
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
			this.getUserList()
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