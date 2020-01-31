const util = require('ethereumjs-util');
const fs = require('fs');

const CREATION_CODE = '0x608060405234801561001057600080fd5b506040516104bb3803806104bb8339818101604052604081101561003357600080fd5b81019080805190602001909291908051906020019092919050505060405180807f6275726e65722d77616c6c65742d666163746f72790000000000000000000000815250601501905060405180910390207f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b146100af57fe5b6100be8261028860201b60201c565b6060600073ffffffffffffffffffffffffffffffffffffffff1663485cc955905060e01b8383604051602401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050905060006101c26102b760201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16826040518082805190602001908083835b6020831061020c57805182526020820191506020810190506020830392506101e9565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d806000811461026c576040519150601f19603f3d011682016040523d82523d6000602084013e610271565b606091505b505090508061027f57600080fd5b5050505061037d565b60007f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b90508181555050565b60006102c761034c60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff1663aaf10f426040518163ffffffff1660e01b815260040160206040518083038186803b15801561030c57600080fd5b505afa158015610320573d6000803e3d6000fd5b505050506040513d602081101561033657600080fd5b8101908080519060200190929190505050905090565b6000807f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b9050805491505090565b61012f8061038c6000396000f3fe6080604052600a600c565b005b60186014601a565b60a4565b565b6000602260c9565b73ffffffffffffffffffffffffffffffffffffffff1663aaf10f426040518163ffffffff1660e01b815260040160206040518083038186803b158015606657600080fd5b505afa1580156079573d6000803e3d6000fd5b505050506040513d6020811015608e57600080fd5b8101908080519060200190929190505050905090565b3660008037600080366000845af43d6000803e806000811460c4573d6000f35b3d6000fd5b6000807f36ea5a899f007351627d257f82d4383e5e83a8533e5a1c1d27d29a16d656070d60001b905080549150509056fea265627a7a72305820755adf024dc0651882fcb04c8ddcf7af2d943a933e5658cff4cf3367867d977c64736f6c634300050a0032';


const deployer = "0x63f765e3df3eaaa39eb4b7f1241b500380e1d751"
const nonce = 0

let accounts = [
  "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  "0xB2ac59aE04d0f7310dC3519573BF70387b3b6E3a"
]

let contractWallets = [];
let contractAddress = '';

if (deployer.length === 42) {
  contractAddress = util.generateAddress(deployer, nonce.toString());
  const internalDeployer = util.generateAddress(contractAddress, '1');

  const makeWallet = address => {
    const code = `${CREATION_CODE}000000000000000000000000${util.bufferToHex(contractAddress).substr(2)}000000000000000000000000${address.substr(2)}`
    return util.bufferToHex(util.generateAddress2(internalDeployer, util.setLengthLeft('0x0', 32), code));
  }

  /*for(let a in accounts){
    if(util.isValidAddress(accounts[a])){
      console.log("Valid address...")
      console.log(accounts[a],"  =>  ",makeWallet(accounts[a]))
    }else{
      console.log("INVALID ADDRESS ",accounts[a])
      break
    }
  }*/

  let csv = fs.readFileSync("sample.csv")
  let lines = csv.toString().split("\n")
  let finalCSV = ""
  console.log(lines)

  const url = "https://buffidao.com/b/"

  finalCSV = lines[0]+",qrcode\n";


  for(let l=1;l<lines.length;l++){
    if(lines[l]){
      let parts = lines[l].split(",")
      if(parts&&parts.length>2){

        console.log(parts)
        let fortmaticAddress = parts[2]
        console.log("fortmaticAddress",fortmaticAddress)
        let contractAddress = makeWallet(fortmaticAddress)
        console.log("contractAddress",contractAddress)

        finalCSV = finalCSV + lines[l]+","+url+contractAddress+"\n"
      }

    }
  }


  const claimUrl = "https://buffidao.com/c/"

  const keypair = ()=>{
    const chars = "0123456789abcdef";
    let str = ""
    for (var i = 0; i < 64; i++)
    str += chars[(Math.floor(Math.random() * 16))];
    //this.onPropertyChanged("privateKey","0x"+str)
    return ["0x"+str,"0x"+util.privateToAddress("0x"+str).toString('hex')]

  }

  let blankPks = []

  for(let e=0;e<750;e++){
    let thisKeypair = keypair()
    blankPks.push(thisKeypair)
    console.log("generated account",thisKeypair)
    let contractAddress = makeWallet(thisKeypair[1])
    console.log("contractAddress",contractAddress)

    finalCSV = finalCSV + ",,"+thisKeypair[1]+",,"+claimUrl+contractAddress+"\n"
  }

  fs.writeFileSync("output.csv",finalCSV)
  fs.writeFileSync("claimableKeypairs.json",JSON.stringify(blankPks))
}
