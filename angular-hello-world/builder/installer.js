const path = require('path');
const json = require(path.resolve('./package.json'));
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const fs = require('fs');

// See available platform and arch here :
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

const linuxConfig = {
    src: "./linux_packager/" + json.name + "-" + spec['platform']['linux'] + "-" + spec['arch']['64'] + "/",
    arch: "amd64",
    dest: "linux_installer",
    categories: [
        "Utility"
    ],
    lintianOverrides: [
        "changelog-file-missing-in-native-package"
    ]
};

switch (process.env.NODE_OS) {
    case "mac":
        if (fs.existsSync('./mac_installer')) {
            console.log('Removing existing ./mac_installer...');
            execSync("rm -rf mac_installer", { maxBuffer: 1024 * 2048 });
            console.log('Successfully removed ./mac_installer/');
        }
        console.log('Creating mac installer...');
        exec("mkdir mac_installer && electron-installer-dmg ./mac_packager/" + json.name + "-" + spec['platform']['mac'] + "-" + spec['arch']['64'] + "/" + json.name + ".app " + json.name + " --out=mac_installer --overwrite && rm -rf mac_packager", (error) => {
            if (!error) {
                console.log('Removing mac_packager...');
                console.log('Successfully created installer at ./mac_installer/');
            } else {
                console.log('Error : ' + error);
            }
        });
        break;
    case "linux":
        const linuxInstaller = require('electron-installer-debian');

        if (fs.existsSync('./linux_installer')) {
            console.log('Removing existing ./linux_installer...');
            execSync("rm -rf linux_installer", { maxBuffer: 1024 * 2048 });
            console.log('Successfully removed ./linux_installer/');
        }

        console.log('Creating linux installer...');

        linuxInstaller(linuxConfig, (error) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }

            console.log('Removing linux_packager...');
            console.log('Successfully created installer at ' + linuxConfig.dest);
        });
        break;
    case "win":
        const electronInstaller = require('electron-winstaller');

        let settings = {
            appDirectory: path.join(path.join((path.join('./'), 'win_packager'), json.name + "-" + spec['platform']['win'] + "-" + spec['arch']['64'] + '/')),
            outputDirectory: path.join(path.join('./'), 'win_installer'),
            authors: '',
            exe: json.name + '.exe',
            name: json.name.replace(/-/g, "_")
        };

        if (fs.existsSync('./win_installer')) {
            console.log('Removing existing ./win_installer...');
            execSync("del /s /q win_installer && rmdir /s /q win_installer", { maxBuffer: 1024 * 2048 });
            console.log('Successfully removed ./win_installer/');
        }

        console.log('Creating windows installer...');

        resultPromise = electronInstaller.createWindowsInstaller(settings);

        resultPromise.then(() => {
            console.log('Removing win_packager...');
            exec("del /s /q win_packager && rmdir /s /q win_packager", { maxBuffer: 1024 * 2048 }, (error) => {
                if (!error) {
                    console.log("Successfully created installer at ./win_installer/");
                } else {
                    console.log('Error : ' + error);
                }
            });
        }, (e) => {
            console.log('Error : ' + e.message);
        });
        break;
    default:
        throw new Error("NODE_OS undefined");
}