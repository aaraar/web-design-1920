import * as d3 from 'd3';
import Chart from 'chart.js';

explanation();

document.getElementById('uitleg').addEventListener("click", e => {
    explanation()
})

function explanation() {
    speechSynthesis.cancel();
    speak('Welkom', 'nl-NL')
        .then(() => speak('Roger', 'fr-FR'))
        .then(() => speak('Op een site speciaal gemaakt voor jou om inzicht te krijgen in de staat van hernieuwbare energie in Nederland van 1965 tot 2018', 'nl-NL'))
        .then(() => speak('Je kunt ten alle tijden mij de mond snoeren door op de Escape toets of Enter Toets te drukken', 'nl-NL'))
        .then(() => speak('Laat mij data uitspreken door er met de muis op te drukken, maar ik hoop dat je het meeste gewoon nog kunt lezen want daar heb ik het speciaal voor ingericht', 'nl-NL'));
}

Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
    draw: function (ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            const activePoint = this.chart.tooltip._active[0],
                ctx = this.chart.ctx,
                x = activePoint.tooltipPosition().x,
                topY = this.chart.legend.bottom,
                bottomY = this.chart.chartArea.bottom;

            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.setLineDash([10, 10]);
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#FFA500';
            ctx.stroke();
            ctx.restore();
        }
    }
});
const voiceIndex = 0

init();


async function speak(text, lang) {
    if (!speechSynthesis) {
        return
    }
    const message = new SpeechSynthesisUtterance(text)
    message.voice = await chooseVoice(lang)
    speechSynthesis.speak(message)
}

function getVoices() {
    return new Promise(resolve => {
        let voices = speechSynthesis.getVoices()
        if (voices.length) {
            resolve(voices)
            return
        }
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices()
            resolve(voices)
        }
    })
}

async function chooseVoice(lang) {
    const voices = (await getVoices()).filter(voice => voice.lang == lang)
    return new Promise(resolve => {
        resolve(voices[voiceIndex])
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
    Chart.defaults.global.defaultFontColor = '#FFF';
    Chart.defaults.global.defaultFontSize = 24;
    const myChart = new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            pointRadius: 10,
            labels: dutchData.map(data => data.Year),
            datasets: [
                {
                    radius: 5,
                    pointRadius: 5,
                    label: 'Waterkracht',
                    data: dutchData.map(data => data["Hydropower (terawatt-hours)"]),
                    backgroundColor: 'rgba(255, 255, 0, 0.3)',
                    borderColor: 'rgba(255, 255, 0, 1)',
                    borderWidth: 0
                },
                {
                    radius: 5,
                    pointRadius: 5,
                    label: 'Zonne energie',
                    data: dutchData.map(data => data["Solar (terawatt-hours)"]),
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    borderColor: 'rgba(0, 0, 255, 1)',
                    borderWidth: 0
                },
                {
                    radius: 5,
                    pointRadius: 5,
                    label: 'Wind',
                    data: dutchData.map(data => data["Wind (terawatt-hours)"]),
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 0
                },
                {
                    radius: 5,
                    pointRadius: 5,
                    label: 'Overige Hernieuwbare Bronnen',
                    data: dutchData.map(data => data["Other renewables (terawatt-hours)"]),
                    backgroundColor: 'rgba(0, 255, 0, 0.3)',
                    borderColor: 'rgba(0, 255, 0, 1)',
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
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Hernieuwbare Energie in Nederland van 1965 to 2018'
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
            hover: {
                mode: 'x',
                intersect: false
            },
            tooltips: {
                mode: 'x',
                intersect: false,
                callbacks: {
                    label: function (tooltipItem, data) {
                        let label = data.datasets[tooltipItem.datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += tooltipItem.yLabel.toFixed(3) + ' Twh'
                        return label;
                    },
                }
            },
            onClick: function (e) {
                const elements = this.getElementsAtEvent(e);
                if (elements.length > 0) {
                    speak(`In ${this.data.labels[elements[0]._index]} was de verhouding als volgt`, 'nl-NL')
                    elements.forEach(element => {
                        let label = this.data.datasets[element._datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        let value = parseFloat(this.data.datasets[element._datasetIndex].data[element._index]).toFixed(3).replace('.', ' komma ');
                        label += value + ' terrawat / uur'
                        speak(label, 'nl-NL');
                    })
                } else {
                    speak('Je klikte net naast een punt, probeer op een punt te klikken, als de punten niet goed te vinden zijn kun je het best op de basis van de X-as klikken', 'nl-NL')
                }
                speechSynthesis.cancel();
            }
        }
    })
    return myChart;
}

window.addEventListener('keyup', e => {
    if (e.key === 'Escape' || e.key === 'Enter') {
        speechSynthesis.cancel();
    }
})

document.querySelector('h1').addEventListener('click', e => {
    speechSynthesis.cancel();
    speak(e.target.innerText, 'nl-NL');
})
document.querySelector('h2').addEventListener('click', e => {
    speechSynthesis.cancel();
    speak(e.target.innerText, 'nl-NL');
})
document.querySelector('h3').addEventListener('click', e => {
    speechSynthesis.cancel();
    speak(e.target.innerText, 'nl-NL');
})
document.querySelector('h4').addEventListener('click', e => {
    speechSynthesis.cancel();
    speak(e.target.innerText, 'nl-NL');
})