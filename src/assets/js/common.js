// 转时间 如 2017-11-3 18:08:15
function addZero(i){
	if (i<10) {
		i="0" + i;
	}
	return i;
}
export function DateToString (format) {
	let d = new Date(Number(format))
	let date = (d.getFullYear()) + "-" + 
	           (addZero(d.getMonth() + 1)) + "-" +
	           (addZero(d.getDate())) + " " + 
	           (addZero(d.getHours())) + ":" + 
	           (addZero(d.getMinutes()));
	return date
}