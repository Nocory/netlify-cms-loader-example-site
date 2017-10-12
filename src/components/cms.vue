<template>
	<div class="component-cms section">
		<div class="container is-fluid">
			<div class="columns">

				<div class="column cms-objects">
					<div class="subtitle">The objects made available by the loader:</div>
					<code class="require-code">
						<b>cmsPosts:</b> require('netlify-cms-loader?collection=posts&sortBy=date&reverse=true!../admin/config.yml'),
						<br>
						<b>cmsImages:</b> require('netlify-cms-loader?collection=images&outputDirectory=cms_alt&sortBy=title!../admin/config.yml')
					</code>
					<p>cmsPosts:</p>
					<code class="loader-output" v-for="(item,index) in cmsPosts" :key="index">
						{
						<div class="cms-object-item" v-for="(entry,key,index) in item" :key="key">{{key}} : {{entry}}</div>},
					</code>
					<p>cmsImages:</p>
					<code class="loader-output" v-for="(item,index) in cmsImages" :key="index">
						{
						<div class="cms-object-item" v-for="(entry,key,index) in item" :key="key">{{key}} : {{entry}}</div>},
					</code>
				</div>

				<div class="column">
					<div class="post-buttons">
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

				<div class="column is-3">
					<p class="subtitle">Images from the CMS:</p>
					<div class="cms-image-wrapper" v-for="(item,index) in cmsImages" :key="index">
						<img :src="item.image">
						<div class="subtitle is-4">{{item.title}}</div>
					</div>
				</div>

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
			cmsPosts: require('netlify-cms-loader?collection=posts&sortBy=date&reverse=true&bodyLimit=1150!../admin/config.yml'),
			cmsImages: require('netlify-cms-loader?collection=images&outputDirectory=cms_alt&sortBy=title!../admin/config.yml'),
			loadedPostIndex: -1,
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

.require-code {
	font-size: 0.6rem;
	color: $oc-gray-7;
	padding: 0;
}

.loader-output {
	font-size: 0.8rem;
	color: $oc-gray-7;
}

.post-buttons {
	margin-bottom: 1rem;
	button {
		margin-right: 1rem;
	}

	button:focus {
		border-color: $oc-blue-5;
		box-shadow: 0 0 0 2px $oc-blue-5;
	}
}

.cms-post-wrapper {
	background: $oc-gray-0;
	color: $oc-gray-7;
	padding: 1rem;
	box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);

	.title {
		color: $oc-gray-7;
	}

	img {
		max-height: 320px;
		margin-bottom: 1rem;
	}
}

.cms-image-wrapper {
	display: flex;
	flex-direction: column;
	max-width: 90vh;

	box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);
	margin-bottom: 2rem; //height: 256px; //max-width: 100%;
	//width: auto;
	img {
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