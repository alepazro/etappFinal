etApp.controller('jobsController', ['$rootScope', '$scope', '$window', '$location', '$http', 'JobStatus', 'WorkZone', 'Technician', 'Job', 'workZones', function ($rootScope, $scope, $window, $location, $http, JobStatus, WorkZone, Technician, Job, workZones) {

    $scope.workZones = workZones;
    $scope.technicians = [];
    $scope.jobs = [];
    $scope.woStatus = [];
    var technicians = [];

    $scope.jobFilterStatus = '0';
    $scope.jobFilterWorkZoneId = '0';
    $scope.jobFilterAssignedToId = '0';

    //GET JOBS STATUS LIST
    //==============================================
    var token = '769CBC17-2804-45C6-A226-B7CE8C76539A';
    var noCache = Math.floor((Math.random() * 100000) + 1);;
    JobStatus.getJobStatus({token : token, noCache: noCache}, function (data) {
        $scope.woStatus = data;
        var ds = new kendo.data.DataSource({ data: data });
        var grid = $('#woStatsGrid').data("kendoGrid");
        grid.setDataSource(ds);
    }, function (arg) {
        var a = 1;
    });


    // SET DATA SOURCES
    //==============================================
    $scope.dsWOStats = new kendo.data.DataSource({
        data: $scope.woStatus
    });

    $scope.dsWorkZones = new kendo.data.DataSource({
        data: workZones
    });

    $scope.dsTechnicians = new kendo.data.DataSource({
        data: []
    });
    $scope.dsJobs = new kendo.data.DataSource({
        data: []
    });
    //==============================================
    // SET GRIDS COLUMNS
    //==============================================
    $scope.woStatsGridOptions = {
        selectable: 'row',
        columns: [
            { field: 'name', title: 'Job Status' },
            { field: 'qty', title: 'Quantity' },
            { field: 'overdue', title: 'Overdue' }
        ],
        change: function (e) {
            var selectedRows = this.select();
            if (selectedRows.length > 0) {
                var selRow = this.dataItem(selectedRows[0]);
                $scope.jobFilterStatus = selRow.id;
                $scope.loadJobs();
            }
        }
    }

    $scope.wzGridOptions = {
        selectable: 'row',
        columns: [
            { field: "name", title: "Work Zones" }
        ],
        change: function (e) {
            var selectedRows = this.select();
            if (selectedRows.length > 0) {
                var selRow = this.dataItem(selectedRows[0]);
                var wzId = selRow.id;
                $scope.jobFilterWorkZoneId = selRow.id;
                $scope.jobFilterAssignedToId = '0'; //Reset the AssignedToId filter when there is a change in Work Zone

                var token = getCookie('ETTK');
                token = '769CBC17-2804-45C6-A226-B7CE8C76539A';
                Technician.getTechnicians({
                    token: token,
                    wzId: wzId
                }, function (data) {
                    technicians = data;

                    var ds = new kendo.data.DataSource({ data: data });
                    var grid = $('#techsGrid').data("kendoGrid");
                    grid.setDataSource(ds); 

                }, function (arg) {
                    var a = 1;
                });

                $scope.loadJobs();

            }
        }
    };

    $scope.techsGridOptions = {
        selectable: 'row',
        columns: [
            { field: 'name', title: 'Technicians' }
        ],
        change: function (e) {
            var selectedRows = this.select();
            if (selectedRows.length > 0) {
                var selRow = this.dataItem(selectedRows[0]);
                $scope.jobFilterAssignedToId = selRow.id;
                $scope.loadJobs();
            }
        }
    };

    //==============================================
    $scope.jobsGridOptions = {
        selectable: 'row',
        sortable: true,
        resizable: true,
        pageable: true,
        columns: [
            { field: 'jobNumber', title: 'Job No.', width: 100 },
            { field: 'customerName', title: 'Customer' },
            { field: 'jobDescription', title: 'Job Description' },
            { field: 'assignedToName', title: 'Assigned To', width: 200 },
            { field: 'jobStatus', title: 'Status', width: 100 },
            { field: 'priority', title: 'Priority', width: 100 },
            { field: 'createdOn', title: 'Created On', width: 100 },
            { field: 'dueOn', title: 'Due On', width: 100 },
            {
                command: {
                    text: "Edit", click: function (e) {
                        e.preventDefault();
                        var selectedRows = this.select();
                        if (selectedRows.length > 0) {
                            var selRow = this.dataItem(selectedRows[0]);
                            var jobId = selRow.id;

                            $rootScope.$apply(function () {
                                $location.path("job/" + jobId);
                            });
                        }
                    }
                }, title: " ", width: "100px"
            }
        ],
        change: function (e) {
            var selectedRows = this.select();
            if (selectedRows.length > 0) {
                var selRow = this.dataItem(selectedRows[0]);
                var jobId = selRow.id;
            }
        }
    };
    //==============================================

    $scope.loadJobs = function () {
        var token = getCookie('ETTK');
        token = '769CBC17-2804-45C6-A226-B7CE8C76539A';
        var noCache = Math.floor((Math.random() * 100000) + 1);
        var filterJobNumber = $scope.filterJobNumber;
        if (filterJobNumber == '' || _.isUndefined(filterJobNumber)) {
            filterJobNumber = '0';
        }
        var filterCustomerName = $scope.filterCustomerName;
        if (filterCustomerName == '' || _.isUndefined(filterCustomerName)) {
            filterCustomerName = '0';
        }
        Job.getJobs({ token: token, noCache: noCache, statId: $scope.jobFilterStatus, wzId: $scope.jobFilterWorkZoneId, techId: $scope.jobFilterAssignedToId, jobNo: filterJobNumber, custName: filterCustomerName }, function (data) {
            var ds = new kendo.data.DataSource({ data: data });
            var grid = $('#jobsGrid').data("kendoGrid");
            grid.setDataSource(ds);

        }, function (err) {
            var b = 1;
        });
    }

    // CLEAR GRIDS SELECTIONS
    //=================================================
    $scope.woStatsGridClear = function () {
        var grid = $('#woStatsGrid').data("kendoGrid");
        grid.clearSelection();
        $scope.jobFilterStatus = '0';
        $scope.loadJobs();
    }
    $scope.wzGridClear = function () {
        var grid = $('#wzGrid').data("kendoGrid");
        grid.clearSelection();
        $scope.jobFilterWorkZoneId = '0';
        $scope.jobFilterAssignedToId = '0';
        //Clear the technicians grid
        $("#techsGrid").data("kendoGrid").dataSource.data([]);
        $scope.loadJobs();
    }

    $scope.techsGridClear = function () {
        var grid = $('#techsGrid').data("kendoGrid");
        grid.clearSelection();
        $scope.jobFilterAssignedToId = '0';
        $scope.loadJobs();
    }
    //=================================================

    $scope.clearFilters = function () { }

    $scope.newJob = function () {
        $location.path('job/0');
    }

}]);
