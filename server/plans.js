// Todo: persist these
// Todo: decide on time units for the rate?

// If player_id is null, it's an NPC

var moment = require('moment');

var main_frequency = 12;

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
                product: 'scented_air',
                price_per_unit: 50,   // how much people pay per unit, each time
                quantity: 1,  // number of units to transfer each time
                frequency: main_frequency  // transactions processed every this-many ticks
            },
            {
                product: 'organic_grass',
                price_per_unit: 75,
                quantity: 1,
                frequency: main_frequency
            },
            {
                product: 'fresh_dirt',
                price_per_unit: 125,
                quantity: 1,
                frequency: main_frequency
            },
            {
                product: 'dust_bunnies',
                price_per_unit: 150,
                quantity: 1,
                frequency: main_frequency
            },
            {
                product: 'seasonal_pollen',
                price_per_unit: 250,
                quantity: 1,
                frequency: main_frequency
            },
            {
                product: 'artisanal_saltwater',
                price_per_unit: 350,
                quantity: 1,
                frequency: main_frequency
            },
        ]
    },
    {
        // this person takes a lower cut, but has higher prices and fewer items
        id: 1,
        player_id: null,
        distributor: 'Limited Selection',
        created_time: moment(),
        retired_time: null,
        cut: 0.6,
        retired: false,
        products: [
            {
                product: 'scented_air',
                price_per_unit: 15,
                quantity: 1,
                frequency: main_frequency
            },
            {
                product: 'seasonal_pollen',
                price_per_unit: 300,
                quantity: 1,
                frequency: main_frequency
            }
        ]
    },
    {
        // Lower cut, same prices, but much higher volume
        // $4450 total per transaction!
        id: 2,
        player_id: null,
        distributor: 'Bulk Wholesale',
        created_time: moment(),
        retired_time: null,
        cut: 0.6, 
        retired: false,
        products: [
            {
                product: 'scented_air',
                price_per_unit: 50,
                quantity: 10,
                frequency: main_frequency
            },
            {
                product: 'organic_grass',
                price_per_unit: 75,
                quantity: 10,
                frequency: main_frequency
            },
            {
                product: 'fresh_dirt',
                price_per_unit: 125,
                quantity: 10,
                frequency: main_frequency
            },
            {
                product: 'dust_bunnies',
                price_per_unit: 150,
                quantity: 5,
                frequency: main_frequency
            },
            {
                product: 'seasonal_pollen',
                price_per_unit: 250,
                quantity: 2,
                frequency: main_frequency
            },
            {
                product: 'artisanal_saltwater',
                price_per_unit: 350,
                quantity: 2,
                frequency: main_frequency
            },
        ]
    },
]

