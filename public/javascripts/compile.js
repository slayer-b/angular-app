angular.module("my-compile", [])
.factory("MyService", function($compile) {
        return {
            compile: function(el) {
                return $compile(el);
            }
        };
})
    .controller("MyCtrl", function($scope, $timeout, MyService) {
        $scope.msg = "Hi, you";
        $timeout(function() {
            $scope.msg = "Its not me";
        }, 2000);
        var html = "<div>{{msg}}</div>";
        //create an angular element. (this is still our "view")
        var el = angular.element(html),

        //compile the view into a function.
        compiled = MyService.compile(el);

        //append our view to the element of the directive.
        $("#my-div").append(el);

        //bind our view to the scope!
        //(try commenting out this line to see what happens!)
        compiled($scope);
    });