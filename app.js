const express = require("express");
const app = express();
const port = process.env.PORT || 3003;

const {createCanvas} = require('canvas')

const server = app.listen(port, () =>
	console.log("Server Listening on " + port)
);

app.get("/", (req, res) => {
    let html = `<h1>Placeholder images API:</h1> <h3>Usage:</h3>
                <p>Add the parameters to the URL to generate PNG images.</p>
                <ul>
                    <li>hostname/width - To generate image of the given width</li>
                    <li>hostname/width/height - To generate image of the given width and height</li>
                    <li>Eg: localhost/150 - will generate image of width 150</li>
                </ul>`;
    res.status(200).send(html);
})

app.get("/:width", (req, res) => {
    let width = req.params.width;
    if (!width || !width.match(/^\d+$/)) return res.status(400).send("Width must be a number");
    renderImage(Buffer.from(createBase64Image(width, width).split(",")[1], "base64"), res);
})

app.get("/:width/:height", (req, res) => {
    let width = req.params.width;
    let height = req.params.height;
    if (!width || !width.match(/^\d+$/)) return res.status(400).send("Width must be a number");
    if (!height || !height.match(/^\d+$/)) return res.status(400).send("Height must be a number");
    renderImage(Buffer.from(createBase64Image(width, height).split(",")[1], "base64"), res);
})

function createBase64Image(width, height, color = "#44444480") {
    
    let text = `${width} x ${height}`;
    var canvas = createCanvas(parseInt(width), parseInt(height));
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, width / 2, height / 2);

    var img = canvas.toDataURL("image/png");
    return img;
}

function renderImage(img, res) {
    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": img.length,
    });
    res.end(img); 
}