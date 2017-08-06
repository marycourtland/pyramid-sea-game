// Todo: persist these
// Todo: decide on time units for the rate?

// If player_id is null, it's an NPC

var moment = require('moment');

var plans = module.exports = [
    {
        id: 0,
        player_id: null,
        distributor: 'StarterBoss',
        created_time: moment(),
        retired_time: null,
        cut: 0.8, // how much the distributor takes (a lot)
        retired: false,
        products: [
            {
                product: 'widgets',
                price_per_unit: 10,   // how much people pay per unit, each time
                quantity: 10,  // number of units to transfer each time
                frequency: 12  // transactions processed every this-many ticks
            }
        ]
    },
    {
        // this person takes a lower cut, but has higher prices
        id: 1,
        player_id: null,
        distributor: 'SomeoneElse',
        created_time: moment(),
        retired_time: null,
        cut: 0.6,
        retired: false,
        products: [
            {
                product: 'widgets',
                price_per_unit: 15,
                quantity: 10,
                frequency: 12
            },
            {
                product: 'air',
                price_per_unit: 9999,
                quantity: 10,
                frequency: 12
            }
        ]
    },
]

