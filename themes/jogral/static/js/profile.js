'use strict'

function invalidForm (e, v) {
  e.preventDefault()
  $(e.target).find('.alert').hide()
  const errors = v.numberOfInvalids()
  if (errors) {
    const msg = '<span class="glyphicon glyphicon-exclamation-sign"></span>'
              + 'You missed <strong>'
              + errors
              + (errors == 1 ? 'field' : 'fields')
              + '</strong>. Check the highlighted fields and correct them.'
    // $(e.target).find('.alert-danger p').html(msg)
  }
  return false
}

$(function () {
  var request;
  // Check for changed forms

  $('form').dirtyForms({ 'dialog': true });
  $(document).bind('dirty.dirtyforms', function(e) {
    var $form = $(e.target)
    $form.find('button').prop('disabled', false)
  })
  $(document).bind('clean.dirtyforms', function(e) {
    var $form = $(e.target)
    $form.find('button').prop('disabled', true)
  })

  // Validation functionality
  $('#profile form').validate({
    errorClass: 'text-danger',
    invalidHandler: function(e, v) {
      invalidForm(e, v)
    },
    submitHandler: function(f, e) {
      return false
    }
  })

  $('#change-password form').validate({
    errorClass: 'text-danger',
    rules: {
      new_password1: {
        required: true,
        minlength: 7
      },
      new_password2: {
        required: true,
        minlength: 7,
        equalTo: '#change-password1'
      }
    },
    invalidHandler: function(e, v) {
      invalidForm(e, v)
    },
    submitHandler: function(f, e) {
      return false
    }
  })
  $('form#has_cards').submit(function (e) {
    var $form = $(this)
    $form.find('button').prop('disabled', true)
  })
  // Submit functionality
  $('#downgrade form').submit(function (e) {
    e.preventDefault()

    var $form = $(this)

    if (request) {
      request.abort()
    }

    $form.find('button').prop('disabled', true)
    request = $.ajax({
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      url: $form.attr('action') + '?is_ajax=1',
      method: 'POST'
    })

    request.done(function (response, textStatus, jqXHR) {
      $('#downgrade .ajax-error').addClass('hide')
      $('#downgrade .not-switched').remove()
      const newTier = $('<div/>').html(response).find('.current-tier').text()
      const notSwitched = $('<div/>').html(response).find('#downgrade .not-switched')

      if (notSwitched.length > 0) {
        $('#downgrade').html(switched.html())
        $('.current-tier').text(newTier)
        $form.find('button').prop('disabled', false)
      } else {
        $('#downgrade .switched').removeClass('hide')
        $('#downgrade form').remove()
      }
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
      $('#downgrade .ajax-error').removeClass('hide')
      console.error(textStatus + ' ' + errorThrown)
      $form.find('button').prop('disabled', false)
    })
  })
  $('#profile form').submit(function (e) {
    e.preventDefault()
    $(e.target).find('.alert').hide()
    const $form = $(this)
    const $inputs = $form.find('input')
    const serializedData = $form.serialize()

    if (request) {
      request.abort()
    }

    $inputs.prop('disabled', true)
    request = $.ajax({
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      url: $form.attr('action'),
      method: 'POST',
      data: serializedData
    })

    request.done(function (response, textStatus, jqXHR) {
      const alertHtml = $('<div/>').html(response).find('#profile .alert-success, #profile .alert-danger')
      $('<div/>').html(response).find('#profile form div.form-group input').each(function () {
        $('#profile form div.form-group #' + this.id).parent().html($(this).parent().html())
      })
      $('#profile form').before(alertHtml)
      // $('#profile .form-group').html(formGroupHtml)
      $form.find('button').prop('disabled', true)
      $form.dirtyForms('setClean')
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
      const alertHtml = $('<div/>').html(response).find('#profile .alert-success, #profile .alert-danger')
      $('<div/>').html(response).find('#profile form div.form-group input').each(function () {
        $('#profile form div.form-group #' + this.id).parent().html($(this).parent().html())
      })
      $('#profile form').before(alertHtml)
    })

    request.always(function() {
      $inputs.prop('disabled', false)
    })
  })
  $('#change-password form').submit(function (e) {
    e.preventDefault()
    const $form = $(this)
    const $inputs = $form.find('input')
    const serializedData = $form.serialize()

    if (request) {
      request.abort()
    }

    $inputs.prop('disabled', true)
    request = $.ajax({
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      url: $form.attr('action'),
      method: 'POST',
      data: serializedData
    })

    request.done(function (response, textStatus, jqXHR) {
      $form.find('input').val('')
      $form.find('.alert-success').show()
      $form.dirtyForms('setClean')
      $form.find('button').prop('disabled', true)
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
      $form.find('.alert-danger').show()
    })

    request.always(function() {
      $inputs.prop('disabled', false)
    })
  })
  $('#deactivate form').submit(function(e) {
    e.preventDefault()
    const $form = $(this)
    if (request) {
      request.abort()
    }
    request = $.ajax({
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      url: $form.attr('action'),
      method: 'POST'
    })

    request.done(function (response, textStatus, jqXHR) {
      window.location = '/'
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
      $form.find('.alert-danger').show()
    })
  })

})
