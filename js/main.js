var sidebar = new ol.control.Sidebar({ element: 'sidebar', position: 'right' });

function pointStyleFunction(f) {
  var p = f.getProperties(), color, stroke, radius;
p = p.properties;
  if(f === currentFeature) {
    stroke = new ol.style.Stroke({
      color: '#000',
      width: 5
    });
    radius = 25;
  } else {
    stroke = new ol.style.Stroke({
      color: '#fff',
      width: 2
    });
    radius = 15;
  }
  if(p.updated === '') {
    color = '#ccc';
  } else if(p.remain_cnt > 100) {
    color = '#48c774'; // > 50% stock
  } else if(p.remain_cnt > 40) {
    color = '#ffdd57'; // > 20% stock
  } else if(p.remain_cnt > 20) {
    color = '#fc82b1'; // > 10% stock
  } else {
    color = '#f00'; // < 10% stock, treat as 0
  }
  return new ol.style.Style({
    image: new ol.style.RegularShape({
      radius: radius,
      points: 3,
      fill: new ol.style.Fill({
        color: color
      }),
      stroke: stroke
    })
  })
}
var sidebarTitle = document.getElementById('sidebarTitle');
var content = document.getElementById('sidebarContent');

var currentCenter = ol.proj.fromLonLat([126.8491238, 37.5650168]); //Seoul
var appView = new ol.View({
  center: currentCenter,
  zoom: 14
});

var vectorPoints = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: pointStyleFunction
});

var baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    opacity: 0.8
});

var map = new ol.Map({
  layers: [baseLayer, vectorPoints],
  target: 'map',
  view: appView
});

map.addControl(sidebar);
var pointClicked = false;
var previousFeature = false;
var currentFeature = false;

map.on('singleclick', function(evt) {
  content.innerHTML = '';
  pointClicked = false;
  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    if(false === pointClicked) {
      pointClicked = true;
      var p = feature.getProperties();
      p = p.properties;
      var message = '<table class="table table-dark">';
      message += '<tbody>';
      message += '<tr><th scope="row" style="width: 100px;">Name</th><td>';
      message += p.name;
      message += '</td></tr>';
      message += '<tr><th scope="row">Remain Count</th><td>' + p.remain_cnt + '</td></tr>';
      message += '<tr><th scope="row">Sold Count</th><td>' + p.sold_cnt + '</td></tr>';
      message += '<tr><th scope="row">Stock Count</th><td>' + p.stock_cnt + '</td></tr>';
      message += '<tr><th scope="row">Stock Time</th><td>' + p.stock_t + '</td></tr>';
      message += '<tr><th scope="row">Type</th><td>' + p.type + '</td></tr>';
      message += '<tr><th scope="row">Address</th><td>' + p.addr + '</td></tr>';
      message += '<tr><th scope="row">Code</th><td>' + p.code + '</td></tr>';
      message += '<tr><th scope="row">Created At</th><td>' + p.created_at + '</td></tr>';
      message += '<tr><td colspan="2">';
      message += '<hr /><div class="btn-group-vertical" role="group" style="width: 100%;">';
      message += '<a href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng + '&travelmode=driving" target="_blank" class="btn btn-info btn-lg btn-block">Google</a>';
      message += '<a href="https://wego.here.com/directions/drive/mylocation/' + p.lng + ',' + p.lat + '" target="_blank" class="btn btn-info btn-lg btn-block">Here WeGo</a>';
      message += '<a href="https://bing.com/maps/default.aspx?rtp=~pos.' + p.lng + '_' + p.lat + '" target="_blank" class="btn btn-info btn-lg btn-block">Bing</a>';
      message += '</div></td></tr>';
      message += '</tbody></table>';
      sidebarTitle.innerHTML = p.name;
      content.innerHTML = message;
      sidebar.open('home');

      currentFeature = feature;
      feature.setStyle(pointStyleFunction(feature));
      if(false !== previousFeature) {
        previousFeature.setStyle(pointStyleFunction(previousFeature));
      }
      previousFeature = feature;
    }
  });
});

map.on('moveend', function(evt) {
  currentCenter = appView.getCenter();
  getPoints();
})

var geolocation = new ol.Geolocation({
  projection: appView.getProjection()
});

geolocation.setTracking(true);

geolocation.on('error', function(error) {
  console.log(error.message);
});

var positionFeature = new ol.Feature();

positionFeature.setStyle(new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: '#3399CC'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2
    })
  })
}));

var firstPosDone = false;
geolocation.on('change:position', function() {
  var coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
  if(false === firstPosDone) {
    currentCenter = coordinates;
    getPoints();
    appView.setCenter(coordinates);
    firstPosDone = true;
  }
});

new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [positionFeature]
  })
});

$('#btn-geolocation').click(function () {
  var coordinates = geolocation.getPosition();
  if(coordinates) {
    appView.setCenter(coordinates);
  } else {
    alert('Your device could not provide information of current location');
  }
  return false;
});

var getPoints = function(lng, lat) {
  var lonLat = ol.proj.toLonLat(currentCenter);
  $.getJSON('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=' + lonLat[1] + '&lng=' + lonLat[0] + '&m=10000', {}, function(c) {
    var features = [];
    var vSource = vectorPoints.getSource();
    vSource.clear();
    for(k in c.stores) {
      var f = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([c.stores[k].lng, c.stores[k].lat])),
        properties: c.stores[k]
      });
      features.push(f);
    }
    vSource.addFeatures(features);
  });
}

getPoints();
