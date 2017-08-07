var InCall = {};
var current_customer = null;

// game.current_customer
var convo_width = 800;
var convo_height = 230;

InCall.current_dialog_output = null;


InCall.preload = function() {
    game.slickUI.load('assets/ui/kenney/kenney.json');
}

InCall.create = function() {
    game.stage.backgroundColor = "#b8966b";
    this.dialog_options = [];

    if (true)
    addButton(game.slickUI,
        hud_margin,
        game.height - hud_margin,
        button_w,
        button_h,
        'Back to Office',
        function() { game.state.start('MainOffice') }
    );

    // convo
    if (false)
    var convo = game.add.sprite(
        (game.width - convo_width) / 2,
        (game.height - convo_height) / 2,
        'convo-plate'
    );

    this.transaction = startTransaction(game.current_customer);

    var initial_output = this.transaction.getNextDialog(null);
    console.log(initial_output)

    this.renderTransactionOutput(initial_output);

    // Customer profile pic
    this.customer_pic = game.add.sprite(
        (game.width - convo_width) / 2,
        hud_margin,
		current_customer.image
    );

    // Your profile pic (currently turned off)
    if (false) {
        this.player_pic = game.add.sprite(
            game.width - (game.width - convo_width) / 2,
            hud_margin,
            'player_convo'
        )
        this.player_pic.anchor.X = 1;
    }
}

InCall.renderTransactionOutput = function(output) {
    // TODO: animate speaker talking


    // remove old buttons
    this.dialog_options.forEach(function(b) {
        b.destroy();
    })

    this.dialog_options = [];

    // main text
    var main_text_width = 400;
    var main_text_height = 320;
    var main_text = new SlickUI.Element.Panel(
        game.width - (game.width - convo_width) / 2 - main_text_width,
        hud_margin,
        main_text_width,
        main_text_height
    )
    game.slickUI.add(main_text);
    this.dialog_options.push(main_text); // so it gets destroyed (and recreated) next time

	main_text.add(new SlickUI.Element.Text(10, 10, output.dialog));

    var num_options = Object.keys(output.options).length;
    var option_height = 32 * 2;
    var option_pad = 8;

    var self = this;
    Object.keys(output.options).forEach(function(option_key, i) {
        var text = output.options[option_key];
        var button = addButton(
            game.slickUI,
            (game.width - convo_width) / 2,
            game.height - option_pad - ((num_options - i) * (option_height + option_pad)),
            convo_width,
            option_height,
            text,
            function() {
                self.customerChoosesOption(option_key);
            },
            false
        )
        self.dialog_options.push(button);
    })
}

InCall.customerChoosesOption = function(option_key) {
    var output = this.transaction.getNextDialog(option_key);
    console.log('Output:', output)

    if (output) {
        this.renderTransactionOutput(output);
    }
    else {
        console.log('DONE!')
    }

}
