/// <reference path='typings/jquery/jquery.d.ts' />
/// <reference path='typings/angularjs/angular.d.ts' />
/// <reference path='typings/angularjs/angular-route.d.ts' />
/// <reference path='typings/angularjs/angular-resource.d.ts' />

var app = angular.module('items', ['ngTable', 'ngResource', 'ngRoute'])
    .controller('DemoListCtrl', function($scope: ItemsScope,
                                         $location: ng.ILocationService,
                                         $resource: ng.resource.IResourceService,
                                         $routeParams, ngTableParams) {
        var service: any = $resource("", {"id": "@id"}, {
            "delete": {
                "method": "POST",
                "url": "/" + $routeParams.type + "/delete/:id"
            },
            "list": {
                "url": "/" + $routeParams.type + "/list"
            }
        });

        $scope.tableParams = new ngTableParams(
            //extend to apply default values
            angular.extend({
                page: 1,
                count: 3
            }, $location.search()), {
                getData: function($defer, params) {
                    $location.search(params.url());
                    service.list(params.url(), function(data) {
                        params.total(data.total);
                        $scope.loaded = true;
                        $defer.resolve(data.result);
                    });
                }
            });
        $scope.my = {
            "loadPage": function(page: any) {
                $scope.loaded = false;
                $scope.tableParams.page(page.number);
            },
            "deleteId": function(id) {
                $scope.loaded = false;
                service.delete({id: id}, function(data) {
                    $scope.loaded = true;
                });

                $scope.loaded = false;

                //reload page after this
//                console.log($scope.page);
//                $scope.tableParams.page($scope.page.number)
            },
            "type": $routeParams.type
        };
    })
    .controller('DemoDetailCtrl', function($scope, $resource, $routeParams) {
        var item = $resource("/" + $routeParams.type + "/detail/:id");
        item.get({"id": $routeParams.id}, function(data) {
            $scope.item = data.result;
        });
        var itemSave = $resource("/" + $routeParams.type +"/save", {}, {
            "save": {method: "POST"}
        });
        $scope.loaded = true;
        $scope.error = true;
        $scope.my = {
            "type": $routeParams.type,
            "save": function() {
                $scope.loaded = false;
                itemSave.save($scope.item, function() {
                    $scope.loaded = true;
                }, function(error) {
                    $scope.loaded = true;
                    $scope.error = false;
                });
            }
        };
    })
    .config(function($routeProvider: ng.route.IRouteProvider) {
        $routeProvider.
            when('/items/:type/list', {templateUrl: '../partials/item-list.html', controller: 'DemoListCtrl'}).
            when('/items/:type/:id', {templateUrl: '../partials/item-detail.html', controller: 'DemoDetailCtrl'}).
            when('/images/:type/list', {templateUrl: '../partials/image-list.html', controller: 'DemoListCtrl'}).
            when('/images/:type/:id', {templateUrl: '../partials/image-detail.html', controller: 'DemoDetailCtrl'}).
            otherwise({redirectTo: '/items/list'});
        //remove '#' sign from url
//        $locationProvider.html5Mode(true);
    });


/**
 * Use this function to manually start up angular application.
 *
 * @param element DOM element which is the root of angular application.
 * @param modules An array of modules to load into the application.
 *     Each item in the array should be the name of a predefined module or a (DI annotated)
 *     function that will be invoked by the injector as a run block.
 */
interface ItemsScope {
    tableParams: any;
    loaded: boolean;
    my: {
        loadPage(page: String): void;
        deleteId(id: String): void;
        type: string;
    };
}