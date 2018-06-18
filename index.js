var http = require('http');
var formidable = require('formidable');
var subida_archivos = require('./modulos/subida_archivos');
var fs = require('fs')
var xmlReader = require('read-xml')
var filepath;
var DOMParser = require('xmldom').DOMParser;
var parseString = require('xml2js').parseString;

var extractedData ="";

http.createServer(function(peticion, respuesta){
   if(peticion.method == 'POST'){
      //Creamos una instancia de IncomingForm.
      var incoming = new formidable.IncomingForm();
      //Carpeta donde se guardarán los archivos.
      incoming.uploadDir = 'archivos_subidos';
      //Parseamos la petición.
      incoming.parse(peticion);
      //Se dispara en caso de que haya algún error.
      incoming.on('error', function(err) {
         respuesta.writeHead(200, {'Content-Type': 'text/html'});
         respuesta.end(subida_archivos.responderSubida(false));
      });
      //Se dispara cuando el archivo llegó al servidor.
      incoming.on('file', function(field, file){
         console.log('Archivo recibido');

      });
      //Se dispara antes de guardar el archivo.
      incoming.on('fileBegin', function(field, file){
         if(file.name){
            //Modificamos el nombre del archivo por código al azar más "_nombre original del archivo"
            file.path += '_' + file.name;
            filepath = file.path;

         }
      });
      //Se dispara una vez que los archivos fueron guardados.

incoming.on('end', function(){
         
   respuesta.writeHead(200, {'Content-Type': 'text/xml'});

   try{         
      xmlReader.readXML(__dirname + '/'+filepath, function(err, data) {
         try{
            //respuesta.end(data.content);
            fs.readFile(__dirname + '/'+filepath, function read(err, data) {
               try{
                  parseString(data, function(err,result){
                     try{
                        var a = 0;
                        for (i in result.company.staff){
                           var b = result.company.staff[i].salary[0];
                           b = b.replace(",","");
                           console.log(b);
                           b = parseFloat(b);
                           console.log(b);
                           console.log(a);
                           a = a + b;
                        }
                        console.log(a);

                     } 
                     catch (err){
                        console.log("No se encuentra el atributo");
                        respuesta.end(subida_archivos.responderSubida(false));

                     }

               
                  });
                  //throw "disparo un error 3!";
               }
               catch(err){
                  console.log("Error en el parseo");
                  respuesta.end(subida_archivos.responderSubida(false));
               }
               
            });
            //throw "disparo un error 2!";
         }
         catch(err){
            console.log("Error en la lectura");
            respuesta.end(subida_archivos.responderSubida(false));
         }
         
      });
     // throw "disparo un error 1!";
   }
   catch(err){
      console.log("No es un archivo XML");
      respuesta.end(subida_archivos.responderSubida(false));
   }
});





   }else{
      respuesta.writeHead(200, {'Content-Type': 'text/html'});
      respuesta.end(subida_archivos.dibujarFormulario());
   }
}).listen(3000, '127.0.0.1');
console.log('Servidor funcionando.');