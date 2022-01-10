<template>
	<view class="drag-box" :style="{height:(itemHeight*1)*dataList.length+'rpx'}">
		<view v-for="(item,index) in dataList" :key="index"
			:style="{top: item.top +'px', height: (itemHeight*1 - 1)+'rpx'}"
			:class="['drag-item',{'drag-active': item.isActive}]">
			<view class="left">
				<view class="title">{{item.sortName||''+index}}</view>
				<view class="count">{{item.count||0}}个商品</view>
			</view>
			<view class="right" @touchstart="touchstart($event,item)" @touchmove.stop.prevent="touchmove" @touchend="touchend(item)">
				按我拖动
			</view>
		</view>
	</view>
</template>

<script>
	import props from './props.js';
	export default {
		mixins: [props],
		data() {
			return {
				activeItem: null,
				isDrag: false,
				dragTargetY: 0,
				dataList: [],
				sortIndexList: [],
			}
		},
		watch: {
			list: {
				immediate: true,
				deep: true,
				handler(list) {
					this.setList(list)
				}
			}
		},
		methods: {
			setUp(item){
				this.$emit('click',item);
			},
			touchstart(e, item) {
				this.dragTargetY = e.touches[0].pageY;
				this.isDrag = true;
				item.isActive = true;
				this.activeItem = item;
			},
			touchmove(e) {
				if (!this.isDrag) {
					return
				}
				let newY = e.touches[0].pageY;
				let d = newY - this.dragTargetY;
				this.activeItem.top += d;

				let prevIndex = this.sortIndexList[this.activeItem.index] - 1;
				let nextIndex = this.sortIndexList[this.activeItem.index] + 1;
				if (prevIndex >= 0 && d < 0) {
					let item = this.getItemByIndex(prevIndex);
					if (this.activeItem.top < item.top) {
						this.swapArray(item);
					}
				} else if (nextIndex < this.list.length && d > 0) {
					let item = this.getItemByIndex(nextIndex);
					if (this.activeItem.top > item.top) {
						this.swapArray(item);
					}
				}
				this.dragTargetY = newY;
			},
			touchend(item) {
				if (!this.isDrag) {
					return
				}
				this.isDrag = false;
				item.isActive = false;
				this.activeItem.top = this.sortIndexList[this.activeItem.index] * this.rowHeight;
				let sortList = [];
				Array(this.dataList.length).fill(0).forEach((v, index) => {
					let tempObj = this.deepClone(this.getItemByIndex(index));
					delete tempObj.isActive;
					delete tempObj.top;
					delete tempObj.index;
					sortList.push(tempObj);
				});
				this.$emit('change', sortList);
			},
			getItemByIndex(index) {
				for (let i = 0; i < this.sortIndexList.length; i++) {
					if (this.sortIndexList[i] === index) {
						return this.dataList[i];
					}
				}
				return null;
			},
			swapArray(item) { //列表中两个元素交换位置
				let index = this.sortIndexList[this.activeItem.index];
				this.sortIndexList[this.activeItem.index] = this.sortIndexList[item.index];
				this.sortIndexList[item.index] = index;
				item.top = index * this.rowHeight;
				this.count = 0;
			},
			setList(list) {
				this.dataList = list.map((item, index) => {
					this.sortIndexList.push(index);
					return {
						...item,
						isActive: false,
						top: index * this.rowHeight,
						index: index
					}
				})
			},
			deepClone(obj) {
				let result = {},
				oClass = this.isClass(obj);
				// console.log(oClass)
				for (let key in obj) {
					let copy = obj[key];
					if (this.isClass(copy) == "Object") {
						result[key] = arguments.callee(copy);
					} else if (this.isClass(copy) == "Array") {
						result[key] = arguments.callee(copy);
					} else {
						result[key] = obj[key];
					}
				}
				return result;
			},
			isClass(o) {
				if (o === null) return "Null";
				if (o === undefined) return "Undefined";
				return Object.prototype.toString.call(o).slice(8, -1);
			}
		},
		mounted() {},
		computed: {
			rowHeight() {
				const res = uni.getSystemInfoSync();
				let screenWidth = res.screenWidth;
				if (this.itemHeight) {
					return this.itemHeight * screenWidth / 750;
				} else {
					return 0;
				}
			}
		}
	}
</script>

<style lang="scss">
	.drag-box {
		position: relative;
		width: 100%;
		.drag-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: absolute;
			width: 100%;
			padding: 0 40rpx;
			box-sizing: border-box;
			background-color: #fff;
			border-bottom: 1rpx solid #F5F5F5;
			transition: all 0.2s;
			z-index: 1;
			&:last-child{
				border-bottom: 0;
			}
			.left{
				flex: 1;
				.title{
					font-size: 32rpx;
				}
				.count{
					margin-top: 10rpx;
					color: #999;
					font-size: 26rpx;
				}
			}
			.right{
				display: flex;
				align-items: center;
				justify-content: center;
				min-width: 100rpx;
				height: 100%;
				color: #ff5500;
				.set-up{
					color: #3D9AF9;
					.name{
						margin-right: 4rpx;
					}
				}
			}
		}
	}
	.drag-active {
		box-shadow: 0 8px 20px 0 #e6e6e6;
		transform: scale(1);
		z-index: 9 !important;
		transition: box-shadow .5s, transform .5s, top 0s !important;
	}
</style>
