<template>
	<div id="app">
		<componentCMS></componentCMS>
	</div>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	components: {
		componentCMS: require("./cms.vue").default,
	}
}
</script>

<style lang="scss" scoped>
@import "~css/colors.scss";
#app {
	z-index: 0;
	position: relative;
}
</style>