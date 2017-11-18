const path = require('path')
const imagemin = require('imagemin')
const webp = require('imagemin-webp')
const outputFolder = path.resolve('assets/img')
const PNGImages = path.resolve('assets/img/*.png')
const JPEGImages = path.resolve('assets/img/*.jpg')

imagemin([PNGImages], outputFolder, {
  plugins: [webp({
    lossless: true
  })]
})

imagemin([JPEGImages], outputFolder, {
  plugins: [webp({
    quality: 75
  })]
})
