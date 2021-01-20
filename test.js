/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/md5
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Md5 = require('./index.js')
const Path = require('path')

console.error('aaa' + "\n  ➜ " + Md5('aaa'))
console.error('我我我我你他' + "\n  ➜ " + Md5('我我我我你他'))
console.error(__dirname + Path.sep + 'index.js' + "\n  ➜ " + Md5.file(__dirname + Path.sep + 'index.js'))

