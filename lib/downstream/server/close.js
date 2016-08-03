'use strict'
module.exports = function closeServer (hub) {
  const server = hub.downstream
  const instances = hub.instances
  closeConnections(hub)
  for (let i = 0, len = instances.length; i < len; i++) {
    closeConnections(instances[i])
  }
  server.httpServer.close()
}

function closeConnections (hub) {
  const clients = hub.clients
  const id = hub.id
  clients.each((client) => {
    if (client.upstream && client.upstream.compute() === id) {
      client.socket.close()
    }
  })
}