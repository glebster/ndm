/*global angular*/
(function withAngular(angular) {
  'use strict';

  var HomeController = function HomeController($rootScope, $scope, npmFactory) {

    var that = this
      , selectGlobal = function selectGlobalDir() {

          $rootScope.globally = true;
          that.selectedProject = undefined;
          $rootScope.$emit('user:selected-global');
          console.log('selected globally');
        }
      , selectProject = function selectProject(project, event) {
        if (event) {
          event.preventDefault();
        }

        $rootScope.globally = undefined;
        that.selectedProject = project;
        $rootScope.$emit('user:selected-project', project);
        console.log('selected project');

        if (event) {
          event.stopPropagation();
        }
      }
      , deleteProject = function deleteProject(project, event) {

        if (event) {
          event.preventDefault();
        }

        var index = $rootScope.projectsList.indexOf(project);
        $rootScope.projectsList.splice(index, 1);
        $rootScope.$emit('user:deleted-project', project);
        console.log('deleted project');

        if (event) {
          event.stopPropagation();
        }
      }
      , unregisterOnNewProject = $rootScope.$on('user:added-new-project', function onNewProject(eventInfo, data) {
        $scope.$evalAsync(function evalAsync() {

          $rootScope.projectsList.push(data);
          selectProject(data);
        });
      });

      $scope.$on('$destroy', function scopeDestroy() {

        unregisterOnNewProject();
      });

      selectGlobal();
      that.selectGlobal = selectGlobal;
      that.selectProject = selectProject;
      that.deleteProject = deleteProject;
  }
  , inputFile = function inputFile($window, $rootScope) {
    return {
      'restrict': 'A',
      'scope': {
        'inputfile': '='
      },
      'link': function linkingFunction(scope, element) {

        element.bind('change', function onInputfileChange(changeEvent) {
          var selectedDir = changeEvent.target;

          if (selectedDir && selectedDir.files[0]) {

            $rootScope.$emit('user:added-new-project', {
              'name': selectedDir.files[0].name,
              'path': selectedDir.files[0].path
            });
          }
        });
      }
    }
  };

  angular.module('electron.home.controllers', [])
    .controller('HomeController', ['$rootScope', '$scope', 'npmFactory', HomeController])
    .directive('inputFile', ['$window', '$rootScope', inputFile]);
}(angular));
