/*Variables globales*/

/*Almacena el id de origen*/
var origen;
/*Almacena el id de destino*/
var destino;
/*Almacena el tipo del mensaje : texto , imagen o voz*/
var tipo;
/*Contadora auxiliar. Se encarga de que cada vez que se abre un terminal permita la eliminación de la cabecera y los mensajes*/
var contadora = 0;

/*Funciones*/

/* Función handleInput
-----------------------
Parámetros : value
Descripción : Obtiene el valor del id origen y lo almacena en una variable global(origen).
*/
function handleInput(value){
origen = value;
console.log(origen);
creacabecera();
}
/* Función compruebausuario
-----------------------
Parámetros : Sin parámetros
Descripción : Comprueba que el usuario logueado se encuentra entre los contactos de SAT, en caso contrario
salta un error por ventana emergente. Para eso mediante un fetch recorremos la lista de contactos y con el id de origen
introduzido anteriormente comparamos con los id del servidor.
*/
function compruebausuario(){

  var url="https://ssaatt.com/whatsat/contactos/jemunoz";

  fetch(url)
 .then(function(response){
  return response.json();
  })

 .then(function(data){

 var tam=data.length;
 var iter;
 var aux=0;

 for (iter=0;iter<tam;iter++){
 var id=data[iter].id;
 var name = data[iter].name;
 var surName = data[iter].surName;
  if(origen==id){
    aux = 1;
  }
 }
  if(aux == 0){
  alert("Error :( "+origen+" no es miembro de SAT 2019");
    }
  if(aux == 1){
  generatabla();
  }
 });
}
/* Función generatabla
-----------------------
Parámetros : Sin parámetros
Descripción : Genera una tabla con todos los contactos , incluyendo su nombre , apellidos y su foto de perfil
*/
function generatabla(){
  var nfilas=0;
  var ncolumnas=4;
  var i;
  var j;
  var k;
  var fila;
  var columna;
  var creatabla= document.getElementById("tabla");
  var url="https://ssaatt.com/whatsat/contactos/jemunoz";

fetch(url)
.then(function(response){

  return response.json();

})
.then(function(data){

  var tam = data.length;
  var iter;
  for(iter=0;iter<tam;iter++){
    var id = data[iter].id;
    var surName = data[iter].surName;
    var name = data[iter].name;
    var profileImageUrl = data[iter].profileImageUrl;
    fila=document.createElement("tr");
    creatabla.appendChild(fila);

    for (j=0; j < ncolumnas; j++) {
      columna=document.createElement("td");
      fila.appendChild(columna);
      if(j==0){
      columna.innerHTML=name;
      }
      if(j==1){
      columna.innerHTML=surName;
      }
      if(j==2){
      columna.innerHTML="<img src='"+profileImageUrl+"' onclick=terminal('"+id+"')"+">";
        }
      }
    }
    document.getElementById("contactos").style.visibility="visible";
    creacabecera();
  });
}
/* Función creacabecera
-----------------------
Parámetros : Sin parámetros
Descripción : Crea la cabecera del usuario que se le quiere enviar un mensaje introduciendo su foto
redondeada y su nombre y apellidos.
*/
function creacabecera(){

  var url="https://ssaatt.com/whatsat/contactos/jemunoz";
  fetch(url)
 .then(function(response){
  return response.json();
  })

 .then(function(data){

 var tam=data.length;
 var iter;
 var aux=0;

 for (iter=0;iter<tam;iter++){
 var id=data[iter].id;
 var name = data[iter].name;
 var surName = data[iter].surName;
 var profileImageUrl = data[iter].profileImageUrl;
  if(destino==id){
    var nombre = name;
    var apellidos = surName;
    var imagen = profileImageUrl;

    //var creacabecera = document.getElementById("cabecera");
    //var parrafo  = document.createElement("p");
    //creacabecera.appendChild(parrafo);
    document.getElementById("cabecera").innerHTML='<p><img id="img-cabecera"  src="'+imagen+'"/>'+nombre+" "+apellidos+'</p>'

  }
  if(origen==id && document.getElementById("contactos").style.visibility=='visible' ){
    var id_logueo = name;
    var logueo_apellidos = surName;
    var imagen_logueo = profileImageUrl;

    //var parrafo  = document.createElement("p");
    //var crealogueo = document.getElementById("logueo");
    //crealogueo.appendChild(parrafo);
      document.getElementById("logueo").innerHTML='<p><img id="img-logueo"  src="'+imagen_logueo+'"/>'+id_logueo+" "+logueo_apellidos+'</p>'
      document.getElementById("logueo").style.visibility="visible";
  }
 }

 });
}
/* Función terminal
-----------------------
Parámetros : id_dest
Descripción : Crea la terminal donde se van a enviar y recibir mensajes
*/
function terminal(id_dest){
if(contadora!=0){

eliminaterminal();
}
contadora++;
var id_org = origen;
destino = id_dest;
creacabecera();
document.getElementById("terminal").style.visibility="visible";
setInterval(recibe,3000,id_org,id_dest);

}
/* Función recibe
-----------------------
Parámetros : id_org,id_dest
Descripción : Mediante un fetch , comprueba (cada 3 segundos) si hay mensajes del usuario con el que se está manteniendo
una conversación y lo añade al terminal.
*/
function recibe(id_org,id_dest){

var url="https://ssaatt.com/whatsat/recibe/"+id_dest+"/"+id_org;
/* Comprobante URL */
console.log("Comprobando url recibe "+url);

fetch(url)
.then(function(response){
  return response.json();
})
.then(function(data){
var tam = data.length;
var iter;
for(iter=0;iter<tam;iter++){
var tipo = data[iter].tipo;
var contenido = data[iter].contenido;

    console.log(tipo);
    addterminal(1,tipo,contenido);
    }
  });
}
/* Función handleEnvia
-----------------------
Parámetros : tipo,texto
Descripción : Se encarga de enviar los mensajes al servidor en funcion de su tipo(texto,image,speech) mediante un fetch
*/
function handleEnvia(tipo,texto){
  var contenido = texto;
  var id_org = origen;
  var id_dest = destino;
  console.log(id_org);
  console.log(id_dest);
  console.log(contenido);
  var url="https://ssaatt.com/whatsat/envia";
  var data={id_org,id_dest,tipo,contenido};
  var formData = new FormData();

  for(var key in data){
    formData.append(key,data[key]);
  }
  fetch(url,{
    method: 'POST',
    body: formData,
  })
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    console.log('Success:',data)
  });
}
/* Función handleTeclado
-----------------------
Parámetros : value
Descripción : Obtiene el valor del teclado
*/
function handleTeclado(value){
var tipo = "text";
var texto = document.getElementById("textoteclado").value;
console.log(texto);
addterminal(0,tipo,texto);
handleEnvia(tipo,texto);
var texto = document.getElementById("textoteclado").value="";
}
/* Función eliminaterminal
-----------------------
Parámetros : Sin parámetros
Descripción : Elimina la cabecera del usuario con el que estamos manteniendo una conversacion y elimina todos los mensajes.
*/
function eliminaterminal(){

var display = document.getElementById("pantalla");
var cabecera = document.getElementById("cabecera");

while (display.hasChildNodes()){
  display.removeChild(display.firstChild);
}
while (cabecera.hasChildNodes()){
  cabecera.removeChild(cabecera.firstChild);
}

}
/* Función addterminal
-----------------------
Parámetros :  usuario,tipo,contenido
Descripción : Añade al terminal los mensajes que se envian y reciben segun el tipo. Si el usuario origen envia un mensaje se
inserta en la derecha , si se recibe algun mensaje se inserta a la izquierda de la pantalla.
*/

  function addterminal(usuario,tipo,contenido){
    if(tipo=="text"){
      var incluirtexto = document.getElementById("pantalla");
      var parrafo  = document.createElement("p");
      incluirtexto.appendChild(parrafo);
      if(usuario==0){
      parrafo.innerHTML="<p style=text-align:right>"+contenido+"</p>";
        }
        if(usuario==1){
        parrafo.innerHTML="<p style=text-align:left>"+contenido+"</p>";
        }
      }

    if(tipo=="image"){
      var incluirimagen = document.getElementById("pantalla");
      var parrafo = document.createElement("p");
      incluirimagen.appendChild(parrafo);
      if(usuario==0){
      parrafo.innerHTML='<p align=right><img height=250 width=250 src="'+contenido+'"/></p>'
        }
        if(usuario==1){
        parrafo.innerHTML= '<p align=left><img height=250 width=250 src="'+contenido+'"/></p>'
        }
    }

    if(tipo=="speech"){
      var incluirvoz = document.getElementById("pantalla");
      var parrafo  = document.createElement("p");
      incluirvoz.appendChild(parrafo);
      if(usuario==0){
        var speech = new SpeechSynthesisUtterance();
                    speech.text=contenido;
                    speech.lang = 'es-ES';
                    window.speechSynthesis.speak(speech);
                    parrafo.innerHTML="<p style=text-align:right>"+contenido+"</p>";
        }
        if(usuario==1){
          var speech = new SpeechSynthesisUtterance();
                      speech.text=contenido;
                      speech.lang = 'es-ES';
                      window.speechSynthesis.speak(speech);
                      parrafo.innerHTML="<p style=text-align:left>"+contenido+"</p>";
        }
    }
  }

