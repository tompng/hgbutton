class Chat
  channel: '/chat'

  constructor: (@fayePath) ->
    @client = new Faye.Client @fayePath
    @client.subscribe @channel, @received

  received: ({message}) =>
    @debug 'received', message
    $('<div/>').text(message).prependTo('#messages')

  send: (message) =>
    @debug 'send', message
    @client.publish(@channel, message: message)

  debug: (args...) ->
    console.log args...
