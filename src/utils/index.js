const fs = require('fs');
const path = require('path');
const shell = require('shelljs');


const findReplace = (file, componentName) => {
    const newPath = file.replace(/__box__/g, componentName);
    fs.renameSync(file, newPath);
    fs.readFile(newPath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/__box__/g, componentName);

        fs.writeFile(newPath, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

const copy = function(src, dest) {
	var oldFile = fs.createReadStream(src);
	var newFile = fs.createWriteStream(dest);
	oldFile.pipe(newFile);
};

const copyDir = function(src, dest, name) {
    shell.mkdir('-p', dest);
	var files = fs.readdirSync(src);
	for(var i = 0; i < files.length; i++) {
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
    rename(dest, name);
};

const rename = function(src, name) {
	var files = fs.readdirSync(src);
	for(var i = 0; i < files.length; i++) {
		var current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			rename(path.join(src, files[i]), name);
		}
        // else if(current.isSymbolicLink()) {
		// 	var symlink = fs.readlinkSync(path.join(src, files[i]));
		// 	fs.symlinkSync(symlink, path.join(dest, files[i]));
		// }
        else {
			findReplace(path.join(src, files[i]), name);
		}
	}
};

module.exports = {
    copyDir
}