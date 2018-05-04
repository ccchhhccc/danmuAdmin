<template>
	<div class="right">
		<div class="head">
			<span>举报管理</span>
		</div>
		<!--频道表格-->
		<Table :columns="columns1" :data="informList" :page-size="6"></Table>
		<!--分页-->
		<Page :current="page" :total="total" simple class="page" :page-size="6"	@on-change="getInormList"></Page>
		
		<!--封禁提示对话框-->
		<Modal v-model="modal1" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除提示</span>
	        </p>
	        <div style="text-align:center">
	            <p>你确定要删除这条举报信息么？</p>
	        </div>
	        <div slot="footer" style="text-align:center">
	        	<Button  @click="closeDel">取消</Button>
	            <Button type="error" @click="toDelInform">确定</Button>
	        </div>
	    </Modal>
	    
	    <!--封禁提示对话框-->
		<Modal v-model="modal2" width="460">
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
	        	<Button  @click="closeBlock">取消</Button>
	            <Button type="error" @click="toBlockUser">确定</Button>
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
				modal2:false,
				//操作id
				operateId:'',
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
                //举报信息列表
                informList:[],
                columns1:[
                    {
                        title: '举报人',
                        key: 'informername'
                    },
                    {
                        title: '被举报人',
                        key: 'toinformname'
                    },
                    {
                        title: '举报时间',
                        key: 'starttime',
                        render:(h,params) => {
                        	return h('p',DateToString(params.row.time))
                        }
                    },
                    {
                        title: '举报原因',
                        key: 'reason'
                    },
                    {
                        title: '被举报人言论',
                        key: 'content'
                    },
                    {
                        title: '被举报人状态',
                        key: 'status',
                        render:(h,params) => {
                        	var flag = true
                        	for(var i in this.irregularityList){
                        		if(this.irregularityList[i].u_id == params.row.u_id){
                        			if(this.irregularityList[i].starttime + this.irregularityList[i].time >new Date().getTime()){
	                        			flag = false
	                        		}
                        		}
                        	}
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
                                        	this.modal2 = true
                                        	this.operateId = params.row.u_id
                                        	this.delId = params.row.id
                                        }
                                    }
                                }, '封禁'),
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
                                }, '删除')
                            ]);
                        }
	                }
	         
				],
				//页数
				page:1,
				//封禁信息
				irregularityList:[],
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
                //删除id
                delId:'',
				
			}
			
		},
		methods:{
			//关闭封禁提示框
			closeBlock(){
				this.modal2 = false
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
						u_id:that.operateId,
						time:that.blockInfo.time,
						reason:that.blockInfo.reason
					},
					async:false,
					success:function(data){
						that.$Message.success('封禁账号成功')
						that.closeBlock()
						that.toDelInform()
						that.getIrregularity()
						that.getInormList()
					}
				});
			},
			//删除举报信息
			toDelInform(){
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/inform/del",
					async:false,
					data:{
						id:that.delId
					},
					success:function(data){
						that.closeDel()
						that.$Message.success('删除举报信息成功')
						that.getInormList()
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
			//获取举报信息分页列表
			getInormList(val){
				if(typeof val === 'number'){
					this.page = val
				}
				var that = this
				$.ajax({
					type:"post",
					url:"http://localhost:2255/inform/sort",
					async:false,
					data:{
						page:that.page
					},
					success:function(data){
						that.informList = data.data
						that.page = data.currpage
						that.total = data.total
						
						//做个处理
						if(data.data.length === 0 && data.total !== 0){
							that.getInormList(data.currpage-1)
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
			this.getInormList()
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