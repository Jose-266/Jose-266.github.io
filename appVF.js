
let mymap;

//CREA EL MAPA Y LEYENDAS
function inicializaMapa()
{
      let centro = [18.25178,-66.254513];
      mymap = L.map('mapid').setView(centro, 9);
      let atrib1 = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">';
      let atrib2 = 'OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
      let atrib  = atrib1 + atrib2;
      let mytoken = 'pk.eyJ1IjoibWVjb2JpIiwiYSI6IjU4YzVlOGQ2YjEzYjE3NTcxOTExZTI2OWY3Y2Y1ZGYxIn0.LUg7xQhGH2uf3zA57szCyw';
      let myLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
      L.tileLayer(myLayer, {
        attribution: atrib,
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mytoken}).addTo(mymap);
      
  
      let legend = L.control({ position: "topright" });
      legend.onAdd = function(mymap) {
        let div = L.DomUtil.create("div", "legend info");
        
        div.innerHTML += "<h4>ESTADO DE EMBALSES</h4>";
        div.innerHTML += '<i style="background: black"></i><span>Desborde</span><br>';
        div.innerHTML += '<i style="background: #448D40"></i><span>Seguridad</span><br>';
        div.innerHTML += '<i style="background: #477AC2"></i><span>Observación</span><br>';
        div.innerHTML += '<i style="background: #FFFF00"></i><span>Ajuste</span><br>';
        div.innerHTML += '<i style="background: #ff8c00"></i><span>Control</span><br>';
        return div;
 };
  
      legend.addTo(mymap);
      let legend2 = L.control({ position: "bottomleft" });
      legend2.onAdd = function(mymap) {
        let div2 = L.DomUtil.create("div2", "legend info2");
        div2.innerHTML += "<h4> Última actualización: "+"<font color=blue>"+fechaActual()+horaActual()+ "</h4>";
           
        return div2;
 };
  
      legend2.addTo(mymap);
  
 };


 //DEFINIR TERMINOS IMPORTANTES
let siteDict = {};
function crearDiccionario()
{

  let url ='https://raw.githubusercontent.com/Jose-266/archivo_datos/main/embalses.json';
  
  Plotly.d3.json(url,function(data){
    for(let i=0;i < data.length; i++)
    {
        siteDict[data[i].siteID] = 
      { nombre:data[i].nombre,
        lat:data[i].latitude,
        lon:data[i].longitude,
       
        capacidad:data[i].capacidad,
        control:data[i].control,
        ajuste:data[i].ajuste,
        observacion: data[i].observacion,
        seguridad:data[i].seguridad,
        desborde:data[i].desborde}
      
        }
      });
    };




//FILTRA LOS DATOS 


function filtraDatos(data)
{
  let fecha = [];
  let nivel = [];
  const filtered = data.split('\n');
  let colNivel;
  for(let i=0;i < filtered.length;i++)
  {
    if (filtered[i].slice(0,9) == "agency_cd")
    {
       let header = filtered[i].split("\t");
       colNivel = header.findIndex(element => element.includes("_62616"))
     }
    if(filtered[i].slice(0,4) == "USGS")
    {
       let fila = filtered[i].split('\t');
       fecha.push(fila[2]);
       nivel.push(parseFloat(fila[colNivel]));
     }
  }
  return [fecha,nivel];
}


//INFO USADA PARA LEYENDA QUE MUESTRA FECHA Y HORA DE ACTUALIZACION

function horaActual() {
  fecha=new Date(); 
  hora=fecha.getHours(); 
  minuto=fecha.getMinutes(); 
  
  if (hora<10) { 
      hora="0"+hora;
      }
  if (minuto<10) { 
      minuto="0"+minuto;
      }     

let tradHora = {};
tradHora = {"01":"1","02":"2","03":"3","04":"4","05":"5","06":"6","07":"7","08":"8","09":"9","10":"10","11":"11","12":"12","13":"1","14":"2","15":"3","16":"4","17":"5","18":"6","19":"7","20":"8","21":"9","22":"10","23":"11","00":"12"};

  reloj = tradHora[hora]+":"+minuto;	
   
   if(hora<12){
     reloj+=" AM";
   }else{
     reloj+=" PM";
   }
  return reloj; 
  };

  function fechaActual(actualidad){

    let fecha = Date();
    
    let diaSemana = fecha.slice(0,3);
    
    let nameDay = {};
    nameDay =       {"Thu":"Jueves","Tue":"Martes","Mon":"Lunes","Wed":"Miércoles","Fri":"Viernes","Sat":"Sábado","Sun":"Domingo"};
  
    let diaFecha = fecha.slice(8,11);
  
    let nameMonth = fecha.slice(4,7);
    let tradMonth = {};
    tradMonth ={"Jan":"Enero","Feb":"Febrero","Mar":"Marzo","Apr":"Abril","May":"Mayo","Jun":"Junio","Jul":"Julio","Aug":"Agosto","Sept":"Septiembre","Oct":"Octubre","Nov":"Noviembre","Dec":"Diciembre"};
  
    let year = fecha.slice(11,15); 
    let hora = fecha.slice(16,18);
    let minutos = fecha.slice(18,21);
    let segundos = fecha.slice(21,24)
    let tradHora = {};
    tradHora = {"1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","10":"10","11":"11","12":"12","13":"1","14":"2","15":"3","16":"4","17":"5","18":"6","19":"7","20":"8","21":"9","22":"10","23":"11","24":"12"}; 
  
    actualidad = nameDay[diaSemana] + "&nbsp;"+ diaFecha + "de" + "&nbsp;"+ tradMonth[nameMonth] + "&nbsp;" + "del" + "&nbsp;"+ year+"&nbsp;"+"a las"+"&nbsp;";
  
    return actualidad;
  
};

