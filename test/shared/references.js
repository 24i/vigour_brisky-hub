'use strict'

module.exports = function (protocol, key) {
  describe('references', function () {
    var server, receiver, receiver2 //eslint-disable-line
    var Promise = require('bluebird')
    var util = require('./util')

    // util assert wrapper that does a sane stack trace?
    function assertReferences (val, done) {
      try {
        var obj = [ server, receiver, receiver2 ]
        for (let i in obj) {
          if (val === null ? obj[i].time !== null : obj[i].time._input !== val) {
            expect(obj[i].key + 'time').to.equal(val)
          }
          if (val === null
            ? obj[i].list[0].time._input !== void 0
            : obj[i].list[0].time._input !== obj[i].time
          ) {
            expect(obj[i].key + ' list time _input').to.equal(val === null ? 'undefined' : obj[i].time._path)
          }
        }
        done()
      } catch (e) {
        e.stack = '' // e.stack.split('\n')[2]
        done(e)
      }
    }

    it('can create and connect to multiple hubs', function (done) {
      var setup = util.setup({
        protocol: protocol,
        key: key,
        receivers: 2,
        log: true
      })
      server = setup.server
      receiver = setup[1]
      receiver2 = setup[2]
      setup.connected.then(function () {
        done()
      })
    })

    it('can set a reference on the server', function (done) {
      console.clear()
      console.line = false

      Promise.all([
        receiver.get('time', {}).is(1),
        receiver2.get('time', {}).is(1),
        receiver.get('list.0.time', {}).is(1),
        receiver2.get('list.0.time', {}).is(1)
      ]).done(function () {
        assertReferences(1, done)
      })
      server.set({ time: 1 })
      server.set({
        list: { 0: { time: server.time } }
      })
    })

    it('can set reference on the receiver', function (done) {
      Promise.all([
        server.time.is(2),
        server.list[0].time.is(2),
        receiver2.time.is(2),
        receiver2.list[0].time.is(2)
      ]).done(function () {
        assertReferences(2, done)
      })
      receiver.set({ time: 2 })
    })

    it('can set reference on both receivers', function (done) {
      Promise.all([
        server.list[0].time.is(3),
        receiver.list[0].time.is(3),
        receiver2.list[0].time.is(3)
      ]).done(function () {
        assertReferences(3, done)
      })
      receiver.set({ time: 3 })
      receiver2.set({ time: 3 })
    })

    it('can set remove a reference', function (done) {
      // console.line = false

      function removed (val, data, event) {
        return data === null
      }

      Promise.all([
        server.time.is(removed),
        receiver.time.is(removed),
        receiver2.time.is(removed)
      ]).done(function () {
        assertReferences(null, done)
      })
      // add log exentsions , totally possible now :D
      receiver.time.remove()
      // setTimeout(() => {
      //   console.log('----------------------------'.magenta)
      //   console.log('server time:', server.time)
      //   console.log('server list time:', server.list[0].time._input)
      //   console.log('reciever time:', receiver.time)
      //   console.log('receiver2 time:', receiver2.time && receiver2.time._input)
      //   console.log('receiver2 list time:', receiver2.list[0].time.val._input)
      //   console.log('reciever list time:', receiver.list[0].time._input)
      //   // shouldnt be removed
      // }, 500)
    })
  })
}