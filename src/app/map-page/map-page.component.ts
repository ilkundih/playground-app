import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import services from '../../assets/data/services.json';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css'],
})
export class MapPageComponent implements OnInit {
  ngOnInit(): void {
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiaWxhbmt1bmRpaCIsImEiOiJjbHA4Ymh6OXkyd21lMnZxa3lqdnZqMDJjIn0.enGCVPw4Xlq_IGo9qLfVuQ';
    const map = new mapboxgl.Map({
      container: 'map-container', // container ID
      style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
      center: [15.95, 45.8], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      }),
    );

    map.on('style.load', () => {
      map.addSource('urban-areas', {
        type: 'geojson',
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson',
      });

      // map.addLayer({
      //   id: 'urban-areas-fill',
      //   type: 'fill',
      //   // This property allows you to identify which `slot` in
      //   // the Mapbox Standard your new layer should be placed in (`bottom`, `middle`, `top`).
      //   source: 'urban-areas',
      //   layout: {},
      //   paint: {
      //     'fill-color': '#f08',
      //     'fill-opacity': 0.1,
      //   },
      // });
    });

    var vehicleIcon = document.createElement('div');
    vehicleIcon.classList.add("vehicle");

    for (var i = 0; i < services.length; i++) {
      var marker1 = new mapboxgl.Marker(vehicleIcon)
        .setLngLat([
          services[i].AKT_POS.AKT_POS_LAENGE,
          services[i].AKT_POS.AKT_POS_BREITE,
        ])
        .addTo(map);
    }
  }
}
