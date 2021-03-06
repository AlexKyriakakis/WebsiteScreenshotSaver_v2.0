const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var websiteData = require("./jsonReader.js");

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

var drive;

// Load client secrets from a local file.
var setup = function setup(){
	fs.readFile('credentials.json', (err, content) => {
	if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Drive API.
		authorize(JSON.parse(content));
	});
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
	drive = google.drive({version: 'v3', auth: oAuth2Client});
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
	approval_prompt: 'force',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
	  drive = google.drive({version: 'v3', auth: oAuth2Client});
    });
  });
}

function uploadItem(item){
	
	var folderId = '1veQ-H0WiTSfqStnguB7fGPk6mS7RVX4N';
		var fileMetadata = {
			'name': item.id+'_'+item.name+'.jpg',
			parents: [folderId]
		};
		var media = {
			mimeType: 'image/jpeg',
			body: fs.createReadStream('screenshots/'+item.id+'_'+item.name+'.jpg')
		};
		drive.files.create({
			resource: fileMetadata,
			media: media,
			fields: 'id'
		}, function (err, file) {
			if (err) {
			// Handle error
				console.error(err);
			} else {
				console.log(item.name+ ' Uploaded.');
			}
		});
	
}

module.exports.setup = setup;
module.exports.uploadItem = uploadItem;
