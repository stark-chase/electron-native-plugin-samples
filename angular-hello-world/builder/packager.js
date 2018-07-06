const path = require('path');
const json = require(path.resolve('./package.json'));
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const fs = require('fs');

// See available platforms and archs here :
// https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
const spec = {
	'platform': {
		'win': 'win32',
		'mac': 'darwin',
		'linux': 'linux'
	},
	'arch': {
		'32': 'ia32',
		'64': 'x64',
		'7l': 'armv7l',
		'arm': 'arm64'
	}
};

switch (process.env.NODE_OS) {
	case "mac":
		if (fs.existsSync('./mac_packager')) {
			console.log('Removing existing ./mac_packager...');
			execSync("rm -rf mac_packager", { maxBuffer: 1024 * 2048 });
			console.log('Successfully removed ./mac_packager/');
		}
		console.log('Creating mac packager...');
		exec("cross-env NODE_ENV=prod webpack && electron-packager dist --overwrite --platform=" + spec['platform']['mac'] + " --arch=" + spec['arch']['64'] + " --prune --asar --out=mac_packager --icon=builder/icons/mac/icon.icns", (error) => {
			if (!error) {
				console.log('Successfully created packager at ./mac_packager/');
			} else {
				console.log('Error : ' + error);
			}
		});
		break;
	case "linux":
		if (fs.existsSync('./linux_packager')) {
			console.log('Removing existing ./linux_packager...');
			execSync("rm -rf linux_packager", { maxBuffer: 1024 * 2048 });
			console.log('Successfully removed ./linux_packager/');
		}
		console.log('Creating linux packager...');
		exec("cross-env NODE_ENV=prod webpack && electron-packager dist --overwrite --platform=" + spec['platform']['linux'] + " --arch=" + spec['arch']['64'] + " --prune --asar --out=linux_packager --icon=builder/icons/linux/icon.png", (error) => {
			if (!error) {
				console.log('Successfully created packager at ./linux_packager/');
			} else {
				console.log('Error : ' + error);
			}
		});
		break;
	case "win":
		if (fs.existsSync('./win_packager')) {
			console.log('Removing existing ./win_packager...');
			execSync("del /s /q win_packager && rmdir /s /q win_packager", { maxBuffer: 1024 * 2048 });
			console.log('Successfully removed ./win_packager/');
		}
		console.log('Creating windows packager...');
		exec("cross-env NODE_ENV=prod webpack && electron-packager dist --overwrite --platform=" + spec['platform']['win'] + " --arch=" + spec['arch']['64'] + " --prune --asar --out=win_packager --icon=builder/icons/win/icon.ico", (error) => {
			if (!error) {
				console.log('Successfully created packager at ./win_packager/');
			} else {
				console.log('Error : ' + error);
			}
		});
		break;
	default:
		throw new Error("NODE_OS undefined");
}