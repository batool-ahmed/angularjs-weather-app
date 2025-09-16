var app = angular.module("weatherApp", []);

app.controller("mainController", function ($scope, $http) {
    $scope.location = '';
    $scope.showWeather = false;

    $scope.getWeather = function () {
        const API_KEY = '4aa6e82d736f430436f7e2e558f8a23b';
        // current weather API
        var currentWeatherAPICall = "https://api.openweathermap.org/data/2.5/weather?q=" + $scope.location + "&appid=" + API_KEY + "&units=metric";
        // weather forecast for upcoming days API
        var forecastAPICall = "https://api.openweathermap.org/data/2.5/forecast?q=" + $scope.location + "&appid=" + API_KEY + "&units=metric";

        // fetching current weather 
        $http.get(currentWeatherAPICall).then(function (response) {
            const currentWeather = response.data;
            
            $scope.currentWeather = {
                temperature: currentWeather.main.temp,
                description: currentWeather.weather[0].description,
                icon: currentWeather.weather[0].icon,
                wind: currentWeather.wind.speed,
                max: currentWeather.main.temp_max,
                min: currentWeather.main.temp_min,
                humidity: currentWeather.main.humidity
            };
        }).catch(function (error) {
            console.error(error);
        });

        // fetching upcoming days' weather forecast
        $http.get(forecastAPICall).then(function (response) {
            const weather = response.data.list;
            
            // 5 weather updates after every 6 hours
            $scope.weatherNextFive = [];

            for (var i = 2; i < 11; i += 2) {
                $scope.weatherNextFive.push(
                    {
                        date: weather[i].dt_txt.slice(0,11),
                        time: weather[i].dt_txt.slice(11,16),
                        icon: weather[i].weather[0].icon,
                        description: weather[i].weather[0].description,
                        temperature: weather[i].main.temp,
                    });
            }
            $scope.error = ''
            $scope.showWeather = true
        }).catch(function (error) {
            // error handling
            $scope.error = 'Please enter correct location';
            $scope.currentWeather = []
            $scope.weatherNextFive = []
            $scope.showWeather = false
            console.error(error);
        });
    };
});
