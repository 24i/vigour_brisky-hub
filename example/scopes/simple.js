'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    // websocket: {}
    // textfield: 'nothing yet'
  }
})

// hub.adapter.scope.val = 'anon'
hub.adapter.set({ websocket: 'ws://localhost:3031' })

var Element = require('vigour-element')
var app = require('vigour-element/lib/app')

app.set({
  holder: {
    $: true,
    textfield: {
      $: 'shows.977.currentSeason',
      type: 'input',
      value: {
        $: 'number'
      },
      on: {
        keyup (data, event) {
          this.value.origin.val = this.node.value
        }
      }
    }
  }
})

app.holder.val = hub
// for the multi-upstreams multi-scope we do need to apply subscriptions to the original -- pretty annoying
// other fix just add extension capability for this all subs on scopes also go to original: true
