# Desafio a realizar 

- Una aplicacion web diseñada en ReactJS (sin importar el diseño), que muestre temperatura y hora de una ciudad especifica, refrescando cada 10seg.
- El backend esta desarrollado en NodeJS con el uso de Express para levantar servicio, debe consumir una API (developer.forecast.io) https://darksky.net/dev,tambien con Axio, para obtener la temperaruta y la hora, que se muestra en el front. 
- Al iniciar debe llenarse la BD con las coordenadas de las ciudades y cada vez q se consuma la api, se deben actualizar los datos en la BD, la cual es Redis.
- Tambien hay que implementar websocket.
- Y debe ser subido a AWS o a heroku.

## Pre-requisitos

Tener instalado: 
- Git https://git-scm.com/book/es/v1/Empezando-Instalando-Git y 
- Redis  

## Instalacion y ejecucion

- Clonar repositorio 'git clone https://github.com/R0bert01de/Desafio-Ripley.git'
- Luego posicionarse en el repositorio '$ cd Desafio-Ripley'
- Por ultimo ejecutar en consolas por separado '$ node server.js' y luego '$ npm start'

## Salida esperada

Se espera que el localhost/3000 muestre la pagina actualizando los datos cada 10seg y el localhost/4000 muestre los datos cada 10seg, estos corresponden a un array. 

## Proximos pasos

- Mejorar el frontend
- Implementar websocket
- Optimizar el levantado de la pagina

# Demo en Cloud
- Aun no se ha subido aun 

### A considerar

- La KEY entregada por la API tiene un maximo (1000) de peticiones diarias.
- Esta se obtiene haciendose una cuenta gratuita en la API.
- Y se modifica en el archivo server.js