/* Función handleFotos
-----------------------
Parámetros : Sin parámetros
Descripción : Activa la Webcam en funcion de éxito.
*/
// function handleFotos(){
//   this.state={
//     id_org:'',
//     id_dest:'',
//     contactos:[],
//     mensajes:[],
//     teclado: '',
//   pantalla: document.getElementById('pantalla'),
//   divTermi: document.getElementById('terminal'),
//   divConta: document.getElementById('contactos'),
//   divFotos: document.getElementById('fotos'),
//   video: document.querySelector('video'),
//   emision: ''
//   };
// this.state.divTermi.style.visibility= "hidden";
// this.state.divConta.style.visibility= "hidden";
// this.state.divFotos.style.visibility= "visible";
// document.getElementById("logueo").style.visibility="hidden";
//
// navigator.mediaDevices.getUserMedia({audio:false,video:true}).then(exito).catch(error);
//
// }
/* Función capturePhoto
-----------------------
Parámetros : Sin parámetros
Descripción : Captura una foto de tipo png segun las dimensiones indicadas y las envia.
*/
  // function capturePhoto() {
  //   var canvas = document.createElement('canvas');
  //   document.querySelector('html').appendChild(canvas);
  //   canvas.width = this.state.video.getAttribute("width");
  //   canvas.height = this.state.video.getAttribute("height");
  //   canvas.getContext('2d').drawImage(this.state.video, 0, 0, canvas.width, canvas.height);
  //   var picture = canvas.toDataURL("image/png");
  //   document.querySelector('html').removeChild(canvas);
  //   cancelPhoto();
  //   var texto="<p align=right>"+this.state.teclado+"</p>";
  //   tipo = "image";
  //   console.log(picture);
  //   addterminal(0,tipo,picture);
  //   handleEnvia("image",picture);
  //   document.getElementById("logueo").style.visibility="visible";
  // }
