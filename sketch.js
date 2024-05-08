let ampharos;


function preload() {
  ampharos = loadImage('images/ampharos-emerald-shiny.png');
}

function setup() {
    createCanvas(400, 400);
    image(ampharos,0,0)

    ampharos.loadPixels()
    ampharos.pixels
  }
  
  function draw() {
    background(220);
  }