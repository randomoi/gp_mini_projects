// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var imgOut;
let p1, p2, p3, p4, p5, p6;
let resultImg;
// array of filters, first filter is true to show sepia filter
let arFilters = [true, false, false, false, false];

var matrix = [
    [
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64]
    ],
    // blur matrix from example provided in blurFilters
    [
        [1 / 9, 1 / 9, 1 / 9],
        [1 / 9, 1 / 9, 1 / 9],
        [1 / 9, 1 / 9, 1 / 9]
    ],
    // gaussian blur matrix from example provided in blurFilters
    [
        [1 / 16, 2 / 16, 1 / 16],
        [2 / 16, 4 / 16, 2 / 16],
        [1 / 16, 2 / 16, 1 / 16]
    ]
];

let matrixIndex = 0;

/////////////////////////////////////////////////////////////////
function preload() { // preloads image in the memory, preload() runs once
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    // creates a canvas twice the width of the image provided in the program, and equal to the image’s height
    createCanvas((imgIn.width * 2), imgIn.height);
    // turns off default display density https://p5js.org/reference/#/p5/pixelDensity
    pixelDensity(1);
    // calls filter menu, which displays the instructions on how to use the program
    filterMenu();
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    // resulting image
    resultImg = createImage(imgIn.width, imgIn.height);
    // copy of resulting image
    resultImg.copy(imgIn, 0, 0, imgIn.width, imgIn.height, 0, 0, imgIn.width, imgIn.height);
    image(earlyBirdFilter(imgIn), imgIn.width, 0); // draws selected filter
    noLoop(); // to help with speed of the program
}

/////////////////////////////////////////////////////////////////
// calls all filters
function earlyBirdFilter(img) {
    if (arFilters[0]) resultImg = sepiaFilter(resultImg);
    if (arFilters[1]) resultImg = darkCorners(resultImg);
    if (arFilters[2]) resultImg = radialBlurFilter(resultImg);
    if (arFilters[3]) resultImg = borderFilter(resultImg);
    if (arFilters[4]) resultImg = invertFilter(resultImg);
    if (arFilters[5]) resultImg = greyscaleFilter(resultImg)

    return resultImg; // returns image with applied filter
}
/////////////////////////////////////////////////////////////////

// Step 1
// function to handle sepia filter
function sepiaFilter(img) {
    img.loadPixels(); // loads pixels
    for (let i = 0; i < img.pixels.length; i += 4) {
        // conversion of red channel pixels
        let newRed = (img.pixels[i] * .393) + (img.pixels[i + 1] * .769) + (img.pixels[i + 2] * .189);
        // conversion of green channel pixels
        let newGreen = (img.pixels[i] * .349) + (img.pixels[i + 1] * .686) + (img.pixels[i + 2] * .168);
        // conversion of blue channel pixels
        let newBlue = (img.pixels[i] * .272) + (img.pixels[i + 1] * .534) + (img.pixels[i + 2] * .131);

        img.pixels[i] = newRed; // assignment to new red
        img.pixels[i + 1] = newGreen; // assignment to new green
        img.pixels[i + 2] = newBlue; // assignment to new blue
    }
    img.updatePixels();
    return img; // return sepia image
}
/////////////////////////////////////////////////////////////////

