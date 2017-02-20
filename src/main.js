import Editor from 'mpeditor'
import $ from 'jQuery'
import 'normalize.css'
$(() => {
  // const editor = initEditor('js-mpe-textarea')
  const $win = $(window)
    // const $perview = $('#js-mpe-perview')

  $('#js-mpeditor').height($win.height())
  $.get('./static/demo.md').done((data) => {
    let editor = new Editor('#js-mpeditor', { text: data.trim() })
    $win.resize(() => {
      let height = $win.height()
      $('#js-mpeditor').height(height)

      editor.resize.bind(editor)(height)
    })
  })
})
