var textField, input;
var output;
var lexicon;
var columns = 48;
var columnWidth = 20;
var boxes;

function setup() {
    loadJSON("palettes.json", gotPalettes);
    createCanvas(columns * columnWidth, columns * columnWidth);
    noLoop();
    background(255);
    noStroke();

    input = select("#input");
    input.changed(newText);
    output = select("#output");
    lexicon = new RiLexicon();
}

function draw() {
    for (var i = 0; i < columns; i++) {
        fill(random(255));
        rect(i * columnWidth, 0, columnWidth, columnWidth);
    }
}

function newText() {
    var s = this.value();
    console.log("Text has changed :", s);
    var r = /\b[A-z]+\b/g;

    var matches = s.match(r);
    console.log(matches);
    var numberOfChars = 0;
    boxes = [];
    for (var i = 0; i < matches.length; i++) {
        var partOfSpeech = RiTa.getPosTags(matches[i]);
        var col = selectColor(partOfSpeech);
        var wordWidth = matches[i].length;
        for (var w = 0; w < wordWidth; w++) {
            boxes.push([col, matches[i][w]]);
        }

        var emptyColor = hexToRgb(palette[4]);
        emptyColor = color(emptyColor.r, emptyColor.g, emptyColor.b);

        boxes.push([emptyColor, null]);
        // fill(col);
        // 
        // var drawerWidth = 0;
        // for (var j = 0; j < wordWidth; j++) {
        //     rect(0, 0, columnWidth, columnWidth);
        //     drawerWidth += columnWidth;
        //     if (drawerWidth > (columns * columnWidth))
        // }
        // numberOfChars += matches[i].length + 1;
        // console.log(matches[i] + ": " + RiTa.getPosTags(matches[i]));
    }
    console.log(numberOfChars);
    fillSheet();
}

function fillSheet() {
    background(255);
    for (var x = 0; x < columns; x++) {
        for (var y = 0; y < columns; y++) {
            var num = x + (y * columns);
            if (boxes[num]) {
                fill(boxes[num][0]);
                push();
                translate(x * columnWidth, y * columnWidth);
                rect(0, 0, columnWidth, columnWidth);
                if (boxes[num][1]) {
                    translate(columnWidth / 4, -columnWidth / 4);
                    fill(0);
                    text(boxes[num][1], 0, 0 + columnWidth);
                }
                pop();
            }
        }
    }
}

function selectColor(POS) {
    console.log("POS : " + POS);
    var col;
    switch (POS[0]) {
        case "nn":
            col = [0];
            break;
        case "nnp":
            col = [0, 4];
            break;
        case "jj":
            col = [1];
            break;
        case "jjr":
            col = [1, 0];
            break;
        case "rb":
            col = [2];
            break;
        case "vb":
            col = [3];
            break;
        case "vbg":
            col = [3, 0];
            break;
        case "vbd":
            col = [3, 1];
            break;
        case "vbp":
            col = [4, 0];
            break;
        case "vbz":
            col = [3, 2];
            break;
        case "vbn":
            col = [3, 4];
            break;
        default:
            col = [3, 4];
    }
    col = interpretColor(col);
    // col = hexToRgb(col);
    // col = color(col.r, col.g, col.b);
    return col;
}

function interpretColor(col) {
    var pal;
    if (col.length == 1) {
        pal = hexToRgb(palette[col[0]]);
        pal = color(pal.r, pal.g, pal.b)
    } else if (col.length == 2) {
        var color1 = col[0];
        var color2 = col[1];
        color1 = hexToRgb(palette[color1]);
        color2 = hexToRgb(palette[color2]);
        pal = color((color1.r + color2.r) / 2, (color1.g + color2.g) / 2, (color1.b + color2.b) / 2);
    }
    return pal;
}