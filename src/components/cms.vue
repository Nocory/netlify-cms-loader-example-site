<template>
  <div class="component-cms">
		<div class="container header">
			<h2 class="title">{{cmsPageStrings.siteTitle}}</h2>
			<div class="description" v-html="cmsPageStrings.body"></div>
		</div>
		
		<div class="container">
			<div class="section-info">
				<h3>{{cmsPageStrings.columnTitles.left}}</h3>
				<code class="require-code">
					<b>cmsPosts</b>: require(`cms?{
					<ul>
						<li>collection:'posts',</li>
						<li>keys: ['title','date'],</li>
					</ul>
					}!`),<br>
					<b>cmsImages</b>: require('cms?images!'),<br>
					<b>cmsPageStrings</b>: require("cms?collection=files/pageStrings&emitJSON=false!")
				</code>
				<h4>cmsPosts:</h4>
				<code class="loader-output" v-for="(item,index) in cmsPosts" :key="'posts-'+index">
					{
						<div class="cms-object-item" v-for="(entry,key) in item" :key="key">{{ key }} : {{ entry }},</div>
					},
				</code>
				<h4>cmsImages:</h4>
				<code class="loader-output" v-for="(item,index) in cmsImages" :key="'images-'+index">
					{
						<div class="cms-object-item" v-for="(entry,key) in item" :key="key">{{ key }} : {{ entry }},</div>
					},
				</code>
				<h4>cmsPageStrings:</h4>
				<code class="loader-output" >
					{
						<div class="cms-object-item" v-for="(value,key) in cmsPageStrings" :key="key">
							<template v-if="typeof value == 'object'">
								<code class="loader-output">
									{{key}} : {
										<div class="cms-object-item" v-for="(value,key) in value" :key="key">{{ key }} : {{ value }},</div>
									},
								</code>
							</template>
							<template v-else>
								{{ key }} : {{ value }},
							</template>
						</div>
					},
				</code>
			</div>

			<div class="section-posts">
				<h3>{{cmsPageStrings.columnTitles.center}}</h3>
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
				<h3>{{cmsPageStrings.columnTitles.right}}</h3>
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
			//cmsPosts: require('netlify-cms-loader?collection=posts&sortBy=date&reverse=false!admin/config.yml'),
			//cmsPosts: require("cms?collection=posts!admin/config.yml")
			cmsPosts: require(`cms?{
				'collection':'posts',
				'keys': ['title','date']
			}!`),
			loadedPostIndex: -1,
			cmsImages: require("cms?images!"),
			cmsPageStrings: require(`cms?{
				'collection': 'files/pageStrings',
				'emitJSON': false,
				'includeBody': true
				}!`)
			//cmsPosts: require("cms-config?hello=1")
			/*
			cmsPosts: require(`netlify-cms-loader?{
				collection:'posts',
				sortBy:'date',
				reverse:true
			}!admin/config.yml`),
			//cmsImages: require('netlify-cms-loader?collection=images&outputDirectory=cms_alt&sortBy=title!admin/config.yml'),
			cmsImages: require(`netlify-cms-loader?{
				collection:'images'
			}!admin/config.yml`),
			loadedPostIndex: -1,
			test: require(`netlify-cms-loader?{
				collection:'files'
			}!admin/config.yml`)
			*/
		}
	},
	methods: {
		loadPost: function(index) {
			this.loadedPostIndex = index
			if (this.cmsPosts[index].body) return

			axios.get(`${this.cmsPosts[index].filePath}`)
				.then(response => {
					this.$set(this.cmsPosts, index, response.data)
				})
				.catch(error => {
					console.error(error.message)
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

.container{
	@include desktop{
		display: flex;
	}
	padding: 1rem;
}

.header{
	display: flex;
	flex-direction: column;
}

.section-info{
	flex-grow: 1;
	flex-basis: 0;
	>.require-code{
		font-size: 0.8rem;
		color: $oc-gray-7;
		padding: 0;
		>ul{
			margin: 0;
			padding: 0 0 0 1rem;
			list-style-type:none;
		}
	}
	>.loader-output {
		font-size: 0.8rem;
		color: $oc-gray-7;
	}
}

.cms-object-item {
	margin-left: 2rem;
}

.section-posts{
	flex-grow: 1;
	flex-basis: 0;
	@include desktop{
		padding: 0 1rem;
	}
	>.post-buttons {
		display: flex;
		margin-bottom: 1rem;
		>button {
			cursor: pointer;
			box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.25);
			background: $oc-gray-1;
			border: 1px solid $oc-gray-6;
			border-radius: 4px;
			margin-right: 1rem;
			padding: 0.5rem 0.5rem;
			font-size: 0.875rem;
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