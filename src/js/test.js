let fnc = () => {
	return new Promise(() => {
		console.log("before")
		return 2
	})
}

fnc().then((val) => {
	console.log("after", val)
})