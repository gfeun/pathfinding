var images = []
var tiles = {}
var tilesheet = new Image()

//var generateImageBitmap = async function (imageData) {
//  return createImageBitmap(imageData)
//}

var loadImages = async function () {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  let tileNum = 0
  for (let i = 1; i <= 18; i++) {
    for (let j = 1; j <= 7; j++) {
      context.save()
      context.globalAlpha = 0
      context.clearRect(0, 0, 64, 64)
      context.restore()
      // 32px margin and 64px per tile
      context.drawImage(tilesheet, (i * 32) + ((i - 1) * 64), (j * 32) + ((j - 1) * 64), 64, 64, 0, 0, 64, 64)
      images[tileNum] = context.getImageData(0, 0, 64, 64)
      tileNum++
    }
  }
  tiles['grass'] = await createImageBitmap(images[0])
  tiles['wood'] = await createImageBitmap(images[24])
  tiles['copper_mine'] = await createImageBitmap(images[41])
  tiles['hero'] = await createImageBitmap(images[97])
}

tilesheet.addEventListener('load', loadImages, false)

tilesheet.src = 'medieval_tilesheet.png'

export { images, tiles }
