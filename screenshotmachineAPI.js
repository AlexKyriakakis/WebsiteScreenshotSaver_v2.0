var screenshotmachine = require('screenshotmachine');
var websiteData = require("./jsonReader.js");

var customerKey = '2bf702';	
	secretPhrase = ''; //leave secret phrase empty, if not needed
	options = {
	// all next parameters are optional, see our website screenshot API guide for more details
	dimension : '1920x1080',
	device : 'desktop',
	format: 'jpg',
	cacheLimit: '0'
}

var savePhotos = function savePhotos(uploadItem){
	
	websiteData.data.forEach((item) => {
		options.url= item.url;
		var apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);
		//save screenshot as an image
		var fs = require('fs');
		var output = 'screenshots/'+item.id+'_'+item.name+'.jpg';
		screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(output).on('close', function() {
			uploadItem(item);
			console.log(item.name+' Saved.');
		}));
		
	});
	
};

module.exports.savePhotos = savePhotos;


