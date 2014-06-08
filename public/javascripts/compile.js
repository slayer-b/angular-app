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
})
    .controller("MyCtrl", function($scope, $timeout, MyService, $interval) {
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