$(function () {
    var chart;
    $(document).ready(function () {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'line',
                marginRight: 130,
                marginBottom: 25,
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

                        var numArr2 = this.series[0].processedYData;
                        var averageFromNumArr = getAverageFromNumArr(numArr2, 2);
                        var standardDeviation = getStandardDeviation(numArr2, 2);
                        var upSD = round2decimals(averageFromNumArr + (standardDeviation * 3));
                        var downSD = round2decimals(averageFromNumArr - (standardDeviation * 3));
                        this.yAxis[0].addPlotLine({
                            value: averageFromNumArr,
                            color: 'green',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: 'Mean ' + averageFromNumArr
                            }
                        });
                        this.yAxis[0].addPlotLine({
                            value: upSD,
                            color: 'red',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: '+3 Standard Deviation ' + upSD
                            }
                        });
                        this.yAxis[0].addPlotLine({
                            value: downSD,
                            color: 'red',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: '-3 Standard Deviation ' + downSD
                            }
                        });
                        var extremes = this.yAxis[0].getExtremes();
                        var min = Math.min(extremes.min, downSD - 5);
                        var max = Math.max(extremes.max, upSD + 5);
                        this.yAxis[0].setExtremes(min, max);
//                        this.yAxis[0].plotLinesAndBands[0].options.value = 2;
                        // set up the updating of the chart each second
//                        var series = this.series[0];
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
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: [
                {
                    name: 'Random data',
                    data: (function () {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -19; i <= 0; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: Math.random() * 35
                            });
                        }
                        return data;
                    })()
                }
            ]

        });
    });

});