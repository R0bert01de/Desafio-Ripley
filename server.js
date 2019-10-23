const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const axios = require('axios');
const getenv = require('getenv');

const PORT = 4000;

const app = express();
const todoRoutes = express.Router();
const client = redis.createClient(`http://${process.env.REDIS_URL}:6379`);

app.use(cors());
app.use(bodyParser.json());

client.on('connect', function() {
    console.log('[REDIS] servidor conectado');
});

const redisHGetAll = (client, key) => new Promise((resolve, reject) => {
    client.hgetall(key, function(err, value) {
        if (err) {
            return reject(err);
        }
        return resolve(value);
    })
})

const ApiClima = () => new Promise(async (resolve, reject) => {
    const resultado = [];

    /* INGRESAR COORDENADAS DE LAS CIUDADES A LA BD */
    /* Coordenadas */
    let ciudades = [{
        id: 'Santiago',
        Latitud: -33.459999,
        Longitud: -70.639999,
        Temperatura: `0`,
        Hora: `0`,
        Gmt: 0
    }, {
        id: 'Zurich',
        Latitud: 47.458057,
        Longitud: 8.547778,
        Temperatura: `0`,
        Hora: `0`,
        Gmt: 2
    }, {
        id: 'Auckland',
        Latitud: -36.849998,
        Longitud: 174.770004,
        Temperatura: `0`,
        Hora: `0`,
        Gmt: 13
    }, {
        id: 'Sydney',
        Latitud: -33.869999,
        Longitud: 151.210007,
        Temperatura: `0`,
        Hora: `0`,
        Gmt: 11
    }, {
        id: 'Londres',
        Latitud: 10.630000,
        Longitud: -63.310001,
        Temperatura: `0`,
        Hora: `0`,
        Gmt: 1
    }, {
        id: 'Georgia',
        Latitud: -33.749001,
        Longitud: -84.387978,
        Temperatura: `0`,
        Hora: `0`,
        Gmt: -4
    }];
    for (const ciudad of ciudades) {
        await client.hset(`${ciudad.id}`, "Lat", `${ciudad.Latitud}`, "Lon", `${ciudad.Longitud}`, "Temp", "0", "Hora", "0");
    }
    for (let ciudad of ciudades) {
        try {
            const value = await redisHGetAll(client, `${ciudad.id}`);

            const lat = value.Lat;
            const lon = value.Lon;
            const url = `https://api.darksky.net/forecast/081c5fbf75a1097dab2cca9a11e271dc/${lat},${lon}`;
        
            const apiclima = axios.create({
                baseURL: url,
            });
            
            const restApiClima = await apiclima.get();
            const temp = Math.trunc(((restApiClima.data.currently.temperature - 32) * (5 / 9)));
            const date = new Date((restApiClima.data.currently.time * 1000)+(1000*60*60*ciudad.Gmt));
            const tiempo = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            /* GUARDAR EN BD */
            await client.hset(`${ciudad.id}`, "Lat", `${ciudad.Latitud}`, "Lon", `${ciudad.Longitud}`, "Temp", `${temp}`, "Hora", `${tiempo}`);
            const redisValues = await redisHGetAll(client, `${ciudad.id}`);

            ciudad.Temperatura = redisValues.Temp;
            ciudad.Hora = redisValues.Hora;

            // Guardando resultados
            resultado.push(ciudad);
        } catch (err) {
            console.error('[Error] Ocurrio un error al obtener todos los valores: ', err);
            return reject(err);
        }
    }
    // Enviando resultados
    return resolve(resultado);
});

todoRoutes.route('/').get(async (req, res)=> {
    try {
        if (Math.random(0, 1) < 0.1) {
            client.hset("api.errors",`${Date.now()}`,"Fallo en la peticion" );
            return res.send({'status':'failed', 'error':'Falla en la peticion'});
        }
        console.log("recibiendo desde React y ejecutando en node");
        const getData = await ApiClima();
        console.log('Retornando datos: ', getData)
        res.send(getData)
    } catch (err) {
        client.hset("api.errors",`${Date.now()}`,`${err}`)
        res.send({'status':'failed', 'error':'problem'})
    }
});

app.use('/', todoRoutes);
app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto: ', PORT);
});