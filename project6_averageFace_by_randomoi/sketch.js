let imgs = [];
let avgImg;
let numOfImages = 30;
let startImgIndex = 0;
let p;
//////////////////////////////////////////////////////////
// Step 1: preloads images in the memory
function preload() { // preload() runs once
    // loads 30 images
    for (let i = 0; i < 30; i++) {
        let fileName = 'assets/' + i + '.jpg';
        imgs[i] = loadImage(fileName);
    }
}
//////////////////////////////////////////////////////////
function setup() {
    // starting image index needs whole value, therefore, using round()
    startImgIndex = round(random(0, numOfImages - 1));
    let cWidth = imgs[startImgIndex].width; // Step 2: canvas width variable
    let cHeight = imgs[startImgIndex].height; // Step 2: canvas height variable
    // Step 2: creates a canvas twice the width of the first image in the array, and equal to the first image’s height
    createCanvas(2 * cWidth, cHeight);
    // turns off default display density https://p5js.org/reference/#/p5/pixelDensity
    pixelDensity(1);
    // Step 3: initializes the avgImg variable using the createGraphics() 
    // its size equals to the size of the first image in the array
    avgImg = createGraphics(cWidth, cHeight);
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    // Step 4: accesses the pixel data of all the images in the imgs array 
    for (let i = 0; i < numOfImages; i++) {
        imgs[i].loadPixels();
    }
    // accesses the pixel data of avgImg 
    avgImg.loadPixels();

    let imY, imX, pixIndex = 0;
    // Step 5: loops over all pixels on the first image in the array
    for (imY = 0; imY < imgs[startImgIndex].height; imY++) {
        for (imX = 0; imX < imgs[startImgIndex].width; imX++) {
            // converts the x and y coordinates from the for loop to a pixel index value 
            pixIndex = (imY * imgs[startImgIndex].width + imX) * 4;

            // Step 6: stores the sum of each channel for that pixel
            let sumR = 0,
                sumG = 0,
                sumB = 0,
                sumA = 0;
            let imgInd;

            // loops through all the images in the imgs array and for each channel 
            // adds its value to the corresponding sum variable
            for (imgInd = 0; imgInd < numOfImages; imgInd++) {
                sumR += imgs[imgInd].pixels[pixIndex + 0];
                sumG += imgs[imgInd].pixels[pixIndex + 1];
                sumB += imgs[imgInd].pixels[pixIndex + 2];
                sumA += imgs[imgInd].pixels[pixIndex + 3];
            }
            // updates each channel in the avgImg
            avgImg.pixels[pixIndex + 0] = round(sumR / numOfImages);
            avgImg.pixels[pixIndex + 1] = round(sumG / numOfImages);
            avgImg.pixels[pixIndex + 2] = round(sumB / numOfImages);
            avgImg.pixels[pixIndex + 3] = round(sumA / numOfImages);
        }
    }
    // updates the pixels of the avgImg 
    avgImg.updatePixels();

    // left image 
    image(imgs[startImgIndex], 0, 0);

    // the avgImg to the right of the existing image
    image(avgImg, imgs[startImgIndex].width, 0);

    // text styling for the user instructions
    p = createP('Press "enter" to switch between faces'); // creates a <p></p> element in the DOM
    p.style('font-size', '16px'); // sets the given style (CSS) property (font size) of the element with the given value (16 px size)
    p.position(10, 505); // coordinates of the text

    // only need to calculate once therefore used noLoop() 
    noLoop();
}

// Step 7a: changes image on the left to a random face from the array by using key "Enter"
function keyPressed() {
    if (keyCode === 13) {
        startImgIndex = round(random(0, numOfImages - 1));
        image(imgs[startImgIndex], 0, 0);
    }
}

// Step 7b: when mouse moved the pixel values of the second image transitions
// between the randomly selected image and the average image 
function mouseMoved() {
    // boundaries for the two images on mouseX movement (starts in the middle if each image)
    let posX = constrain(mouseX, imgs[0].width / 2, 1.5 * imgs[0].width);
    // image changes based on mouseX movement from 0 to 1
    let amt = map(posX, imgs[0].width / 2, 1.5 * imgs[0].width, 0, 1);
    // keeps temporary average image copy
    let tmpImg = createImage(avgImg.width, avgImg.height);
    tmpImg.copy(avgImg, 0, 0, avgImg.width, avgImg.height, 0, 0, avgImg.width, avgImg.height);
    // merges two images
    tmpImg = lerpImg(imgs[startImgIndex], tmpImg, amt);
    // the new image where we had avgImg before (on the right)
    image(tmpImg, imgs[startImgIndex].width, 0);
}

// handles pixels calculations between two images
function lerpImg(img1, img2, amt) {
    img1.loadPixels(); // loads pixels of image1
    img2.loadPixels(); // loads pixels of image2
    // loops through pixels of the first image
    for (let i = 0; i < img1.pixels.length; i++) {
        // calculates a new image between left and right images, the intensity of change depends on "amt"
        img2.pixels[i] = lerp(img1.pixels[i], img2.pixels[i], amt);
    }
    // updates pixels of new image
    img2.updatePixels();
    return img2; // returns new image
}