
function calculateCompPct(game) {
    return (game["Att"] == 0) ? 0 : (100 * (parseFloat(game["Cmp"]) / parseFloat(game["Att"])))
}

(function () {
    'use strict'

    let lineCanvas = document.getElementById("comp-chart");
    let lineChartConfig = {
        type: "line",
        data: {
            labels: games.map(gm => gm.week),
            datasets: [
                {
                    data: games.map(gm => calculateCompPct(gm)),
                    borderColor: teamColor,
                    backgroundColor: teamColor,
                    pointStyle: games.map(gm => {
                        var logo = new Image()
                        logo.src = gm.opponentImage;
                        logo.width = 27.5
                        logo.height = 27.5
                        return logo
                    })
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: (tooltip, data) => {
                            let context = tooltip[0]
                            let gm = games[context.dataIndex]
                            return [
                                `Week ${tooltip[0].label} vs ${gm.opponent}`
                            ]
                        },
                        label: context => {
                            return `Comp Pct: ${Math.round(context.raw)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: "Comp Pct %"
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return `${value}%`
                        }
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "Week"
                    }
                }
            }
        }
    };

    let barCanvas = document.getElementById("comp-bars");
    let barChartConfig = {
        type: "bar",
        data: {
            labels: games.map(gm => gm.week),
            datasets: [
                {
                    data: games.map(gm => calculateCompPct(gm)),
                    borderColor: teamColor,
                    backgroundColor: teamColor,
                    pointStyle: games.map(gm => {
                        var logo = new Image()
                        logo.src = gm.opponentImage;
                        logo.width = 25
                        logo.height = 25
                        return logo
                    })
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: (tooltip, data) => {
                            let context = tooltip[0]
                            let gm = games[context.dataIndex]
                            return [
                                `Week ${tooltip[0].label} vs ${gm.opponent}`
                            ]
                        },
                        label: context => {
                            return `Comp Pct: ${Math.round(context.raw)}%`;
                        }
                    }
                },
                
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: "Comp Pct %"
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return `${value}%`
                        }
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "Week"
                    },
                    
                }
            }
        }
    };
    
    let lineChart = new Chart(lineCanvas, lineChartConfig);
    let bar = new Chart(barCanvas, barChartConfig);
})()