// Step 2
// function to handle dark corners filter
function darkCorners(img) {
    img.loadPixels();
    let imY, imX, pixIndex = 0;
    let centerX = round(img.width / 2); // used round() to round up the result 
    let centerY = round(img.height / 2); // used round() to round up the result 
    let maxPixDist = dist(centerX, centerY, 0, 0); // maximum pixel distance 

    for (imY = 0; imY < img.height; imY++) {
        for (imX = 0; imX < img.width; imX++) {
            pixIndex = (imY * img.width + imX) * 4; // multiply by 4 channels: red, green, blue, alpha
            let pixDist = dist(centerX, centerY, imX, imY); // pixel distance
            let dynLum = 1;

            // up to 300 pixels away from the center of the image – no adjustment 
            if (pixDist > 300) {
                // from 300 up to 450 scale by 1 to 0.4 depending on distance
                if (pixDist >= 300 && pixDist < 450) {
                    dynLum = map(constrain(pixDist, 300, 450), 300, 450, 1, 0.4);
                }
                // 450 and above scale by a value between 0.4 and 0
                if (pixDist >= 450) {
                    dynLum = map(constrain(pixDist, 450, maxPixDist), 450, maxPixDist, 0.4, 0);
                }
                // conversion of red channel pixels, used round() to round up the result 
                let newRed = round(img.pixels[pixIndex] * dynLum);
                // conversion of green channel pixels, used round() to round up the result 
                let newGreen = round(img.pixels[pixIndex + 1] * dynLum);
                // conversion of blue channel pixels, used round() to round up the result 
                let newBlue = round(img.pixels[pixIndex + 2] * dynLum);

                img.pixels[pixIndex + 0] = newRed; // assignment to new red
                img.pixels[pixIndex + 1] = newGreen; // assignment to new green
                img.pixels[pixIndex + 2] = newBlue; // assignment to new blue
            }
        }
    }
    img.updatePixels();
    return img; // returns image with dark corners
}
/////////////////////////////////////////////////////////////////

// Step 3
// function to handle radial blur filter
function radialBlurFilter(img) {
    imgOut = createImage(img.width, img.height);
    var matrixSize = matrix[matrixIndex].length;
    let centerX = mouseX - img.width; // Step 3: click on the part of the image you want to place at the centre of the radialBlurFilter()
    let centerY = mouseY;
    imgOut.loadPixels();
    img.loadPixels();

    let px = img.pixels; // original image

    // reads every pixel, responsible for blurring every pixel
    for (var imX = 0; imX < imgOut.width; imX++) {
        for (var imY = 0; imY < imgOut.height; imY++) {

            var index = (imX + imY * imgOut.width) * 4; // multiply by 4 channels: red, green, blue, alpha
            var c = convolution(imX, imY, matrix[matrixIndex], matrixSize, img); // calculation of blurred pixel

            imgOut.pixels[index + 0] = c[0]; // assigns blurred pixels to red channel
            imgOut.pixels[index + 1] = c[1]; // assigns blurred pixels to green channel
            imgOut.pixels[index + 2] = c[2]; // assigns blurred pixels to blue channel
            imgOut.pixels[index + 3] = 255; // adds not translucent alpha channel 
            // imgOut is completely blurred image
        }
    }

    for (var imX = 0; imX < imgOut.width; imX++) {
        for (var imY = 0; imY < imgOut.height; imY++) {
            let pixDist = dist(centerX, centerY, imX, imY); // calculating from mouse position to position of particular pixel

            var index = (imX + imY * imgOut.width) * 4; // multiply by 4 channels: red, green, blue, alpha

            // remaps the distance from a range from 100 to 300 to a new range from 0 to 1 
            // then constrains the returned value from 0 to 1 and saves it in the dynBlur variable
            let dynBlur = constrain(map(pixDist, 100, 300, 0, 1), 0, 1);

            // px = original image pixels, imgOut = blurred image
            /* assigning pixel behavior for each channel based on distance from the mouse:
                from 0 to 100 no blurring effect
                from 101 to 300 blurring effect, blurring effect intensifies with higher value
            */
            imgOut.pixels[index + 0] = round(imgOut.pixels[index + 0] * dynBlur + px[index + 0] * (1 - dynBlur)); // red channel
            imgOut.pixels[index + 1] = round(imgOut.pixels[index + 1] * dynBlur + px[index + 1] * (1 - dynBlur)); // green channel
            imgOut.pixels[index + 2] = round(imgOut.pixels[index + 2] * dynBlur + px[index + 2] * (1 - dynBlur)); // blue channel
            imgOut.pixels[index + 3] = 255; // adds not translucent alpha channel 
        }
    }
    imgOut.updatePixels();
    return imgOut; // returns image with radial blur filter
}

