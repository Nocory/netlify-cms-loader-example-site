<template>
	<div class="component-cms section">
		<div class="container">
			<div class="columns">
				<div class="column">
					<div class="summary">
						<p class="subtitle">Posts from the CMS (click)</p>
						<button class="button" v-for="(item,index) in cmsPosts" :key="index" @click="loadPost(index)">{{item.title}}</button>
					</div>

					<div class="cms-post-wrapper" v-if="loadedPostIndex != -1">
						<div class="title">{{cmsPosts[loadedPostIndex].title}}</div>
						<img :src="cmsPosts[loadedPostIndex].image">
						<p>
							{{cmsPosts[loadedPostIndex].body}}
						</p>
					</div>
				</div>

				<div class="column is-narrow">
					<div class="summary">
						<p class="subtitle">Images from the CMS:</p>
					</div>
					<div class="cms-image-wrapper" v-for="(item,index) in cmsImages" :key="index">
						<img :src="item.image">
						<div class="subtitle is-4">{{item.title}}</div>
					</div>

				</div>

			</div>

			<div class="cms-objects">
				<div class="subtitle is-4">The objects made available by the loader:</div>
				<p class="subtitle">cmsPosts:</p>
				<code v-for="(item,index) in cmsPosts" :key="index">
					{
					<div class="cms-object-item" v-for="(entry,key,index) in item" :key="key">{{key}} : {{entry}}</div>},
				</code>
				<p>cmsImages:</p>
				<code v-for="(item,index) in cmsImages" :key="index">
					{
					<div class="cms-object-item" v-for="(entry,key,index) in item" :key="key">{{key}} : {{entry}}</div>},
				</code>
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
			cmsPosts: require('netlify-cms-loader?collection=posts&bodyLimit=512!../admin/config.yml'),
			loadedPostIndex: -1,
			cmsImages: require('netlify-cms-loader?collection=images&outputDirectory=cms_alt!../admin/config.yml'),
		}
	},
	methods: {
		loadPost: function(index) {
			this.loadedPostIndex = index
			if (this.cmsPosts[index].body) return

			axios.get(`${this.cmsPosts[index].filePath}`)
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
	background: $oc-gray-1;
	min-height: 100%;
}

.summary {
	margin-bottom: 1rem;
	button {
		margin-right: 1rem;
	}
}

.cms-post-wrapper {
	background: $oc-gray-0;
	padding: 1rem;
	box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);

	img {
		max-height: 360px;
	}
}

.cms-image-wrapper {
	display: flex;
	flex-direction: column;

	box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);
	margin-bottom: 2rem; //height: 256px; //max-width: 100%;
	//width: auto;
	img {
		max-height: 128px;
		object-fit: cover;
		object-position: center;
		overflow: hidden;
	}

	.subtitle {
		padding: 1rem;
	}
}

.cms-object-item {
	margin-left: 2rem;
}
</style>