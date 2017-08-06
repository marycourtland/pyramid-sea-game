var JoinGame = {};

JoinGame.preload = function() {
    game.slickUI.load('assets/ui/kenney/kenney.json');
}

JoinGame.create = function() {
    game.stage.backgroundColor = "#949292";

    var margin = 100;
    var panel = new SlickUI.Element.Panel(margin, margin, game.width - 2*margin, game.height - 2*margin);
    game.slickUI.add(panel);
    panel.add(new SlickUI.Element.Text(10,10, "Welcome, new partner! What's your name?")).centerHorizontally()

    addTextBox('name_input',
        margin+20,
        margin+80,
        game.width - 2*margin - 40,
        "What's your name?"
    );

    var enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enter.onDown.add(JoinGame.join, this);

    // TODO: a 'join' button would also be good
}

JoinGame.join = function() {
    var name = $("name_input").val();
    Client.newPlayer(name);
    game.state.start('MainOffice');
}
