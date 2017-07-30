var path = require('path')
var http = require('http')
var fs = require('fs')
var IRData = []
var querystring = require('querystring')

var methods = {
  // 获取最新红外数据
  irData: function (req, res, url) {
    res.writeHead(200, {'Content-Type': 'application/json'})
    setTimeout(function () {
      if (Array.isArray(IRData)) {
        res.end(JSON.stringify(IRData))
        IRData = []
      } else {
        res.end('[]')
      }
    }, 1000)
  },
  saveData: function (req, res, url) {
    var params = querystring.parse(req.url.replace(/^.+\?/, ''))
    fs.appendFile(__dirname + '/ir.txt',
      decodeURIComponent(params.name) + ' | ' + params.data + '\r\n', function (err) {
        if (err) throw err;
        res.end()
        console.log('The "data to append" was appended to file!');
      });
  },
  // 处理静态数据
  static: function (req, res, url) {
    var type = path.extname(url).toLowerCase()
    switch (type) {
      case 'sj':
        res.writeHead(200, {'Content-Type': 'application/javascript'})
        break;
      case 'html':
        res.writeHead(200, {'Content-Type': 'text/html'})
        break;
    }
    var _path = __dirname + url
    fs.exists(_path, function (exists) {
      if (!exists) {
        res.end()
        return
      }
      fs.createReadStream(_path).pipe(res)
    })
  }
}

$.ready(function () {

  $('#IR_RECEIVER').on('data', function (data) {
    console.log('IR_RECEIVER')
    IRData = data
  });

  var server = http.createServer(function (req, res) {
    var url = req.url.replace(/\?.*$/, '').replace(/\.+/, '.');
    var api = url.substring(1)
    if (methods[api]) {
      methods[api](req, res, url)
    } else {
      methods.static(req, res, url)
    }
  })
  server.on('error', function (error) {
    console.log(error)
  })
  server.listen(8080)
})
