/* Created by sohaib on 6/2/2015.*/


app.controller('MainCtrl',function($scope, $ionicPlatform, $cordovaSQLite, $cordovaToast, $ionicLoading,
                                   $cordovaFile)
{
    var db = null;
    $scope.results = [ ];
    var query = '';
    $scope.searchData = {query:''};
    $scope.fieldName = 'regNo';
    $scope.err = '';


    $ionicPlatform.ready(function()
    {

        if (localStorage.getItem('dbCopied'))
        {
            db = window.sqlitePlugin.openDatabase({name: "carsdata.db3"});
        }
        else
        {
            $scope.updateDatabase();
        }

    });

    $scope.updateDatabase = function()
    {
        $ionicLoading.show({
            template: 'Loading...'
        });

        $cordovaFile.checkFile(cordova.file.externalRootDirectory, "carsdata.db3")
            .then(function (success) {
                $cordovaFile.copyFile(cordova.file.externalRootDirectory, "carsdata.db3" ,
                    cordova.file.applicationStorageDirectory +"/databases/")
                    .then(function(success) {
                        $cordovaFile.checkFile(cordova.file.applicationStorageDirectory +"/databases/", "carsdata.db3")
                            .then(function(success){
                                db = window.sqlitePlugin.openDatabase({name: "carsdata.db3"});
                                localStorage.setItem('dbCopied', true);
                                $ionicLoading.hide();
                            }, function(error)
                            {
                                $cordovaToast.show('File Not Found in Application Storage Directory', 'long', 'center');
                                $ionicLoading.hide();
                            })
                    }, function(error)
                    {
                        $cordovaToast.show('Copy Database file to Application Storage Directory failed', 'long', 'center');
                        $ionicLoading.hide();
                    });
                // success
            }, function (error)
            {
                $cordovaToast.show('Database not found', 'long', 'center');
                $ionicLoading.hide();
                // error
            });
    }

    $scope.searchRecords = {
        'regNo': function()
        {
            query = "SELECT * FROM carsdata WHERE RegNo ='"+$scope.searchData.query+"'";
            search();
        },
        'engineNo': function()
        {
            query = "SELECT * FROM carsdata WHERE EngNo ='"+$scope.searchData.query+"'";
            search();
        },
        'chasisNo': function()
        {
            query = "SELECT * FROM carsdata WHERE ChasisNo ='"+$scope.searchData.query+"'";
            search();
        },
        'cngNo': function()
        {
            query = "SELECT * FROM carsdata WHERE CNGNo ='"+$scope.searchData.query+"'";
            search();
        }
    };

    var search = function()
    {
        $scope.results = [];
        $ionicLoading.show({
            template: 'Searching...'
        });
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0 && res.rows.length < 25)
            {
                for (var i=0; i<res.rows.length;i++)
                {
                    $scope.results.push(res.rows.item(i));
                }
                $ionicLoading.hide();
                $scope.err = '';
            }
            else if(res.rows.length > 0 && res.rows.length > 25)
            {
                $scope.err = 'Results are too long to display.';
                $ionicLoading.hide();
                $scope.err = '';
            }
            else
            {
                $scope.err = 'No record found.';
                $ionicLoading.hide();
            }
        }, function (err)
        {
            $scope.err = err;
            $ionicLoading.hide();
        });
    }

});
