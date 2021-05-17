// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.16;


contract Airline{

  address public owner;

  struct CustomerStruct{
    uint loyaltyPoints;
    uint totalFlights;
  } 

  struct FlightStruct{
    string name;
    uint256 price;
  }

  uint etherPerPoint = 0.5 ether;

  FlightStruct[] public flightsList;

  mapping (address => CustomerStruct) public customersMap;
  mapping (address => FlightStruct[]) public customerFlightsMap;
  mapping (address => uint) public customerTotalFlights;
  

  event FlightPurchased(address indexed customer, uint price);
  


  constructor() public{
    owner = msg.sender;
     
    flightsList.push(FlightStruct('Tokio', 4 ether));
    flightsList.push(FlightStruct('German', 1 ether));
    flightsList.push(FlightStruct('Mexico', 2 ether));
  }

  function buyFlight(uint flightIndex) public payable{
    FlightStruct memory flight = flightsList[flightIndex];

    require (msg.value == flight.price);
    CustomerStruct storage customer = customersMap[msg.sender];
    customer.loyaltyPoints +=5;
    customer.totalFlights +=1;
    customerFlightsMap[msg.sender].push(flight);
    customerTotalFlights[msg.sender] ++;

    emit FlightPurchased(msg.sender, flight.price);
  }

  function totalFlights () public view returns(uint) {
    return flightsList.length;
    
  }
  

  function redeemCustomer () public {
    CustomerStruct storage customer = customersMap[msg.sender];
    uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
    msg.sender.transfer(etherToRefund);
    customer.loyaltyPoints = 0;
  }

  function getRefundableEther () public view returns(uint) {
    return etherPerPoint * customersMap[msg.sender].loyaltyPoints;
  }
  
  
  function getAirlineBalance () public isOwner view returns(uint) {
    return address(this).balance;
  }
  
  modifier isOwner() { 
    require (msg.sender == owner); 
    _; 
  }
  

}
