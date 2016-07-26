angular.module('app.controllers', [])


.controller('MenuCtrl', function($scope, $rootScope, $ionicModal, $timeout, StorageService,$ionicPopup, $state) {  
    $scope.enableSubMenu = false;
    $scope.$on('enableMenus', function(event) {
        $scope.enableSubMenu = true;
    });


    //Configuration for menu
    $scope.isExpanded = true;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };


    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.logout =  function(){

         var confirmPopup = $ionicPopup.confirm({
           title: 'Logout',
           template: 'Are you sure you want to logout?'
         });

         confirmPopup.then(function(res) {
           if(res) {
               StorageService.removeAll() ;
               $scope.enableSubMenu = false;
               console.log('Logged out successfully.');
               $state.go('login'); 
           } else {
               console.log('Not logging out');
           }
   });
 };
 })


//Controller for Loading icon or spinner
.controller('LoadingCtrl', function($scope, $ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
})


//Controller to display all accounts
.controller('showAllAccountCtrl', function($scope,accountsService,StorageServiceForToken,$state,$http,AccountDetails,$resource,$ionicPopup,$ionicLoading) {
   $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);

    var promise = accountsService.getAccounts();
      promise.then(function(data) {
          $scope.allAccountDetails = data;
      });

    $scope.moveToDetails = function(){
      $state.go('menu.aboutPSD2');      
    };
  })

//Controller to display app info (currently not in use)
.controller('aboutPSD2Ctrl', function($scope,aboutService,StorageServiceForToken,$http,AccountDetails,$resource,$ionicPopup,$ionicLoading) {
  $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
  var promise = aboutService.getAccountDetails();
  promise.then(function(data) {
          $scope.accountDetails = data;
      });
})

