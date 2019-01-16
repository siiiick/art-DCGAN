const fs = require('fs')
const rp = require('request-promise')

let page = 1
let url = `https://www.wikiart.org/en/paintings-by-genre/design?select=featured&json=2&layout=new`
let images = []

const makeRequest = u => {
  rp(u)
  .then(res => {
    const r = JSON.parse(res)
    
    if (r.Paintings !== null) {
      r.Paintings.forEach(painting => {
        images.push({ url: painting.image, filename: painting.id })
      })

      page++
      makeRequest(`${url}&page=${page}`)
    } else {
      startFileDownload()
    }
  })
  .catch(err => {
    console.log(err)
  })
}

const startFileDownload = () => {
  console.log(images.length, '--- finished scraping')
  console.log('request', page, ' pages')
  images.forEach(image => {
    downloadFile(image.url, image.filename)
  })
}

const downloadFile(url, filename) => {
  rp(url).pipe(fs.createWriteStream(`images/${filename}.jpg`))
}

makeRequest(`${url}&page=${page}`)

