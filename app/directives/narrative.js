
/*
 * Narrative directives
 *  - narrativeCell : extends functionality of a cell
 *  - kbWidget : wrapper for jquery output widgets
 *  - ddSelector : searchable angular, bootstrapifyed dropdown used
 *                 for selectors
 *
 * Controllers:  (See Analysis in js/controllers.js)
 *
 *
 * Authors:
 *  Neal Conrad <nealconrad@gmail.com>
 *
*/

var narrativeDirectives = angular.module('narrative-directives', []);

angular.module('narrative-directives')

.directive('narrativeCell', function(narrative) {
    return {
        link: function(scope, ele, attrs) {

            // dictionary for fields in form.  Here, keys are the ui_name
            scope.fields = {};

            scope.flip = function($event) {
                $($event.target).parents('.panel').find('.narrative-cell').toggleClass('flipped')
            }

            scope.minimize = function($event) {
                $($event.target).parents('.panel').find('.panel-body').slideToggle('fast');
            }

            scope.runCell = function(index, cell) {
                var task = {name: cell.title, fields: scope.fields};
                narrative.newTask(task);
            }


        }
    }
})

.directive('showData', function() {
    return {
        link: function(scope, ele, attrs) {

        }
    }
})

.directive('kbUpload', function($location) {
    return {
        link: function(scope, element, attrs) {
            console.log(USER_TOKEN)
            SHOCK.init({ token: USER_TOKEN, url: scope.shockURL })

            var url = "http://140.221.67.190:7078/node" ;

            /*
            var prom = SHOCK.get_all_nodes(function(data) {
                console.log('shock data!', data)
            })*/

            var prom = SHOCK.get_all_nodes();
            $.when(prom).done(function(data){
                scope.$apply(function(){
                    scope.uploads = data;
                })
                console.log(data)
            })

        }
    }
})
