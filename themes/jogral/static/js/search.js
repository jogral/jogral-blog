'use strict'

$(function () {
  var request
  $('#search-form').submit(function (e) {
    e.preventDefault()
  })
  $('input[name="search"]').val('')

  $('input[name="search"]').keyup(function (e) {
    const $form = $('form')
    const search = e.target.value
    console.log(search)
    const numChars = search.length
    if (numChars > 3) {
      const serializedData = $form.serialize()

      if (request) {
        request.abort()
      }

      request = $.ajax({
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        url: $form.attr('action'),
        method: 'POST',
        data: serializedData
      })

      request.done(function (response, textStatus, jqXHR) {
        var $newDoc = $('<div />').append(response).find('#courses-list').html()
        $('#courses-list').html($newDoc)
        console.log('Rock on')
      })

      request.fail(function (jqXHR, textStatus, errorThrown) {
        console.log('No ' + textStatus + ' ' + errorThrown)
      })
    } else {
      $('#courses-list').html('')
    }
  })
})
