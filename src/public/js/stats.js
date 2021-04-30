
function calculateCompPct(game) {
    return (game["Att"] == 0) ? 0 : (100 * (parseFloat(game["Cmp"]) / parseFloat(game["Att"])))
}

function calculateYdsPerAttempt(game, adjustForSacks) {
    return (game["Att"] == 0) ? 0 : (parseFloat(game["PsYds"]) / parseFloat(game["Att"]))
}

function composeStatLine(gm) {
    return `${gm.Cmp}/${gm.Att}, ${gm.PsYds} yd${ (Math.abs(parseFloat(gm.PsYds)) == 1) ? "" : "s" }, ${gm.PsTD} TD, ${gm.Int} INT`;
}

var selectedGame = "";

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
                    pointHitRadius: 10,
                    pointHoverRadius: 10,
                    pointRadius: 10,
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
                                `Week ${tooltip[0].label} vs ${gm.opponent}`,
                                composeStatLine(gm)
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

    let attChart = document.getElementById("yds-per-att-chart");
    let attChartConfig = {
        type: "line",
        data: {
            labels: games.map(gm => gm.week),
            datasets: [
                {
                    data: games.map(gm => calculateYdsPerAttempt(gm)),
                    borderColor: teamColor,
                    backgroundColor: teamColor,
                    pointHitRadius: 10,
                    pointHoverRadius: 10,
                    pointRadius: 10,
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
                                `Week ${tooltip[0].label} vs ${gm.opponent}`,
                                composeStatLine(gm)
                            ]
                        },
                        label: context => {
                            return `Yds/Att: ${Math.round(context.raw * 100) / 100}`;
                        }
                    }
                },
                
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: "Yards per Attempt"
                    }
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
    let ypaChart = new Chart(attChart, attChartConfig);
})()