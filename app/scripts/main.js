



/**
 * Declare MainCtrl, this controller does a GET on "/hello" and put the result in scope.
 */
function MainCtrl($scope, $http) {

    $scope.chartObject = {};

    $scope.stats = [];


	var projs=new Array();

		projs[0]="MM-API-Automation - DEV";
		projs[1]="MM-API-Automation";
		projs[2]="MM-UI-Automation";
    $scope.failCount=0;
    $scope.skipCount=0;
    $scope.totalCount=0;
    $scope.successCount=0;


    $scope.chartObject.type = 'PieChart';
    $scope.chartObject.options = {
        colors: ['green', 'red', 'grey'],
        legend: 'none'

    }
	
	$scope.projects=projs;

	$scope.projectResults=new Array();

	$scope.showResults=function(){
		displayProjectResult($scope.chosenProject);
	};

	
	function displayProjectResult(projectName)
	{
		var j=0;
		var projectResult = new Object();
		projectResult.title=projectName;

		$scope.projectResults[j]=projectResult;


		$http.jsonp('http://jenkins.masternautuk.lan:8080/jenkins/job/'+projectName+'/lastBuild/testReport/api/json?jsonp=JSON_CALLBACK')
			.success(function(data) {
			var i=0;
            $scope.failCount=data.failCount;
                $scope.skipCount=data.skipCount;
                $scope.totalCount=data.totalCount;
                $scope.successCount=   data.totalCount-data.failCount-data.skipCount;

                $scope.chartObject.data = {"cols": [
                    {id: "t", label: "TestStatus", type: "string"},
                    {id: "s", label: "Count", type: "number"}
                ], "rows": [{c: [
                    {v: "Success"},
                    {v: $scope.successCount}
                ]},
                    {c: [
                        {v: "Fail"},
                        {v: $scope.failCount}
                    ]},
                    {c: [
                        {v: "Skip"},
                        {v: $scope.skipCount}
                    ]}
                ]};

			projectResult.results=new Array();
			data.childReports.forEach(function(elemcr,ccr) {
				elemcr.result.suites.forEach(function(elems,cs) {
					elems.cases.forEach(function(elemc,cc) {
						projectResult.results[i]=new Object();
						projectResult.results[i].name=elemc.name;
						projectResult.results[i].status=elemc.status;
						projectResult.results[i].duration=elemc.duration;
						i++;
					});
				});
			});
            });
	}

}



/**
 * Declare the routes.
 * Route /main (#/main in browser) use the controller MainCtrl with template main.html
 */
var app =angular.module('EasyTestReporting',["googlechart"]);



app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/main', {templateUrl:'partial/main.html', controller:MainCtrl});
    $routeProvider.otherwise({redirectTo: '/main'});
}]).value('googleChartApiConfig', {
    version: '1',
    optionalSettings: {
        packages: ['corechart'],
        language: 'en'
    }
});
