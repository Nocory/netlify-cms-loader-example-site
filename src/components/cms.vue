<template>
  <div class="component-cms">
		<div class="container">

			<div class="section-info">
				<h2 class="subtitle">The objects made available by the loader:</h2>
				<code class="require-code">
					<b>cmsPosts:</b><br>
					require('netlify-cms-loader?collection=posts&sortBy=date&reverse=true!admin/config.yml')<br>
					<br>
					<b>cmsImages:</b><br>
					require('netlify-cms-loader?collection=images&outputDirectory=cms_alt&sortBy=title!admin/config.yml')
				</code>
				<p>cmsPosts:</p>
				<code class="loader-output" v-for="(item,index) in cmsPosts" :key="'posts-'+index">
					{
					<div class="cms-object-item" v-for="(entry,key) in item" :key="key">{{ key }} : {{ entry }}</div>},
				</code>
				<p>cmsImages:</p>
				<code class="loader-output" v-for="(item,index) in cmsImages" :key="'images-'+index">
					{
					<div class="cms-object-item" v-for="(entry,key) in item" :key="key">{{ key }} : {{ entry }}</div>},
				</code>
			</div>

			<div class="section-posts">
				<h2 class="subtitle">Posts from the CMS:</h2>
				<div class="post-buttons">
					<button class="button" v-for="(item,index) in cmsPosts" :key="index" @click="loadPost(index)">Load '{{ item.title }}'</button>
				</div>
				<div class="post-wrapper" v-if="loadedPostIndex != -1">
					<h3 class="title">{{ cmsPosts[loadedPostIndex].title }}</h3>
					<img :src="cmsPosts[loadedPostIndex].image">
					<div v-html="cmsPosts[loadedPostIndex].body"></div>
				</div>
			</div>

			<div class="section-images">
				<h2 class="subtitle">Images from the CMS:</h2>
				<div class="image-wrapper" v-for="(item,index) in cmsImages" :key="index">
					<img :src="item.image">
					<h4 class="subtitle">{{ item.title }}</h4>
				</div>
			</div>

		</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			msg: "Message from data",
			cmsPosts: require('netlify-cms-loader?collection=posts&sortBy=date&reverse=true!admin/config.yml'),
			cmsImages: require('netlify-cms-loader?collection=images&outputDirectory=cms_alt&sortBy=title!admin/config.yml'),
			loadedPostIndex: -1,
		}
	},
	methods: {
		loadPost: function(index) {
			this.loadedPostIndex = index
			if (this.cmsPosts[index].body) return

			axios.get(`${this.cmsPosts[index].filePath}`)
				.then(response => {
					this.$set(this.cmsPosts[index], "body", response.data.body)
				})
				.catch(error => {
					console.error(error)
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
	padding: 1rem;
}

.container{
	@include desktop{
		display: flex;
	}
	>div{
		margin: 2rem;
	}
}

.section-info{
	flex-grow: 1;
	flex-basis: 0;
	>.require-code{
		font-size: 0.6rem;
		color: $oc-gray-7;
		padding: 0;
	}
	>.loader-output {
		font-size: 0.8rem;
		color: $oc-gray-7;
		>.cms-object-item {
			margin-left: 2rem;
		}
	}
}

.section-posts{
	flex-grow: 1;
	flex-basis: 0;
	>.post-buttons {
		display: flex;
		margin-bottom: 1rem;
		>button {
			box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.25);
			background: $oc-gray-1;
			border: 1px solid $oc-gray-6;
			border-radius: 4px;
			margin-right: 1rem;
			padding: 0.25rem 0.5rem;
			&:focus{
				border-color: $oc-blue-5;
			}
		}
	}
	>.post-wrapper {
		background: $oc-gray-0;
		color: $oc-gray-7;
		padding: 1rem;
		box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.25);

		>.title {
			color: $oc-gray-7;
		}

		>img {
			max-width: 100%;
			max-height: 320px;
			margin-bottom: 1rem;
		}
	}
}

.section-images{
	flex-grow: 1;
	flex-basis: 0;
	>.image-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;

		box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.25);
		margin-bottom: 2rem;
		
		>img {
			width: 100%;
			//object-fit: contain;
			object-position: center;
			overflow: hidden;
		}

		>.subtitle {
			padding: 1rem;
		}
	}
}
</style>