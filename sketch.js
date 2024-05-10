let ampharos;
let charmander;

let data = {
  xPos: 600,
  yPos: 200,
  width: 300,
  height: 400,
  pixelDictionary: {},
  pixelArray: [],
}


function drawPixelCountTable(pixTable){
  // pixel table
  fill(color(255,255,255))
  
  rect(pixTable.xPos,pixTable.yPos,pixTable.width,(pixTable.pixelArray.length *  30) + 30)

  // Table Header
  textSize(20)
  fill('black')
  text("Pixel Count Table", pixTable.xPos +10, pixTable.yPos -10)

  // Column headers
  textSize(14)
  text("Color          RGBA           Count", pixTable.xPos +10, pixTable.yPos +20 )


  for(let i=0; i < pixTable.pixelArray.length; i++){
    let pixel = pixTable.pixelArray[i]
    fill(color(pixel.r, pixel.g, pixel.b, pixel.a))
    rect(pixTable.xPos + 10, pixTable.yPos + 30 + (i*30), 40, 20)
    
    // text of the rgba
    textSize(12)
    fill('black')
    text(pixel.rgbaId, pixTable.xPos + 60, pixTable.yPos + 42 +(i*30))
    
    // text of the count
    text(pixel.count, pixTable.xPos + 200, pixTable.yPos + 42 +(i*30) )

  }
}

function preload() {
  ampharos = loadImage('ampharos-emerald-shiny.png');
  charmander = loadImage('charmander-35-39-fire-red-leaf-green-sprite.png')

}

function setup() {
    createCanvas(1000, 800);
    frameRate(2)
    image(charmander,0,0)
    let spriteWidth = charmander.width;
    let spriteHeight = charmander.height;
    charmander.loadPixels()

    function countAllPixelColors(image){
      image.loadPixels()
      for (let i = 0; i < image.pixels.length; i+= 4){
        let red = image.pixels[i]
        let green = image.pixels[i+1];
        let blue = image.pixels[i+2];
        let alpha = image.pixels[i+3];
        let pixelIdString = red.toString() + ',' + green.toString() + ',' + blue.toString() + ',' + alpha.toString();
        if(data.pixelDictionary[pixelIdString] === undefined){
          
          let pixelData = {
            r: red,
            g: green,
            b: blue,
            a: alpha,
            rgbaId: pixelIdString,
            count: 1
  
          }
          data.pixelDictionary[pixelIdString] = pixelData 

        }else{
          data.pixelDictionary[pixelIdString].count += 1
        }
      
      }

      // after iterating over all of the pixels, push the objects from the dictionary into the pixel array
      for(const pix in data.pixelDictionary){
        data.pixelArray.push(data.pixelDictionary[pix])
      }
    
    }

    countAllPixelColors(charmander)

    

    // ampharos.loadPixels()
    // ampharos.pixels


    // I want to create a pixel counter, that counts all of the different colors of pixels

  }
  
  function draw() {
    background(220);
    image(ampharos,0,0)
    image(charmander,60,100)
    drawPixelCountTable(data)
    
    
  }