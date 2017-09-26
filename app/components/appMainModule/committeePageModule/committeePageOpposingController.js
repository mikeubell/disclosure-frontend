'use strict';

function committeePageOpposingController($scope, opposing) {
  $scope.opposing = opposing;
  console.log('Opposing', opposing);
}

module.exports = committeePageOpposingController;
