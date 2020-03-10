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
  switch(p.remain_stat) {
    case 'plenty':
      color = '#48c774';
      break;
    case 'some':
      color = '#ffdd57';
      break;
    case 'few':
      color = '#f00';
      break;
    case 'empty':
      color = '#ccc';
      break;
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
      message += '<tr><th scope="row">Remain Status</th><td>';
      switch(p.remain_stat) {
        case 'plenty':
          message += 'Plenty - 재고 상태[100개 이상(녹색)';
          break;
        case 'some':
          message += 'Some - 30개 이상 100개미만(노랑색)';
          break;
        case 'few':
          message += 'Few - 2개 이상 30개 미만(빨강색)';
          break;
        case 'empty':
          message += 'Empty - 1개 이하(회색)';
          break;
      }
      message += '</td></tr>';
      message += '<tr><th scope="row">Stock Time</th><td>' + p.stock_at + '</td></tr>';
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

map.once('rendercomplete', function() {
  if(window.location.hash === '') {
    var lonLat = ol.proj.toLonLat(appView.getCenter());
    window.location.hash = '#' + lonLat[0].toString() + '/' + lonLat[1].toString();
  }
  map.on('moveend', function(evt) {
    var lonLat = ol.proj.toLonLat(appView.getCenter());
    window.location.hash = '#' + lonLat[0].toString() + '/' + lonLat[1].toString();
  })
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
    if(window.location.hash === '') {
      appView.setCenter(coordinates);
    }
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

var areas = {};
$.getJSON('json/skorea-list.json', {}, function(c) {
  areas = c;

  var options = '<option></option>';
  for(k in areas.provinces) {
    options += '<option value="' + k + '">' + areas.provinces[k].name + ' - ' + areas.provinces[k].name_eng + '</option>';
  }
  $('select#selectProvince').html(options).change(function() {
    var codeSelected = $(this).val();
    var options = '<option></option>';
    for(k in areas.municipalities) {
      if(k.substr(0, 2) === codeSelected) {
        options += '<option value="' + k + '">' + areas.municipalities[k].name + ' - ' + areas.municipalities[k].name_eng + '</option>';
      }
      $('select#selectCity').html(options);
    }
    appView.setCenter(ol.proj.fromLonLat([areas.provinces[codeSelected].lng, areas.provinces[codeSelected].lat]));
    sidebar.close();
  });

  options = '<option></option>';
  for(k in areas.municipalities) {
    options += '<option value="' + k + '">' + areas.municipalities[k].name + ' - ' + areas.municipalities[k].name_eng + '</option>';
  }
  $('select#selectCity').html(options).change(function() {
    var codeSelected = $(this).val();
    appView.setCenter(ol.proj.fromLonLat([areas.municipalities[codeSelected].lng, areas.municipalities[codeSelected].lat]));
    sidebar.close();
  });

});



var showPoints = function(lng, lat) {
  $.getJSON('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=' + lat + '&lng=' + lng + '&m=10000', {}, function(c) {
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

routie(':lng/:lat', showPoints);