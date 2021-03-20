const gulp = require('gulp');
const logger = require('gulp-logger');
/**需要package的version 版本号、description 版本描述 **/
const pkg = require('../../package.json');
const chalk = require('chalk'); // 改变屏幕文字颜色

const log = content => console.log(chalk.green(content));

const { deleteFolder, runTask, runCmd } = require("./util");


const config = {
    baseDir: `../../../${pkg.name}-npm`
};
//cwd
module.exports = async function () {
    gulp.task('clean', async (cb) => {
        log(`清除${config.baseDir}开始`)
        await deleteFolder(config.baseDir);
        setTimeout(() => {
            log(`清除${config.baseDir}完成`)
            cb();
        }, 2000)
    });
    gulp.task('del-dist', async (cb) => {
        log(`删除 ${config.baseDir}/dist 开始`)
        await deleteFolder(`${config.baseDir}/dist`);
        log(`删除 ${config.baseDir}/dist 结束`)
        cb();
    });
    gulp.task('copy-info', () => {
        log(`拷贝 '../../**' 开始`)
        return gulp.src(['../../package.json','../../README.md'])
            .pipe(logger({
                before: 'copy package.json...',
                after: 'copy package.json complete!',
                showChange: false
            }))
            .pipe(gulp.dest(`${config.baseDir}/`));
    });

    gulp.task('copy-dist', () => {
        log(`拷贝 '../../dist/**' 开始`)
        return gulp.src(['../../dist/**'])
            .pipe(logger({
                before: 'copy dist...',
                after: 'copy dist complete!',
                showChange: false
            }))
            .pipe(gulp.dest(`${config.baseDir}/dist`));
    });
    gulp.task('copy-lib', () => {
        return gulp.src('../../lib/**')
            .pipe(logger({
                before: 'copy lib...',
                after: 'copy lib complete!',
                showChange: false
            }))
            .pipe(gulp.dest(`${config.baseDir}/lib`));
    });

    gulp.task('publish', function (cb) {
        log('git publish--');
        runCmd(`cd ${config.baseDir} & npm publish`, cb);
    });

    gulp.task(
        'publish',
        gulp.series('clean', 'del-dist','copy-info', 'copy-dist', 'copy-lib','publish')
    );

    runTask('publish')
};
