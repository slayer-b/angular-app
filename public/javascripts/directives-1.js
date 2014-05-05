(function () {

    var module = angular.module('test-directive', []);

    module.directive("superhero", function() {
        return {
            restrict: "E",
            scope: {},
            controller: function($scope, $element) {
                $scope.abilities = [];
                this.addAbility = function(name) {
                    $scope.abilities.push(name);
                    console.log($element.position());
                }
            },
            link: function(scope, element, attrs) {
                element.bind("mouseenter", function() {
                    console.log(scope.abilities);
                });
            }
        };
    });

    module.directive("strength", function() {
        return {
            restrict: "A",
            require: "superhero",
            link: function(scope, element, attrs, superheroCtrl) {
                superheroCtrl.addAbility("strength");
            }
        };
    });
    module.directive("speed", function() {
        return {
            restrict: "A",
            require: "superhero",
            link: function(scope, element, attrs, superheroCtrl) {
                superheroCtrl.addAbility("speed");
            }
        };
    });
    module.directive("ability", function() {
        return {
            restrict: "A",
            require: "superhero",
            link: function(scope, element, attrs, superheroCtrl) {
                superheroCtrl.addAbility(attrs["ability"]);
            }
        };
    });

    module.directive("position", function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                element.bind("mouseenter", function() {
                    console.log(element.position());
                });
            }
        };
    });
})();