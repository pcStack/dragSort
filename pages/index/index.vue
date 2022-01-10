<template>
	<view>
		<dragSort :list="list" @change="changeEnd"></dragSort>
	</view>
</template>

<script>
	import dragSort from '@/components/dragSort/dragSort.vue'
	export default {
		data() {
			return {
				list:[
					{sortName:'潮流新品',count:666},
					{sortName:'进店必买',count:235},
					{sortName:'爆炒荤菜',count:4654},
					{sortName:'精致套餐',count:3475},
					{sortName:'特色菜系',count:2352},
					{sortName:'营养汤品',count:267},
				]
			}
		},
		methods: {
			changeEnd(list){
				// console.log(list)
			}
		}
	}
</script>

<style>

</style>
