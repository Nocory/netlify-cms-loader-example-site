const path = require('path')
const fm = require('front-matter')
const loaderUtils = require("loader-utils")

const checkForBody = (collection) => {
	for (let field of collection.fields) {
		if (field.name === "body") return true
	}
	return false
}

const loaderFnc = function(content) {
	console.time("Netlify-CMS Loader")
	this.cacheable()
	const options = loaderUtils.getOptions(this)

	const config = JSON.parse(content)
	const collection = config.collections.find((el) => el.name === options.collection)
	const collectioneHasBody = checkForBody(collection)

	let items = []

	const allFiles = this.fs.readdirSync(collection.folder)
	for (let fileName of allFiles) {
		let fileContent = this.fs.readFileSync(path.resolve(__dirname, collection.folder, fileName), { encoding: 'utf8' }) //FIXME: encoding not working??
		fileContent = fileContent.toString()
		let fmContent = fm(fileContent)
		let cmsEntry = fmContent.attributes

		if (fmContent.body.length < (options.bodyLimit || 128)) {
			cmsEntry.body = fmContent.body
		}

		cmsEntry.filename = fileName
		cmsEntry.hasBody = collectioneHasBody
		let fileStats = this.fs.statSync(path.resolve(__dirname, collection.folder, fileName))
		cmsEntry.birthtimeMs = fileStats.birthtimeMs
		items.push(cmsEntry)
	}

	console.log("======================")
	console.timeEnd("Netlify-CMS Loader")
	console.log("======================")

	return `module.exports = ${JSON.stringify(items)}`
}

module.exports = loaderFnc