//OAuth implementation
.controller('exploreAPICtrl', function($scope, OAuthService,$http, $state,$interval, $cordovaInAppBrowser,StorageServiceForToken, subscribeService) {
    $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    
    $scope.apiClick =  function(){
    var ref = cordova.InAppBrowser.open('http://169.44.112.56:8081/oauth2server/oauth/authorize?client_id=postman&redirect_uri=http://localhost/callback&scope=write&response_type=code', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes,toolbar=yes');
    ref.addEventListener('loadstart', function(event) {
    if ((event.url).startsWith("http://localhost/callback")) {
          $scope.requestToken = (event.url).split("code=")[1];
          $scope.oAuth=[];
         //Fetch general Information details from the API
         OAuthService.general(
             {
               grant_type: 'authorization_code',
               redirect_uri: 'http://localhost/callback',
               state: '4281938',
              code:  $scope.requestToken
            },
            {

            },
            function(message) {
               $scope.oauthData=message;
               ref.close();
               //alert("done.."+$scope.oauthData);
               //Persisting the token data in local storage
               StorageServiceForToken.remove($scope.oauthData);
               StorageServiceForToken.add($scope.oauthData) ;
             // alert('before calling subscription service '); 
               //check subscription
               var subscriptionDetails = {};
               var promise = subscribeService.getSubscriptionInfo();
                promise.then(function(resp) {
                    subscriptionDetails = resp.data;
                    //alert('subscriptionDetails: '+subscriptionDetails.length);
                    if(subscriptionDetails.length && subscriptionDetails.length>0){
                        var accountID = subscriptionDetails[0].accountId;
                        localStorage.setItem("accountID", accountID);
                        //alert('GetAccountId: '+localStorage.getItem("accountID"));
                        //$state.go('menu.aboutPSD22');
                    }else{
                        $state.go('menu.subscription');
                    }
                });               
            });
       };
     });

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
        };
    }
   };
 })


  .controller('aboutPSD22Ctrl', function($scope,InformationService,$state,$ionicPopup,$ionicLoading, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $ionicLoading.show();
    $scope.general=[];
    
    $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);


    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 400);

    // Set Ink
    ionicMaterialInk.displayEffect();

    //Fetch general Information details from the API
    InformationService.general({value : 'general' }, {},
    function(message) {
      
      $scope.general=message;
      // function to retrive the response
      if($scope.general.status=='SUCCESS'){
        $scope.general=message;
      }
    });

    //Fetch  IBM information details from the API
    InformationService.general({value : 'ibm' }, {},
    function(message) {
      
      $scope.ibmInformation=message;
    });

    //Fetch  bookmarks from the API
    InformationService.general({value : 'bookmarks' }, {},
    function(message) {
      $scope.bookmarks=message.response.additionalInfo;
      
    });

    $scope.clickLink =  function(link){
      //alert(link);
      window.open(link, '_system', 'location=yes');

    };

    $ionicLoading.hide();

    

  })

  .controller('profileCtrl', function($scope,StorageService, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    
    $scope.userProfile = StorageService.getAll();


    // Set Header
    $scope.$parent.showHeader();

    // Delay expansion
    // $timeout(function() {
    //     $scope.isExpanded = true;
    //     $scope.$parent.setExpanded(true);
    // }, 150);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();


  })

  .controller('creditsCtrl', function($scope, $timeout, ionicMaterialMotion, ionicMaterialInk){
    // Set Header
    $scope.$parent.showHeader();

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 150);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
  })


  .controller('transactionDetailsCtrl', function($scope,transactionService,StorageService,$http,StorageServiceForToken,$ionicLoading,$ionicPopup) {
      // Set Header
    $scope.$parent.showHeader();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(true);
      $ionicLoading.show(); 
      /*
       * if given group is the selected group, deselect it
       * else, select the given group
       */
      $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
      };
      $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
      };
      
      
    var interBankCount=0;
    var internationBankCount=0;
    var withInBankCount=0;
    $scope.transactionDetails = transactionService.getTransactionDetails();   

    var promise = transactionService.getTransactionDetails();
      promise.then(function(resp) {
          $scope.transactionDetails = resp.data;
          if($scope.transactionDetails.length>0){
          $scope.groups = [];
          for (var i=0; i<$scope.transactionDetails.length; i++) {
                  
            var  highlightChallenge="";
            var challengeValue=false;
            if($scope.transactionDetails[i].challenge !== undefined){
                highlightChallenge="*";
                challengeValue=true;
            }

            $scope.groups[i] = {
              name:$scope.transactionDetails[i].body.value.amount + " "+$scope.transactionDetails[i].body.value.currency +" " +highlightChallenge,
              items: [],
              challenge: challengeValue,
              challengeId: [],
              challengeType: [],
              transactionId: []

            };
          
             $scope.groups[i].items.push("To Account: "+$scope.transactionDetails[i].body.to.account_id); 
             $scope.groups[i].items.push("Description: "+$scope.transactionDetails[i].body.description);
             $scope.groups[i].items.push("Payment Status: "+$scope.transactionDetails[i].status);
             $scope.groups[i].items.push("Transaction Id: "+$scope.transactionDetails[i].id);
             
             if($scope.transactionDetails[i].challenge !== undefined){

                $scope.groups[i].items.push("Transaction has been challenged ");
                $scope.groups[i].items.push("Challenge Id: "+$scope.transactionDetails[i].challenge.id);
                $scope.groups[i].items.push("Challenge Type: "+$scope.transactionDetails[i].challenge.challenge_type);

                $scope.groups[i].challengeId.push($scope.transactionDetails[i].challenge.id);
                $scope.groups[i].challengeType.push($scope.transactionDetails[i].challenge.challenge_type);
                $scope.groups[i].transactionId.push($scope.transactionDetails[i].id);
             }

             if($scope.transactionDetails[i].type=='WITHIN_BANK'){
              
              withInBankCount++;

             }
              if($scope.transactionDetails[i].type=='INTER_BANK'){
              interBankCount++;

             }

             if ($scope.transactionDetails[i].type=='INTERNATIONAL'){
              internationBankCount++;
             }
          }
          $scope.options = {  
            chart: {
              type: 'pieChart',
              height: 500,
              x: function(d){return d.key;},
              y: function(d){return d.y;},
              showLabels: true,
              duration: 500,
              labelThreshold: 0.01,
              labelSunbeamLayout: true,
              legend: {
                margin: {
                  top: 5,
                  right: 35,
                  bottom: 5,
                  left: 0
                }
              }
            }
          };
          $scope.data = [  
            {
              key: "International",
              y: internationBankCount
            },
            {
              key: "Within-Bank",
              y: withInBankCount
            },
            {
              key: "Inter-Bank",
              y: interBankCount
            }
          ];
        }    
      });
     

     $scope.answerChallenge = function( challengeId,challengeType,transactionId){
        $scope.challengeId= challengeId;
        $scope.challengeType=challengeType;
        $scope.transactionId=transactionId;
        $http.defaults.headers.common.Authorization=$scope.authorizationToken;
        $scope.data = {};
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="data.wifi">',
          title: 'Enter Challenge Answer',
          subTitle: 'You need to answer the challenge',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Submit</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.wifi) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.data.wifi;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
          $scope.challengeObject= {  "id":$scope.challengeId,  "answer":res};
          transactionService.answerChallenge($scope.challengeType, $scope.transactionId, $scope.challengeObject);
          console.log('Tapped!', res);
        });
     }
  })


  .controller('makeAPaymentCtrl', function($scope,$http, transactionService, $ionicLoading, StorageServiceForToken,$ionicPopup,$cordovaBarcodeScanner) {
     // Set Header
    $scope.$parent.showHeader();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(true);
    
     $scope.makePaymentObj = {
          "type": "",
          "from": {
              "bank_id": "",
              "account_id": ""
          },
          "to":{
              "bank_id":"",
              "account_id":""
            },  
          "value":{
              "currency":"GBP",
              "amount":""
            },
          "description":""
      }

     
      var promise = transactionService.getTransactionTypes();
      promise.then(function(types) {
          $scope.transactionTypes = types.data;
      });
      
      

      $scope.paymentSubmit = function(){
        console.log($scope.makePaymentObj);
        transactionService.createTransactionRequest($scope.makePaymentObj.type, $scope.makePaymentObj);
      };

      $scope.setType=function(){
          alert('hwlloo');
      };


     $scope.scanForPayment = function(){
       $cordovaBarcodeScanner.scan().then(function(imageData) {
       //     alert(imageData.text);
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);

            var dataFromBarCode= imageData.text.split(':');
   //         alert("in array at 0: "+dataFromBarCode[0]);
            $scope.makePaymentObj.to.account_id =parseInt(dataFromBarCode[1]);
 //           alert("in array at 1: "+dataFromBarCode[1]);
            $scope.makePaymentObj.value.amount=parseInt(dataFromBarCode[0])
     //       alert("in array at 2: "+dataFromBarCode[2]);
            $scope.makePaymentObj.description=dataFromBarCode[2];
            //$scope.makePaymentObj.value.amount=100;
        }, function(error) {
            console.log("An error happened -> " + error);
        });
        
      };
  
  })


  .controller('loginCtrl', function($scope, $http, $rootScope, $resource,LoginService, $state,$ionicPopup,StorageService,StorageServiceForToken, $localStorage,$ionicLoading ) {
    //Login once functionality 
    if( StorageService.getAll()[0] !== undefined ){
      if(StorageService.getAll()[0].data!== undefined){
             $state.go('menu.aboutPSD22');
      }
    }
    
    // if(StorageServiceForToken.getAll()[0]!=undefined){
    //   if(StorageServiceForToken.getAll()[0].data!== undefined){
    //          $rootScope.$broadcast('enableMenus');
    //          $scope.enableSubMenu = true;
    //   }
    // }

    $scope.click =  function(){
      $ionicLoading.show();
      //clearing the userProfile at the time of user login
      $scope.dataFromService=[];
      $scope.authTokenForLogin= btoa(this.userId+":"+this.password);

      $http.defaults.headers.common.Authorization="Basic "+$scope.authTokenForLogin;
      $http.get('http://169.44.112.56:8084/psd2demoapp/user/profile').then(function(resp){
          $ionicLoading.hide();
          console.log('Success', resp);
          $scope.dataFromService=resp;
       //   StorageService.remove($scope.dataFromService);
          StorageService.add($scope.dataFromService) ;
          $state.go('menu.aboutPSD22');
           // JSON object
          // $scope.allAccountDetails=resp;
        }, function(err){
          console.error('ERR', err);
          $scope.dataFromService=err;
          $ionicLoading.hide();
        });
      }
    })


    .controller('subscriptionCtrl', function($scope,$http, subscribeService, $ionicLoading, StorageServiceForToken, $state,$rootScope) {
       // Set Header
    $scope.$parent.showHeader();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(true);
  
       $scope.subscribeObj = {
        "subscriptionInfo":{
            "username" : "",
            "accountId" : "",
            "bank_id" : "BARCGB",
            "viewIds": [{"id":"owner"}],
            "clientId": "postman",
            "limits": [{
                    "transaction_request_type": { "value" : "WITHIN_BANK"},
                    "amount": { "currency" : "GBP", "amount" : 100.01}
                },
                {
                    "transaction_request_type": { "value" : "INTER_BANK"},
                    "amount": { "currency" : "GBP", "amount" : 50.01}
                },
                {
                    "transaction_request_type": { "value" : "INTERNATIONAL"},
                    "amount": { "currency" : "GBP", "amount" : 25.01}
                }
                ],
            "transaction_request_types": [{"value": "WITHIN_BANK"}, {"value": "INTER_BANK"}, {"value": "INTERNATIONAL"}]
            }
        };


        $scope.subscribe = function(){          
          subscribeService.subscribe($scope.subscribeObj);
        };

    })

    .controller('signupCtrl', function($scope, CreateBankUser,CreateBankAccount, SignUpService,$state,$ionicPopup, CreateClientForOAuth, $ionicLoading ) {
      $scope.signUpUser =  function(){
      $ionicLoading.show();
        //clearing the userProfile at the time of user login
      $scope.signupResponse=[];
      

      //Create client for OAuth
      CreateBankUser.createBankUser(
        {  },
        {
        username: this.firstName.charAt(0).toLowerCase()+this.lastName.toLowerCase(),
        password: this.password,
        role:'USER'
      },
      function(message) {
        $scope.createBankUser=message;
        $ionicLoading.hide();
        // function to retrive the response
        if($scope.createBankUser.status=='SUCCESS'){
        }
      },function(message) {
        $ionicLoading.hide();
        $scope.createBankUser=message;
      }

      );

      //Create bank account
      var accountNumber =this.phoneNumber;
      CreateBankAccount.createBankAccount(
        {  },
        { 
            "id" : accountNumber.toString().substr(accountNumber.toString().length - 4), 
            "label" : "Bank", 
            "number" : this.phoneNumber, 
            "owners" : [ { "id" : this.firstName.charAt(0).toLowerCase()+this.lastName.toLowerCase(), "provider" : "https://www.barclays.co.uk", "display_name" : this.firstName+this.lastName } ], 
            "type" : null, 
            "balance" : { "currency" : "GBP", "amount" : 10000.01 }, 
            "iban" : "BARCGB22", 
            "swift_bic" : "BARCGB22XXX", 
            "bank_id" : "BARCGB", 
            "username" : this.firstName.charAt(0).toLowerCase()+this.lastName.toLowerCase()
          },
      function(message) {
        $scope.createBankAccount=message;
        $ionicLoading.hide();
        // function to retrive the response
        //alert('Success in create bank account');
      },function(message) {
        $ionicLoading.hide();
        $scope.createBankAccount=message;
        alert('Failure in creating bank account.');
      }

    );

    //calling sign up service api
    SignUpService.signup(
      {  }, {email: this.userId,
        password: this.password,
        role: 'USER',
        firstName:  this.firstName,
        lastName: this.lastName,
        phone: this.phoneNumber

      },
      function(message) {
        $scope.signupResponse=message;
        // function to retrive the response
        if($scope.signupResponse.status=='SUCCESS'){
          var alertPopup = $ionicPopup.alert({
            title: 'Signup',
            template:'User added successfully. Please login now.'
          });
          $state.go('login');
        }
      },function(message) {
        $scope.signupResponse=message;
      }
    );

  }
})


.controller('techCtrl', function($scope, $timeout, ionicMaterialMotion, ionicMaterialInk){
    // Set Header
    $scope.$parent.showHeader();

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
  })