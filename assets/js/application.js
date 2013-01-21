$(function () {
    var chart;
    $(document).ready(function () {

        function sortByFrequency(array) {
            var frequency = {};

            array.forEach(function (value) {
                frequency[value] = 0;
            });


            var uniques = array.filter(function (value) {
                return ++frequency[value] == 1;
            });
            console.log(uniques);

            var tuples = [];

            for (var key in frequency) tuples.push([key, frequency[key]]);

            tuples.sort(function (a, b) {
                a = a[1];
                b = b[1];

                return a < b ? 1 : (a > b ? -1 : 0);
            });

            return tuples;
        }

        function keys(tuples) {
            var keys = [];
            for (var i = 0; i < tuples.length; i++) {
                keys.push(tuples[i][0]);
            }
            return keys;
        }

        function values(tuples) {
            var keys = [];
            for (var i = 0; i < tuples.length; i++) {
                keys.push(tuples[i][1]);
            }
            return keys;
        }

        function sum(array) {
            var total = 0;
            for (i = 0; i < array.length; i++) {
                total += array[i];
            }
            return total;
        }

        function cumulativePercent(array) {
            var cumulative = [];
            var cumulativeTotal = 0;
            var total = sum(array);
            for (var i = 0; i < array.length; i++) {
                cumulativeTotal += (array[i] / total) * 100;
                cumulative.push(cumulativeTotal);
            }
            return cumulative;
        }

        createGraph("Cog Radius Individuals", 1, 'graph1', 'line');
        createGraph("Cog Radius Subgroup = 4", 2, 'graph2', 'scatter');
        createGraph("Cog Radius Subgroup = 10", 3, 'graph3', 'scatter');
        createParetoChart("Recorded Fault", 4, 'graph4', 'bar');

        function createParetoChart(seriesName, worksheetNumber, renderToDiv, chartType) {
            chartType = chartType || 'line';
            var ds = new Miso.Dataset({
                importer: Miso.Dataset.Importers.GoogleSpreadsheet,
                parser: Miso.Dataset.Parsers.GoogleSpreadsheet,
                key: "0ApMTQySkpypIdHM4SWwtTFgydVpwRnVGTFhoZzdReGc",
                worksheet: worksheetNumber,
                fast: false
            });

            _.when(ds.fetch()).then(function () {
                ds.eachColumn(function (columnName) {
                    console.log(ds.column(columnName).data);
                });

//                var tuples = sortByFrequency(['a', 'a', 'b', 'c', 'c', 'c', 'c', 'c', 'd', 'e', 'e', 'e', 'f', 'g']);
                var tuples = sortByFrequency(ds.column(ds.columnNames()[1]).data);
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: renderToDiv,
                        defaultSeriesType: 'column',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        marginLeft: 110,
                        marginRight: 50,
                        backgroundColor: '#eee',
                        plotBackgroundColor: '#fff',
                        alignTicks: false
                    },
                    title: {
                        text: 'Pareto Chart'
                    },
                    legend: {

                    },
                    tooltip: {
                        formatter: function () {
                            if (this.series.name == 'Cumulative Percent') {
                                return this.y + '%';
                            }
                            return this.y;
                        }
                    },
                    plotOptions: {
                        series: {
                            shadow: false
                        }
                    },
                    xAxis: {
                        categories: (function () {

                            return keys(tuples);
                        })(),
                        lineColor: '#999',
                        lineWidth: 1,
                        tickColor: '#666',
                        tickLength: 3,
                        title: {
                            text: 'X Axis Title',
                            style: {
                                color: '#000'
                            }
                        }
                    },
                    yAxis: [
                        {
                            endOnTick: false,
                            lineColor: '#999',
                            lineWidth: 1,
                            tickColor: '#666',
                            tickWidth: 1,
                            tickLength: 3,
                            gridLineColor: '#ddd',
                            title: {
                                text: 'Y Axis Title',
                                rotation: 0,
                                margin: 50,
                                style: {
                                    color: '#000'
                                }
                            }
                        },
                        {
                            title: {text: ''},
                            gridLineWidth: 0,
                            lineColor: '#999',
                            lineWidth: 1,
                            tickColor: '#666',
                            tickWidth: 1,
                            tickLength: 3,
                            endOnTick: false,
                            opposite: true,
                            min: 0,
                            labels: {
                                formatter: function () {
                                    return this.value + '%';
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: seriesName,
                            yAxis: 0,
                            data: (function () {
                                return values(tuples);
                            })()
                        },
                        {
                            type: 'line',
                            name: 'Cumulative Percent',
                            yAxis: 1,
                            data: (function () {
                                return cumulativePercent(values(tuples));
                            })()
                        }
                    ]
                });
            });
        }

        function createGraph(seriesName, worksheetNumber, renderToDiv, chartType) {
            chartType = chartType || 'line';
            var ds = new Miso.Dataset({
                importer: Miso.Dataset.Importers.GoogleSpreadsheet,
                parser: Miso.Dataset.Parsers.GoogleSpreadsheet,
                key: "0ApMTQySkpypIdHM4SWwtTFgydVpwRnVGTFhoZzdReGc",
                worksheet: worksheetNumber,
                fast: false
            });

            _.when(ds.fetch()).then(function () {
                ds.eachColumn(function (columnName) {
                    console.log(ds.column(columnName).data);
                });

                chart = new Highcharts.Chart({
                    chart: {
                        renderTo: renderToDiv,
                        type: chartType,
//                        marginRight: 130,
//                        marginBottom: 25,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        marginLeft: 110,
                        marginRight: 50,
                        backgroundColor: '#eee',
                        plotBackgroundColor: '#fff',
                        events: {
                            load: function () {
                                // Programmer: Larry Battle
                                // Date: Mar 06, 2011
                                // Purpose: Calculate standard deviation, variance, and average among an array of numbers.
                                var isArray = function (obj) {
                                        return Object.prototype.toString.call(obj) === "[object Array]";
                                    },
                                    getNumWithSetDec = function (num, numOfDec) {
                                        var pow10s = Math.pow(10, numOfDec || 0);
                                        return ( numOfDec ) ? Math.round(pow10s * num) / pow10s : num;
                                    },
                                    getAverageFromNumArr = function (numArr, numOfDec) {
                                        if (!isArray(numArr)) {
                                            return false;
                                        }
                                        var i = numArr.length,
                                            sum = 0;
                                        while (i--) {
                                            sum += numArr[ i ];
                                        }
                                        return getNumWithSetDec((sum / numArr.length ), numOfDec);
                                    },
                                    getVariance = function (numArr, numOfDec) {
                                        if (!isArray(numArr)) {
                                            return false;
                                        }
                                        var avg = getAverageFromNumArr(numArr, numOfDec),
                                            i = numArr.length,
                                            v = 0;

                                        while (i--) {
                                            v += Math.pow((numArr[ i ] - avg), 2);
                                        }
                                        v /= numArr.length;
                                        return getNumWithSetDec(v, numOfDec);
                                    },
                                    getStandardDeviation = function (numArr, numOfDec) {
                                        if (!isArray(numArr)) {
                                            return false;
                                        }
                                        var stdDev = Math.sqrt(getVariance(numArr, numOfDec));
                                        return getNumWithSetDec(stdDev, numOfDec);
                                    };

                                var round2decimals = function (num) {
                                    return Math.round(num * 100) / 100;
                                };

                                var xAxi = this.xAxis[0];
                                var yAxi = this.yAxis[0];

                                var yData = this.series[0].processedYData;
                                var averageFromNumArr = getAverageFromNumArr(yData, 2);
                                var standardDeviation = getStandardDeviation(yData, 2);
                                var upSD = round2decimals(averageFromNumArr + (standardDeviation * 3));
                                var downSD = round2decimals(averageFromNumArr - (standardDeviation * 3));

                                yAxi.addPlotLine({
                                    value: averageFromNumArr,
                                    color: 'green',
                                    dashStyle: 'shortdash',
                                    width: 2,
                                    label: {
                                        text: 'Mean ' + averageFromNumArr
                                    }
                                });
                                yAxi.addPlotLine({
                                    value: upSD,
                                    color: 'red',
                                    dashStyle: 'shortdash',
                                    width: 2,
                                    label: {
                                        text: '+3 Standard Deviation ' + upSD
                                    }
                                });
                                yAxi.addPlotLine({
                                    value: downSD,
                                    color: 'red',
                                    dashStyle: 'shortdash',
                                    width: 2,
                                    label: {
                                        text: '-3 Standard Deviation ' + downSD
                                    }
                                });

                                var xExtremes = xAxi.getExtremes();
                                var xMin = xExtremes.min - 150;
                                var xMax = xExtremes.max + 150;
                                xAxi.setExtremes(xMin, xMax);

                                var yExtremes = yAxi.getExtremes();
                                var yMin = Math.min(yExtremes.min, downSD);
                                var yMax = Math.max(yExtremes.max, upSD);
                                yAxi.setExtremes(yMin, yMax);

//                        this.yAxis[0].plotLinesAndBands[0].options.value = 2;
                                // set up the updating of the chart each second
//                            var series = this.series[0];
//                        setInterval(function () {
//                            var x = (new Date()).getTime(), // current time
//                                y = Math.round(Math.random() * 100);
//                            series.addPoint([x, y], true, true);
//                        }, 1000);


                            }
                        }
                    },
                    title: {
                        text: 'Variables Control Chart',
                        x: -20 //center
                    },
                    subtitle: {
                        text: 'Subtitle goes here',
                        x: -20
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                    },

                    yAxis: {
                        title: {
                            text: 'Individual Value'
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                Highcharts.numberFormat(this.y, 2);
                        }
                    },

                    legend: {
//                        layout: 'vertical',
//                        align: 'right',
//                        verticalAlign: 'top',
//                        x: -10,
//                        y: 100,
//                        borderWidth: 0
                    },
                    series: [
                        {
                            name: seriesName,
                            data: (function () {
                                // generate an array of random data
                                var data = [];

                                var column0Name = ds.columnNames()[0];
                                var column1Name = ds.columnNames()[1];
                                ds.each(function (row) {
                                    console.log(JSON.stringify(row));
                                    var dateTime = new Date(row[column0Name]).getTime();
                                    data.push({
                                        x: dateTime,
                                        y: row[column1Name]
                                    });
                                });

                                return data;
                            })()

                        }
                    ]

                });
            });
        }
    });

});