/* Workaround for Hover*/
fix_charts_bool = false
function fix_charts() {
    if (fix_charts_bool == false) {
        fix_charts_bool = true;
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
    }
}

function get_vals(x, c) {
    /* Given a 2-d array x and index c, function will extract [:][c] */ 
    let data = []
    for (y of x) {
        data.push(y[c])
    }
    return data
}


/* Begin charts*/

systems_chart = Highcharts.getJSON(
    'data/carrier_traffic_clean.json',
    function (data) {

        Highcharts.chart('systems-enplanement', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'US System Aircraft Passenger Enplanements (January 2000 - January 2020)'
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
                crosshair: true,
            },
            yAxis: {
                title: {
                    text: 'Passenger Emplanements',
                    rotation: 0,
                    align: 'high',
                    offset: 0,
                    y: -10
                },
                tickPositions: [25000, 37500, 50000, 62500, 75000, 87500],
                crosshair: true
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
                text: 'Note: Dashed grid lines represent January and July.<br />Source: <a href="https://www.transtats.bts.gov/TRAFFIC/">Bureau of Transportation Statistics</a>'
            }
        });
    }
);


diffs_chart = Highcharts.getJSON(
    'data/diffs_systems.json',
    function (data) {
        console.log(get_vals(data, 0));
        Highcharts.chart('systems-diff', {
            title: {
                text: 'Differences in Aircraft Passenger Emplanement by Year (2000 -  2019)'
            },
            subtitle: {
                text: 'With a notable exception in 2001, and a dip 2008-2009,<br /> passenger traffic seems to have been stedily increasing every single year'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                tickInterval: 1,
                title: {
                    text: "Year"
                },
                categories: get_vals(data, 0)
            },
            yAxis: {
                title: {
                    text: 'Differences<br />. from Previous Year (%)',
                    rotation: 0,
                    align: 'high',
                    offset: 0,
                    y: -25
                },
                tickPositions: [-10, -7.5, -5, -2.5, 0, 2.5, 5, 7.5, 10],
            },
            series: [
                {
                    data: get_vals(data, 1),
                    type: 'column',
                    name: 'Differences <br /> from Previous Year %',
                    showInLegend: false,
                    color: '#556b2f',
                    negativeColor: '#990000'
                },
                {
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    type: 'line',
                    showInLegend: false,
                    color: 'black',
                    enableMouseTracking: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            ],
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            caption: {
                text: 'Note: Difference above 0 (green) means that travel increased by the given percentage, while a difference below 0 (red) means it decreased by the given percentage. <br/ >Source: <a href="https://www.transtats.bts.gov/TRAFFIC/">Bureau of Transportation Statistics</a>'
            }
        });
    }
);

quarter_by_quarter_chart = Highcharts.getJSON(
    'data/quarterly.json',
    function (data) {
        Highcharts.chart('quarter-by-quarter', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Quatertly U.S. Outbound Tourism, 2018'
            },
            subtitle: {
                text: 'It seems to be fairly uniform, with the summmer months (Jul-Sept) only beating the winter months (Jan-Mar) by ~6.7%'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    },
                }
            },
            colors: ['#236e96', '#ff598f', '#ffd700', '#f3872f'],
            series: [{
                name: 'Fiscal Quarter',
                colorByPoint: true,
                data: data
            }],
            caption: {
                text: 'Source: <a href="https://travel.trade.gov/view/m-2018-O-001/index.html">U.S. ITA National Travel and Tourism Office</a>'
            }
        });
    }
);

world_continents = Highcharts.getJSON(
    'data/twenty_eighteen.json',
    function (data) {
        console.log(get_vals(data, 0))
        Highcharts.chart('world-continents', {

            chart: {
                polar: true,
                type: 'line'
            },
        
            title: {
                text: 'Monthly U.S. Outbound Tourism, 2018',
            },
            subtitle: {
                text: 'It seems to be fairly uniform, with the summmer months (Jul-Sept) only beating the winter months (Jan-Mar) by ~6.7%'
            },
            caption: {
                text: 'Source: <a href="https://travel.trade.gov/view/m-2018-O-001/index.html">U.S. ITA National Travel and Tourism Office</a>'
            },
        
            xAxis: {
                categories: get_vals(data, 0),
                tickmarkPlacement: 'on',
                labels: {
                    format: '{value}'
                }
            },
            
            pane: {
                size: '90%'
            },
            
            yAxis: {
                lineWidth: 0,
                tickPositions: [3, 6, 9, 12, 15]
            },

            tooltip: {
                pointFormat: '<b>{point.y}%</b>'
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    groupPadding: 0
                }
            },
        
            series: [{
                name: 'Area',
                data: get_vals(data,1)
            }]
        });
    }
);

