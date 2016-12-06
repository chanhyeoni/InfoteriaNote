var appAngular = angular.module("notesApp", ['ngRoute']);

// route configuration
appAngular.config(function($routeProvider) {
    $routeProvider
       .when("/", {
            templateUrl: "/views/main.html",
            controller: "homeController"
        })             
        .when("/login", {
            templateUrl: "/views/main.html",
            controller: "userController",
        })
});

// controller
appAngular.controller("homeController", function($scope, $http){
    // first check whether the user has been authenticated
    var message = "";
    $http({
        method: 'GET',
        url: '/isLoggedIn'
    }).then(function(response){
        console.log("response received from homeController");
        console.log(response.data);
        var isLoggedIn = response.data.isLoggedIn;
        if(isLoggedIn == true){
            $http({
                method: 'GET',
                url: '/notes'
            }).then(function(response){
                console.log(response.data);
                message = "There are " + response.data.length + " notes."
                $scope.notes = response.data; 
                $scope.message = message;
            }, function(response){
                message = "error getting notes : " + response;
                console.log(message);
                
                $scope.notes = [];
                $scope.message = message;
            })      
        }
        $scope.isLoggedIn = isLoggedIn;
    },function(response){
        message = "Signin failed: " + response; 
        console.log(message);
        $scope.isLoggedIn = false;
        $scope.message = message;
    });

    $scope.getNote = function(noteKey){
        $http({
            method: 'GET',
            url:'/notes/:noteKey',
            data : {noteKey : noteKey},
        }).then(function(response){

        }, function(response){

        });
    }
    
});

appAngular.controller("userController", function($scope, $http, $route){
    // first check whether the user has been authenticated
    $scope.isLoggedIn = false;

    $scope.logIn = function(){
        var status = 0;
        var invoices = [];
        var data = {"email": $scope.email, "password": $scope.password};
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http({
            method: 'POST',
            url: '/login', 
            data : data, 
            headers: config
        }).then(function(response){
            console.log("response received from userController");        
            $scope.status = response.data.status;
            $scope.message = response.data.message;
            $scope.invoices = response.data.invoices;
            $route.reload();
        }, function(response){
            $scope.status = 500;
            $scope.message = "Error in userController. ";
        });     
    }


    $scope.register = function(){
   
    }


    $scope.logOut = function(){
    
    }

});