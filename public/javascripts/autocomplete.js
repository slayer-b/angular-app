(function () {
    var module = angular.module('autocomplete', []);

    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
        'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
        'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
        'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    var list = [];
    var num = 0;
    angular.forEach(states, function (value, key) {
        num++;
        list.push({
            "value": value,
            "visible": false,
            "id": "item-"+num
        });
    });

//    module.controller("AutocompleteCtrl", function AutocompleteCtrl($scope) {
//        $scope.states = list;
//    });
    module.directive("autoComplete", function () {
        return {
            restrict: "E",
            scope: {},
            controller: function($scope, $element) {
                //TODO: remove this
                $scope.items = list;

                this.position = function() {
                    var position = $element.position();
                    position.top += $element.height();
                    return position;
                }
            },
            link: function (scope, element, attrs) {
//                element.val("Type text: " + attrs.autoComplete);
            }
        };
    });
    module.directive("autoCompleteMenu", function () {
        return {
            restrict: "A",
            require: "^autoComplete",
            link: function (scope, element, attrs, AutoCompleteCtrl) {
                scope.menu = {};
                scope.menu.hide = function () {
                    element.css("visibility", "hidden");
                };
                scope.menu.show = function () {
                    element.css("visibility", "visible");
                };
                var position = AutoCompleteCtrl.position();
                element.css({
                    "top": position.top,
                    "left": position.left,
                    "position": "absolute"
                });
            }
        };
    });

    module.directive("hint", function () {
        return {
            link: function (scope, element, attrs) {
                console.log("Hint > link");
                var parent = element.parent();
                var position = parent.position();
                position.left += parent.width();
                element.css({
                    "top": position.top,
                    "left": position.left,
                    "position": "absolute"
                });
                scope.showHint = function() {
                    element.css("visibility", "visible");
                };
                scope.hideHint = function() {
                    element.css("visibility", "hidden");
                };
//                parent.mouseenter(element.css("visibility", "visible"));
//                parent.mouseleave(element.css("visibility", "hidden"));
            }
        };
    });

})();