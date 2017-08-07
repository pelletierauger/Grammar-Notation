var allPalettes;
var currentPaletteIndex = 12;

function gotPalettes(palettes) {
    allPalettes = palettes;
    palette = allPalettes[currentPaletteIndex];
    styleButton();
    notate();
}

function shufflePalettes() {
    var choice = currentPaletteIndex;
    while (choice == currentPaletteIndex) {
        choice = Math.floor(Math.random() * 18);
    }
    currentPaletteIndex = choice;
    palette = allPalettes[currentPaletteIndex];
}

function styleButton() {
    var col = hexToRgb(palette[3]);
    col = color(col.r, col.g, col.b);
    var colOpp = getOppositeColor(col);
    notationButton.style("background-color", "#" + palette[3]);
    notationButton.style("color", colOpp);
    notationButton.style("border-color", colOpp);
    input.style("border-color", colOpp);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}