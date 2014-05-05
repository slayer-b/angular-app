angular.module('my-service', ["ngResource"]).
    factory('PhoneHttp', function($http) {
        console.info("PhoneHttp created");
        return {
            all: function() {
                return $http.get('phones').then(function (response) {
                    console.log(response.data);
                    return response.data;
                });
            }
        };
    }).
    factory('PhoneResource', function($resource) {
        console.info("PhoneResource created");
        return $resource('phones/:phoneId.json', {}, {
            query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
        });
    }).
    service("PhoneService", function() {
        console.info("PhoneService created");
        this.hello = function() {
          console.info("PhoneService hello")
        };
    });