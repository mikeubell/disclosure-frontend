  /**
   * opposingListing/index.js
   *
   * Describes a single political opposing.
   **/

   (function() {
    'use strict';

    angular
    .module('opposingListing',[])
    .directive('opposingListing', opposingListingDirective);

    function opposingListingDirective() {
      return {
        restrict: 'E',
        template: require('./opposingListing.html'),
        controller: opposingListingController,
        controllerAs: '$ctrl',
        bindToController: true,
        scope: {
          opposing: '=',
          expenditures: '=',
        }
      };
    }

    opposingListingController.$inject = ['$filter'];
    function opposingListingController($filter) {
      var ctrl = this;

      var expendituresObjs;

      ctrl.opposingTotal = 0;
      ctrl.expendituresSearch = '';

      // Convert resources to plain old objects to make ag-grid happy
      expendituresObjs = ctrl.expenditures.map(function(resource) {
        // Total listed expenditures
        ctrl.opposingTotal += resource.Tran_Amt1;

        return {
          Name: getFriendlyName(resource),
          Tran_Amt1: resource.total,
          Tran_Date: resource.Exp_Date
        };
      });

      ctrl.gridOptions = {
        columnDefs: [
          {
            headerName: 'Contributor',
            field: 'Name',
            filter: 'text',
            minWidth: 300,
            width: getColumnWidth(0.6, 300),
            suppressMenu: true
          },
          {
            headerName: 'Amount',
            field: 'Tran_Amt1',
            minWidth: 100,
            width: getColumnWidth(0.2, 100),
            cellFormatter: function(params) {
              return $filter('currency')(params.value, '$', 0);
            },
            sort: 'desc',
            suppressMenu: true
          },
          {
            headerName: 'Date',
            field: 'Tran_Date',
            minWidth: 110,
            width: getColumnWidth(0.2, 110),
            suppressMenu: true
          }
        ],
        headerHeight: 40,
        enableSorting: true,
        enableFilter: true,
        rowData: expendituresObjs,
        rowHeight: 40,
        suppressMovableColumns: true
      };

      // Combine first and last name, capitalize
      function getFriendlyName(resource) {
        var names = [];
        if (resource.Tran_NamF) {
          names = names.concat(resource.Tran_NamF.split(' '));
        }

        if (resource.Tran_NamL) {
          names = names.concat(resource.Tran_NamL.split(' '));
        }

        return names.join(' ');
      }

      // ag-grid requires fixed widths in pixels. Calculating them here to take all available space
      function getColumnWidth(percentOfWidth, minWidth) {
        var allocatedWidth, gridWidth, minWidth, odcaGridElement;

        odcaGridElement = document.querySelectorAll('.odca-grid')[0];
        gridWidth = odcaGridElement.offsetWidth;
        allocatedWidth = Math.round(gridWidth * percentOfWidth * 100) / 100;

        return allocatedWidth >= minWidth ? allocatedWidth : minWidth;
      }
    }


})();
