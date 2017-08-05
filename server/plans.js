// Todo: persist these
// Todo: decide on time units for the rate?


var plans = module.exports = [
    {
        id: 0,
        distributor: 'StarterBoss',
        product: 'widgets',
        price: 10,   // how much people pay each time
        amount: 10,  // amount to transfer each time
        rate: 1 // per minute?
    },
    {
        id: 1,
        distributor: 'SomeoneElse',
        product: 'air',
        price: 9999, 
        amount: 10,
        rate: 1
    },
]

