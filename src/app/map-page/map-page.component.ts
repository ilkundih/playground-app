import { Component, Input, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import services from '../../assets/data/services.json';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css'],
})
export class MapPageComponent implements OnInit {

  direction: any;

  //lap timer variables
  clock: any;
  minutes: any = '00';
  seconds: any = '00';
  milliseconds: any = '00';
  laps: any = [];
  counter: number;
  timerRef;
  running: boolean = false;
  startText = 'Start';


  currentPosition: GeolocationCoordinates;

  private options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };


  ngOnInit(): void {

    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiaWxhbmt1bmRpaCIsImEiOiJjbHA4Ymh6OXkyd21lMnZxa3lqdnZqMDJjIn0.enGCVPw4Xlq_IGo9qLfVuQ';
    const map = new mapboxgl.Map({
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

    //map.addControl(geocoder);
    map.addControl(directions, 'top-right');
    map.addControl(geolocate);


    map.on('load', function () {
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


    navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error, this.options);

    console.log(directions.getOrigin);
  }





  public success(pos) {
    const crd = pos.coords;
    this.currentPosition = crd;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }

  public error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  //timer methods

  startTimer() {
    console.log(this.currentPosition.latitude + ' ' + this.currentPosition.longitude);
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

    console.log(lapTime);
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


