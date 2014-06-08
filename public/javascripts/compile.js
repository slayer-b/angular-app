angular.module("my-compile", [])
.factory("MyService", function($compile) {
        return {
            compile: function(html, id, $scope) {
                //create an angular element. (this is still our "view")
                var el = $(html);
                //compile the view into a function.
                var compiled = $compile(el);
                //append our view to the element of the directive.
                $(id).append(el);
                //bind our view to the scope!
                compiled($scope);
            }
        };
}).controller("SlidersCtrl", function($scope, $timeout, $interval, MyService) {
        $scope.slide = false;
        var id = "#sliders";
        var html = "<div class=\"element\" ng-include=\"'/assets/html/sliders-partial.html'\"></div>";
        var i = 0;
        var next = 1;
        $interval(function() {
            i = i + 1;
            $scope.slide = !$scope.slide;
            if (i == next) {
                var newScope = $scope.$new();
                newScope.i = 0;
                newScope.number = next;
                $interval(function() {
                    newScope.i += 1;
                }, 1000);
                i = 0;
                next = 2 * next;
                MyService.compile(html, id, newScope);
            }
        }, 1000);
}).controller("MyCtrl", function($scope, $timeout, MyService, $interval) {
    $scope.msg = "Hi, you";
    var count = 0;
    $interval(function() {
        count += 1;
        $scope.msg = count;
    }, 1000);
    $timeout(function() {
        $("#my-div").html("Removed");
    }, 5000);
    var html = "<div>{{msg}}</div>";
    MyService.compile(html, "#my-div", $scope);

    var html2 = "<div ng-include=\"'/assets/html/partial.html'\"></div>";
    MyService.compile(html2,"#my-div", $scope);
});