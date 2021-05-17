const Airline = artifacts.require("Airline");

let instance;


beforeEach(async () =>{
  instante = await Airline.new()
});

contract('Airline', accounts =>{
  it('should have available flights', async() =>{
    let total = await instante.totalFlights();
    assert(total > 0);
  });
});