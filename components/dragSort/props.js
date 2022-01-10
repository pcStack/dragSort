export default{
	props: {
		//列表
		list: {
			type: Array,
			default: []
		},
		//行高
		itemHeight: {
			type: [Number,String],
			default: 120
		},
		//是否可以拖动
		isTouch:{
			type: [Boolean],
			default: false
		}
	}
}