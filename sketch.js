var canvas, ctx, canvasContainer;
var input;
var lexicon;
var columns;
var columnWidth = 20;
var boxes;
var textInput;
var notationButton;

function setup() {
    canvasContainer = select("#canvascontainer");
    loadJSON("palettes.json", gotPalettes);
    // createCanvas((columns + 4) * columnWidth, (columns + 4) * columnWidth);
    canvas = createCanvas(canvasContainer.width, canvasContainer.width);
    columns = Math.floor(width / columnWidth);
    background(255);
    noLoop();
    noStroke();
    input = select("#input")
    lexicon = new RiLexicon();
    notationButton = select('#notationButton');
    notationButton.mouseClicked(notate);
}

function draw() {
    for (var i = 0; i < columns; i++) {
        fill(random(255));
        rect(i * columnWidth, 0, columnWidth, columnWidth);
    }
}

function notate() {

    currentPaletteIndex = Math.floor(Math.random() * 4000);
    palette = allPalettes[currentPaletteIndex];
    var s = input.html();
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

        // var emptyColor = hexToRgb(palette[4]);
        var ac0 = hexToRgb(palette[0]);
        var ac1 = hexToRgb(palette[1]);
        var ac2 = hexToRgb(palette[2]);
        var ac3 = hexToRgb(palette[3]);
        var ac4 = hexToRgb(palette[4]);
        var red = (ac0.r + ac1.r + ac2.r + ac3.r + ac4.r) / 5;
        var green = (ac0.g + ac1.g + ac2.g + ac3.g + ac4.g) / 5;
        var blue = (ac0.b + ac1.b + ac2.b + ac3.b + ac4.b) / 5;
        var emptyColor = color(red, green, blue);

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
    styleButton();
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
                    var opp = getOppositeColor(boxes[num][0]);
                    fill(red(opp), green(opp), blue(opp), 190);
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
        case "nns":
            col = [0];
            break;
        case "dt":
            col = [0, 1];
            break;
        case "prp":
            col = [0, 2];
            break;
        case "prp$":
            col = [0, 2];
            break;
        case "nnp":
            col = [0, 4];
            break;
        case "jj":
            col = [1];
            break;
        case "jjr":
            col = [1];
            break;
        case "jjs":
            col = [1];
            break;

        case "rb":
            col = [4];
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
            col = [3, 2];
            break;
        case "vbz":
            col = [3, 4];
            break;
        case "vbn":
            col = [2, 4];
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

function keyPressed() {
    if (key == 'p' || key == 'P') {
        currentPaletteIndex = Math.floor(Math.random() * 4000);
        newText();
        fillSheet();
    }
}

function getOppositeColor(col) {
    var currentSum = red(col) + green(col) + blue(col);
    var ac0 = hexToRgb(palette[0]);
    var ac1 = hexToRgb(palette[1]);
    var ac2 = hexToRgb(palette[2]);
    var ac3 = hexToRgb(palette[3]);
    var ac4 = hexToRgb(palette[4]);
    var sum0 = ac0.r + ac0.g + ac0.b;
    var sum1 = ac1.r + ac1.g + ac1.b;
    var sum2 = ac2.r + ac2.g + ac2.b;
    var sum3 = ac3.r + ac3.g + ac3.b;
    var sum4 = ac4.r + ac4.g + ac4.b;
    var sums = [
        [sum0, ac0],
        [sum1, ac1],
        [sum2, ac2],
        [sum3, ac3],
        [sum4, ac4]
    ];
    var difference = 0;
    var finalCol;
    for (var i = 0; i < sums.length; i++) {
        var currentDifference = Math.abs(currentSum - sums[i][0]);
        // console.log(currentDifference);
        if (currentDifference > difference) {
            difference = currentDifference;
            finalCol = sums[i][1];
        }
    }
    return color(finalCol.r, finalCol.g, finalCol.b);
}