
angular.module('ws-controllers', [])


.controller('Login', ['$scope', '$state', '$window', 'auth',
function($scope, $state, $window, auth) {

    $scope.auth = auth;

    $scope.loginUser = function(user, pass) {
        console.log(user, pass)
        $scope.loading = true;
        auth.login(user, pass)
            .success(function(data) {

                // see https://github.com/angular-ui/ui-router/issues/582
                $state.transitionTo('ws', {}, {reload: true, inherit: true, notify: false})
                      .then(function() {
                        setTimeout(function(){
                            $window.location.reload();
                        }, 0);
                      });

            }).error(function(e, status){
                console.log('error', e)
                $scope.loading = false;
                if (status == 401) {
                    $scope.inValid = true;
                } else {
                    $scope.failMsg = "Could not reach authentication service: "+e.error_msg;
                }
            })
    }

    $scope.logout = function() {
        auth.logout();
        $state.transitionTo('login', {}, { reload: true, inherit: true, notify: false })
              .then(function() {
                  $window.location.reload();
              });
    }
}])

.controller('WB', ['$scope', '$stateParams', 'auth',
function($scope, $stateParams, auth) {
    $scope.auth = auth;

    $scope.ws = $stateParams.ws;
    $scope.type = $stateParams.type;



}])

.controller('KBaseTables', function($scope, $stateParams) {
    $scope.tab = 'data';
    $scope.info = {type: $stateParams.type,
                   ws: $stateParams.ws,
                   name: $stateParams.name,
                   kind: $stateParams.type.split('.')[1]};

})
.controller('KBaseExamples', ['$scope', function($scope) {
    $scope.tab = "Narrative Examples";

    // order in which examples are dsiplayed
    $scope.typeOrder = ['KBaseSearch.GenomeSet',
                        'KBaseBiochem.Media',
                        'KBaseFBA.FBAModel',
                        'KBaseFBA.FBA',
                        'KBasePhenotypes.PhenotypeSet',
                        'KBasePhenotypes.PhenotypeSimulationSet']

    // example objects from KBaseExampleData
    kb.ws.list_objects({workspaces: ['KBaseExampleData']})
        .done(function(data){
            var examples = {}; // by type
            data.forEach(function(obj) {
                var type = obj[2].split('-')[0],
                    name = obj[1],
                    ws = obj[7];


                if (type in examples)
                    examples[type].push({obj: name, ws: ws});
                else
                    examples[type] = [{obj: name, ws: ws}];
            })

            $scope.$apply(function() {
                $scope.examples = examples;
            })
        })

    $scope.otherExamples =
        {'KBaseSearch.GenomeSet': [{ws: 'chenry:SingleGenomeNarrative', obj: 'Rhodobacter_Pangenome_Set'}],
         'KBaseBiochem.Media': [{ws: 'chenry:SingleGenomeNarrative', obj: 'QuantOptMedia-Acetoin'},
                                {ws: 'chenrydemo', obj: 'mediaexample'},
                                {ws: 'KBaseMedia', obj: 'PlantHeterotrophicMedia'}],
          'KBaseFBA.FBAModel': [{ws: 'nconrad:testObjects', obj: 'iBsu1103'},
                                {ws: 'PublishedFBAModels', obj: 'iJO1366'}],
          'KBasePhenotypes.PhenotypeSet': [{ws: 'chenrydemo', obj: 'testpheno'}],
          'KBasePhenotypes.PhenotypeSimulationSet': [{ ws: 'dejongh:COBRA2014', obj: 'Rsp-biolog.simulation'}]
        };
}])

.controller('WBTour', ['$scope', '$state', function($scope, $state) {
    $scope.ws = 'chenryExample';  // workspace to use for tour

    // if not logged in, prompt for login
    if (!USER_ID) {
        var signin_btn = $('#signin-button');
        signin_btn.popover({content: "You must login before taking the tour",
                            trigger: 'manual', placement: 'bottom'})
        signin_btn.popover('show');

    // otherwise, do the tour
    } else {
        function checkSomething() {
            $scope.checkedList.push([ 'kb|g.0.fbamdl', 'chenryExample', 'FBAModel-2.0' ]);
            $scope.$apply();
            $('.ncheck').eq(2).addClass('ncheck-checked');
        }

        var tour = [{element: '.btn-new-ws', text:'Create a new workspace here', placement: 'bottom'},
                    {element: '.btn-ws-settings', n: 2,
                        text: 'Manage workspsace sharing and other settings, as \
                        well as clone and delete workspaces using the gear button.',
                        bVisible: true, time: 4000},
                    {element: '.obj-id', n: 2,
                        text: 'View data about the object, including visualizations and KBase widgets'},
                    {element: '.show-versions', n: 2, text: 'View the objects history.'},
                    {element: '.btn-show-info', n: 2,
                        text: 'View meta data,  download the objects, etc', bVisible: true},
                    {element: '.ncheck', n: 2, text: 'Select objects by using checkboxes<br> and see options appear above',
                        event: checkSomething},
                    {element: '.btn-table-settings', text: 'Show and hide columns and set other object table settings'},
                    {element: '.type-filter', text: 'Filter objects by type'},
                    {element: '.btn-delete-obj', text: 'Delete the objects selected in the table'},
                    {element: '.btn-mv-dd', text: 'Go ahead, copy your colleague\'s objects to your own workspace'},
                    {element: '.btn-rename-obj', text: 'Rename a selected object'},
                    {element: '.btn-trash', text: 'View the trash bin for this workspace.<br>  \
                                    Unreferenced objects will be deleted after 30 days.'}]

        function exit_callback() {
            $scope.$apply( $state.go('ws') );
        }

        new Tour({tour: tour, exit_callback: exit_callback});
    }
}])
