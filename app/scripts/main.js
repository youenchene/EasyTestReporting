



/**
 * Declare MainCtrl, this controller does a GET on "/hello" and put the result in scope.
 */
function MainCtrl($scope, $http) {



	var projs=new Array();

	projs[0]="mastermanager-test%20-%20FLUENT";
	projs[1]="mastermanager-test%20-%20ALL%20-%20Sequential";
	projs[2]="mastermanager-test%20-%20N-1";
	projs[3]="masternaut-api-test";
	projs[4]="mastermanager-test%20-%20Account";
	projs[5]="mastermanager-test%20-%20Administration";
	projs[6]="mastermanager-test%20-%20Driver";
	projs[7]="mastermanager-test%20-%20Home";
	projs[8]="mastermanager-test%20-%20OBU";
	
	
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
			$scope.projectResults[j]=projectResult;

			$http.jsonp('http://jenkins.masternautuk.lan:8080/jenkins/job/'+projectName+'/lastBuild/api/json?jsonp=JSON_CALLBACK')
				.success(function(data) {

				$scope.projectResults[j].date=new Date(data.timestamp);
				});
					

		});
	}

}



/**
 * Declare the routes.
 * Route /main (#/main in browser) use the controller MainCtrl with template main.html
 */
var app =angular.module('EasyTestReporting',[]);



app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/main', {templateUrl:'partial/main.html', controller:MainCtrl});
    $routeProvider.otherwise({redirectTo: '/main'});
}]);
