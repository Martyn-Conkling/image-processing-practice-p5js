let ampharos;
let charmander;

let data = {
  xPos: 600,
  yPos: 200,
  width: 300,
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

function upscaleImage(image, mult, imageName = "untitled", gridLines = false, gridLineThickness = 1, ){
  // rounds down to the nearest integer to ensure that mult is an integer
  image.loadPixels()

  mult = Math.floor(mult);

  let upscaledImage = createImage(image.width*mult, image.height*mult);

  upscaledImage.loadPixels();
  
  let newImageCopy = [];

  let rowGridLineArray = []

  if(gridLines){
    for(let gridLineIndex = 0; gridLineIndex < upscaledImage.width; gridLineIndex++){
      rowGridLineArray.push(0,0,0,255);
    }
  }
  console.log(rowGridLineArray);

  // This for loop is going to go through every row of pixels of the starting image
  for (let rowNumber = 0; rowNumber < image.height; rowNumber++){
    let newImageRowArray = [];

    // looping through the image.pixel array to get the pixel rgba values
    for (let i = rowNumber * image.width*4 ; i < ((rowNumber+1) * (image.width*4)); i+= 4){
      // gets the rgba values of each pixel of the original image
      let red = image.pixels[i]
      let green = image.pixels[i+1];
      let blue = image.pixels[i+2];
      let alpha = image.pixels[i+3];

      
      
        if(gridLines){
          // Pushes the black grid pixel in first in the new upscaled image "pixel"
          for(let z = 0; z < gridLineThickness; z++){
            newImageRowArray.push(0,0,0,255)
          }
          // Pushes the same pixel into the newImageRowArray mult number of times to upscale it
          for(let k = gridLineThickness; k < mult; k++){
            newImageRowArray.push(red, green, blue, alpha);
          }

        }else{
          // Pushes the same pixel into the newImageRowArray mult number of times to upscale it
          for(let j=0; j < mult; j++){
            newImageRowArray.push(red, green, blue, alpha);
          }
        }
    }


    
    // This is pushing the same row of pixels in multiple times in order to upscale the vertical height of the newImage's "pixel"
    if(gridLines){
      for(let index = 1; index <= gridLineThickness; index++){
        newImageCopy.push(...rowGridLineArray);
      }
      for(let index = gridLineThickness; index < mult; index++){
        newImageCopy.push(...newImageRowArray);
      }
    }
    else{
      for(let multiplierIndex = 0; multiplierIndex < mult; multiplierIndex++){
          newImageCopy.push(...newImageRowArray);
      }
    }    
     

  } 
  // End of the for loop iterating over all of the image rows
  

  for(let imageCopyIndex = 0; imageCopyIndex < upscaledImage.pixels.length; imageCopyIndex++){
    upscaledImage.pixels[imageCopyIndex] = newImageCopy[imageCopyIndex];
  }

  upscaledImage.updatePixels();

  // let randomString = random(9999,999999)
  // randomString = Math.floor(randomString).toString();
  let gridStatus = gridLines ? `-with-${gridLineThickness}-px-grid`: "-no-grid";
  let nameAddOnString = `-upscaled-by-${mult}`
  upscaledImage.save(imageName + nameAddOnString + gridStatus,'png')
  return upscaledImage

}

// This array will be used to contain all of the file names of images I want to process



let images = [];
let imageNames = [];

function runUpscaleJob(){
  images.forEach((image, index) => {
    // call the upscaleImage() function on each image
    upscaleImage(image, 10, imageNames[index], true)
  })
}

function preload() {
  // ampharos = loadImage('ampharos-emerald-shiny.png');
   charmander = loadImage('/images/charmander-35-39-fire-red-leaf-green-sprite.png')

  // This loads the json file the locally hosted express server gives containing all of the image paths and names

  
  loadJSON('http://localhost:3000/list-images', function(data) {
    data.imagePaths.forEach(path => {
      images.push(loadImage(path));
    });

    data.imageNames.forEach(name => {
      imageNames.push(name)
    });
    console.log("Images loaded successfully")
    console.log(images);
    console.log(imageNames)
    });




}

function setup() {
    createCanvas(1900, 900);
    noLoop();
    
    
    // countAllPixelColors(charmander)

    
    const btn = createButton('upscale provided images');
    btn.mousePressed(runUpscaleJob)


  }
  
  function draw() {
    background(220);
    




    // countAllPixelColors(charmander)
  
    // image(charmander,60,100)
    // drawPixelCountTable(data)
    
    // image(upscaleImage(charmander, 10),100,200)
    // image(upscaleImage(charmander, 10,"dude", true),1000,100)
    

  }


  // Tasks left for project

  // Write the code for upscaling the image
  // DONE!
  // Add the code to the upscaling function to add grid lines
    // DONE!
  // Save the new Image as a PNG file

    // Write code for programatically going through a list of file names in the image folder, 
    // And then it will load each of those images in in the preload function, 
    // Then it will run the upscale Image function on all of the images, 
    // Then it will export all of the NEW images as png files



    // Batch running the upscaling/grid functionality on a folder of images
    // how do I use p5.js to batch load a bunch of images?
    // I need to use a different program to save all of the image names in a list
    // I can do this with Node.js fs module or Python pathlib module
    // The script should iterate through all of the images in a given folder, and save all the image names in a list,
    // It should save this list as image-list.json or something like that, 
    // Import image-list.json into the p5.js program
    // Iterate over the list to load all of the images, give them a name, and save them in a list

    // Iterate over the list of images to upscale the images as desired



    //I also want to be able to export the data from the countAllPixelColors function, 
    // Save the data table I create showing the color and the info
    // Save the data as a json file with the RGBA values of all the pixels and their count


    // Create a table or dictionary matching the closest lego color to various rgb colors

