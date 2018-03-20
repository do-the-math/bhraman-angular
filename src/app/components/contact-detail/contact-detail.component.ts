import { Component, OnInit, ViewChild } from '@angular/core';
import { Contact } from '../../models/contactBO';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
	@ViewChild('gmap') gmapElement: any;
	map: google.maps.Map;
	geocoder;
	contactID: String;
	userSettings: any;
	myNoteDate: String = "Enter Key.." ;
	myNoteText: String = "Enter Note..";
	myNotes:any;
	newObj = new Contact();

	showInp = false;
	myMarker;
	addedMarker:any;
	markerCnt = 0;

    constructor(private route: ActivatedRoute,
				private CategoryService: CategoryService) {}
    
    ngOnInit() {
		this.markerCnt = 0;
		this.myNotes = [];
		this.contactID = (this.route.snapshot.paramMap.get('contactID'));
		this.getContact();
		this.userSettings = {
			"inputString":"Bangalore,karnataka"
		}
		
		var mapProp = {
			center: new google.maps.LatLng(17.385044, 78.4877),
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.myMarker = navigator.geolocation.getCurrentPosition((position) => {});	
		this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
		this.geocoder = new google.maps.Geocoder;
		
		google.maps.event.addListener(this.map, 'click', (event)=>{
		   this.placeMarker(event);
		});
		
    }

	getContact(){
		console.log("Contact Added from Component");
		this.CategoryService.fetchContactById(this.contactID)
			.subscribe(
				data => {
					this.newObj = data[0];
					this.myNotes = this.newObj.notes;
					this.userSettings = {
						"inputString": this.newObj.location
					}
					/* this.addedMarker = new google.maps.Marker({
							position: new google.maps.LatLng(this.newObj.position.lat, this.newObj.position.lng),
							map: this.map,
							title: this.newObj.name
					}); */
					console.log(data);
				},
				error => alert(error),
				()=> console.log("done")
			);
    }
	updateContact(){
		console.log("Contact Updated from Component");
		
		this.CategoryService.updateContactById(this.newObj._id, this.newObj)
			.subscribe(
				data => {
					console.log("updated contact");
					console.log(data)
				},
				error => alert(error),
				()=> console.log("done")
			); 
    }
	placeMarker(event){
		console.log(event);
		if(this.markerCnt==0){
			this.markerCnt = 1;
			this.addedMarker = new google.maps.Marker({
				position: event.latLng, 
				map: this.map,
				draggable: true
			});
			this.addedMarker.addListener('position_changed', (event)=>{
				//console.log("position_changed");
				console.log(this.addedMarker.getPosition());
			});
		}else{
			console.log("MARKER COUNT MORE THAN 1");
		}
	}
	addNote(){
		console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWW");
		console.log(this.newObj.notes);
		
		this.newObj.notes.push({
			date: this.myNoteDate,
			note: this.myNoteText
		});
		this.CategoryService.updateContactById(this.contactID, this.newObj)
			.subscribe(
				data => {
					console.log("updated contact");
					console.log(data);
				},
				error => alert(error),
				()=> console.log("done")
			); 
			
	}
    addField(){
		this.showInp = !this.showInp;
	}
	saveField(){
		this.showInp = !this.showInp;
		this.myNotes.push({
			date: this.myNoteDate,
			note: this.myNoteText
		});
		this.newObj.notes = this.myNotes;
		this.updateContact();
	}
	saveLocation(){
		//console.log(this.addedMarker.position);
		this.newObj.position = this.addedMarker.position;
		this.geocoder.geocode({'location': this.addedMarker.position}, (results, status)=> {
			if (status === 'OK') {
				console.log(results[0].formatted_address)
				if (results[0]) {
					this.newObj.location = results[0].formatted_address;
					this.userSettings = {
						"inputString": this.newObj.location
					}
				} else {
					window.alert('No results found');
				}
			} else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
		//this.updateContact();
		
	}
	
}
