const {expect} = require("chai")
const {expectRevert}= require("@openzeppelin/Test-helpers")

describe ("Contract", ()=>{
    let contract, result 

    const description ="Lorem Ipsum"
    const title= "Democratic Election"
    const image="https://img.png"
    const starts=Date.now()- 10 * 60 *1000
    const ends= Date.now() + 10 *60 *1000
    const pollId=1
    const constantsId=1

    const avatar1="http://aatar1.png"
    const name1="Yusuf"
    const avatar2= "https://avatar2.png"
    const name2 ="Olayinka"

    beforeEach(async ()=>{
        const Contract = await ethers.getContractFactory('Election')
        ;[deployer, constestant1, constestant2, voter1, voter2]= await ethers.getSigners()

        contract = await Contract.deploy()
        await contract.deployed()

    })  

    describe("poll mgt" , ()=>{
        describe("Succeses" , ()=>{
            it("should confirms poll creation sucess", async ()=>{
             
               result = await contract.getPolls()
               expect(result).to.have.lengthOf(0) 

               await contract.createPoll(image, title, description, starts, ends)

               result = await contract.getPolls()
               expect(result).to.have.lengthOf(1)

               result = await contract.getPoll(pollId)
               expect(result.title).to.be.equal(title)
               expect(result.director).to.be.equal(deployer.address)

            })

            it("should confrim poll update sucess", async()=>{
                await contract.createPoll(image, title, description, starts, ends)

                result = await contract.getPoll(pollId)            
                expect(result.title).to.be.equal(title)   

                await contract.updatePoll(pollId , image , 'new Title' , description, starts, ends )

                result = await contract.getPoll(pollId)
                expect(result.title).to.be.equal("new Title")

            })
            it("should confrim poll deletcion sucess", async()=>{
                
                await contract.createPoll(image, title, description, starts, ends)

                result = await contract.getPolls()
                expect(result).to.have.lengthOf(1)

                result = await contract.getPoll(pollId)
                expect(result.deleted).to.be.equal(false)
                
                await contract.deletedPoll(pollId)

                result= await contract.getPolls()
                expect(result).to.have.length(0)

                result= await contract.getPoll(pollId)
                expect(result.deleted).to.be.equal(true)

            }) 
        })

        describe("failure", ()=>{
            it("should confirm poll creation failures", async ()=>{
                await expectRevert(
                    contract.createPoll("", title, description, starts, ends), 'image URL cannot be empty'
                )
                await expectRevert(
                    contract.createPoll(image, title, description,0, ends), 'Start date must be greater than 0'
                )
            })
            it("should confrim poll Update Failure", async ()=>{
                await expectRevert(
                    contract.updatePoll(100, image, 'new title' , description, starts, ends), "Poll not Found"
                )
            })
            it("should confrim poll deletion failure", async ()=>{
                await expectRevert(contract.deletePoll(100), "Poll not Found")

            })
        })
    })

    describe("poll Contest" , ()=>{
        beforeEach(async ()=>{
            await contract.createPoll(image , title, description, starts, ends)
        })

        describe("sucess", ()=>{
            it("should confirm contest entry sucess", async()=>{
                result = await contract.getPoll(pollId)
                expect(result.constestants.toNumber()).to.be.equal(0)

                await contract.connect(constestant1).connect(pollId, name1, avatar1 )
                await contract.connect(constestant2).connect(pollId, name1, avatar1)

                result= await contract.getPoll(pollId)
                expect(result.constestants.toNumber()).to.be.equal(2)

                result = await contract.getConstestants(pollId)
                expect(result).to.have.length(2)
            })
        })

        describe("Failure", () =>{
            it("should confrim contest entry failure", async ()=>{
                
                await expectRevert(contract.contest(100, name1, avatar1), "poll not found")

                await expectRevert(contract.contest(pollId, " ", avatar1), "name cannot be empty")

                await contract.connect(constestant1).constest(pollId, name1, avatar1)

                await expectRevert(
                    contract.connect(contestant1).contest(pollId, name1, avatar1), "already constested"
                )

            })
        } )
      
    })

    describe("Poll Voting", ()=>{
        
        beforeEach(async ()=>{
            await contract.createPoll(image, title, description, starts, ends)
            await contract.connect(contestant1).connect(pollId, name1, avatar1)
            await contract.connect(contestant2).contest(pollId, name2, avatar2)
        })
       
        describe("sucess", ()=>{
            it("should confrim contest entry sucess", async()=>{
                
                result = await contract.getPoll(pollId)
                expect(result.votes.toNumber()).to.be.equal(0)
                
                await contract.connect(contestant1).vote(pollId,constantsId)

                await contract.connect(contestant2).vote(pollId,constantsId)

                result= await contract.getPoll(pollId)
                expect(result.votes.toNumber()).to.be.equal(2)

                result = await contract.getPoll(pollId)
                expect(result.votes.toNumber()).to.be.equal(2)

                result = await contract.getConstestants(pollId, constantsId)

                expect(result.voters).to.have.lengthOf(2)
                expect(result.voter).to.be.equal(contestant1.address)
            })
        })
    
    describe("failure" , ()=> {
        it("should confrim contest entry failure", async ()=>{
            
            await expectRevert(contract.vote(100, constantsId), "poll not found")

            await contract.deletePoll(pollId)
            
            await expectRevert(contract.vote(pollId, constantsId), "polling not available")           

        })
    })    

    })


})