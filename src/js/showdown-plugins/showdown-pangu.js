import pangu from 'pangu'
import showdown from 'showdown'

showdown.extension('pangu', () => {
  return [{
    type: 'filter',
    filter (text) {
      text = pangu.spacing(text)
      // console.log(text)
      return text
    }
  }]
})
