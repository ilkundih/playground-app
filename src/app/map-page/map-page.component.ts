import { Component, Input, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { Laps } from '../models/laps';
import * as turf from '@turf/turf';
import { TrackStart } from '../models/trackStart';
import { TrackEnd } from '../models/trackEnd';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css'],
})
export class MapPageComponent implements OnInit {

  direction: any;
  trackStart: TrackStart[] = [];
  trackEnd: TrackEnd[] = [];
  laps: Laps[] = [];
  radiusInMeters: any = 10;
  originLat: any = '';
  originLon: any = '';
  destinationLat: any = '';
  destinationLon: any = '';
  //lap timer variables
  clock: any;
  minutes: any = '00';
  seconds: any = '00';
  milliseconds: any = '00';
  index: any = 0;
  lapTime: any = '';
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
      steps: true,
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

    map.addControl(directions, 'top-right');
    map.addControl(geolocate);
    map.setPitch(40, { duration: 2000 });
    map.on('load', function () {
      geolocate.trigger();
    })

    navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error, this.options);


    directions.on('destination', function () {
      const originLat = directions.getOrigin().geometry.coordinates[1];
      const originLon = directions.getOrigin().geometry.coordinates[0];
      //this.trackStart.push(originLat);
      //this.trackStart.push(originLon);
      const destinationLat = directions.getDestination().geometry.coordinates[1];
      const destinationLon = directions.getDestination().geometry.coordinates[0];
      //this.trackEnd.push(destinationLat);
      //this.trackEnd.push(destinationLon);
      console.log('Origin lat: ' + originLat + ' Origin long: ' + originLon);
      console.log('Dest lat: ' + destinationLat + ' Dest long: ' + destinationLon);
      //console.log(this.trackStart.originLat);
    });

    // directions.on('destination', function makeRadius(originLat, radiusInMeters) {
    //   var point = turf.point(originLat);
    //   var buffered = turf.buffer(point, radiusInMeters, { units: 'meters' });
    //   console.log(buffered);
    //   return buffered;

    // });
    if (this.originLat == this.currentPosition.latitude && this.originLon == this.currentPosition.longitude) {
      this.startTimer();
    }
    else if (this.destinationLat == this.currentPosition.latitude && this.destinationLon == this.currentPosition.longitude) {
      this.lapTimeSplit();
      this.clearTimer();
    }

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

  public startTimer() {
    console.log('USER  ' + 'lat: ' + this.currentPosition.latitude + ' lon: ' + this.currentPosition.longitude);
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

  public lapTimeSplit() {
    this.lapTime = this.minutes + ':' + this.seconds + ':' + this.milliseconds;
    this.laps.push(this.lapTime);
    console.log(this.lapTime);
  }

  public clearTimer() {
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

  ngOnChange() {
  }
}


