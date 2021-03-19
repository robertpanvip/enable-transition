import 'core-js/es/array';
import 'core-js/es/promise';
//摆脱当缺少浏览器polyfills的警告
global.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0);
}
