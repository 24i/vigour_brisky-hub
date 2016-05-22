'use strict'
module.exports = function serializeSubscription (state, subs) {
  if ('client' in subs) {
    let hub = state.getRoot()
    if (hub === state) {
      console.log('special handle for client')
      subs.clients = { [hub.id]: subs.client }
      delete subs.client
    }
  }
  const parsed = parse(subs)
  // functions
  // remove _ field
  return parsed
}

function parse (obj, last) {
  const result = {}
  for (let i in obj) {
    if (i !== '_') {
      // also check for field 'map'
      if (i === 'map' && typeof obj[i] === 'function') {
        result['$fn-' + i] = obj[i].toString()
      } else if (i === 'val' || i === 'done') {
        if (typeof obj[i] === 'function') {
          result['$fn-' + i] = obj[i].toString()
        } else {
          result[i] = obj[i]
        }
      } else {
        result[i] = parse(obj[i])
      }
    }
  }
  return result
}