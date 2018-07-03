var http = require('http');
var formidable = require('formidable');
var subida_archivos = require('./modulos/subida_archivos');
var fs = require('fs')
var xmlReader = require('read-xml')
var filepath;
var DOMParser = require('xmldom').DOMParser;
var parseString = require('xml2js').parseString;
var _ = require('lodash');

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
         
   respuesta.writeHead(200, {'Content-Type': 'text/html'});

   try{         
      xmlReader.readXML(__dirname + '/'+filepath, function(err, data) {
         try{
            //respuesta.end(data.content);
            fs.readFile(__dirname + '/'+filepath, function read(err, data) {
               try{
                  parseString(data, function(err,result){
                     try{

                        //console.log(result.Project.Tasks[0].Task[5].PredecessorLink[0].Type[0]);
                        //console.log(result.Project.Tasks[0].Task[5].PredecessorLink[1].Type[0]);
                     	//console.log(1);

               

                     	// CÁLCULO DE LA DESVIACIÓN ESTÁNDAR
                     	function standardDeviation(values){
  							var avg = average(values);
  
  							var squareDiffs = values.map(function(value){
    							var diff = value - avg;
   								var sqrDiff = diff * diff;
    							return sqrDiff;
  							});
  
  							var avgSquareDiff = average(squareDiffs);

  							var stdDev = Math.sqrt(avgSquareDiff);
  							return stdDev;
						}



						// CÁLCULO DE LA MEDIA
                        function average(data){
  							var sum = data.reduce(function(sum, value){
    							return sum + value;
  							}, 0);

  							var avg = sum / data.length;
  							return avg;
						}



						// OBTENCIÓN DEL MÁXIMO DE UN ARRAY
						function getMaxOfArray(numArray){
							return Math.max.apply(null, numArray);
						}



						// OBTENCIÓN DEL MÍNIMO DE UN ARRAY
						function getMinOfArray(numArray){
							return Math.min.apply(null, numArray);
						}


						// OBTENER LA DIFERENCIA ENTRE DOS FECHAS, TENIENDO EL RESULTADO EN DÍAS
						function date_diff_indays(date1,date2){
							dt1 = new Date(date1);
							dt2 = new Date(date2);
							return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
						}

 /////////////////////////////////////////////////////////////////////////////////////////////////////////

                       /*########  FUNCIONES RELACIONADAS CON LAS TAREAS     ########*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////



						console.log("SECCIÓN DE TAREAS");

						// CÁLCULO NÚMERO TOTAL DE TAREAS RESUMEN DE  PRIMER NIVEL
						function NumTareasResumenPrimerNivel(){
							var a = 0;
                        	for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		if((level == 1) && (summary == 1) && (milestone == 0)){
                                 		a = a+1;
                              		}
                           		}
                         	}
                         	return (a);
						}
						console.log("Número total de tareas de primer nivel:", NumTareasResumenPrimerNivel());



						// CÁLCULO NÚMERO TOTAL DE TAREAS DE SEGUNDO NIVEL
						function NumTareasSegundoNivel(){
							var a = 0;
                        	for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone') &&  _.has(b,'WBS')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		var wbs = parseFloat(b.WBS[0]);
                              		wbs = Math.trunc(wbs);
                              		if((level == 2) && (summary == 0) && (milestone == 0)){
                                 		a = a+1;
                              		}
                           		}
                         	}
                         	return (a);
						}
						console.log("Número total de tareas de segundo nivel:", NumTareasSegundoNivel());


						// OBTENCIÓN DE UN ARRAY CON EL NÚMERO DE TAREAS DE SEGUNDO NIVEL POR TAREA RESUMEN
						function ArrayTareasSegundoNivelPorResumen(){

							var wbs_array = [];
                        	for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone') &&  _.has(b,'WBS')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		var wbs = parseFloat(b.WBS[0]);
                              			if((level == 1) && (summary == 1) && (milestone == 0)){
                                 			wbs_array.push(wbs);
                              			}
                           		}
                         	}	

							var wbs_2level_array = [];
                        	for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone') &&  _.has(b,'WBS')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		var wbs = parseFloat(b.WBS[0]);
                              		wbs = Math.trunc(wbs);
                              			if((level == 2) && (summary == 0) && (milestone == 0)){
                                 			wbs_2level_array.push(wbs);
                              			}		
                           		}
                         	}

                         	var diff_num_wbs = [];
                        	var a = 0;
                         	for (i=0; i<wbs_array.length;i++){
                           		for (j=0; j<wbs_2level_array.length;j++){
                              		if (wbs_array[i] == wbs_2level_array[j]){
                                 		a = a + 1;
                              		}
                           		}
                           		diff_num_wbs.push(a);
                           		a = 0;
                         	}
                         	return (diff_num_wbs);
						}
						console.log("Número de Tareas por bloque:", ArrayTareasSegundoNivelPorResumen());


						// CÁLCULO DE MEDIA DE TAREAS POR BLOQUE
						function mediaTareasSegundoNivel(){
							arrayTareasSegundo = ArrayTareasSegundoNivelPorResumen();
							mediaTareasSegundo = average(arrayTareasSegundo);
							return (mediaTareasSegundo);
						}
						console.log("Media de tareas por bloque (Resumen):", mediaTareasSegundoNivel());



						// CÁLCULO DE DESVIACIÓN ESTÁNDAR DE TAREAS POR BLOQUE
						function stdTareasSegundoNivel(){
							arrayTareasSegundo = ArrayTareasSegundoNivelPorResumen();
							stdTareasSegundo = standardDeviation(arrayTareasSegundo);
							return (stdTareasSegundo);

						}
						console.log("Desviación estándar de tareas por bloque (Resumen):", stdTareasSegundoNivel());




						// CALCULAR NÚMERO DE VINCULOS
						function ArrayVinculos(){
							var FF = 0;
							var FS = 0;
							var SF = 0;
							var SS = 0;
							var arrayVinc = [];
							for (i in result.Project.Tasks[0].Task){
								var b = result.Project.Tasks[0].Task[i];

						    	if(_.has(b,'PredecessorLink')){
						    		for (j in b.PredecessorLink){
						    			var c = b.PredecessorLink[j];
						    			var vinculo = parseFloat(c.Type[0]);
						    			if (vinculo == 0){
						    				FF = FF+1;
						    			}
						    			else if (vinculo == 1){
						    				FS = FS+1;
						    			}
						    			else if (vinculo == 2){
						    				SF = SF+1;
						    			}
						    			else if (vinculo == 3){
						    				SS = SS+1;
						    			}
						    		}
						  		}
							}
							//arrayVinc.push("FF FS SF SS: ");
							arrayVinc.push("FF: "+FF);
							arrayVinc.push("FS: "+FS);
							arrayVinc.push("SF: "+SF);
							arrayVinc.push("SS: "+SS);
							return (arrayVinc);

						}
						console.log("Número de tipos de vínculos:", ArrayVinculos());



						// OBTENER TAREAS SIN VINCULACIÓN ALGUNA
						function TareasSinVinculacion(){
							var UIDArray = [];
                        	for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone') &&  _.has(b,'WBS')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		if((level == 2) && (summary == 0) && (milestone == 0)){
                              			var numUID = parseFloat(b.UID[0]);
                                 		UIDArray.push(numUID);
                              		}
                           		}
                        	}

                        	for (i in result.Project.Tasks[0].Task){
                        		var b = result.Project.Tasks[0].Task[i];
                        		if (_.has(b,'PredecessorLink') && _.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone') &&  _.has(b,'WBS')){
                        			var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		if((level == 2) && (summary == 0) && (milestone == 0)){
                        				var posNumUID = parseFloat(b.UID[0]);
                        				var index_1 = UIDArray.indexOf(posNumUID);
                        				if (index_1 !== -1){
                        				UIDArray.splice(index_1,1);
                        				}
                        			
                        				for (j in b.PredecessorLink){
                        					var c = b.PredecessorLink[j];
                        					var numPred = parseFloat(c.PredecessorUID[0]);
                        					var index_2 = UIDArray.indexOf(numPred);
                        					if (index_2 !== -1){
                        						UIDArray.splice(index_2,1);	
                        					}				
                              			}
									}
								}
							}

							var arrayTareas = [];
							for (i = 0; i<UIDArray.length;i++){
								for (j in result.Project.Tasks[0].Task){
                           			var b = result.Project.Tasks[0].Task[j];
                           			var UIDFinal = parseFloat(b.UID[0]);
                           			if (UIDFinal === UIDArray[i]){
                           				arrayTareas.push(b.Name[0]+" "+b.WBS[0]);
                           			}
                           		}
							}

							return (arrayTareas);
						}
						console.log("Tareas sin vinculación:", TareasSinVinculacion());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


								/*############## FUNCIONES RELACIONADAS CON LOS HITOS ##########*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


						console.log("SECCIÓN HITOS");

						// CÁLCULO DEL NÚMERO TOTAL DE HITOS EN EL PROYECTO
						function NumHitos(){
							var a = 0;
                        	for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		if((level == 1) && (summary == 0) && (milestone == 1)){
                                 		a = a+1;
                              		}
                           		}
                         	}
                         	return (a);
						}
						console.log("Número de Hitos:", NumHitos());



						//DIFERENCIA DE TIEMPO ENTRE HITOS EN DÍAS

						function DiffTiempoHitos(){
							date1 = 0;
							date2 = 0;
							var arrayDiffFechaHitos = [];
							for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		if((level == 1) && (summary == 0) && (milestone == 1)){
                                 		if (date1 === 0){
                                 			date1 = b.Start[0];
                                 		}
                                 		else{
                                 			date2 = b.Start[0];
                                 			var diffDate = date_diff_indays(date1,date2);
                                 			arrayDiffFechaHitos.push(diffDate);
                                 			date1 = date2;
                                 		}
                              		}
                           		}
                         	}
                         	return (arrayDiffFechaHitos);
						}
						console.log("Diferencia de tiempo en días entre Hitos consecutivos:", DiffTiempoHitos());

						

						// CÁLCULO DE LA MEDIA DE TIEMPO ENTRE HITOS

						function mediaTiempoHitos(){
							date1 = 0;
							date2 = 0;
							var arrayDiffFechaHitos = [];
							for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		if((level == 1) && (summary == 0) && (milestone == 1)){
                                 		if (date1 === 0){
                                 			date1 = b.Start[0];
                                 		}
                                 		else{
                                 			date2 = b.Start[0];
                                 			var diffDate = date_diff_indays(date1,date2);
                                 			arrayDiffFechaHitos.push(diffDate);
                                 			date1 = date2;
                                 		}
                              		}
                           		}
                         	}
                         	mediaTiempo = average(arrayDiffFechaHitos);
                         	return (mediaTiempo);
						}
						console.log("Media de tiempo en días entre Hitos consecutivos:", mediaTiempoHitos());



						// CÁLCULO DE LA DESVIACIÓN ESTÁNDAR

						function stdTiempoHitos(){
							date1 = 0;
							date2 = 0;
							var arrayDiffFechaHitos = [];
							for (i in result.Project.Tasks[0].Task){
                           		var b = result.Project.Tasks[0].Task[i];
                           		if (_.has(b,'OutlineLevel') && _.has(b,'Summary') && _.has(b,'Milestone')){
                              		var level = parseFloat(b.OutlineLevel[0]);
                              		var summary = parseFloat(b.Summary[0]);
                              		var milestone = parseFloat(b.Milestone[0]);
                              		if((level == 1) && (summary == 0) && (milestone == 1)){
                                 		if (date1 === 0){
                                 			date1 = b.Start[0];
                                 		}
                                 		else{
                                 			date2 = b.Start[0];
                                 			var diffDate = date_diff_indays(date1,date2);
                                 			arrayDiffFechaHitos.push(diffDate);
                                 			date1 = date2;
                                 		}
                              		}
                           		}
                         	}
                         	stdTiempo = standardDeviation(arrayDiffFechaHitos);
                         	return (stdTiempo);

						}
						console.log("Desviación estándar de tiempo en días entre Hitos consecutivos:", stdTiempoHitos());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


								/*############## FUNCIONES RELACIONADAS CON LOS RECURSOS ##########*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


						console.log("SECCIÓN RECURSOS");


						// CÁLCULO DEL NÚMERO TOTAL DE RECURSOS
						function NumRecursos(){
							var a = 0;
                        	for (i in result.Project.Resources[0].Resource){
                           		var b = result.Project.Resources[0].Resource[i];
                           		if (_.has(b,'Name')){
                              		a=a+1;
                           		}
                         	}
                         	return (a);
						}
						console.log("Número de Recursos:", NumRecursos());


						// ARRAY CON EL TIPO DE RECURSOS
						function ArrayTipoRecursos(){
							var material = 0;
							var trabajo = 0;
							var coste = 0;
							var arrayTipoRecursos = [];
							for (i in result.Project.Resources[0].Resource){
								var b = result.Project.Resources[0].Resource[i];

						    	if(_.has(b,'Name')){

						    		if (b.Type[0] == 0){
						    			material = material + 1;
						    		} 
						    		else if (b.Type[0] == 1){
						    			trabajo = trabajo + 1;
						    		}
						    		else if (b.Type[0] == 2){
						    			coste  = coste + 1;
						    		}
						  		}
							}
							//arrayVinc.push("FF FS SF SS: ");
							arrayTipoRecursos.push("Material: "+material);
							arrayTipoRecursos.push("Trabajo: "+trabajo);
							arrayTipoRecursos.push("Coste: "+coste);
							return (arrayTipoRecursos);

						}
						console.log("Número de tipos de Recursos:", ArrayTipoRecursos());




						// NÚMERO DE RECURSOS SOBREASIGNADOS
						function ArraySobreasignados(){
							//var a = 0;
							var arraySobreasignados = [];
							for (i in result.Project.Resources[0].Resource){
								var b = result.Project.Resources[0].Resource[i];

						    	if(_.has(b,'Name') && _.has(b, 'OverAllocated')){

						    		if (b.OverAllocated[0] == 1){
						    			//a = a + 1;
						    			arraySobreasignados.push(b.Name[0]);
						    		} 
						  		}
							}
							//arrayVinc.push("FF FS SF SS: ");
							return (arraySobreasignados);

						}
						console.log("Recursos Sobreasignados:", ArraySobreasignados());





						//var resultado = date_diff_indays(result.Project.Tasks[0].Task[0].Start[0],result.Project.Tasks[0].Task[0].Finish[0]);
						//console.log(resultado);


						//console.log(result.Project.Tasks[0].Task[0].Start[0]);
						//var start = new Date(result.Project.Tasks[0].Task[0].Start[0]);
                        //var finish = new Date(result.Project.Tasks[0].Task[0].Finish[0])
						//console.log(finish-start);
						//var delta = [1,5,3,67,9,2,5,67];
						//var index = delta.indexOf(67);
						//console.log(index);

						//console.log("Número de Tareas anidadas por tarea de primer nivel o resumen", ArrayTareasSegundoNivelPorResumen());

						//console.log("Tareas de Segundo nivel por Resumen", ArrayTareasSegundoNivelPorResumen());
						//console.log("Media", average(ArrayTareasSegundoNivelPorResumen()));
						//console.log("Desviación Estándar", standardDeviation(ArrayTareasSegundoNivelPorResumen()));
						//console.log("Máximo", getMaxOfArray(ArrayTareasSegundoNivelPorResumen()));
						//console.log("Mínimo", getMinOfArray(ArrayTareasSegundoNivelPorResumen()));
						//console.log("Número de vínculos", ArrayVinculos());
						            


                        
//                        /*FUNCIÓN PARA EL DISPLAY DE TODOS LOS VALORES DE UN KEY EN CONCRETO*/
                        /*
                        for (i in result.Project.Tasks[0].Task){
                           var b = result.Project.Tasks[0].Task[i];
                           if (_.has(b,'UID')){
                              console.log(b.UID[0]);
                           }
                           else{
                              continue;
                           }
                          
                        }*/
                        
                        respuesta.end(subida_archivos.responderSubida(true));

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