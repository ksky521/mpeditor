var showdown = require('showdown')

showdown.extension('tasklist', function () {
  return [{
    type: 'output',
    filter: function (source) {
      source = source.replace(/<li>\[ ] (.*)<\/li>/gi, function (match, pre) {
        if (pre) {
          return '<section class="mpe-task-list unchecked" style="list-style-type: none;color:#777"><img src="https://raw.githubusercontent.com/ksky521/mpeditor/master/src/img/square.png" style="width:20px;height:20px;margin:0 10px;position: relative;display:inline-block;" />' + pre + '</section>'
        }
      })

      source = source.replace(/<li>\[x] (.*)<\/li>/gi, function (match, pre) {
        if (pre) {
          return '<section class="mpe-task-list checked" style="list-style-type: none;"><img src="https://raw.githubusercontent.com/ksky521/mpeditor/master/src/img/square_check_fill.png" style="width:20px;height:20px;margin:0 10px;position: relative;display:inline-block;" />' + pre + '</section>'
        }
      })

      return source
    }
  }]
})
