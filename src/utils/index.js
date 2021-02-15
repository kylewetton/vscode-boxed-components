const fs = require('fs');
const path = require('path');
const shell = require('shelljs');


const findReplace = (file, componentName) => {
    const newPath = /__box__/g.test(file) ? file.replace(/__box__/g, componentName) : file;
	
	if (file !== newPath)
		fs.renameSync(file, newPath);

	fs.readFile(newPath, 'utf8', (err, data) => {
		var result = data.replace(/__box__/g, componentName);
		fs.rename(file, newPath, () => {
			fs.writeFileSync(newPath, result, 'utf8');
		});
	});
}

const copy = function(src, dest) {
	var oldFile = fs.createReadStream(src);
	var newFile = fs.createWriteStream(dest);
	oldFile.pipe(newFile);
};

const copyDir = function(src, dest, name) {
	return new Promise((res, rej) => {
		shell.mkdir('-p', dest);
		var files = fs.readdirSync(src);
			for (var i = 0; i < files.length; i++) {
			var current = fs.lstatSync(path.join(src, files[i]));
			if(current.isDirectory()) {
				copyDir(path.join(src, files[i]), path.join(dest, files[i]), name);
			}
        	else if(current.isSymbolicLink()) {
				var symlink = fs.readlinkSync(path.join(src, files[i]));
				fs.symlinkSync(symlink, path.join(dest, files[i]));
			}
        	else {
				copy(path.join(src, files[i]), path.join(dest, files[i]));
			}
		}
		res(true);
	});
};

const rename = function(src, name) {
	var files = fs.readdirSync(src);
	for(var i = 0; i < files.length; i++) {
		var current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			rename(path.join(src, files[i]), name);
		}
        else {
			findReplace(path.join(src, files[i]), name);
		}
	}
};

module.exports = {
    copyDir,
	rename
}