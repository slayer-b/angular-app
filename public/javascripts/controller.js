function PhoneListCtrl($scope, PhoneResource, PhoneHttp, PhoneService) {
    PhoneHttp.all().then(function(data) {
        $scope.phones = data;
    });
//    $scope.phones = PhoneResource.query();

    $scope.orderProp = "age";
    PhoneService.hello()
}

function PhoneDetailCtrl($scope, $routeParams, PhoneResource, PhoneService) {
    $scope.phone = PhoneResource.get({phoneId: $routeParams.phoneId}, function(phone) {
        console.log(phone)
    });

    $scope.phoneId = $routeParams.phoneId;
    PhoneService.hello()
}