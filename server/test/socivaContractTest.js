const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("socivaContract", function() {
  let Sociva;
  let sociva;
  let owner;

  const NUM_TOTAL_NOT_MY_SIVS = 5;
  const NUM_TOTAL_MY_SIVS = 3;

  let totalSivs;
  let totalMySivs;

  beforeEach(async function() {
    Sociva = await ethers.getContractFactory("socivaContract");
    [owner, addr1, addr2] = await ethers.getSigners();
    sociva = await Sociva.deploy();
    
    totalSivs = [];
    totalMySivs = [];

    for(let i=0; i<NUM_TOTAL_NOT_MY_SIVS; i++) {
      let siv = {
        'sivText': 'Ramdon text with id:- ' + i,
        'username': addr1,
        'isDeleted': false
      };

      await sociva.connect(addr1).addSiv(siv.sivText, siv.isDeleted);
      totalSivs.push(siv);
    }

    for(let i=0; i<NUM_TOTAL_MY_SIVS; i++) {
      let siv = {
        'username': owner,
        'sivText': 'Ramdon text with id:- ' + (NUM_TOTAL_NOT_MY_SIVS+i),
        'isDeleted': false
      };

      await sociva.addSiv(siv.sivText, siv.isDeleted);
      totalSivs.push(siv);
      totalMySivs.push(siv);
      }

    });

    describe("Add Siv", function() {
    it("should emit AddSiv event", async function() {
      let siv = {
        'sivText': 'New Siv',
        'isDeleted': false
      };

      await expect(await sociva.addSiv(siv.sivText, siv.isDeleted)
    ).to.emit(sociva, 'AddSiv').withArgs(owner.address, NUM_TOTAL_NOT_MY_SIVS + NUM_TOTAL_MY_SIVS);
    })
  });
    
    describe("Get Sivs", function() {
    it("should return the correct number of total sivs", async function() {
      const sivsFromChain = await sociva.getAllSivs();
      expect(sivsFromChain.length).to.equal(NUM_TOTAL_NOT_MY_SIVS+NUM_TOTAL_MY_SIVS);
    })

    it("should return the correct number of all my sivs", async function() {
      const mySivsFromChain = await sociva.getMySivs();
      expect(mySivsFromChain.length).to.equal(NUM_TOTAL_MY_SIVS);
    })
  })

  describe("Delete Siv", function() {
    it("should emit delete siv event", async function() {
      const SIV_ID = 0;
      const SIV_DELETED = true;

      await expect(
        sociva.connect(addr1).deleteSiv(SIV_ID, SIV_DELETED)
      ).to.emit(
        sociva, 'DeleteSiv'
      ).withArgs(
        SIV_ID, SIV_DELETED
      );
    })
  })
 });