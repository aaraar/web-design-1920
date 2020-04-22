import * as d3 from 'd3';
import Chart from 'chart.js';

init();
tts("hallo wereld");

function tts(text) {
    fetch(`http://localhost:3000/tts`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "audio/wav"
            },
            body: JSON.stringify({
                text: text
            })
        }) //voice=nl-NL_LiamVoice
        .then(res => {
            if (res.ok) {
                console.log(res);
                const audio = new Audio(res.data);
                audio.currentTime = 0;
                audio.play();
            }
        })
}

function init() {
    d3.csv('./renewable-energy-consumption.csv')
        .then(makeGraph)
}

function makeGraph(data) {
    const ctx = document.getElementById('hernieuwbareEnergie').getContext('2d');
    createGraph(ctx, data)
}

function readGraph(audio) {
    audio.currentTime = 0;
    audio.play();
}

function createGraph(ctx, data) {
    const dutchData = data.filter(entry => entry.Entity === 'Netherlands');
    console.log(dutchData.map(data => data.Year));
    Chart.defaults.global.defaultFontColor = '#FFF';
    Chart.defaults.global.defaultFontSize = 24;
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: dutchData.map(data => data.Year),
            datasets: [
                {
                    label: 'Waterkracht',
                    data: dutchData.map(data => data["Hydropower (terawatt-hours)"]),
                    backgroundColor: 'rgba(255, 255, 0, 0.5)',
                    borderColor: 'rgba(255, 255, 0, 1)',
                    borderWidth: 0
                },
                {
                    label: 'Overige Hernieuwbare Bronnen',
                    data: dutchData.map(data => data["Other renewables (terawatt-hours)"]),
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    borderColor: 'rgba(0, 255, 0, 1)',
                    borderWidth: 0
                },
                {
                    label: 'Zonne energie',
                    data: dutchData.map(data => data["Solar (terawatt-hours)"]),
                    backgroundColor: 'rgba(0, 0, 255, 0.5)',
                    borderColor: 'rgba(0, 0, 255, 1)',
                    borderWidth: 0
                },
                {
                    label: 'Traditionele biobrandstoffen',
                    data: dutchData.map(data => data["Traditional biofuels (terrawatt-hours)"]),
                    backgroundColor: 'rgba(0, 255, 255, 0.5)',
                    borderColor: 'rgba(0, 255, 255, 1)',
                    borderWidth: 0
                },
                {
                    label: 'Wind',
                    data: dutchData.map(data => data["Wind (terawatt-hours)"]),
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 0
                },
            ]
        },
        datasets: [
            {fill: 'origin'},   // 0: fill to 'origin'
            {fill: '-1'},       // 1: fill to dataset 0
            {fill: 1},          // 2: fill to dataset 1
            {fill: false},      // 3: no fill
            {fill: '-2'}        // 4: fill to dataset 2
        ],
        options: {responsive: true,
            title: {
                display: true,
                text: 'Hernieuwbare Energie in Nederland van 1965 to 2018'
            },
            hover: {
                mode: 'nearest',
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 1)'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 1)'
                    }
                }]
            },
            plugins: {
                filler: {
                    propagate: true
                }
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                    label: function (tooltipItem, data) {
                        let label = data.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) {
                            label += ': ';
                        }
                        label += tooltipItem.yLabel + 'Twh'
                        return label;
                    }
                }
            }
        }
    })
}