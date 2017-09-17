//import 'normalize.css'
//require("css/main.scss")
import "css/critical.scss"
import "css/main.scss"

import Vue from "vue/dist/vue.runtime.esm.js"
import app from "../components/app.vue"

new Vue({
	el: '#app',
	render: h => h(app)
});

console.log("NODE_ENV is: ", process.env.NODE_ENV)
console.log("DEBUG is: ", process.env.DEBUG)