// helper function for radial blur filter 
// function was used as-is from the example code provided
function convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
}

// handles mouse presses for the radial blur filter
function mousePressed() {
    loop();
}
/*
// used mouseMoved() for the radial blur filter testing 
// as it allows to just move the mouse on the image to check unblurring effect
// left the code here in case Instructor/Tutor would like to use this functionality
function mouseMoved() {
    loop();
}
*/
/////////////////////////////////////////////////////////////////

// Step 4
// function to handle border filter
// https://p5js.org/reference/#/p5/rect
function borderFilter(img) {
    buffer = createGraphics(img.width, img.height);
    buffer.background(255, 255, 0);
    buffer.image(img, 0, 0);
    buffer.strokeWeight(0);
    buffer.stroke(0);

    // handles triangles covering missed spots by the rectangle
    buffer.triangle(0, 0, 85, 0, 0, 85); // top left triangle
    buffer.triangle(img.width, 0, img.width - 85, 0, img.width, 85); // top right triangle
    buffer.triangle(0, img.height, 0, img.height - 85, 85, img.height); // bottom left triangle
    buffer.triangle(img.width, img.height - 85, img.width - 85, img.height, img.width, img.height + 85); // bottom right triangle

    // handles rectangle 
    buffer.stroke(255); // white color
    buffer.noFill(); // without fill
    buffer.strokeWeight(30); // thickness 
    buffer.rect(15, 15, img.width - 30, img.height - 30, 70); // x, y, w, h, rounded corners
    return buffer;
}
/////////////////////////////////////////////////////////////////

/* Step 5 - Extension:
Added greyscaleFilter with minor changes to the provided code. 
Added invertFilter with minor changes to the provided code. 
Added two additional kernels stored in the matrix variable to create two more blur options for the Radial Blur filter.
Added filter switching mechanism to the program. Usability of which is described below the original image.
    Press 1: Sepia Filter
    Press 2: Dark Corners Filter
    Press 3: Radial Blur Filter (use SHIFT + 1 - 3 for other blur variations; use mouse presses to unblur parts of the image)
    Press 4: Rounded Corners Filter
    Press 5: Inverter Filter
    Press 6: Greyscale Filter
    Press 0: To Reset to Original Image
*/
// function to handle grey scale filter
function greyscaleFilter(img) {
    imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (x = 0; x < imgOut.width; x++) {
        for (y = 0; y < imgOut.height; y++) {
            // calculates index
            var index = (x + y * imgOut.width) * 4; // multiply by 4 channels: red, green, blue, alpha
            // red channel pixels
            var r = img.pixels[index + 0];
            // green channel pixels
            var g = img.pixels[index + 1];
            // blue channel pixels
            var b = img.pixels[index + 2];

            // average of 3 colors
            var gray = (r + g + b) / 3;

            // assigns grey scale value and no transparency
            imgOut.pixels[index + 0] = imgOut.pixels[index + 1] = imgOut.pixels[index + 2] = gray;
            imgOut.pixels[index + 3] = 255; // adds not translucent alpha channel 
        }
    }
    imgOut.updatePixels();
    return imgOut; // returns grey scaled image
}

// function to handle inverter filter (inverts image to green/black)
function invertFilter(img) {
    imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
            // calculates index
            var index = (x + y * imgOut.width) * 4; // multiply by 4 channels: red, green, blue, alpha
            // red channel pixels inversion 
            var r = 0 - img.pixels[index + 0];
            // green channel pixels inversion 
            var g = 255 - img.pixels[index + 1];
            // blue channel pixels inversion 
            var b = 0 - img.pixels[index + 2];

            imgOut.pixels[index + 0] = r; // assigns inversion to red channel
            imgOut.pixels[index + 1] = g; // assigns inversion to green channel
            imgOut.pixels[index + 2] = b; // assigns inversion to blue channel
            imgOut.pixels[index + 3] = 255; // adds not translucent alpha channel 
        }
    }
    imgOut.updatePixels();
    return imgOut; // returns inverted image
}

