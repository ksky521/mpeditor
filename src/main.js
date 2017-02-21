import Editor from 'mpeditor'
import $ from 'jQuery'
import 'normalize.css'
const $win = $(window)
const LS = window.localStorage
$(() => {
  $('#js-mpeditor').height($win.height())
  LS.mpe_content ? createEditor(LS.mpe_content) : $.get('./static/demo.md').done(createEditor)
})

function createEditor (data) {
  let editor = new Editor('#js-mpeditor', { text: data.trim() })
  $win.resize(() => {
    let height = $win.height()
    $('#js-mpeditor').height(height)

    editor.resize.bind(editor)(height)
  })
}
