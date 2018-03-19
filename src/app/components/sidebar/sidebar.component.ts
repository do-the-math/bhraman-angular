import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	successClass = "text-danger";
	clicked = true;
	
	constructor() { }

	ngOnInit() { }

	onClick(){
		this.clicked= !this.clicked;  
		console.log("clicked")
	}
}
