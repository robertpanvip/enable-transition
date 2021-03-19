const del = require('del');
const gulp = require('gulp');
const { spawn } = require("child_process");
function runTask(toRun) {
    const metadata = { task: toRun };
    const taskInstance = gulp.task(toRun);
    if (taskInstance === undefined) {
        console.log('task_not_found', metadata);
    }
    try {
        taskInstance.apply(gulp);
        gulp.emit('stop');
    } catch (err) {
        err.task = metadata.task;
        console.log('task_err', err);
    }
}

function runCmd(cmd,resolve,reject) {

    const proc = spawn(cmd, [], {
        shell: true,
    });

    proc.stdout.pipe(process.stdout) //正常流
    proc.stderr.pipe(process.stderr) //异常流

    proc.on("exit", (code) => {
        if (code === 0) {
            console.log('exit')
            resolve&&resolve();
        } else {
            reject&&reject();
        }
    });
}

async function deleteFolder(url) {
    await del([`${url}/**/*`],{force:true, dot: true,gitignore:false});
}

async function deleteFile(url) {
    await del([url],{force:true, dot: true,gitignore:false});
}

module.exports={
    runTask,
    deleteFolder,
    deleteFile,
    runCmd,
};