// filter menu
// https://p5js.org/reference/#/p5/createP
// https://p5js.org/reference/#/p5.Element/position
// https://p5js.org/reference/#/p5.Element/style
function filterMenu() {
    push();
    p1 = createP('Press 1: Sepia Filter'); // creates a <p></p> element in the DOM
    p1.style('font-size', '16px'); // sets the given style (CSS) property (font size) of the element with the given value (16 px size)
    p1.position(10, 720); // coordinates of the text

    p2 = createP('Press 2: Dark Corners Filter'); // creates a <p></p> element in the DOM
    p2.style('font-size', '16px'); // sets the given style (CSS) property (font size) of the element with the given value (16 px size)
    p2.position(10, 740); // coordinates of the text

    p3 = createP('Press 3: Radial Blur Filter (use SHIFT + 1 - 3 for other blur variations; use mouse presses to unblur parts of the image)'); // creates a <p></p> element in the DOM
    p3.style('font-size', '16px'); // sets the given style (CSS) property (font size) of the element with the given value (16 px size)
    p3.position(10, 760); // coordinates of the text

    p4 = createP('Press 4: Rounded Corners Filter'); // creates a <p></p> element in the DOM
    p4.style('font-size', '16px'); // sets the given style (CSS) property (font size) of the element with the given value (16 px size)
    p4.position(10, 780); // coordinates of the text

    p5 = createP('Press 5: Inverter Filter'); // creates a <p></p> element in the DOM
    p5.style('font-size', '16px'); // sets the given style (CSS) property (font size) of the element with the given value (16 px size)
    p5.position(10, 800); // coordinates of the text

    p5 = createP('Press 6: Greyscale Filter'); // creates a <p></p> element in the DOM
    p5.style('font-size', '16px'); // sets the given style (CSS) property (font size) of the element with the given value (16 px size)
    p5.position(10, 820); // coordinates of the text

    p6 = createP('Press 0: Reset to Original Image'); // creates a <p></p> element in the DOM
    p6.style('font-size', '16px'); // sets the given style (CSS) property (font size) of the element with the given value (16 px size)
    p6.position(10, 840); // coordinates of the text
    pop();
}

// function handles key presses by user
function keyTyped() {
    switch (key) {
        case '1':
            arFilters[0] = !arFilters[0]; // if 1 pressed, Sepia filter displays
            break;
        case '2':
            arFilters[1] = !arFilters[1]; // if 2 pressed, Dark Corners filter displays
            break;
        case '3':
            arFilters[2] = !arFilters[2]; // if 3 pressed, Blur Image filter displays
            break;
        case '4':
            arFilters[3] = !arFilters[3]; // if 4 pressed, Rounded Corners filter displays
            break;
        case '5':
            arFilters[4] = !arFilters[4]; // if 5 pressed, Image Inverter filter displays
            break;
        case '6':
            arFilters[5] = !arFilters[5]; // if 6 pressed, Greyscale filter displays
            break;

        case '0':
            arFilters[0] = false; // resets filter
            arFilters[1] = false; // resets filter
            arFilters[2] = false; // resets filter
            arFilters[3] = false; // resets filter
            arFilters[4] = false; // resets filter
            arFilters[5] = false; // resets filter
            break;

            // switches matrix (additional blur filter variations) for Radial Blur filter
        case '!':
            matrixIndex = 0; // uses first matrix on SHIFT + number 
            break;
        case '@':
            matrixIndex = 1; // uses second matrix on SHIFT + number
            break;
        case '#':
            matrixIndex = 2; // uses third matrix on SHIFT + number
            break;
    }
    loop();
}