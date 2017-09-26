const path = require('path')
const fm = require('front-matter')

module.exports = function(content) {
	this.cacheable()
	content = JSON.parse(content)
	//console.log(content)
	console.log("===== NETLIFY CMS LOADER START =====")

	let result = {}

	for (let collection of content.collections) {
		result[collection.label] = {}

		let folder = collection.folder

		const allFiles = this.fs.readdirSync(folder)
		//console.log("found")
		//result[collection.label] = files
		for (let filePath of allFiles) {
			//console.log(filePath)
			//console.log(path.resolve(__dirname, collection.folder, filePath))
			let fileContent = this.fs.readFileSync(path.resolve(__dirname, collection.folder, filePath), { encoding: 'utf8' }) //FIXME: encoding not working
			fileContent = fileContent.toString()
			//console.log(typeof fileContent)
			//console.log(fileContent)
			let fmContent = fm(fileContent)
			let attributes = fmContent.attributes
			result[collection.label][filePath] = attributes
		}
	}

	console.log(result)

	console.log("===== NETLIFY CMS LOADER END =====")

	//this.fs
	return `module.exports = JSON.parse(${JSON.stringify(result)})`
	//return `module.exports = ""`
}