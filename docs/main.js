
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
    'use strict';

    init();

    function init () {
        const audio = new Audio('./readSimpleGraph.wav');
        const canvas = document.querySelector('canvas');
        draw(canvas);
        addGraphExplanation(canvas, audio);
        window.addEventListener('resize', () => {
            draw(canvas);
        });
    }

    function addGraphExplanation (canvas, audio) {
        canvas.addEventListener('click', () => {
            readGraph(audio);
        });
        canvas.addEventListener('touchstart', ()=> {
            readGraph(audio);
        });
    }

    function draw(canvas) {
        var ctx = (canvas.getContext('2d'));
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height);
        ctx.lineTo(ctx.canvas.width, 0);
        ctx.lineWidth = 30;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
        for (let i = 0; i < 10; i++) {
            const yIncrement = ctx.canvas.height / 10 * i;
            const xIncrement = ctx.canvas.width / 10 * i;
            if (i > 0) {
                ctx.beginPath ();
                ctx.moveTo ( 0, yIncrement );
                ctx.lineTo ( 40, yIncrement );
                ctx.lineWidth = 30;
                ctx.strokeStyle = "white";
                ctx.stroke ();
                ctx.closePath ();
                ctx.beginPath ();
                ctx.moveTo ( xIncrement, ctx.canvas.height );
                ctx.lineTo ( xIncrement, ctx.canvas.height - 40 );
                ctx.lineWidth = 30;
                ctx.strokeStyle = "white";
                ctx.stroke ();
                ctx.closePath ();
            }
        }
    }

    function readGraph (audio) {
        audio.currentTime = 0;
        audio.play();
    }

    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments);};
        h._hjSettings={hjid:1768995,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

}());
