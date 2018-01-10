'use strict'

$(function () {
  $('label.btn:first-child').click(function (e) {
    $('div.monthly').removeClass('show').addClass('hide')
    $('div.annual').removeClass('hide').addClass('show')
  })
  $('label.btn:last-child').click(function (e) {
    $('div.annual').removeClass('show').addClass('hide')
    $('div.monthly').removeClass('hide').addClass('show')
  })
})
