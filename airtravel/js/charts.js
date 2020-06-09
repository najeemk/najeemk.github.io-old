/* Workaround for Hover*/
/*
(function (H) {
    H.wrap(H.Pointer.prototype, 'normalize', function (proceed, e) {
        var e = proceed.call(this,e);
        var zoom = Reveal.getScale();
        if(zoom>1) {
        var positionX = e.pageX - e.chartX;
        var positionY = e.pageY - e.chartY;
        e.chartX = Math.round((e.pageX - positionX*zoom)/zoom);
        e.chartY = Math.round((e.pageY - positionY*zoom)/zoom); 
        } else {
          e.chartX = Math.round(e.chartX/zoom);
          e.chartY = Math.round(e.chartY/zoom);
        }
      return e;
    });
}(Highcharts));
*/

/* Begin charts*/

systems_chart = Highcharts.getJSON(
    'data/carrier_traffic_clean.json',
    function (data) {

        Highcharts.chart('systems-enplanement', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'US System Passenger Enplanements (January 2000 - January 2020)'
            },
            subtitle: {
                text: 'With a notable exception in September 2001, and a dip around late-2008,<br /> passenger traffic seems to have been stedily increasing every single year'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Year'
                },
                minorGridLineColor: '#C5EEFA',
                minorTickInterval: 'auto',
                minorGridLineDashStyle: 'longdash',
            },
            yAxis: {
                title: {
                    text: 'Passenger Emplanements',
                    rotation: 0,
                    align: 'high',
                    offset: 0,
                    y: -10
                },
                tickPositions: [12500, 25000, 37500, 50000, 62500, 75000, 87500],
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'Passengers',
                data: data,
                allowPointSelect: true,
            }],

            caption: {
                text: 'Source: <a href="https://www.transtats.bts.gov/TRAFFIC/">Bureau of Transportation Statistics</a>'
            }
        });
    }
);

systems_chart = Highcharts.getJSON(
    'data/diffs_systems.json',
    function (data) {
        console.log(data);
        Highcharts.chart('systems-diff', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Differences Between by Year (2000 -  2019)'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                tickInterval: 1,
                title: {
                    text: "Year"
                }
            },
            yAxis: {
                title: {
                    text: 'Differences<br />. from Previous Year',
                    rotation: 0,
                    align: 'high',
                    offset: 0,
                    y: -25
                },
                tickPositions: [-75000, -50000, -25000, 0, 25000, 50000, 75000]
            },
            series: [{
                data: data,
                name: 'Differences <br /> from Previous Year',
                showInLegend: false
            }],
            caption: {
                text: 'Note: Difference above 0 means that travel increased by the given amount, while a difference below 0 means it decreased by the given amount. <br/ >Source: <a href="https://www.transtats.bts.gov/TRAFFIC/">Bureau of Transportation Statistics</a>'
            }
        });
    }
);

Reveal.addEventListener( 'somestate', function() {
    window.setTimeout(function(){ systems_chart.reflow(); });
}, false );
