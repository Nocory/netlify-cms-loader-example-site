<template>
	<div class="component-additional">
		<p>
			Lorem ipsum dolor sit amet.
		</p>
		<p>
			Lorem ipsum dolor sit amet.
		</p>
	</div>
</template>

<script>
import anime from 'animejs'
import cmsData from 'netlify-cms!yaml-loader!../admin/config.yml'
export default {
	data() {
		return {
			msg: "Message from data",
			cmsData
		}
	},
	methods: {
		scrollTo: function(id) {
			anime({
				targets: document.body,
				scrollTop: window.innerHeight,
				duration: 750,
				easing: 'easeOutCubic',
				elasticity: 100
			})
		}
	},
	created() { },
	mounted() {
		let introAnimStarted = false

		let introAnimation = () => {
			console.log("intro fnc")
			if (introAnimStarted) return
			introAnimStarted = true
			console.log("intro cont")

			let dividerEl = document.querySelector(".divider")
			let nameEl = document.querySelector(".name")
			let jobTitleEl = document.querySelector(".jobTitle")
			let buttonEl = document.querySelector(".scroll-button")

			anime.timeline()
				.add({
					duration: 1000,
					offset: 500,
					easing: 'easeInOutCubic',
					targets: dividerEl, width: "100%",
				})
				.add({
					duration: 1000,
					easing: 'easeInOutCubic',
					targets: nameEl, translateY: [200, 0],
				})
				.add({
					duration: 1000,
					offset: "-=500",
					easing: 'easeInOutCubic',
					targets: jobTitleEl, translateY: [-200, 0],
				})
				.add({
					duration: 1000,
					easing: 'easeInOutCubic',
					targets: dividerEl, width: ["100%", "66%"],
				})
				.add({
					targets: buttonEl, opacity: 0.67,
					duration: 500,
					easing: 'linear'
				})
				.add({
					targets: buttonEl, rotateX: [-180, 0],
					duration: 300,
					easing: 'linear'
				})
				.add({
					targets: document.querySelector(".scroll-button>i"), opacity: 0.67,
					duration: 1,
					offset: "-=150",
					easing: 'linear'
				})
		}

		setTimeout(introAnimation, 2000)
		let initTime = Date.now()

		document.querySelector(".background").addEventListener("load", (event) => {
			console.log("img loaded")
			console.log(Date.now() - initTime)
			if (Date.now() - initTime > 1000) {
				event.target.style.transition = `opacity ${(Date.now() - initTime) / 2000}s linear`
				document.querySelector(".background-overlay").style.transition = `opacity ${(Date.now() - initTime) / 2000}s linear`
			}
			event.target.style.opacity = 1
			document.querySelector(".background-overlay").style.opacity = 1
			introAnimation()
		})
	}
}
</script>

<style scoped lang="scss">
@import "~css/colors.scss";

.component-intro {
	height: 100%;
	max-height: 100%;
	z-index: -50;
	display: flex;
	justify-content: center;
	align-items: center;
}

.greeting-wrapper {
	position: fixed;
	z-index: 1;
	max-width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.background {
	object-fit: cover;
	top: 0;
	z-index: 0;
	position: fixed;
	width: 100vw;
	height: 100vh;
	opacity: 0; //transition: opacity 0.5s ease-out;
}

$bg-color: 0;
$bg-alpha: 0.5;
$bg-step: 0.1;

.background-overlay {
	top: 0;
	z-index: 1;
	position: fixed;
	width: 100vw;
	height: 100vh; //background: #0B2238;
	background-image: linear-gradient(120deg,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 0) 0%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 0) 20%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 1) 20%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 1) 40%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 2) 40%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 2) 60%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 3) 60%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 3) 80%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 4) 80%,
	rgba($bg-color, $bg-color, $bg-color, $bg-alpha - $bg-step * 4) 100%);
	opacity: 0;
}

.greeting-text {
	z-index: 1;
	position: relative;
	text-align: center;
	line-height: 1;
	letter-spacing: 0.1em;
	font-weight: normal;
	font-family: "Raleway", sans-serif;
	padding: 1.00rem;
	color: #fafafa; //
	//text-shadow: 0px 0px 16px rgba(0, 0, 0, 0.5); //
	text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.75);
}

.text-wrapper {
	overflow: hidden;
}

.name {
	@extend .greeting-text;
	font-size: calc(2rem + 2vw);
	transform: translateY(200px);
}

.divider {
	z-index: 1;
	bottom: -1px;
	width: 0%;
	height: 2px;
	background-color: #fafafa;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.75);
}

.jobTitle {
	@extend .greeting-text;
	font-size: calc(1rem + 1vw);
	transform: translateY(-200px);
}

////////////
// BUTTON //
////////////
.scroll-button {
	position: fixed;
	bottom: 32px; //left: calc(50% - 1.5rem);
	width: 3rem;
	height: 3rem;
	z-index: 1;

	opacity: 0;

	display: flex;
	align-items: center;
	justify-content: center;

	border: 1px solid $nord0;
	background: rgba(255, 255, 255, 0.75);
	border-radius: 50%;
	cursor: pointer;
	box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);

	transform: rotateX(180deg)
}

.scroll-button:hover,
.scroll-button:hover>i {
	opacity: 1 !important;
}

.scroll-button>i {
	opacity: 0;
	color: #222;
	font-size: 1rem;
}
</style>