angular.module('my-app', ['my-filters', 'my-service', 'ngRoute']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/phones', {templateUrl: 'assets/partials/phone-list.html', controller: PhoneListCtrl}).
            when('/phones/:phoneId', {templateUrl: 'assets/partials/phone-detail.html', controller: PhoneDetailCtrl}).
            otherwise({redirectTo: '/phones'});
    }]);