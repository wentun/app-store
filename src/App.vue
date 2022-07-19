<template>
	<div class="container">
		<!-- 搜索区 -->
		<div class="search-con">
			<van-search v-model="sreachText" placeholder="Search..." @update:model-value="search"/>
		</div>
		<!-- 推荐列表 -->
		<div class="recommend-con">
			<p class="title">Recommend</p>
			<div class="app-con">
				<div class="app-item" v-for="item in topList" :key="item.id" @click="openAppStore(item)">
					<img :src="item['im:image'][2]['label']">
					<p class="name">{{item['im:name']['label']}}</p>
					<span class="type">{{item.category.attributes.label}}</span>
				</div>
			</div>
		</div>
		<!-- 免费列表 -->
		<div class="free-con">
			<div class="free-app" v-for="(item, index) in filterList" :key="item.id" @click="openAppStore(item)">
				<span class="serial-number">{{index+1}}</span>
				<img :src="item['im:image'][1]['label']" :class="[index%2 == 0 ? 'img1' : 'img2']">
				<div class="app-msg">
					<p class="name">{{item['im:name']['label']}}</p>
					<p class="type">{{item.category.attributes.label}}</p>
					<div>
						<van-rate
							v-model="item.detail.averageUserRating"
							:size="14"
							color="#f3cb4c"
							allow-half
							readonly />
							<span class="score">({{item.detail.userRatingCount}})</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { topfreeapplications, topgrossingapplications, lookup} from '@/api/getData';
import { Rate, Search  } from "vant";
import 'vant/lib/rate/style'
import 'vant/lib/search/style'

export default {
  name: 'App',
  components: {
		[Rate.name]: Rate,
		[Search.name]: Search,
  },
	data(){
		return{
			sreachText: '',
			topList: [],
			freeList: [],// 原始数组
			filterList: [],// 最终显示数据
			timer: null
		}
	},
	methods:{
		getTopList(){
			topgrossingapplications(10).then(res=>{
				this.topList = res.feed.entry
			})
		},
		async getFreeList(){
			const res = await topfreeapplications(100)
			const freeList = res.feed.entry
			const idList = res.feed.entry.map(item =>{
				return item.id.attributes['im:id']
			})
			const detail = await lookup(idList.join(','))
			// 将数据合并
			detail.results.forEach((item, index) => {
				Object.assign(freeList[index], {detail: item})
			});
			this.freeList = freeList
			this.filterList = freeList
		},
		openAppStore(item){
			window.open(item.link[0].attributes.href, '_blank')
		},
		search(){
			clearTimeout(this.timer)
			this.timer = setTimeout(()=>{
				this.filterData()
			}, 500)
		},
		filterData(){
			if(!this.sreachText){
				this.filterList = this.freeList
				return
			}
			const filterlist = this.freeList.filter((item)=>{
				if(
					item['im:name']['label'].indexOf(this.sreachText) != -1
					|| item.detail.description.indexOf(this.sreachText) != -1
					|| item.detail.artistName.indexOf(this.sreachText) != -1
				){
					return item
				}
			})
			this.filterList = filterlist
		}
	},
	mounted(){
		this.getTopList()
		this.getFreeList()
	}
}
</script>

<style lang="less">
.container{

}
.search-con{
	margin-top: 12px;
	border-bottom: 1px solid #eee;
}
.recommend-con{
	padding-bottom: 12px;
	border-bottom: 1px solid #eee;
	.title{
		margin-left: 12px;
		margin-top: 12px;

	}
	.app-con{
		display: flex;
		overflow-x: auto;
		margin: 12px;
		&::-webkit-scrollbar {
			width: 4px;
			height: 4px;
		}
		&::-webkit-scrollbar-thumb {
				border-radius: 10px;
				background: rgba(0, 0, 0, 0);
		}

		&::-webkit-scrollbar-track {
				border-radius: 0;
				background: rgba(0, 0, 0, 0);
		}
		.app-item{
			position: relative;
			text-align: center;
			margin-right: 15px;
			img{
				border-radius: 22.5%;
			}
			.name{
				width: 100px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap; 
			}
			.type{
				font-size: 12px;
				color: rgba(60,60,67,.6);
			}
		}
	}
}
.free-con{
	.free-app{
		display: flex;
		align-items: center;
		margin: 12px 0 0 12px;
		border-bottom: 1px solid #eee;
		padding-bottom: 12px;
		.serial-number{
			font-size: 18px;
			color: #999;
			margin-right: 12px;
		}
		.img1{
			border-radius: 22.5%;
		}
		.img2{
			border-radius: 50%;
		}
		.app-msg{
			margin-left: 12px;
		}
		.name{
			margin-bottom: 5px;
		}
		.type,.score{
			font-size: 12px;
			color: rgba(60,60,67,.6);
			margin-bottom: 5px;
		}
		.score{
			margin-left: 15px;
		}
	}
}
</style>