//FUNCION QUE CREA GRAFICAS

function graficaDatos(filtrado, nombres,ultimo){
   
  let trace = {
    x: filtrado[0],
    y: filtrado[1],
    type:'scatter',
    line: {
      color: 'red',
      width: 2
    },

  };
  let layout = {
    width: 370,
    height: 300, 
    paper_bgcolor: "lightblue",
    plot_bgcolor: "#ddd",

    title: {
      text: "<b>" +  nombres + "</b>"+ "<br>" + "<b>Nivel Actual: </b>" + ultimo + "\nmetros."+ 
      "<br>" + "<b>Fecha: </b>" + fechaActual() +horaActual()+"."+ "<br>",
      font: {
      color:'black',
      family: 'Arial',
      size: 12
    }},
    xaxis: {
      title: {
          text: "<b>Fecha/Hora<b>",
          font: {
          size: 10}
      },
      linecolor:'black',
      mirror: true,
      gridwidth:2,
      gridcolor:'grey',
      gridwidth:1,
    },
    yaxis: {
      title: {
          text: "<b>Nivel(m)<b>",
          font: {
            size: 10}
      },
      linecolor:'black',
      mirror: true,
      gridcolor:'grey',
      gridwidth:1,
      tickformat: ".2f", 
    },
  }

  let graphData = [trace];
Plotly.newPlot('Graph',graphData,layout); 
};


//FUNCION QUE CALCULA LA TENDENCIA DEL NIVEL DE CADA EMBALSE
function calculaTendencia(fecha, nivel)
{
  let now = Date().slice(8,10);
  let tendencia =[];
  
  for(let i=0;i < nivel.length;i++)
    {
      if (fecha[i].slice(8,10) == now)
        {
          tendencia.push(parseFloat(nivel[i]));
        }
    }
  let pendiente = tendencia[tendencia.length -1] - tendencia[0];
  return pendiente;
  
};



//BUSCA EL EMBALSE Y SUS CARACTERISTICAS PARA PONERLO EN EL MAPA Y LAS GRAFICAS


