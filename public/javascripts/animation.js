angular.module("myAnimations", ["ngAnimate"]);

$(document).ready(function() {
    var hide;
    $("#check").change(function() {
        var el = $("#box");
        hide = !hide;
        if (hide) {
            el.addClass("ng-hide-add-active");
            el.addClass("ng-hide");
            setTimeout(function() {
                el.removeClass("ng-hide-add-active");
                el.addClass("ng-hide-remove-active");
            }, 5000);
        } else {
            el.removeClass("ng-hide");
            el.removeClass("ng-hide-remove-active");
            setTimeout(function() {
            }, 1);
        }
    });
});