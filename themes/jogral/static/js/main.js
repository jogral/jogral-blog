$(function() {
  $('#course-tabs').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
  })

  // $('.add-cc-form').hide()
  // Change password UI validations
  $('#change-password1, #inputPassword1').keyup(function (e) {
    if (e.target.value.length >= 7) {
      $('#password-rules li:first-child span').removeClass('text-danger glyphicon-remove-sign').addClass('text-success glyphicon-ok-sign')
    } else {
      $('#password-rules li:first-child span').removeClass('text-success glyphicon-ok-sign').addClass('text-danger glyphicon-remove-sign')
    }
  })
  $('#change-password2, #inputPassword2').keyup(function (e) {
    var pw1_value
    if ($('#change-password1').length) {
      pw1_value = $('#change-password1').val()
    } else {
      pw1_value = $('#inputPassword1').val()
    }
    if (e.target.value == pw1_value) {
      $('#password-rules li:last-child span').removeClass('text-danger glyphicon-remove-sign').addClass('text-success glyphicon-ok-sign')
    } else {
      $('#password-rules li:last-child span').removeClass('text-success glyphicon-ok-sign').addClass('text-danger glyphicon-remove-sign')
    }
  })
})
