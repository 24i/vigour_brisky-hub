'use strict'

const test = require('tape')
const Hub = require('../')

test('app-state-scraper', (t) => {
  var updates = 0
  const lolValue = 'FFFUUUU'

  const scraper = new Hub({
    // context: false,
    id: 'scraper',
    port: 6000
  })

  const state = new Hub({
    // context: false,
    loldata: {
      on: {
        data (val) {
          // console.log('STATE LOLDATA', val)
          updates++
        }
      }
    },
    url: 'ws://localhost:6000',
    port: 6001
  })
  state.subscribe({ val: true })

  const app = new Hub({
    loldata: {
      on: {
        data (val) {
          // console.log('APP LOLDATA', val)
          updates++
        }
      }
    },
    // context: false,
    url: 'ws://localhost:6001'
  })
  app.subscribe({ val: true })

  setTimeout(() => {
    scraper.set({
      loldata: lolValue
    })
    state.set({
      stateToApp: true
    })
    setTimeout(() => {
      t.equals(updates, 2, 'scraper update arrived in both state and app')
      t.equals(state.get('loldata.compute'), lolValue, 'state has loldata')
      t.equals(app.get('loldata.compute'), lolValue, 'app has loldata')
      t.ok(app.get('stateToApp.compute'), 'app got update from set on state')
      // console.log('app has', app.loldata)
      // console.log('SCRAPER', scraper.inspect())
      // console.log('STATE', state.inspect())
      // console.log('APP', app.inspect())
      app.remove()
      state.remove()
      scraper.remove()
      t.end()
    }, 100)
  }, 100)
})
