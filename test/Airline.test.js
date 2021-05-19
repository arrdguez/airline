const Airline = artifacts.require("Airline");

let instance;


beforeEach(async () =>{
  instance = await Airline.new()
});

contract('Airline', accounts =>{
  it('should have available flights', async() =>{
    let total = await instance.totalFlights();
    assert(total > 0);
  });

  it('should allow customer to buy flight', async() =>{
    let flight = await instance.flightsList(0);
    let flightName = flight[0], price = flight[1];

    await instance.buyFlight(0, {from: accounts[0], value: price});
    //let t = await instance.customerTotalFlights(accounts[0])
    //console.log(await instance.customerTotalFlights(accounts[0]));
    let customerFlight = await instance.customerFlightsMap(accounts[0], 0);
    let customerTotalFlights = await instance.customerTotalFlights(accounts[0]);

    assert(customerFlight[0], flightName);
    assert(customerFlight[1], price);
    assert(customerTotalFlights, 1);

    //console.log(customerFlight, customerTotalFlights);
  });

  it('shold not allow customer to buy flight under the price', async() =>{
    let flight = await instance.flightsList(0);
    let price = flight[1] - 5000;
    try {
      await instance.buyFlight(0, {from: accounts[0], value: price})
    } catch(e) {return;
      // statements
      //console.log(e);
    }
    assert.fail();
  });

  it('should get real balance of the contract', async()=>{
    let flight = await instance.flightsList(0);
    let price = flight[1];

    let flight2 = await instance.flightsList(0);
    let price2 = flight2[1];

    await instance.buyFlight(0, {from: accounts[0], value:price});
    await instance.buyFlight(0, {from: accounts[1], value:price2});

    let newAirlineBalance = await instance.getAirlineBalance();
    //console.log(newAirlineBalance.toNumber());

    console.log(await instance.getAirlineBalance());
    //assert.equal(newAirlineBalance.toNumber(), price.toNumber()+price2.toNumber());
  });

});