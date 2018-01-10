'use strict'

$(function() {
  const accepted = ['visa', 'mastercard', 'discover', 'amex']
  const ccSpan = '.cc-validate span.cc'
  const hasFeedback = '.has-feedback'
  const allCCInputs = '.add-cc-form .payment input'
  var request;

  /*function resetCCForm() {
    var $inputs = $('.edit-cc-form input')
    $inputs.prop('disabled', true).hide()
    $('.edit-cc-form .btn').hide()
    $('.edit-cc-form .static-text, .edit-cc-form a').show()
  }

  $('.show-new-cc-form').click(function(e) {
    e.preventDefault()
    $(this).hide()
    $('.add-cc-form').fadeIn(2000)
  })*/
  //$(allCCInputs).val('')
  $(hasFeedback).ready(function() {
    $(this).removeClass('has-success')
  })
  $('input[name="ccnumber"], input[name="expdate"], input[name="cvc"]').keyup(function (e) {
    e.preventDefault()
    const trimmedVal = e.target.value.replace(/[^0-9]/g, '')
    $(e.target).val(trimmedVal)
  })
  $('input[name="ccnumber"]').validateCreditCard(function(r) {
    if (r.card_type != null) {
      $(ccSpan).removeClass(accepted.join(' ')).addClass(r.card_type.name)
    } else {
      $(ccSpan).removeClass(accepted.join(' '))
    }
    if (r.length_valid && r.luhn_valid) {
      $('.cc-validate').addClass('has-success')
    } else {
      $('.cc-validate').removeClass('has-success')
    }
  }, { accept: accepted })
  $('.add-cc-form form').submit(function (e) {
    e.preventDefault()
    const $form = $(this)
    const $inputs = $form.find('input')
    const serializedData = $form.serialize()
    if (request) {
      request.abort()
    }

    $inputs.prop('disabled', true)
    $form.find('button').prop('disabled', true)
    request = $.ajax({
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      url: $form.attr('action') + '?ajax=1',
      method: 'POST',
      data: serializedData
    })

    request.done(function (response, textStatus, jqXHR) {
      const isUrl = response.indexOf('ajax=1') >= 0
      if (isUrl) {
        window.location.replace(response)
      } else {
        $('.col-md-7 .alert').remove()
        const alert = $('<div/>').html(response).find('.alert')
        $('.col-md-7 .alert').remove(alert)
        $('.col-md-7').prepend(alert)
        $('.payment .form-group').addClass('has-error')
      }
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
      $form.find('.alert-danger').show()
    })

    request.always(function() {
      $inputs.prop('disabled', false)
      $form.find('button').prop('disabled', false)
      $(allCCInputs).val('')
    })
  })
  $('.open-edit').click(function (e) {
    e.preventDefault()
    if ($('.edit-cc-form').hasClass('hide')) {
      $('.edit-cc-form').removeClass('hide').addClass('show')
      $('#cc-list').removeClass('show').addClass('hide')
      $(this).text('Cancel')
    } else {
      $('.edit-cc-form').removeClass('show').addClass('hide')
      $('#cc-list').removeClass('hide').addClass('show')
      $(this).text('Change Payment Information')
    }
  })
  /*$('.edit-cc-row .delete-cc').click(function(e) {
    e.preventDefault()
    const parent = e.target.parentElement.parentElement
    const cc = $(parent + ' input[name="ccnumber"]').val()

    if (request) {
      request.abort()
    }

    request = $.ajax({
      url: '/dashboard/profile/delete-payment/?ajax=1',
      method: 'POST',
      data: { 'cc': cc }
    })


    request.done(function (response, textStatus, jqXHR){
      $(parent).fadeOut(1000).remove()
    })
    request.fail(function (jqXHR, textStatus, errorThrown){
      console.error("The following error occurred: " +
                    textStatus, errorThrown)
    })
  })*/
  $('.edit-cc-form form').submit(function(e) {
    e.preventDefault()
    const action = $(this).attr('action') + '?ajax=1'
    const $form = $(this)
    const $inputs = $form.find('input')
    const serializedData = $form.serialize()

    if (request) {
      request.abort()
    }

    $inputs.prop('disabled', true)
    $form.find('button').prop('disabled', true)

    request = $.ajax({
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      url: action,
      method: 'POST',
      data: serializedData
    })

    request.done(function (response, textStatus, jqXHR){
      $inputs.val('')
      $('.open-edit').click()
      const alert = $('<div/>').html(response).find('.edit-cc-form .alert')
      const table = $('<div/>').html(response).find('#cc-list')
      $('#cc-list').html(table.html())
      $('#cc-list').before(alert)
      $form.dirtyForms('setClean')
    })

    request.fail(function (jqXHR, textStatus, errorThrown){
      $inputs.prop('disabled', false)
      //const alert = $('<div/>').html(response).find('.alert')
      //$form.before(alert)
      // $inputs.val('')
      console.error("The following error occurred: " +
                    textStatus, errorThrown)
    })
  })

  $(allCCInputs).keyup(function(e) {
    const val = e.target.value
    if (!e.target.id.includes('cc-number')) {
      if (val !== undefined && val !== '') {
        $(e.target.parentElement).addClass('has-success')
      }
    }
  })
})
