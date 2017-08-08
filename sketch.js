var canvas, canvasContainer;
var input;
var columns, rows;
var columnWidth = 20;
var boxes;
var notationButton;
var firstNotation = true;

function setup() {
    loadJSON("palettes.json", gotPalettes);
    input = select("#input");
    canvasContainer = select("#canvascontainer");
    prepareCanvasSize();
    canvas = createCanvas(canvasContainer.width, rows * columnWidth);
    columns = Math.floor(width / columnWidth);
    background(255);
    noLoop();
    noStroke();
    notationButton = select('#notationButton');
    notationButton.mouseClicked(notate);
}

function prepareCanvasSize() {
    var s = input.html();
    var re = /<div>/gi;
    s = s.replace(re, "");
    re = /<\/div>/gi;
    s = s.replace(re, "");
    re = /<br>/gi;
    s = s.replace(re, "");
    re = /<i>/gi;
    s = s.replace(re, "");
    re = /<\/i>/gi;
    s = s.replace(re, "");
    re = /<br \/>/gi;
    s = s.replace(re, "");

    var r = /\b[A-z]+\b/g;

    var matches = s.match(r);
    var s2 = "";
    for (var i = 0; i < matches.length; i++) {
        s2 += matches[i] + " ";
    }
    s = s2;

    var widthByAmount = canvasContainer.width / columnWidth;
    var flooredAmount = Math.floor(widthByAmount);
    columnWidth = canvasContainer.width / flooredAmount;
    rows = Math.ceil(s.length / flooredAmount) + 1;
}

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function notate() {
    prepareCanvasSize();
    resizeCanvas(canvasContainer.width, rows * columnWidth);
    if (firstNotation) {
        firstNotation = false;
    } else {
        shufflePalettes();
    }
    var s = input.html();

    // console.log(s);
    s = s.replace(/\n/gi, " ");
    s = s.replace(/<br>/gi, " ");
    s = s.replace(/<br \/>/gi, " ");
    s = s.replace(/<br\/>/gi, " ");
    s = strip(s);
    var re = /<div>/gi;
    s = s.replace(re, "");
    re = /<\/div>/gi;
    s = s.replace(re, "");
    re = /<i>/gi;
    s = s.replace(re, "");
    re = /<\/i>/gi;
    s = s.replace(re, "");
    re = /[.',\/#!?$%\^&\*;:{}=_`~()]/gi;
    s = s.replace(re, " ");
    // console.log(s);

    var tags = RiTa.getPosTags(s);
    // console.log(tags);

    var r = /\b[A-z\-]+\b/g;
    var matches = s.match(r);
    // console.log(matches.length);

    var numberOfChars = 0;
    boxes = [];
    var ac0 = hexToRgb(palette[0]);
    var ac1 = hexToRgb(palette[1]);
    var ac2 = hexToRgb(palette[2]);
    var ac3 = hexToRgb(palette[3]);
    var ac4 = hexToRgb(palette[4]);
    var red = (ac0.r + ac1.r + ac2.r + ac3.r + ac4.r) / 5;
    var green = (ac0.g + ac1.g + ac2.g + ac3.g + ac4.g) / 5;
    var blue = (ac0.b + ac1.b + ac2.b + ac3.b + ac4.b) / 5;
    var emptyColor = color(red, green, blue);

    for (var i = 0; i < tags.length; i++) {
        var partOfSpeech = tags[i];
        var col = selectColor(partOfSpeech);
        if (col == null) {
            col = emptyColor;
        }
        var wordWidth = matches[i].length;
        for (var w = 0; w < wordWidth; w++) {
            boxes.push([col, matches[i][w]]);
        }
        if (i !== matches.length - 1) {
            boxes.push([emptyColor, null]);
        }
    }
    fillSheet();
    styleButton();
}

function fillSheet() {
    background(255);
    for (var x = 0; x < columns; x++) {
        for (var y = 0; y < rows; y++) {
            var num = x + (y * columns);
            if (boxes[num]) {
                fill(boxes[num][0]);
                push();
                translate(x * columnWidth, y * columnWidth);
                rect(0, 0, columnWidth + 0.5, columnWidth + 0.5);
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
    // console.log("POS : " + POS);
    var col;
    switch (POS) {
        // Noun, singular or mass
        case "nn":
            col = [0];
            break;
            // Noun, plural
        case "nns":
            col = [0];
            break;

            // Proper noun, singular
        case "nnp":
            col = [0, 1];
            break;
            // Proper noun, plural
        case "nnps":
            col = [0, 1];
            break;

            //Adjectives
        case "jj":
            col = [1];
            break;
        case "jjr":
            col = [1];
            break;
        case "jjs":
            col = [1];
            break;

            //Determiner
        case "dt":
            col = [2];
            break;
            //Predeterminer
        case "pdt":
            col = [2];
            break;
            //Wh-determiner
        case "wdt":
            col = [2];
            break;

            //Pronouns
        case "prp":
            col = [2, 0];
            break;
        case "prp$":
            col = [2, 0];
            break;
            //wh-pronoun
        case "wp":
            col = [2, 0];
            break;
            //Possessive wh-pronoun
        case "wp$":
            col = [2, 0];
            break;
            //Possessive ending
        case "pos":
            col = [2, 1];
            break;

            //  Preposition or subordinating conjunction
        case "in":
            col = [4, 2];
            break;

            //Existential there
        case "ex":
            col = [4, 2];
            break;

            //Coordinating conjunction
        case "cc":
            col = [4, 3];
            break;
        case "to":
            col = [4, 2];
            break;

            //Interjection
        case "uh":
            col = [4, 1];
            break;

            //Cardinal number
        case "cd":
            col = [0, 4];
            break;

            //Verbs
        case "vb":
            col = [3];
            break;
        case "vbd":
            col = [3];
            break;
        case "vbg":
            col = [3];
            break;
        case "vbn":
            col = [3];
            break;
        case "vbp":
            col = [3];
            break;
        case "vbz":
            col = [3];
            break;

            //Modal
        case "md":
            col = [3, 1];
            break;

            //Adverbs
        case "rb":
            col = [4];
            break;
        case "rbr":
            col = [4];
            break;
        case "rbs":
            col = [4];
            break;
            //Who adverb
        case "wrb":
            col = [4];
            break;

            //Particle
        case "rp":
            col = [3, 0];
            break;

        default:
            col = null;
    }
    if (col !== null) {
        col = interpretColor(col);
    }
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
        if (currentDifference > difference) {
            difference = currentDifference;
            finalCol = sums[i][1];
        }
    }
    return color(finalCol.r, finalCol.g, finalCol.b);
}