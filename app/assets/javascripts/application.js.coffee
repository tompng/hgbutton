#= require jquery
#= require jquery_ujs
#= require_tree .

$ ->
  chat = new Chat fayePath
  $newMessage = $('#new-message')
  $newMessage.focus()

  $('#chat').submit (e) ->
    message = $newMessage.val()
    chat.send message
    $newMessage.val ''

    false
