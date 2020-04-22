const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3000
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const {IamAuthenticator} = require('ibm-watson/auth')
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.post('/tts', (req, res) => {
    const textToSpeech = new TextToSpeechV1({
        authenticator: new IamAuthenticator({
            apikey: process.env.API_KEY,
        }),
        url: process.env.TTS_URL,
        disableSslVerification: true,
    });

    const synthesizeParams = {
        text: req.body.text,
        accept: 'audio/wav',
        voice: 'nl-NL_LiamVoice',
    };

    textToSpeech.synthesize(synthesizeParams)
        .then(audio => {
            res.setHeader('Content-Type', 'audio/wav')
            audio.pipe(req)
        })
        .catch(err => {
            console.log('error:', err);
        })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))