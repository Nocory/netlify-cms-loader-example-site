const yaml = require('js-yaml')
const path = require('path')
const fm = require('front-matter')
const matter = require('gray-matter')
const marked = require("marked")
//const md = require('markdown-it')()
const loaderUtils = require("loader-utils")

const parseFile = (content) => {
	const firstLine = content.substr(0, content.indexOf('\n')).trim()
	
	switch (firstLine) {
		case '---':
			return matter(content)
		case '{':
			const parsedContent = JSON.parse(content)
			console.log(parsedContent)
			const result = Object.entries(parsedContent).reduce((acc,val) => {
				if(val[0] != "body") acc.data[val[0]] = val[1]
				return acc
			},{
				data: {},
				content: parsedContent.body
			})
			return result
		default:
			throw new Error('netlify-cms-loader: Unrecognized format, when attempting to parse file')
	}
}

let isMediaCopied = false

function loaderFnc (source) {
	const cmsConfig = yaml.safeLoad(source)

	console.log(cmsConfig)

	if (!isMediaCopied) {
		console.time("netlify-cms-loader: copied media files")
		const filesInCollection = this.fs.readdirSync(cmsConfig.media_folder)
		for (let fileName of filesInCollection) {
			let fileContent = this.fs.readFileSync(path.resolve(cmsConfig.media_folder, fileName))
			this.emitFile(path.join(cmsConfig.public_folder, fileName), fileContent)
		}
		isMediaCopied = true
		console.timeEnd("netlify-cms-loader: copied media files")
	}

	const getCMSFiles = (options = {
		collection: "",
		bodyLimit: 256,
		emitSource: false,
		emitJSON: true,
		parseBody: true,
		sortBy: "",
		reverse: false,
		outputDirectory: "cms"
	}) => {
		// Check collection is valid, otherwise exit with error //TODO: improve (see error message)
		const collection = cmsConfig.collections.find((el) => el.name === options.collection)
		if (!collection) {
			throw new Error(`netlify-cms-loader: collection '${options.collection}' not found. Available collections are [${cmsConfig.collections.map(x => x.name)}]`)
		}
		//this.addContextDependency(collection.folder)

		console.time(`netlify-cms-loader: finished loading collection '${options.collection}'`)

		const result = []
		//console.log("netlify-cms-loader source:",source)
		let filesInCollection = []
		if(collection.folder){
			filesInCollection = this.fs.readdirSync(collection.folder).map(x => ({
				srcPath: path.resolve(collection.folder,x),
				srcExt: path.extname(x),
				name: path.basename(x,path.extname(x))
			}))
		}
		if(collection.files){
			filesInCollection = collection.files.map(x => ({
				srcPath: path.resolve(x.file),
				srcExt: path.extname(x.file),
				name: x.name
			}))
		} 
		console.log("netlify-cms-loader filesInCollection:",filesInCollection)
		for (const fileInfo of filesInCollection) {
			let fileContent = this.fs.readFileSync(fileInfo.srcPath, {
				encoding: 'utf8'
			}) //FIXME: encoding not working?? Have to convert to string
			fileContent = fileContent.toString()
			let matterFile = parseFile(fileContent)
			console.log(fileInfo.srcPath,matterFile)
			let cmsEntry = matterFile.data

			if(typeof matterFile.content === "string" && matterFile.content.trim().length){
				cmsEntry.hasBody = true
				if (matterFile.content.length < options.bodyLimit) {
					cmsEntry.body = options.parseBody ? marked(matterFile.content) : matterFile.content
				}
			}else{
				cmsEntry.hasBody = false
			}
			
			if (options.emitSource) {
				cmsEntry.filePath = path.join(options.outputDirectory,collection.name,fileInfo.name + fileInfo.srcExt)
				this.emitFile(cmsEntry.filePath, fileContent)
			}
			if(options.emitJSON){
				cmsEntry.filePath = path.join(options.outputDirectory,collection.name,fileInfo.name + ".json")
				const jsonOut = Object.assign({},cmsEntry)
				if(jsonOut.hasBody && !jsonOut.body) jsonOut.body = options.parseBody ? marked(matterFile.content) : matterFile.content
				this.emitFile(cmsEntry.filePath, JSON.stringify(jsonOut, null, "\t"))
			}

			result.push(cmsEntry)
		}

		if (result.length >= 2 &&
			options.sortBy &&
			result[0][options.sortBy]) {
			//console.log("SORTING")
			let isNumber = Date.parse(result[0][options.sortBy]) || Number(result[0][options.sortBy])
			//console.log("isNumber", isNumber)
			if (isNumber) {
				//console.log("sorting by num")
				result.sort((a, b) => a[options.sortBy] - b[options.sortBy])
			} else {
				//console.log("sorting by str")
				result.sort((a, b) => {
					let nameA = a[options.sortBy].toUpperCase()
					let nameB = b[options.sortBy].toUpperCase()
					if (nameA < nameB) return -1
					if (nameA > nameB) return 1
					return 0
				})
			}
		}

		if (options.reverse) result.reverse()

		console.timeEnd(`netlify-cms-loader: finished loading collection '${options.collection}'`)

		return `module.exports = ${JSON.stringify(result)}`
	}

	return getCMSFiles
}

