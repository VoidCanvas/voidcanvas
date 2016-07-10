let readlineSync = require('readline-sync');
let Download = require('download');
let ini = require('ini');
let logger = require('../logger');
let fs = require('fs');
let shell = require('shelljs');

const allowedFiles = [
	".git",
	"readme.md",
	".",
	".."
]

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
    	var curPath = path + "/" + file;
    	if(fs.lstatSync(curPath).isDirectory()) { // recurse
      		deleteFolderRecursive(curPath);
      	} else { // delete file
        	fs.unlinkSync(curPath);
      	}
    });
    fs.rmdirSync(path);
  }
};

module.exports = class {
	makePathClear(path){
		let isGoodToGo = true;
		
		let files = fs.readdirSync(path);
		if(files && files.length){
			files.forEach((filePath) => {
				if(allowedFiles.indexOf(filePath.toLowerCase())===-1){
					isGoodToGo=false;
				}
			});
			if(!isGoodToGo){
				let shouldCleanAndContinue = this.askToClean();
				if(shouldCleanAndContinue){
					isGoodToGo = this.clean(files);
				}
			}
		}

		return isGoodToGo;
	}

		//if files already exist in the base path, ask to remove
	askToClean(question){
		return this.ask("Do you want to clean the directory and continue?", "There are files in this directory. Void Canvas needs a clean directory to scaffold.");
	}

	ask(question, description){
		if(description)
			logger.log(description);

		let answer = readlineSync.question(question+' (yes/no) :');
		if(answer && answer.toLowerCase()==="yes")
			return true;
		else
			return false;
	}

	//cleaning
	clean(files){
		let isGoodToGo = true;
		try{
			files.forEach(function (filePath) {
				if(allowedFiles.indexOf(filePath)===-1){
					if(fs.lstatSync(filePath).isDirectory()){
						deleteFolderRecursive(filePath);
					}
					else{
						fs.unlinkSync(filePath);
					}
				}
			});
		} catch (e){
			isGoodToGo = false;
		}
		return isGoodToGo;
	}
	downloadAndScaffold(source, destination){
		logger.log("It's downloading the base repo; wait for a minute...");
		new Download({mode: '755', extract:true, strip: 1})
	    .get(source)
	    .dest(destination)
	    .run(this.afterRepoDownload.bind(this));

	}
	afterRepoDownload(err, files){
		if(err)
			logger.error("Something went wrong. Couldn't download repo!");
		else{
			logger.success("Repo downloading done!!");
			let pckgJSON = this.getPackageJSON();
			let defaultValues = this.getDefaults();
			let inputValues = {};

			//let's ask questions
			let defaultDisplayProject = defaultValues.project ? `(${defaultValues.project})` : "";
			inputValues.project = readlineSync.question(`project name ${defaultDisplayProject} : `) || defaultValues.project;

			let defaultDisplayDescription = defaultValues.description ? `(${defaultValues.description})` : "";
			inputValues.description = readlineSync.question(`project description ${defaultDisplayDescription} : `) || defaultValues.description;

			let defaultDisplayUserName = defaultValues.username ? `(${defaultValues.username})` : "";
			inputValues.username = readlineSync.question(`author name ${defaultDisplayUserName} : `) || defaultValues.username;

			let defaultDisplayEmail = defaultValues.email ? `(${defaultValues.email})` : "";
			inputValues.email = readlineSync.question(`author email ${defaultDisplayEmail} : `) || defaultValues.email;

			let defaultDisplayRepo = defaultValues.repo ? `(${defaultValues.repo})` : "";
			inputValues.repo = readlineSync.question(`repo url ${defaultDisplayRepo} : `) || defaultValues.repo;

			let defaultDisplayHomePage = defaultValues.homepage ? `(${defaultValues.homepage})` : "";
			inputValues.homepage = readlineSync.question(`homepage url ${defaultDisplayHomePage} : `) || defaultValues.homepage;

			let defaultDisplayLicense = defaultValues.license ? `(${defaultValues.license})` : "";
			inputValues.license = readlineSync.question(`license ${defaultDisplayLicense} : `) || defaultValues.license;


			//modifying package.json
			pckgJSON.name = inputValues.project;
			pckgJSON.description = inputValues.description;
			pckgJSON.repository.url="git+"+inputValues.repo;
			pckgJSON.author = `${inputValues.username} <${inputValues.email}>`;
			pckgJSON.license = inputValues.license;
			pckgJSON.homepage = inputValues.homepage;
			pckgJSON.bugs.url = inputValues.issues;

			let currentPath = shell.pwd();
			let packageJsonPath = currentPath+"/package.json";

			fs.writeFileSync(packageJsonPath, JSON.stringify(pckgJSON, null, 4));
			logger.log("It's scaffolding; wait for a moment...");
			shell.exec("npm install");
			logger.success("Project setup is done! \nYou can do modifications in the config files present inside ./configs folder and run the project with the command 'vc run'. \nFor more info/tutorial please visit http://voidcanvas.com/cli ");
		}
	}

	getPackageJSON(){
		let currentPath = shell.pwd();
		let packageJsonPath = currentPath+"/package.json";
		let pckg = require(packageJsonPath);
		return pckg;
	}

	getDefaults(){
		var defaultValues={}
		let currentPath = shell.pwd();
		let currentFolder = currentPath.split('/')[currentPath.split('/').length-1];
		let gitConfig = {};
		try{
			if(fs.existsSync(currentPath+"/.git") && fs.lstatSync(currentPath+"/.git").isDirectory()){
				var config = ini.parse(fs.readFileSync(currentPath+'/.git/config', 'utf-8'));
				gitConfig={
					"username": config.user && config.user.name,
					"email": config.user && config.user.email,
					"repo": config['remote "origin"'] && config['remote "origin"'].url
				}
			}
		}
		catch(e){
			logger.error("Following error occured!")
			logger.error(e);
		}

		gitConfig.project = currentFolder;
		gitConfig.username = gitConfig.username || "";
		gitConfig.email = gitConfig.email || "";
		gitConfig.repo = gitConfig.repo || "";
		gitConfig.description = "";
		gitConfig.license = "ISC";
		if(gitConfig.repo){
			gitConfig.homepage = gitConfig.repo.replace(".git","")+"#readme";
			gitConfig.issues = gitConfig.repo.replace(".git","")+"/issues";
		}

		return gitConfig;
	}

}