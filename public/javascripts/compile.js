angular.module("my-compile", [])
.factory("MyService", function($compile) {
        return {
            compile: function(el) {
                return $compile(el);
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
        //create an angular element. (this is still our "view")
        var el = angular.element(html);
        //compile the view into a function.
        var compiled = MyService.compile(el);
        //append our view to the element of the directive.
        $("#my-div").append(el);
        //bind our view to the scope!
        //(try commenting out this line to see what happens!)
        compiled($scope);
    });