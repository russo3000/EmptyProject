angular.module('services', [])

.service('UserService', function() 
{
  //for now I will store user data on ionic local storage but Later I should save it on a database
  var setUser = function(user_data) 
  {
    window.localStorage.GoByData = JSON.stringify(user_data);
  };

  var getUser = function()
  {
    return JSON.parse(window.localStorage.GoByData || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
})
.factory('ConnectivityMonitor', function($cordovaNetwork, $rootScope)
{  
  function checkConnection()
  {    
    if($rootScope.isMobile())
    {
      if($cordovaNetwork.isOnline())
      {
        return true;  
      }
      else
      {
        return false;
      }
    }
    else
    {  
      if(navigator && navigator.onLine)
      {
        return true;  
      }
      else
      {
        return false;
      }
    }
  };

  function startWatching(callback)
  {
    //console.log("in start watching: " + $rootScope.connectionStatus);

      if($rootScope.isMobile())
      {
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState)
        {            
         // console.log("went online");
          $rootScope.connectionStatus = "connected";
          callback($rootScope.connectionStatus);
        });

        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState)
        {
         // console.log("went offline");
          $rootScope.connectionStatus = "not-connected";
          callback($rootScope.connectionStatus);
        });
      }
      else 
      {
        window.addEventListener("online", function(e) 
        {
        //  console.log("went online");
          $rootScope.connectionStatus = "connected";
          callback($rootScope.connectionStatus);
        }, false);    

        window.addEventListener("offline", function(e) 
        {
        //  console.log("went offline");
          $rootScope.connectionStatus = "not-connected";
          callback($rootScope.connectionStatus);;
        }, false);  
      }
  }

  return {
    startWatching: startWatching,
    checkConnection: checkConnection
  }
}) 
.factory('DbService', function(config, UserService, ConnectivityMonitor, $rootScope) 
{
  
  function Store (userObject, callback)
  {
    userObject.time_stamp = Date.now().toString();

    //console.log("Storing:");
    //console.log(userObject);
    //console.log("-----");
    //localStorage.setItem('GoByData', JSON.stringify(userObject));

    UserService.setUser(userObject);
  };
 
  return {
    Store: Store
  }
})

;
