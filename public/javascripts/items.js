var app = angular.module('items', ['ngTable', 'ngResource', 'ngRoute'])
    .controller('DemoListCtrl', function($scope, $location, $resource, ngTableParams) {
        var items = $resource("/items.json");
        $scope.tableParams = new ngTableParams(
            //extend to apply default values
            angular.extend({
                page: 1,
                count: 3
            }, $location.search()), {
                getData: function($defer, params) {
                    $location.search(params.url());
                    items.get(params.url(), function(data) {
                        params.total(data.total);
                        $scope.loaded = true;
                        $defer.resolve(data.result);
                    });
                }
            });
        $scope.my = {
            "loadPage": function(page) {
                $scope.loaded = false;
                $scope.tableParams.page(page.number);
            },
            "delete": function(id) {
                console.log("delete #" + id);
            },
            "edit": function(id) {
                console.log("edit #" + id);
            }
        };
    })
    .controller('DemoDetailCtrl', function($scope, $resource, $routeParams) {
        var item = $resource("/item.json");
        item.get($routeParams, function(data) {
            $scope.item = data.result;
        });
        var itemSave = $resource("/item-save", {}, {
            "save": {method: "POST"}
        });
        $scope.loaded = true;
        $scope.error = true;
        $scope.save = function() {
            $scope.loaded = false;
            itemSave.save($scope.item, function() {
                $scope.loaded = true;
            }, function(error) {
                $scope.loaded = true;
                $scope.error = false;
            });
        }
    })
    .config(function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/items', {templateUrl: '../partials/item-list.html', controller: 'DemoListCtrl'}).
            when('/items/:id', {templateUrl: '../partials/item-detail.html', controller: 'DemoDetailCtrl'}).
            otherwise({redirectTo: '/items'});
        //remove '#' sign from url
//        $locationProvider.html5Mode(true);
    });