module.exports = loaderFnc

/*
const loaderFnc = function(source) {
	this.cacheable()

	const cmsConfig = yaml.safeLoad(source)

	// Merging default and user specified options
	const options = {
		collection: "",
		bodyLimit: 256,
		emitSource: false,
		emitJSON: true,
		parseBody: true,
		sortBy: "",
		reverse: false,
		outputDirectory: "cms"
	}
	Object.assign(options, loaderUtils.getOptions(this))

	// Copy upload/file assets only ONCE to the build directory
	if (!isMediaCopied) {
		console.time("netlify-cms-loader: copied media files")
		const filesInCollection = this.fs.readdirSync(cmsConfig.media_folder)
		for (let fileName of filesInCollection) {
			let fileContent = this.fs.readFileSync(path.resolve(cmsConfig.media_folder, fileName))
			this.emitFile(path.join(cmsConfig.public_folder, fileName), fileContent)
		}
		isMediaCopied = true
		console.timeEnd("netlify-cms-loader: copied media files")
	}

	// Check collection is valid, otherwise exit with error //TODO: improve (see error message)
	const collection = cmsConfig.collections.find((el) => el.name === options.collection)
	if (!collection) {
		throw new Error(`netlify-cms-loader: collection '${options.collection}' not found. Available collections are [${cmsConfig.collections.map(x => x.name)}]`)
	}
	//this.addContextDependency(collection.folder)

	console.time(`netlify-cms-loader: finished loading collection '${options.collection}'`)

	const result = []
	//console.log("netlify-cms-loader source:",source)
	let filesInCollection = []
	if(collection.folder){
		filesInCollection = this.fs.readdirSync(collection.folder).map(x => ({
			srcPath: path.resolve(collection.folder,x),
			srcExt: path.extname(x),
			name: path.basename(x,path.extname(x))
		}))
	}
	if(collection.files){
		filesInCollection = collection.files.map(x => ({
			srcPath: path.resolve(x.file),
			srcExt: path.extname(x.file),
			name: x.name
		}))
	} 
	console.log("netlify-cms-loader filesInCollection:",filesInCollection)
	for (const fileInfo of filesInCollection) {
		let fileContent = this.fs.readFileSync(fileInfo.srcPath, {
			encoding: 'utf8'
		}) //FIXME: encoding not working?? Have to convert to string
		fileContent = fileContent.toString()
		let matterFile = parseFile(fileContent)
		console.log(fileInfo.srcPath,matterFile)
		let cmsEntry = matterFile.data

		if(typeof matterFile.content === "string" && matterFile.content.trim().length){
			cmsEntry.hasBody = true
			if (matterFile.content.length < options.bodyLimit) {
				cmsEntry.body = options.parseBody ? marked(matterFile.content) : matterFile.content
			}
		}else{
			cmsEntry.hasBody = false
		}
		
		if (options.emitSource) {
			cmsEntry.filePath = path.join(options.outputDirectory,collection.name,fileInfo.name + fileInfo.srcExt)
			this.emitFile(cmsEntry.filePath, fileContent)
		}
		if(options.emitJSON){
			cmsEntry.filePath = path.join(options.outputDirectory,collection.name,fileInfo.name + ".json")
			const jsonOut = Object.assign({},cmsEntry)
			if(jsonOut.hasBody && !jsonOut.body) jsonOut.body = options.parseBody ? marked(matterFile.content) : matterFile.content
			this.emitFile(cmsEntry.filePath, JSON.stringify(jsonOut, null, "\t"))
		}

		result.push(cmsEntry)
	}

	if (result.length >= 2 &&
		options.sortBy &&
		result[0][options.sortBy]) {
		//console.log("SORTING")
		let isNumber = Date.parse(result[0][options.sortBy]) || Number(result[0][options.sortBy])
		//console.log("isNumber", isNumber)
		if (isNumber) {
			//console.log("sorting by num")
			result.sort((a, b) => a[options.sortBy] - b[options.sortBy])
		} else {
			//console.log("sorting by str")
			result.sort((a, b) => {
				let nameA = a[options.sortBy].toUpperCase()
				let nameB = b[options.sortBy].toUpperCase()
				if (nameA < nameB) return -1
				if (nameA > nameB) return 1
				return 0
			})
		}
	}

	if (options.reverse) result.reverse()

	console.timeEnd(`netlify-cms-loader: finished loading collection '${options.collection}'`)

	return `module.exports = ${JSON.stringify(result)}`
}

module.exports = loaderFnc
*/