const url = require('node:url');
const enrutador = require('./enrutador');
const StringDecoder = require('string_decoder').StringDecoder;

module.exports = (req, res) => {
    // obtener url desde el objeto request
    const urlActual = req.url;
    // obtener la ruta
    const urlParseada = url.parse(urlActual, true);
    const ruta = urlParseada.pathname;
    // limpiar la ruta de los slash "/"
    const rutaLimpia = ruta.replace(/^\/+|\/+$/g, "");
    // obtener el metodo http
    const metodo = req.method.toLowerCase();

    //obtener el metodo para personas externas
    res.setHeader('Access-Control-Allow-Origin', "*");//aquí es para poder ver el origen de la consulta
    res.setHeader('Access-Control-Request-Methods', "OPTIONS,GET,PUT,DELETE,POST");//en esta parte sirve para destacar cada unas de las opciones que pueden interactuar con el server 
    res.setHeader('Access-Control-Allow-Headers', "*");
    res.setHeader('Access-Control-Allow-Methods', "OPTIONS,GET,PUT,DELETE,POST");//indica que tipo de headers se puede poner dentro de las opciones.
    if (metodo === 'options') {
        res.writeHead(200);
        res.end();
        return;
    }

    // obtener las variables del query
    const { query = {} } = urlParseada;
    console.log({ query });
    // obtener headers.
    const { headers = {} } = req;
    console.log({ headers });
    // obtener payload, en el caso de haber alguno.
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    // ir acumulando la data cuendo el request reciba un payload
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    // terminar de acumular datos y decirle al decoder que finalece.
    req.on('end', () => {
        buffer += decoder.end();
        if (headers["content-type"] === 'application/json') {
            buffer = JSON.parse(buffer);
        }

        // revisar si tiene subrutas en este caso es el indice del array
        if (rutaLimpia.indexOf("/") > -1) {
            var [rutaPrincipal, indice] = rutaLimpia.split('/');

        }

        // ordenar la data
        const data = {
            indice,
            ruta: rutaPrincipal || rutaLimpia,
            query,
            metodo,
            headers,
            payload: buffer
        };


        console.log({ data });

        // elegir el manejador de la respuesta.//handler.
        let handler;
        if (data.ruta &&
            enrutador[data.ruta] &&
            enrutador[data.ruta][metodo]) {
            handler = enrutador[data.ruta][metodo];
        } else {
            handler = enrutador.noEncontrado;
        }

        // ejecutar handler para enviar la respuesta.
        if (typeof handler === 'function') {
            handler(data, (statusCode = 200, mensaje) => {
                const respuesta = JSON.stringify(mensaje);
                res.setHeader('content-type', "application/json");
                res.writeHead(statusCode);

                //linea donde realmente ya estamos dando la respuesta a la aplicación cliente.
                res.end(respuesta);
            });
        }
    });
    /*if(rutaLimpia === 'ruta'){
        res.end('estas en la ruta: /ruta');
    }else{
        res.end('estas en una ruta que no conzco');
    }
    */
};