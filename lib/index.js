'use strict'
const Sync = require('./sync')
const Client = require('./client')
const uuid = Math.random()*9999 + Date.now()
const ts = require('monotonic-timestamp')
const stamp = require('vigour-stamp')
const create = stamp.create
stamp.offset = 0 // dont worry too much about offset now
stamp.create = (type, src, val) => create(type, src, val || ts() + stamp.offset)

module.exports = new Sync({
  type: 'hub',
  define: {
    isHub: true,
    inprogress: { value: {} }
  },
  types: {
    sync: Sync.prototype,
    client: Client.prototype
  },
  inject: [
    require('./clients'),
    require('./upstream'),
    require('./downstream'),
    require('./context'),
    require('./receive')
  ],
  properties: {
    incoming: true,
    id: true,
    subscriptions: true
  },
  id: uuid,
  on: {
    error (err) {
      console.log(err)
    }
  }
}, false).Constructor
