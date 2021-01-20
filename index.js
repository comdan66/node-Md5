/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/md5
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const FileSystem = require('fs')

const endian = n => {
  const rotl = (n, b) => (n << b) | (n >>> (32 - b))
  
  if (n.constructor == Number)
    return rotl(n, 8) & 0x00FF00FF | rotl(n, 24) & 0xFF00FF00

  for (let i = 0; i < n.length; i++)
    n[i] = endian(n[i])
  return n
}
const bytes2Words = bytes => {
  const words = []
  for (let i = 0, b = 0; i < bytes.length; i++, b += 8)
    words[b >>> 5] |= bytes[i] << (24 - b % 32)
  return words
}
const words2Bytes = words => {
  const bytes = []
  for (let b = 0; b < words.length * 32; b += 8)
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF)
  return bytes
}
const bytes2Hex = bytes => {
  const hex = []
  for (let i = 0; i < bytes.length; i++)
    hex.push((bytes[i] >>> 4).toString(16), (bytes[i] & 0xF).toString(16))
  return hex.join('')
}

const ff  = (a, b, c, d, x, s, t) => (a = a + (b & c | ~b & d) + (x >>> 0) + t, ((a << s) | (a >>> (32 - s))) + b)
const gg  = (a, b, c, d, x, s, t) => (a = a + (b & d | c & ~d) + (x >>> 0) + t, ((a << s) | (a >>> (32 - s))) + b)
const hh  = (a, b, c, d, x, s, t) => (a = a + (b ^ c ^ d) + (x >>> 0) + t, ((a << s) | (a >>> (32 - s))) + b)
const ii  = (a, b, c, d, x, s, t) => (a = a + (c ^ (b | ~d)) + (x >>> 0) + t, ((a << s) | (a >>> (32 - s))) + b)

const Md5 = function(text) {
  return bytes2Hex(words2Bytes(((message) => {
    
    message = unescape(encodeURIComponent(message)).split('').map(char => char.charCodeAt(0) & 0xFF)


    let m = bytes2Words(message), l = message.length * 8, a =  1732584193, b = -271733879, c = -1732584194, d =  271733878

    for (let i = 0; i < m.length; i++)
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF | ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00

    m[l >>> 5] |= 0x80 << (l % 32)
    m[(((l + 64) >>> 9) << 4) + 14] = l

    for (let i = 0; i < m.length; i += 16) {
      let aa = a, bb = b, cc = c, dd = d
      a = ff(a, b, c, d, m[i+ 0],  7, -680876936), d = ff(d, a, b, c, m[i+ 1], 12, -389564586), c = ff(c, d, a, b, m[i+ 2], 17,  606105819), b = ff(b, c, d, a, m[i+ 3], 22, -1044525330), a = ff(a, b, c, d, m[i+ 4],  7, -176418897), d = ff(d, a, b, c, m[i+ 5], 12,  1200080426), c = ff(c, d, a, b, m[i+ 6], 17, -1473231341), b = ff(b, c, d, a, m[i+ 7], 22, -45705983), a = ff(a, b, c, d, m[i+ 8],  7,  1770035416), d = ff(d, a, b, c, m[i+ 9], 12, -1958414417), c = ff(c, d, a, b, m[i+10], 17, -42063), b = ff(b, c, d, a, m[i+11], 22, -1990404162), a = ff(a, b, c, d, m[i+12],  7,  1804603682), d = ff(d, a, b, c, m[i+13], 12, -40341101), c = ff(c, d, a, b, m[i+14], 17, -1502002290), b = ff(b, c, d, a, m[i+15], 22,  1236535329)
      a = gg(a, b, c, d, m[i+ 1],  5, -165796510), d = gg(d, a, b, c, m[i+ 6],  9, -1069501632), c = gg(c, d, a, b, m[i+11], 14,  643717713), b = gg(b, c, d, a, m[i+ 0], 20, -373897302), a = gg(a, b, c, d, m[i+ 5],  5, -701558691), d = gg(d, a, b, c, m[i+10],  9,  38016083), c = gg(c, d, a, b, m[i+15], 14, -660478335), b = gg(b, c, d, a, m[i+ 4], 20, -405537848), a = gg(a, b, c, d, m[i+ 9],  5,  568446438), d = gg(d, a, b, c, m[i+14],  9, -1019803690), c = gg(c, d, a, b, m[i+ 3], 14, -187363961), b = gg(b, c, d, a, m[i+ 8], 20,  1163531501), a = gg(a, b, c, d, m[i+13],  5, -1444681467), d = gg(d, a, b, c, m[i+ 2],  9, -51403784), c = gg(c, d, a, b, m[i+ 7], 14,  1735328473), b = gg(b, c, d, a, m[i+12], 20, -1926607734)
      a = hh(a, b, c, d, m[i+ 5],  4, -378558), d = hh(d, a, b, c, m[i+ 8], 11, -2022574463), c = hh(c, d, a, b, m[i+11], 16,  1839030562), b = hh(b, c, d, a, m[i+14], 23, -35309556), a = hh(a, b, c, d, m[i+ 1],  4, -1530992060), d = hh(d, a, b, c, m[i+ 4], 11,  1272893353), c = hh(c, d, a, b, m[i+ 7], 16, -155497632), b = hh(b, c, d, a, m[i+10], 23, -1094730640), a = hh(a, b, c, d, m[i+13],  4,  681279174), d = hh(d, a, b, c, m[i+ 0], 11, -358537222), c = hh(c, d, a, b, m[i+ 3], 16, -722521979), b = hh(b, c, d, a, m[i+ 6], 23,  76029189), a = hh(a, b, c, d, m[i+ 9],  4, -640364487), d = hh(d, a, b, c, m[i+12], 11, -421815835), c = hh(c, d, a, b, m[i+15], 16,  530742520), b = hh(b, c, d, a, m[i+ 2], 23, -995338651)
      a = ii(a, b, c, d, m[i+ 0],  6, -198630844), d = ii(d, a, b, c, m[i+ 7], 10,  1126891415), c = ii(c, d, a, b, m[i+14], 15, -1416354905), b = ii(b, c, d, a, m[i+ 5], 21, -57434055), a = ii(a, b, c, d, m[i+12],  6,  1700485571), d = ii(d, a, b, c, m[i+ 3], 10, -1894986606), c = ii(c, d, a, b, m[i+10], 15, -1051523), b = ii(b, c, d, a, m[i+ 1], 21, -2054922799), a = ii(a, b, c, d, m[i+ 8],  6,  1873313359), d = ii(d, a, b, c, m[i+15], 10, -30611744), c = ii(c, d, a, b, m[i+ 6], 15, -1560198380), b = ii(b, c, d, a, m[i+13], 21,  1309151649), a = ii(a, b, c, d, m[i+ 4],  6, -145523070), d = ii(d, a, b, c, m[i+11], 10, -1120210379), c = ii(c, d, a, b, m[i+ 2], 15,  718787259), b = ii(b, c, d, a, m[i+ 9], 21, -343485551)
      a = (a + aa) >>> 0, b = (b + bb) >>> 0, c = (c + cc) >>> 0, d = (d + dd) >>> 0
    }

  return endian([a, b, c, d])
  })(text)))
}


Md5.file = (path, encoding = 'utf8') => {
  try { path = FileSystem.readFileSync(path, { encoding }) }
  catch (_) { return null }
  return Md5(path)
}

module.exports = Md5
