'use strict'
const createContext = require('./context')
const vstamp = require('vigour-stamp')

module.exports = function (hub, data, socket) {
  const client = data.client
  const id = client.id
  const hubid = hub.id
  const parsed = vstamp.parse(client.stamp)
  // const stamp = vstamp.create(parsed.type, parsed.src || id, parsed.val)
  const stamp = vstamp.create(parsed.type, hubid)
  const context = createContext(hub, socket, client, stamp)
  // ------------------------------
  if (client.subscriptions) {
    for (let i in client.subscriptions) {
      context.subscribe(client.subscriptions[i], void 0, void 0, stamp, context.clients[id])
    }
  }
  console.log('yo stamp', stamp)
  vstamp.close(stamp)
  delete data.client
}