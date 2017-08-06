var JoinGame = {};

JoinGame.preload = function() {
    game.slickUI.load('assets/ui/kenney/kenney.json');
}

JoinGame.create = function() {
    game.stage.backgroundColor = "#949292";
    //game.add.sprite(0, 0, 'main-office');

    var margin = 100;
    var panel = new SlickUI.Element.Panel(margin, margin, game.width - 2*margin, game.height - 2*margin);
    game.slickUI.add(panel);
    panel.add(new SlickUI.Element.Text(10,40, "Welcome, new Partner! Please sign here.")).centerHorizontally()

    addTextBox('name_input',
        margin+40,
        margin+120,
        game.width - 2*margin - 80,
        ""
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