function buscaEmbalse(miEmbalse)
{

   Plotly.d3.text("https://waterdata.usgs.gov/pr/nwis/uv/?format=rdb&site_no=" + miEmbalse, function(data) {
   
     
      let lat = siteDict[miEmbalse].lat;
      let lon = siteDict[miEmbalse].lon;
      let nombre = siteDict[miEmbalse].nombre;
      let desborde = siteDict[miEmbalse].desborde;
      let seguridad = siteDict[miEmbalse].seguridad;
      let observacion = siteDict[miEmbalse].observacion;
      let ajuste = siteDict[miEmbalse].ajuste;
      let control = siteDict[miEmbalse].control;
      let capacidad = siteDict[miEmbalse].capacidad;
      

     let datos = filtraDatos(data);
     let fecha = datos[0];
     let nivel = datos[1].pop();
     let normalizar = normalizacionDatos(nivel,control,desborde)
     let Nivel2 = (0.09 - (normalizar/09).toFixed(2));
     let LonN = 0.04;
     
     let desborde_normalizado = normalizacionDatos(desborde,control,desborde);
     let nivel_desborde = (0.09 - (desborde_normalizado/9).toFixed(2));
     
     let seguridad_normalizada = normalizacionDatos(seguridad,control,desborde);
     let nivel_seguridad = (0.09 - (seguridad_normalizada/9).toFixed(2));
     if (nivel_seguridad < 0){
       nivel_seguridad=-nivel_seguridad;
     }
     
     let observacion_normalizada = normalizacionDatos(observacion,control,desborde);
     let nivel_observacion = (0.09 - (observacion_normalizada/9).toFixed(2));
     if (nivel_observacion < 0){
       nivel_observacion=-nivel_observacion;
     }
     
     let ajuste_normalizado = normalizacionDatos(ajuste,control,desborde);
     let nivel_ajuste = (0.09 - (ajuste_normalizado/9).toFixed(2));
     if (nivel_ajuste < 0){
       nivel_ajuste=-nivel_ajuste;
     }
     
     let control_normalizado = normalizacionDatos(control,control,desborde);
     let nivel_control = (0.09 - (control_normalizado/9).toFixed(2));
     if (nivel_control < 0){
       nivel_control=-nivel_control;
     }
     
     if (Nivel2.toFixed(2) == 0.00){
       LonN = 0.00;
     }
     
     let colorNivel;
       
        if (nivel >= seguridad ){
          colorNivel = 'green'
        }
            
        if (nivel >= observacion && nivel < seguridad){
          colorNivel = 'blue'
          
        }
          
        if (nivel >= ajuste && nivel < observacion ){
          colorNivel = 'yellow'
         
        }
            
        if (nivel <= control ){
          colorNivel = 'darkorange'
        }
     
        if(nivel == desborde){
          colorNivel = 'black'
        }
     
   
     let rectan_observacion= L.rectangle([[lat-nivel_seguridad.toFixed(2),lon],[lat-nivel_observacion.toFixed(2),lon-0.03]],
                            {color: "blue",
                            colorOpacity:0.09,
                            fillColor:" ",
                            fillOpacity:0.02}).addTo(mymap);
     
     let rectan_ajuste= L.rectangle([[lat-nivel_observacion.toFixed(2),lon],[lat-nivel_ajuste.toFixed(2),lon-0.03]],
                            {color: "yellow",
                            colorOpacity:0.09,
                            fillColor:" ",
                            fillOpacity:0.02}).addTo(mymap);
     
     let rectan_control= L.rectangle([[lat-nivel_ajuste.toFixed(2),lon],[lat-nivel_control.toFixed(2),lon-0.03]],
                            {color: "darkorange",
                            colorOpacity:0.09,
                            fillColor:" ",
                            fillOpacity:0.02}).addTo(mymap);
     
     let rectan_desborde= L.rectangle([[lat-nivel_control.toFixed(2),lon],
                                   [lat-nivel_desborde.toFixed(2),lon-0.03]],
                            {color: "black",
                            colorOpacity:0.09,
                            fillColor:" ",
                            fillOpacity:0.02}).addTo(mymap);
     
     
     let BotonGrafica = L.circle([lat-0.12,lon-0.015],
                           {color: 'transparent',
                            colorOpacity:1.0,
                            fillColor:colorNivel,
                            fillOpacity:1.0,
                            label: "boton",
                            radius: 2000}).addTo(mymap);

     
     let rectanBackg = L.rectangle([[lat-nivel_control.toFixed(2),lon-0.03],[lat-Nivel2.toFixed(2),lon]],
                           {color: "black",
                            colorOpacity:0.9,
                            fillColor:colorNivel,
                            fillOpacity:0.75,
                            radius: 2000}).addTo(mymap);
     
    
     rectanBackg.bindPopup(nombre).openPopup();
     
     BotonGrafica.bindPopup('<div id="Graph"></div>', {Position: 'absolute', maxWidth:'auto'}).on('popupopen', function(e) {graficaDatos(datos, nombre, datos[1].slice(-1))});
     
     let nivel_pend = datos[1];
     let pendiente = calculaTendencia(fecha, nivel_pend);
     
     let icon;
     if(pendiente > 0){
       icon= 'https://cdn0.iconfinder.com/data/icons/flat-round-arrow-arrow-head/512/Green_Arrow_Top-512.png?raw=true';}
     if(pendiente == 0){
       icon= 'https://cdn0.iconfinder.com/data/icons/ui-essence/32/_26ui-512.png?raw=true';}
     if(pendiente < 0){
       icon= 'https://cdn0.iconfinder.com/data/icons/flat-round-arrow-arrow-head/512/Red_Arrow_Down-512.png?raw=true';}
     
     
   
     let markerIcon = L.icon({
       iconUrl: icon,
       iconSize: [35,35], 
       iconAnchor: [25,35],
     });
     
    let trendMarker = L.marker([lat-nivel_desborde.toFixed(2)+0.0035,lon-0.0035], {
       icon: markerIcon}).addTo(mymap); 
    
    });

  }

  



function procesaEmbalses()
{
  for (const [key, value] of Object.entries(siteDict))
  {
      buscaEmbalse(key);
  }
};


function normalizacionDatos(nivel, control, desborde) {
  let norma1 = nivel - control;
  let norma2 = desborde - control;
  let normalizacion = (norma1 / norma2);
  return normalizacion;
};





horaActual();
    
fechaActual();

inicializaMapa();

normalizacionDatos();

crearDiccionario();
{setTimeout(procesaEmbalses,500)};