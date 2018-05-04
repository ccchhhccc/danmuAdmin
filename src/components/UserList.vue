<template>
	<div class="right">
		<div class="head">
			<span>用户信息</span>
			<Input v-model="search.fiter" placeholder="请输入搜索关键词" style="width: 200px;margin-left:10px;"></Input>
			<Select v-model="search.status" style="width:160px;margin-left:10px;">
				<Option value="" :key="">请选择用户状态</Option>
		        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
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
		<Modal v-model="modal1" width="460">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>封禁提示</span>
	        </p>
	        <Form ref="blockInfo" :model="blockInfo" id="blockInfo" :label-width="80">
		        <FormItem label="封禁时长" required>
		            <Select v-model="blockInfo.time" style="width:350px;">
				        <Option v-for="item in blockTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
		        </FormItem>
		        <FormItem label="封禁原因" required>
		            <Input v-model="blockInfo.reason" placeholder="请输入封禁原因" class="forminput"></Input>
		        </FormItem>
		    </Form>
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
				//封禁信息
				blockInfo:{
					time:'',
					reason:''
				},
				//用户详情对话框
				modal2:false,
				//封禁id
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
                blockTime: [
                    {
                        value: '43200000',
                        label: '十二小时'
                    },
                    {
                        value: '86400000',
                        label: '一天'
                    },
                    {
                        value: '864000000',
                        label: '十天'
                    },
                    {
                        value: '25920000000',
                        label: '一个月'
                    },
                    {
                        value: '77760000000',
                        label: '三个月'
                    },
                    {
                        value: '155520000000',
                        label: '半年'
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
                        title: '头像',
                        key: 'img',
                        width:120,
                        render:(h,params) => {
                        	return h('img',{
                        		attrs:{
                        			src:params.row.headurl
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
                        title: '性别',
                        key: 'sex',
                        width:60,
                        render:(h,params) => {
                        	var color = params.row.sex==1?true:false
                        	return h('Icon',{
                        		props:{
                        			type:color?'male':'female',
                        			size:color?'14':'16',
                        			color:color?'blue':'red'
                        		}
                        	})
                        }
                    },
                    {
                        title: '等级',
                        key: 'brief',
                        render:(h,params) => {
                        	return h('p',params.row.leval)
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
                        	var flag = true
                        	for(var i in this.irregularityList){
                        		if(this.irregularityList[i].u_id == params.row.id){
                        			if(this.irregularityList[i].starttime + this.irregularityList[i].time >new Date().getTime()){
	                        			flag = false
	                        		}
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
                                        	this.showInfo()
                                        	this.getInfoById(params.row.id)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        disabled:flag?false:true
                                    },
                                    on: {
                                        click: () => {
                                        	this.delId = params.row.id
                                        	this.showDel()
                                        }
                                    }
                                }, '封禁')
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
				},
				//违规用户列表
				irregularityList:[]
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
			//封禁账号
			toBlockUser(){
				var that = this
				this.blockInfo.reason = this.blockInfo.reason.trim()
				if(this.blockInfo.time=='' ||this.blockInfo.reason==''){
					that.$Message.error('请输入必填信息')
					return
				}
				//更改用户表的状态
				$.ajax({
					type:"post",
					url:"http://localhost:2255/user/status",
					data:{
						id:that.delId,
						status:2,
					},
					async:false,
					success:function(data){
						
					}
				});
				//插入封禁表数据
				$.ajax({
					type:"post",
					url:"http://localhost:2255/irregularity/add",
					data:{
						u_id:that.delId,
						time:that.blockInfo.time,
						reason:that.blockInfo.reason
					},
					async:false,
					success:function(data){
						that.$Message.success('封禁账号成功')
						that.closeDel()
						that.getUserList()
						that.getIrregularity()
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
				this.blockInfo = {
					time:'',
					reason:''
				}
			},
			//获取用户分页列表
			getUserList(val){
				if(typeof val === 'number'){
					this.search.page = val
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/userlist/sort",
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
			//获取所有违规账号
			getIrregularity(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/user/irregularity/all",
					async:false,
					success:function(data){
						that.irregularityList = data.data
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
			this.getIrregularity()
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