'use strict'

describe('single scope', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  var server = new Hub({
    key: 'single_server'
  })
  var receiver = new Hub({
    key: 'single_receiver'
  })

  server.set({
    adapter: {
      id: 'single-server',
      mock: new Mock()
    }
  })

  server.adapter.mock.set({ server: 'single_server' })

  receiver.set({
    adapter: {
      id: 'single_receiver',
      mock: new Mock()
    }
  })

  it('can connect to a scope', function (done) {
    receiver.adapter.set({
      mock: 'single_server',
      scope: 'myScope'
    })
    receiver.adapter.mock.on('connect', function () {
      expect(server).to.not.have.property('clients')
      expect(server).to.have.property('_scopes')
        .which.has.property('myScope')
      expect(server._scopes.myScope).to.have.property('clients')
      done()
    })
  })

  it('merges sets from the original sever to client', function () {
    server.set({
      youri: true
    })
    expect(receiver.youri.val).to.equal(true)
  })

  it('merges sets from the "myScope" on the sever to client', function () {
    server._scopes.myScope.set({
      james: true
    })
    expect(receiver.james.val).to.equal(true)
  })

  it('set from client to server only manipulates "myScope"', function () {
    receiver.set({bla: 'hey'})
    expect(server.bla).to.be.not.ok
    expect(server._scopes.myScope.bla).to.be.ok
  })
})