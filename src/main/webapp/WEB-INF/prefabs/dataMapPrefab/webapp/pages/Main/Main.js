Application.$controller("DataMapPrefabController", ["$scope", "$element", "Utils", function($scope, $element, Utils) {
    var countryList = {},
        labelKeys = [],
        labels,
        _dataset,
        _oldBoundLocations = -1;
    $scope.data = {};

    function generateDataset(dset) {
            var _s = $element.closest('.app-prefab').scope();
            if (dset && $scope.datafield) {
                _.forEach(dset, function(d, index) {
                    var k = _.get(d, $scope.datafield);
                    $scope.data[k] = d;
                    if ($scope.binddisplayfield) {
                        var expr = $scope.binddisplayfield && $scope.binddisplayfield.replace('bind:', '');
                        $scope.data[k].fillKey = _s.$eval(expr, {
                            '$i': index
                        });

                    } else {
                        $scope.data[k].fillKey = _.get(d, $scope.displayfield);
                    }
                    if ($scope.showdetails) {
                        if ($scope.binddetailstemplate) {
                            var expr = $scope.binddetailstemplate && $scope.binddetailstemplate.replace('bind:', '');
                            $scope.data[k].template = _s.$eval(expr, {
                                '$i': index
                            });
                        } else {
                            $scope.data[k].template = $scope.detailstemplate;
                        }
                    }
                });
                if ($scope.onInitPrefab) {
                    $scope.onInitPrefab();
                }
            }
        }
        //for inflight control of the data value being set
    var _generateDataset = _.debounce(generateDataset, 300);
    //This function creates the options necessary for the widgetProps
    function onDatasetChange(newVal) {
            var datasetObj,
                widgetProps = $scope.$parent.widgetProps,
                options;
            _dataset = [];
            if (WM.isArray(newVal)) {
                _dataset = newVal;
            } else {
                if (WM.isObject(newVal)) {
                    if (WM.isArray(newVal.data)) {
                        _dataset = newVal.data;
                    } else {
                        _dataset = [newVal];
                    }
                }
            }
            if ($scope.widgetid) {

                options = [""];

                widgetProps.itemlabel.options = options;
                widgetProps.datafield.options = options;
                widgetProps.displayfield.options = options;

                if (_dataset.length > 0) {
                    datasetObj = _dataset[0];

                    Utils.getAllKeysOf(datasetObj).forEach(function(key) {
                        options.push(key);
                    });
                }

                if ((_oldBoundLocations !== -1) && (_oldBoundLocations !== $scope.bindlocations)) {
                    /*Remove the attributes from the markup*/
                    $scope.$root.$emit('set-markup-attr', $scope.$parent.widgetid, {
                        "dataset": "",
                        "itemlabel": "",
                        "datafield": "",
                        "displayfield": ""
                    });
                    $scope.itemlabel = "";
                    $scope.datafield = "";
                    $scope.displayfield = "";
                    _oldBoundLocations = $scope.bindlocations;
                }

                if (_oldBoundLocations === -1) {
                    _oldBoundLocations = $scope.bindlocations;
                }
            }
            _generateDataset(_dataset);
        }
        //generate the labels from the key
    function generateLabelsfromKey() {
        if ($scope.itemlabel && $scope.datafield && _dataset) {
            $scope.labeldata = {};
            _.forEach(_dataset, function(sdata, index) {
                var k = _.get(sdata, $scope.datafield);
                var t = _.get(sdata, $scope.itemlabel);
                if (k) {
                    $scope.labeldata[k] = t;
                }
            });
        }
    }

    //when the property changes in the property panel this method handles the changes
    function propertyChangeHandler(key, newVal, oldVal) {
            switch (key) {
                case 'dataset':
                    onDatasetChange(newVal);
                    break;
                case 'itemlabel':
                    generateLabelsfromKey();
                case 'datafield':
                    break;
            }

        }
        /* register the property change handler */
    $scope.propertyManager.add($scope.propertyManager.ACTIONS.CHANGE, propertyChangeHandler);

    //called on initialization of the prefab    
    $scope.onInitPrefab = function() {
        var mapCtr = $element.find("[name = mapContainer]")[0];
        WM.element(mapCtr).empty();
        // this method will be triggered post initialization of the prefab.
        $scope.map = new Datamap({
            element: mapCtr,
            scope: $scope.coverage,
            fills: $scope.colormap,
            data: $scope.data,
            customTemplate: $scope.detailstemplate,
            done: function(datamap) {
                datamap.svg.call(d3.behavior.zoom().on("zoom", redrawMap));
                $scope.datamap = datamap;
                $scope.zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

                function redrawMap() {
                        datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    }
                    //added the click handler on country click
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    if ($scope.onRegionclick) {
                        var d = $scope.data[geography.id];
                        $scope.onRegionclick({
                            "$data": d
                        });
                        $scope.$root.$safeApply($scope);
                    }
                });
                $scope.datamap = datamap;

                function zoomed() {
                    datamap.svg.selectAll("g").attr("transform",
                        "translate(" + $scope.zoom.translate() + ")" +
                        "scale(" + $scope.zoom.scale() + ")"
                    );
                }

                function interpolateZoom(translate, scale) {
                    var self = this;
                    return d3.transition().duration(350).tween("zoom", function() {
                        var iTranslate = d3.interpolate($scope.zoom.translate(), translate),
                            iScale = d3.interpolate($scope.zoom.scale(), scale);
                        return function(t) {
                            $scope.zoom
                                .scale(iScale(t))
                                .translate(iTranslate(t));
                            zoomed();
                        };
                    });
                }

                this.zoomIn = function() {
                    $scope.datamap.svg.call($scope.zoom);
                    zoomClick(true);
                };

                this.zoomOut = function() {
                    $scope.datamap.svg.call($scope.zoom);
                    zoomClick();
                };

                this.zoomHome = function() {
                    $scope.datamap.resize();
                };
                this.zoomGlass = function() {
                    alert('not implemented');
                };

                function zoomClick(isZoomIn) {
                    var direction = 1,
                        factor = 0.2,
                        target_zoom = 1,
                        center,
                        width, height,
                        extent = $scope.zoom.scaleExtent(),
                        translate = $scope.zoom.translate(),
                        translate0 = [],
                        l = [],
                        view = {
                            x: translate[0],
                            y: translate[1],
                            k: $scope.zoom.scale()
                        };
                    if (isNaN($scope.width)) {
                        width = $scope.width.split("%");
                        width = width.length > 1 ? (window.innerWidth * width[0]) / 100 : $scope.width.split("px")[0];
                    } else {
                        width = $scope.width;
                    }
                    if (isNaN($scope.height)) {
                        height = $scope.height.split("%");
                        height = height.length > 1 ? (window.innerHeight * height[0]) / 100 : $scope.height.split("px")[0];
                    } else {
                        height = $scope.height;
                    }
                    center = [width / 2, height / 2];
                    //d3.event.preventDefault();
                    direction = isZoomIn ? 1 : -1;
                    target_zoom = $scope.zoom.scale() * (1 + factor * direction);

                    if (target_zoom < extent[0] || target_zoom > extent[1]) {
                        return false;
                    }

                    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
                    view.k = target_zoom;
                    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

                    view.x += center[0] - l[0];
                    view.y += center[1] - l[1];
                    interpolateZoom([view.x, view.y], view.k);
                }

            },
            geographyConfig: {
                popupOnHover: $scope.showdetails,
                highlightOnHover: $scope.highlight ? true : false,
                highlightFillColor: $scope.highlight,
                highlightBorderColor: $scope.highlight,
                highlightBorderOpacity: 0.4,
                popupTemplate: function(geography, data) {
                    //customTemplate 
                    var t = "";
                    if ($scope.data[geography.id]['template']) {
                        t = '<div class="popover" style="display:block;"><div class="popover-content" style="padding:1em;">' + $scope.data[geography.id]['template'] + '</div></div>'
                    }
                    return t;
                }
            },
            responsive: true
        });
        generateLabelsfromKey()
        if ($scope.labeldata) {
            //get all keys from the label data
            _.forEach($scope.labeldata, function(value, key) {
                    labelKeys.push(key);
                })
                //get all countries to prepare the list of key and value for labels
            _.forEach($scope.datamap.worldTopo.objects.world.geometries, function(value) {
                _.includes(labelKeys, value.id) ? countryList[value.id] = $scope.labeldata[value.id] : countryList[value.id] = ' ';
            });
            $scope.map.labels({
                'customLabelText': countryList
            });
        }


    };


    $(window).on('resize', function() {
        $scope.datamap.resize();
    });

    //handles zoom in button click
    $scope.zoomInClick = function($event, $isolateScope) {
        $scope.map.options.zoomIn();
    };

    //handle zoom out button click
    $scope.zoomOutClick = function($event, $isolateScope) {
        $scope.map.options.zoomOut();
    };

    //handle home button click
    $scope.zoomHomeClick = function($event, $isolateScope) {
        $scope.map.options.zoomHome();
    };

    //handle the zoom glass button click. TODO not implemented
    $scope.zoomGlassClick = function($event, $isolateScope) {
        $scope.map.options.zoomGlass();
    };

}]);