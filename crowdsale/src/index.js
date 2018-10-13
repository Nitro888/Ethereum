const TITLE     = "test title";
const campaigns = [
  {
     name   : "FUND_NAME",
     dir    : "fund_001",
     htmlID : "fund_001"
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
  initContract: function(SampleCrowdsale,RefundVault,MintableToken) {
    $.getJSON(SampleCrowdsale, function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var SampleCrowdsaleArtifact = data;
      App.contracts.SampleCrowdsale = TruffleContract(SampleCrowdsaleArtifact);

      // Set the provider for our contract.
      App.contracts.SampleCrowdsale.setProvider(App.web3Provider);
      //return App.getRaisedFunds(), App.getGoalFunds(), App.getEndTime(), App.isFinalized(), App.getTokenPrice1(), App.getTokenPrice10(), App.getTokenPrice100(), App.isGoalReached(), App.getEthRefundValue();
    });

    $.getJSON(RefundVault, function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var RefundVaultArtifact = data;
      App.contracts.RefundVault = TruffleContract(RefundVaultArtifact);

      // Set the provider for our contract.
      App.contracts.RefundVault.setProvider(App.web3Provider);
    });

    $.getJSON(MintableToken, function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var MintableTokenArtifact = data;
      App.contracts.MintableToken = TruffleContract(MintableTokenArtifact);

      // Set the provider for our contract.
      App.contracts.MintableToken.setProvider(App.web3Provider);

      // Use subcontract token to return current token balance of the user.
      //return App.getBalance(), App.getTokenContractAddress();
    });
  }
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
                'Finalized: <strong><span id="isFinalized_'+campaigns[i].dir+'"></span></strong> Goal Reached: <strong><span id="isGoalReached_'+campaigns[i].dir+'"></span></strong><br/><br/>'+
                '<h4>Balance</h4>'+
                'Your Token balance: <strong><span id="tokenBalance_'+campaigns[i].dir+'"></span></strong> tokens<br/><br/>'+
                '<a href="'+campaigns[i].dir+'/" class="btn btn-primary">Join</a>'+
                '</div></div></div>';
    }

    $("#title").text(TITLE);
    $("#campaigns").html(html);

    for(let i=0 ; i<campaigns.length ; i++)
      return App.initContract(campaigns[i].dir+'/SampleCrowdsale.json',campaigns[i].dir+'/RefundVault.json',campaigns[i].dir+'/MintableToken.json');
  });
});
