<template>
	<div class="component-cms section">
		<div class="container">
			<div class="post-summary">
				<p class="subtitle">Available Posts:</p>
				<button class="button" v-for="(item,index) in cmsPosts" :key="index" @click="loadPost(index)">{{item.title}}</button>
			</div>

			<hr>

			<div class="cms-post-wrapper" v-if="loadedPostIndex != -1">
				<div class="title">{{cmsPosts[loadedPostIndex].title}}</div>
				<img :src="cmsPosts[loadedPostIndex].image">
				<p>
					{{cmsPosts[loadedPostIndex].body}}
				</p>
			</div>

		</div>
	</div>
</template>

<script>
import fm from "front-matter"
import axios from 'axios'
export default {
	data() {
		return {
			msg: "Message from data",
			cmsPosts: require('netlify-cms?collection=posts&bodyLimit=512!yaml-loader!../admin/config.yml'),
			loadedPostIndex: -1,
			cmsImages: require('netlify-cms?collection=images!yaml-loader!../admin/config.yml'),
		}
	},
	methods: {
		loadPost: function(index) {
			this.loadedPostIndex = index
			if (this.cmsPosts[index].body) return

			const filename = this.cmsPosts[index].filename

			axios.get(`/cms/posts/${filename}`)
				.then((response) => {
					let obj = fm(response.data)
					this.$set(this.cmsPosts[index], "body", obj.body)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}
}
</script>

<style scoped lang="scss">
@import "~css/colors.scss";

.component-cms {
	min-height: 100%;
}

.post-summary {
	button {
		margin-right: 1rem;
	}
}

.cms-post-wrapper {
	padding: 1rem;
	border: 1px solid lightblue;

	img {
		max-height: 360px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
	}
}
</style>