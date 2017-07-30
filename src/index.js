$.ready(function () {
  $('#IR_RECEIVER').on('data', function (data) {
    console.log('received data', data);
  })
})
