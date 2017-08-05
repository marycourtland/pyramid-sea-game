// Todo: persist these
// Todo: decide on time units for the rate?


var plans = module.exports = [
    {
        id: 0,
        distributor: 'StarterBoss',
        cut: 0.8, // how much the distributor takes (a lot)
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
        distributor: 'SomeoneElse',
        cut: 0.6,
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