timeline_d = Highcharts.getJSON(
    'data/null.json',
    function (data) {
        Highcharts.chart('timeline-data', {
            chart: {
                zoomType: 'x',
                type: 'timeline'
            },
            xAxis: {
                type: 'datetime',
                visible: true,
                plotLines: [{
                    color: '#236e96', // Color value
                    dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                    value: Date.UTC(2019, 0, 1), // Value of where the line will appear
                    width: 2 // Width of the line    
                  },
                  {
                    color: '#ff598f', // Color value
                    dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                    value: Date.UTC(2019, 3, 1), // Value of where the line will appear
                    width: 2 // Width of the line    
                  },
                  {
                    color: '#ffd700', // Color value
                    dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                    value: Date.UTC(2019, 6, 1), // Value of where the line will appear
                    width: 2 // Width of the line    
                  },
                  {
                    color: '#f3872f', // Color value
                    dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                    value: Date.UTC(2019, 9, 1), // Value of where the line will appear
                    width: 2 // Width of the line    
                  }]
            },
            yAxis: {
                gridLineWidth: 1,
                title: null,
                labels: {
                    enabled: false
                }
            },
            legend: {
                enabled: false
            },
            title: {
                text: 'Timeline of Space Exploration'
            },
            subtitle: {
                text: 'Info source: <a href="https://en.wikipedia.org/wiki/Timeline_of_space_exploration">www.wikipedia.org</a>'
            },
            tooltip: {
                style: {
                    width: 300
                }
            },
            series: [{
                dataLabels: {
                    allowOverlap: true,
                    format: '<span style="color:{point.color}">● </span><span style="font-weight: bold;" > ' +
                        '{point.x:%d %b %Y}</span><br/>{point.label}'
                },
                marker: {
                    symbol: 'circle'
                },
                data: [{
                    x: Date.UTC(2019, 0, 1),
                    dataLabels: {
                        enabled: false
                    }
                },{
                    x: Date.UTC(2019, 1, 5),
                    name: 'Lunar New Year',
                    label: 'Lunar New Year',
                },{
                    x: Date.UTC(2019, 1, 14),
                    name: 'Valentines Day',
                    label: 'Valentines Day',
                },{
                    x: Date.UTC(2019, 2, 23),
                    name: 'Spring Break (UC)',
                    label: 'Spring Break (UC)',
                },{
                    x: Date.UTC(2019, 3, 21),
                    name: 'Easter',
                    label: 'Easter',
                },{
                    x: Date.UTC(2019, 4, 27),
                    name: 'Memorial Day',
                    label: 'Memorial Day',
                },{
                    x: Date.UTC(2019, 5, 14),
                    name: 'Summer Break (UC)',
                    label: 'Summer Break (UC)',
                },{
                    x: Date.UTC(2019, 6, 4),
                    name: 'Independence Day',
                    label: 'Independence Day',
                },{
                    x: Date.UTC(2019, 8, 2),
                    name: 'Labor Day',
                    label: 'Labor Day',
                },{
                    x: Date.UTC(2019, 9, 31),
                    name: 'Halloween',
                    label: 'Halloween',
                },{
                    x: Date.UTC(2019, 10, 28),
                    name: 'Thanksgiving',
                    label: 'Thanksgiving',
                },
                {
                    x: Date.UTC(2019, 11, 25),
                    name: 'Christmas',
                    label: 'Christmas',
                }
            ]
            }]
        });
    }
);

Reveal.addEventListener( 'somestate', function() {
    window.setTimeout(function(){ 
        systems_chart.reflow(); 
        diffs_chart.reflow();
        quarter_by_quarter_chart.reflow(); 
        world_continents.reflow();
        timeline_d.reflow();
    });
}, false );

timeline_d.reflow();