/* Función cancelPhoto
-----------------------
Parámetros : Sin parámetros
Descripción : Cancela la emision de la Webcam.
*/
  // function cancelPhoto(){
  //   this.state.emision.getTracks()[0].stop();
  //   document.getElementById("terminal").style.visibility="visible";
  //   document.getElementById("contactos").style.visibility="visible";
  //   document.getElementById("logueo").style.visibility="visible";
  //   document.getElementById("fotos").style.visibility="hidden";
  // }
/* Función exito
-----------------------
Parámetros : stream
Descripción : Activa el flujo de la emision si todo está correcto.
*/
function exito(stream) {
  this.state.video.autoplay=true;
  this.state.video.srcObject = stream;
  this.state.emision=stream;
}
/* Función error
-----------------------
Parámetros : Sin parámetros
Descripción : Si existe algun error en la emision de la webcam se captura el error y llama a la funcion error.
*/
function error(){

}
/* Función handleGeoLocation
-----------------------
Parámetros : Sin parámetros
Descripción : Activa los servicios de geolocalizacion y llama a la funcion posicion para obtener las coordenadas.
*/
function handleGeoLocation(){
navigator.geolocation.getCurrentPosition(posicion);
}
/* Función posicion
-----------------------
Parámetros : position
Descripción : Envia las coordenadas
*/
function posicion(position){
var coordenadas = position.coords;
var latitud = coordenadas.latitude;
var longitud = coordenadas.longitude;
addterminal(0,"text","Latitud "+latitud);
addterminal(0,"text","Longitud "+longitud);
handleEnvia("text",latitud);
handleEnvia("text",longitud);
}
/* Función handleVoz
-----------------------
Parámetros : Sin parámetros
Descripción : Reconocimiento de la voz a través del microfono. Traduce la voz a texto y la envia.
*/
function handleVoz(){
  this.state={
    id_org:'',
    id_dest:'',
    contactos:[],
    mensajes:[],
    teclado: '',
  pantalla: document.getElementById('pantalla'),
  divTermi: document.getElementById('terminal'),
  divConta: document.getElementById('contactos'),
  divFotos: document.getElementById('fotos'),
  video: document.querySelector('video'),
  emision: ''
  };
  var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = 'es-ES';
  recognition.start();
  var data_uri;
  var pantalla=this.state.pantalla;
  var divFotos=this.state.divFotos;
  recognition.onend = function(event) {
    if (data_uri==null) pantalla.innerHTML= "<p align=right>No he reconocido</p>"+pantalla.innerHTML;
  };
  recognition.onresult = function(event) {
    data_uri = event.results[0][0].transcript;
      if (data_uri!=''){
        var texto=data_uri;
            addterminal(0,"speech",texto);
            handleEnvia("speech",data_uri);
         }
  };
}
