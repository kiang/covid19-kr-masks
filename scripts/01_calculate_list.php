<?php
$basePath = dirname(__DIR__);
include_once($basePath . '/vendor/phayes/geophp/geoPHP.inc');

$json = json_decode(file_get_contents($basePath . '/json/skorea-provinces-2018-geo.json'), true);
$krList = array(
    'provinces' => array(),
    'municipalities' => array(),
);
foreach($json['features'] AS $feature) {
    $p = $feature['properties'];
    $geo = geoPHP::load(json_encode($feature['geometry']), 'json');
    $center = $geo->getCentroid();
    $p['lng'] = $center->coords[0];
    $p['lat'] = $center->coords[1];
    $krList['provinces'][$p['code']] = $p;
}

$json = json_decode(file_get_contents($basePath . '/json/skorea-municipalities-2018-geo.json'), true);
foreach($json['features'] AS $feature) {
    $p = $feature['properties'];
    $geo = geoPHP::load(json_encode($feature['geometry']), 'json');
    $center = $geo->getCentroid();
    $p['lng'] = $center->coords[0];
    $p['lat'] = $center->coords[1];
    $krList['municipalities'][$p['code']] = $p;
}

file_put_contents($basePath . '/json/skorea-list.json', json_encode($krList, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));