function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function randomValue(list) {
    return list[Math.floor(Math.random() * list.length)];
}


// phaser shortcut
function addRectangle(x, y, w, h, rgb) {
    var sprite = game.add.graphics(x, y); 
    sprite.beginFill(Phaser.Color.getColor(rgb.r, rgb.g, rgb.b));
    sprite.bounds = new PIXI.Rectangle(0, 0, w, h); 
    sprite.drawRect(0, 0, w, h); 
    return sprite;
}

function addButton(parent, x, y, w, h, text, callback) {
    var button = new SlickUI.Element.Button(x, y, w, h);
    parent.add(button);
    button.inputEnabled = true;
    button.events.useHandCursor = true;
    button.events.onInputUp.add(callback);
    button.add(new SlickUI.Element.Text(0,0, text)).center();
    return button;
}

// HTML textbox overlaid on phaser
function addTextBox(id, x, y, w, placeholder) {
    placeholder = placeholder || "";
    var text = $("<input id='" + id + "' type='text' placeholder='" + placeholder + "'></input>");

    // account for css padding
    w -= 10;
    
    text.css({
        position: 'absolute',
        left: x,
        top: y,
        width: w
    })

    text.appendTo("#game-html");
    return text;
}

function clearHtml() {
    $("#game-html").empty();
}
