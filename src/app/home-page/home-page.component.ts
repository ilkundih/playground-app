import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  laps: any;

  constructor(private dataService: DataService) {
    this.dataService.data$.subscribe(data => {
      this.laps = data;
    });
  }
}
