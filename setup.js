
const fs = require("fs");
const {execSync} = require("child_process"); 
require("dotenv").config();
var testenv =
`TOKEN=test
CAPTCHASECRET=6LeIewsgAAAAABWjEVCnFPR7POHFJbzZJM_OqKdQ
CAPTCHASITE=6LeIewsgAAAAAPp9VS21fBk7VWQX3wps40gWrUWH

USEFISHYSSL=false
DATABASE_URL=postgres://fishymine:P7oU3-qbHjgPTFnZRat7kw@free-tier14.aws-us-east-1.cockroachlabs.cloud:26257/bilked-blob-1224.defaultdb
PRODUCTION=false`;

var defaultconfig = `{
  "CAPTCHASITE": "6LeIewsgAAAAAPp9VS21fBk7VWQX3wps40gWrUWH",
  "localServer": true
}`;

//check if config.json exists
if (!fs.existsSync("./config.json")) {
	console.log("Generating config.json");
	fs.writeFileSync("./config.json", "{}");
}
var theConfig = require("./config.json");


if(!theConfig.hasOwnProperty("localServer")) {
	console.log("Generating config.json");
	fs.writeFileSync("./config.json", defaultconfig);
	theConfig = require("./config.json");
	execSync("npm run build");
}
if(!process.env.hasOwnProperty("TOKEN")) {
	console.log("👀 First run? No worries, we're setting you up.");
	fs.writeFileSync(".env", testenv);
	fs.writeFileSync("config.json", defaultconfig);
	console.log("Building latest code... ");
	theConfig = require("./config.json");
	//run npm run build
	execSync("npm run build");
	console.log("✅ Done!");

//	process.exit(1);
}

if(process.env.PRODUCTION == "true") {
	console.log("🚀 Using production setup...\n");
	if(process.env.CAPTCHASITE) {
		theConfig.CAPTCHASITE = process.env.CAPTCHASITE;
	}
	theConfig.localServer = false;
	fs.writeFileSync("config.json", JSON.stringify(theConfig));
	console.log("Note: We've updated the config.json file to reflect this.\n");
	console.log("If you're running this during development, the game won't work\n");
	console.log("🔥 Creating a production build...");
	execSync("npm run build");
	console.log("✅ Done!\n");

}