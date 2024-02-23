import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { 
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiaWxhbmt1bmRpaCIsImEiOiJjbHA4Ymh6OXkyd21lMnZxa3lqdnZqMDJjIn0.enGCVPw4Xlq_IGo9qLfVuQ';
    const map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [15.95, 45.8],
      zoom: 12,
    });
  }
}
