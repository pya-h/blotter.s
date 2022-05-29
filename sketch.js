let font = null,
    screenWidth = 0,
    screenHeight = 0;
const fontName = "./Calistoga-Regular.ttf";
const expressions = "SHROOMS BLOTTER DOTS AND TABS".split(" ");
let fontSize = 100,
    fontSizeChanges = 0;
const fontSizeMax = 150,
    fontSizeMin = 50;
let index = 0;
const position = { x: 0, y: 0 },
    v = { x: 0, y: 0 };
let teta = 0,
    omega = 0;
const dragStart = { x: 0, y: 0, t: 0 },
    dragEnd = { x: 0, y: 0, t: 0 };
let textChangeIntervalID = null;
let points = [];
const colors = [{ r: 0, g: 0, b: 0 }];
let amt = null;

function calculateNewVelocity() {
    const dt = (dragEnd.t - dragStart.t) / 20;
    v.x = (dragEnd.x - dragStart.x) / dt;
    v.y = (dragEnd.y - dragStart.y) / dt;
    console.log(v)
}

function onBodyMouseKeyPress(event) {
    v.x = v.y = 0;
    dragStart.x = mouseX;
    dragStart.y = mouseY;
    omega = 1;
    fontSizeChanges = 0;
    dragStart.t = millis();
    clearInterval(textChangeIntervalID);
    textChangeIntervalID = null;
}

function onBodyMouseKeyRelease(event) {
    dragEnd.x = mouseX;
    dragEnd.y = mouseY;
    dragEnd.t = millis();
    omega = 0;
    fontSizeChanges = 2;
    calculateNewVelocity();
    textChangeIntervalID = setInterval(() => {
        index = (index + 1) % expressions.length
    }, 1500);
}

function preload() {
    font = loadFont(fontName);
}

function decorate() {
    var trail = map(mouseY, 0, height, 1, 10);
    fill(0, trail);
    rect(0, 0, width, height);

    noStroke();
    for (let i = 0; i < points.length; i++) {
        colors.push({ r: random(0, 256), g: random(0, 256), b: random(0, 256) })
        fill(colors[i].r, colors[i].g, colors[i].b);

        amt = map(mouseX, 0, width, 0, 80);
        const pointNoise = {
            x: noise(points[i].x + points[i].y + (frameCount * 0.2)),
            y: noise(points[i].x + points[i].y + 2 + (frameCount * 0.2))
        };
        var location = {
            x: map(pointNoise.x, 0, 1, -amt, amt),
            y: map(pointNoise.y, 0, 1, -amt, amt)
        };
        ellipse(points[i].x + location.x, points[i].y + location.y, 4, 4);
    }
}

function setup() {
    // put setup code here
    screenWidth = document.body.clientWidth;
    screenHeight = document.body.clientHeight;
    document.body.addEventListener("mousedown", onBodyMouseKeyPress)
    document.body.addEventListener("mouseup", onBodyMouseKeyRelease)
    position.x = screenWidth / 2;
    position.y = screenHeight / 2;
    createCanvas(screenWidth, screenHeight);
    background(0);

    angleMode(DEGREES);
    textFont(font);
    textAlign(CENTER, CENTER);
    textChangeIntervalID = setInterval(() => {
        index = (index + 1) % expressions.length
    }, 1500);


}

function draw() {
    // put drawing code here
    points = font.textToPoints(expressions[index], position.x, position.y, fontSize, {
        sampleFactor: .3,
        simplifyThreshold: 0
    });
    decorate();
    textSize(fontSize);
    rotate(teta);
    text(expressions[index], position.x, position.y);
    position.x += v.x;
    position.y += v.y;
    fontSize += fontSizeChanges;
    teta = (teta + omega) % 4;
    if (position.x + fontSize / 2 >= screenWidth || position.x - fontSize / 2 <= 0)
        v.x *= -1;
    if (position.y + fontSize / 2 >= screenHeight || position.y - fontSize / 2 <= 0)
        v.y *= -1;
    if (fontSize >= fontSizeMax || fontSize <= fontSizeMin)
        fontSizeChanges *= -1;

}