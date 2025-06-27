// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract socivaContract{

event AddSiv(address recipient, uint sivId);
event DeleteSiv(uint sivId, bool isDeleted);

  struct Siv{
    uint256 id;
    address username;
    string sivText;
    bool isDeleted;
  }

  Siv[] private sivs;

   //Mapping of siv id to the wallet address of the user
   mapping(uint256 => address) sivToOwner;

   //Method to be called by our frontend when trying to add a new Siv
   function addSiv(string memory sivText, bool isDeleted) external {
    uint sivId = sivs.length;
    sivs.push(Siv(sivId, msg.sender, sivText, isDeleted));
    sivToOwner[sivId] = msg.sender;
    emit AddSiv(msg.sender, sivId);
   }

   //Method to get all the sivs
   function getAllSivs() external view returns (Siv[] memory){
    Siv[] memory temporary = new Siv[](sivs.length);
        uint counter = 0;
        for(uint i=0; i<sivs.length; i++) {
            if(sivs[i].isDeleted == false) {
                temporary[counter] = sivs[i];
                counter++;
            }
        }

        Siv[] memory result = new Siv[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
   }

   // Method to get only your Sivs
    function getMySivs() external view returns (Siv[] memory) {
        Siv[] memory temporary = new Siv[] (sivs.length);
        uint counter = 0;
        for(uint i=0; i<sivs.length; i++) {
            if(sivToOwner[i] == msg.sender && sivs[i].isDeleted == false) {
                temporary[counter] = sivs[i];
                counter++;
            }
        }

        Siv[] memory result = new Siv[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to Delete a Siv
    function deleteSiv(uint sivId, bool isDeleted) external {
        if(sivToOwner[sivId] == msg.sender) {
            sivs[sivId].isDeleted = isDeleted;
            emit DeleteSiv(sivId, isDeleted);
        }
    }

}