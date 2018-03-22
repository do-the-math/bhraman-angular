import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit {
@ViewChild('gmap') gmapElement: any;
map: google.maps.Map;
  constructor() { }

  ngOnInit() {
	  var mapProp = {
		center: new google.maps.LatLng(17.385044, 78.4877),
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

}
