var WalletProvider  = require("truffle-wallet-provider");
var EthUtil         = require('ethereumjs-util');

// var keystore = require('fs').readFileSync('../keystore/geth_active/key.json').toString();
// var pass = require('fs').readFileSync('../keystore/geth_active/pass').toString();
// var wallet = require('ethereumjs-wallet').fromV3(keystore, pass);

//var pkey_str = require('fs').readFileSync('../keystore/pkey_eth_acc').toString();
//var prkey_buff = new Buffer(pkey_str, 'hex')
const prkey_buff = EthUtil.toBuffer('[0x+PRIVATEKEY_FROM_METAMASK]'); // todo : PRIVATE_KEY_FROM_METAMASK
var wallet = require('ethereumjs-wallet').fromPrivateKey(prkey_buff)

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new WalletProvider(wallet, "https://ropsten.infura.io/cpokRXa96X1xQ48pv841"),
      network_id: 3,
      gas: 4700000
    }
  },

  solc: {
	  optimizer: {
	    enabled: true,
	    runs: 200
	  }
  }

};
