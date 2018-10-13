const TITLE     = "test title";
const campaigns = [
  {
     name   : "FUND_001",
     dir    : "fund_001"
  }
];

App = {
  web3Provider: null,
  contracts: {},

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      //App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/cpokRXa96X1xQ48pv841');
      web3 = new Web3(App.web3Provider);
    }
  },
  initContract: function(dir,SampleCrowdsale,RefundVault,MintableToken) {
    $.getJSON(SampleCrowdsale, function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var SampleCrowdsaleArtifact = data;
      App.contracts[dir].SampleCrowdsale = TruffleContract(SampleCrowdsaleArtifact);

      // Set the provider for our contract.
      App.contracts[dir].SampleCrowdsale.setProvider(App.web3Provider);
      //return App.getRaisedFunds(), App.getGoalFunds(), App.getEndTime(), App.isFinalized(), App.getTokenPrice1(), App.getTokenPrice10(), App.getTokenPrice100(), App.isGoalReached(), App.getEthRefundValue();
    });

    $.getJSON(RefundVault, function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var RefundVaultArtifact = data;
      App.contracts[dir].RefundVault = TruffleContract(RefundVaultArtifact);

      // Set the provider for our contract.
      App.contracts[dir].RefundVault.setProvider(App.web3Provider);
    });

    $.getJSON(MintableToken, function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var MintableTokenArtifact = data;
      App.contracts[dir].MintableToken = TruffleContract(MintableTokenArtifact);

      // Set the provider for our contract.
      App.contracts[dir].MintableToken.setProvider(App.web3Provider);

      // Use subcontract token to return current token balance of the user.
      return App.getBalance(dir);//, App.getTokenContractAddress();
    });
  },
  getBalance: function(dir) {
    console.log('Getting balances...');
    App.contracts[dir].SampleCrowdsale.deployed().then(function(instance) {
      return instance.token();
      }).then(function(address){
        var token_contract_address = address;
        console.log('Token contract address: ' + token_contract_address);
        token_contract = App.contracts[dir].MintableToken.at(token_contract_address);
        return token_contract.balanceOf(web3.eth.coinbase);
      }).then(function(balance) {
        tokenBalance = Math.round(10*balance/1000000000000000000)/10; // Balance is returned in wei (10^18 per 1 ETH), so divide by 10^18. Also using a technique to "multiply and divide" by 10 for rounding up to 1 decimal.
        $('#tokenBalance_'+dir).text(tokenBalance.toString(10));
      }).catch(function(err) {
        console.log(err.message);
      });
  },
}

$(function() {
  $(window).load(function() {
    App.initWeb3();
    let html = '';
    for(let i=0 ; i<campaigns.length ; i++) {
      html  +=  '<div class="col-md-4">' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading"><h3 class="panel-title">'+campaigns[i].name+'</h3></div>'+
                '<div class="panel-body">'+
                '<h4>Campaign Status</h4>'+
                'Finalized: <strong><span id="isFinalized_'+campaigns[i].dir+'"></span></strong><br/>'+
                'Goal Reached: <strong><span id="isGoalReached_'+campaigns[i].dir+'"></span></strong><br/><br/>'+
                '<h4>Balance</h4>'+
                'Your Token balance: <strong><span id="tokenBalance_'+campaigns[i].dir+'"></span></strong> tokens<br/><br/>'+
                '<a href="'+campaigns[i].dir+'/" class="btn btn-primary">Join</a>'+
                '</div></div></div>';
    }

    $("#title").text(TITLE);
    $("#campaigns").html(html);

    for(let i=0 ; i<campaigns.length ; i++) {
      App.contracts[campaigns[i].dir] = {};
      return App.initContract(  campaigns[i].dir,
                                campaigns[i].dir+'/SampleCrowdsale.json',
                                campaigns[i].dir+'/RefundVault.json',
                                campaigns[i].dir+'/MintableToken.json');

    }
  });
});
