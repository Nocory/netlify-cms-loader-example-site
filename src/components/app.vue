<template>
	<div id="app">
		<componentAdditional></componentAdditional>
	</div>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	components: {
		componentAdditional: require("./additional.vue").default,
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