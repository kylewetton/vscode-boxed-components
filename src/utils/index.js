const fs = require('fs');
const path = require('path');
const shell = require('shelljs');


const regexParse = (text, name) => {
	var std = text.replace(/__box__/g, name)
	var up = std.replace(/_u_box_u_/g, name.toUpperCase())
	var res = up.replace(/_l_box_l_/g, name.toLowerCase());
	return res;
}

const findReplace = (file, componentName) => {
	fs.readFile(file, 'utf-8', (err, data) => {
		
		var result = regexParse(data, componentName);
		console.log(!data || !result ? `Failed: ${componentName} ${file}` : `Success: ${componentName} ${file}`);
		fs.writeFile(file, result, () => {
			const newPath = regexParse(file, componentName);
			fs.renameSync(file, newPath);
		});	
	});
}

const copy = function(src, dest, name) {
	fs.copyFile(src, dest, (err) => {
		if (err) throw err;
		findReplace(dest, name);
	});
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
				copy(path.join(src, files[i]), path.join(dest, files[i]), name);
			}
		}
		res('Resolved copy successfully...');
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