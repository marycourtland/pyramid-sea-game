var MainOffice = {};

MainOffice.preload = function() {
    game.slickUI.load('assets/ui/kenney/kenney.json');
}

MainOffice.create = function() {
    game.stage.backgroundColor = "#949292";

    // person
    //game.add.sprite(0, 0, 'character');

    // desk
    var desk_height = 32*4;
    var bg = game.add.sprite(0, 0, 'main-office');
    bg.inputEnabled = true;
    bg.events.onInputUp.add(hideCustomerList);

    // Buttons

    addButton(game.slickUI,
        game.width - hud_margin - button_w,
        game.height - hud_margin - button_h,
        button_w,
        button_h,
        'Call a Customer',
        function() { showCustomerList(); }
    );

    addButton(game.slickUI,
        hud_margin,
        game.height - hud_margin - button_h,
        button_w,
        button_h,
        'Warehouse',
        function() { game.state.start('Warehouse') }
    );


    addButton(game.slickUI,
        game.width - hud_margin - button_w,
        hud_margin,
        button_w,
        button_h,
        'Go Outside',
        function() { game.state.start('BrowsePlans') }
    );


    // Customer list
    var contact_list_width = 480;
    var contact_list_y = 120;
    var contact_list = new SlickUI.Element.Panel(
        contact_list_width/2,
        contact_list_y,
        //game.height,
        contact_list_width,
        game.height - contact_list_y + 20
    )
    game.slickUI.add(contact_list);
    contact_list.add(new SlickUI.Element.Text(0,10, "Latest Customer Leads")).centerHorizontally()
    contact_list.visible = false;
    

    var customers = MainOffice.getNewCustomers(5);
    var item_height = 64;
    var item_width = 32*6;
    var item_padding = 16;
    customers.forEach(function(customer, i) {
        var call_button = addButton(contact_list,
            (contact_list_width - item_width)/2, 
            64+ (item_height + item_padding)*i,
            item_width,
            item_height,
            '',
            function() {
                game.current_customer = customer;
                game.state.start('InCall');
            }
        );
        call_button.add(new SlickUI.Element.Text(10,4, (customer.name).toUpperCase()));
        var details = customer.age + ', ' + customer.location;
        call_button.add(new SlickUI.Element.Text(10,28, details));
    })

    function showCustomerList() {
        if(contact_list.visible) return;
        contact_list.y = game.height;
        contact_list.visible = true;
        game.add.tween(contact_list).to( {y:contact_list_y}, 500, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
            // ?
        });
        game.slickUI.container.displayGroup.bringToTop(contact_list.container.displayGroup);
    }

    function hideCustomerList() {
        if(!contact_list.visible) return;
        //contact_list_y = game.width;
        //contact_list.visible = true;
        //contact_list.x = basePosition + 156;
        game.add.tween(contact_list).to( {y: game.height}, 500, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
            // ?
            contact_list.visible = false;
        });
        game.slickUI.container.displayGroup.bringToTop(contact_list.container.displayGroup);
    }



}

MainOffice.getNewCustomers = function(n) {
    var customers = [];
    for (var i = 0; i < n; i++) {
        customers.push(generateCustomer());
    }
    return customers;
}

MainOffice.showContactList = function() {
}
