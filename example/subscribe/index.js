var Observable = require('vigour-js/lib/observable')
var Hub = require('../../lib')
console.log('starting...')
console.time('test1')
var obj = require('../data.json')
console.timeEnd('test1')
console.time('test2')
var hub = new Observable(obj)
console.timeEnd('test2')
console.log('done')
