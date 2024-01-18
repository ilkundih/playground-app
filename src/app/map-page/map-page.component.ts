import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import services from '../../assets/data/services.json';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css'],
})
export class MapPageComponent implements OnInit {

  clock: any;
  minutes: any = '00';
  seconds: any = '00';
  milliseconds: any = '00';

  laps: any = [];
  counter: number;
  timerRef;
  running: boolean = false;
  startText = 'Start';

  ngOnInit(): void {
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiaWxhbmt1bmRpaCIsImEiOiJjbHA4Ymh6OXkyd21lMnZxa3lqdnZqMDJjIn0.enGCVPw4Xlq_IGo9qLfVuQ';
    const maps = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [15.95, 45.8],
      zoom: 12,
    });

    const directions = new MapboxDirections({
      accessToken: 'pk.eyJ1IjoiaWxhbmt1bmRpaCIsImEiOiJjbHA4Ymh6OXkyd21lMnZxa3lqdnZqMDJjIn0.enGCVPw4Xlq_IGo9qLfVuQ',
      unit: 'metric',
      profile: 'mapbox/driving',
      //bearing: true,
      //steps: true,
      // controls: {
      //   instructions: true
      // }
    })

    maps.on('style.load', () => {
      maps.addSource('urban-areas', {
        type: 'geojson',
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson',
      });

      maps.addLayer({
        id: 'urban-areas-fill',
        type: 'fill',
        source: 'urban-areas',
        layout: {},
        paint: {
          'fill-color': '#f08',
          'fill-opacity': 0.05,
        },
      });
    });

    maps.addControl(directions, 'top-right');

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        maxZoom: 18
      },
      trackUserLocation: true,
      showAccuracyCircle: true,
      showUserHeading: true,
      showUserLocation: true
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })

    maps.addControl(geocoder);
    maps.addControl(geolocate);

    maps.on('load', function () {
      geolocate.trigger();
    })

    // for (var i = 0; i < services.length; i++) {
    //   const marker = new mapboxgl.Marker()
    //     .setLngLat([
    //       services[i].AKT_POS.AKT_POS_LAENGE,
    //       services[i].AKT_POS.AKT_POS_BREITE,
    //     ])
    //     .addTo(map);
    // }
    console.log(geolocate.getDefaultPosition);

    if (geolocate.getDefaultPosition == directions.waypoints[0].location) {
      this.startTimer;
    }
  }

  startTimer() {
    // const source = timer(0, Date.now());
    // const subscribe = source.subscribe(val => console.log(val));
    this.running = !this.running;
    if (this.running) {
      this.startText = 'Stop';
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
        // console.log(Date.now());
        // console.log(startTime);
        // console.log(this.counter);
        this.milliseconds = Math.floor(Math.floor(this.counter % 1000) / 10).toFixed(0);
        this.minutes = Math.floor(this.counter / 60000);
        this.seconds = Math.floor(Math.floor(this.counter % 60000) / 1000).toFixed(0);
        if (Number(this.minutes) < 10) {
          this.minutes = '0' + this.minutes;
        } else {
          this.minutes = '' + this.minutes;
        }
        if (Number(this.milliseconds) < 10) {
          this.milliseconds = '0' + this.milliseconds;
        } else {
          this.milliseconds = '' + this.milliseconds;
        }
        if (Number(this.seconds) < 10) {
          this.seconds = '0' + this.seconds;
        } else {
          this.seconds = '' + this.seconds;
        }
      });
    } else {
      this.startText = 'Resume';
      clearInterval(this.timerRef);
    }
  }


  lapTimeSplit() {
    let lapTime = this.minutes + ':' + this.seconds + ':' + this.milliseconds;
    this.laps.push(lapTime);
  }

  clearTimer() {
    this.running = false;
    this.startText = 'Start';
    this.counter = undefined;
    this.milliseconds = '00',
      this.seconds = '00',
      this.minutes = '00';
    this.laps = [];
    clearInterval(this.timerRef);
  }

  ngOnDestroy() {
    clearInterval(this.timerRef);
  }
}


