var router = {
				setting:['carousel','channel','leval'],
				video:['video','recommend','rank'],
				vip:['vipVideo','videoList'],
				user:['userList', 'irregularity', 'inform'],
				management:['adminList']
			}

//验证url合法性
export function validateUrl(){
	
	var url = location.href
	for(var key in router){
		for(var i in router[key]){
			if(url.indexOf(router[key][i])>=0){
				if(this.$store.state.limits[key]==0){
					location.href = 'http://localhost:8888/#/admin/'
					return
				}else{
					return
				}
			}
		}
	}
	location.href = 'http://localhost:8888/#/admin/'
}