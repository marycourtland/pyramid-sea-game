// Todo: persist these
// Todo: decide on time units for the rate?

// If player_id is null, it's an NPC

var plans = module.exports = [
    {
        id: 0,
        player_id: null,
        distributor: 'StarterBoss',
        cut: 0.8, // how much the distributor takes (a lot)
        retired: false,
        products: [
            {
                product: 'widgets',
                price: 10,   // how much people pay each time
                amount: 10,  // amount to transfer each time
                rate: 1 // per minute?
            }
        ]
    },
    {
        // this person takes a lower cut, but has higher prices
        id: 1,
        player_id: null,
        distributor: 'SomeoneElse',
        cut: 0.6,
        retired: false,
        products: [
            {
                product: 'widgets',
                price: 15,
                amount: 10,
                rate: 1
            },
            {
                product: 'air',
                price: 9999,
                amount: 10,
                rate: 1
            }
        ]
    },
]

