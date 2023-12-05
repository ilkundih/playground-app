import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

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
      center: [15.9, 45.8], // starting position [lng, lat]
      zoom: 13, // starting zoom
    });

    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
      }),
      'top-left',
    );
  }
}
