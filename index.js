//TODO: Validate values between 0-255;
//TODO: Settings object to have a more flexible config

const express = require('express')
const { Yeelight } = require('yeelight-node')
const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('localhost.key','utf8');
const certificate = fs.readFileSync('localhost.crt','utf8');
const credentials = { key: privateKey,cert: certificate };
const app = express()
const port = 3000
const cors = require('cors')
app.use(cors());

var httpsServer = https.createServer(credentials,app);
var httpsServer = https.createServer(credentials,app);
const yeelight = new Yeelight({ ip: '192.168.1.98',port: 55443 })

yeelight.set_power('on','smooth',0,2);
yeelight.set_ct_abx(4780);
yeelight.set_bright(100);


app.post('/color/:rgb',(req,res) => {
    if(req.params.rgb && req.params.rgb.length === 9) {
        let match = req.params.rgb.match(/(?<r>\d{3})(?<g>\d{3})(?<b>\d{3})/);
        yeelight.set_rgb([parseInt(match.groups.r),parseInt(match.groups.g),parseInt(match.groups.b)],"smooth",200);
        res.send([parseInt(match.groups.r),parseInt(match.groups.g),parseInt(match.groups.b)]);
        
        
    }
})
//TODO: Validate Params
app.post('/ct/:ct',(req,res) => { //47100
    if(req.params.ct) {
        yeelight.set_bright(100);
        yeelight.set_ct_abx([parseInt(req.params.ct)], "smooth",200);
        res.send("ok");
        yeelight.closeConnection();

    }
})

app.get('/color',(req,res) => {
    yeelight.get_prop("rgb").then(
        data => {
            let response = JSON.parse(data);
            let number = parseInt(response.result[0]).toString(16);
            res.send(number);
        }
    )
})

app.get('/ct',(req,res) => {
    yeelight.get_prop("ct").then(
        data => {
            let response = JSON.parse(data);
            res.send(data);
        }
    )
})

httpsServer.listen(port,() => {
    console.log(`Yeelighy listening at https://localhost:${port}`)
})