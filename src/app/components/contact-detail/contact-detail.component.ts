import { Component, OnInit, ViewChild } from '@angular/core';
import { CONTACT } from '../../models/contactBO';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
	@ViewChild('gmap') gmapElement: any;
	map: google.maps.Map;
	geocoder;
	userSettings: any;
	myNoteDate: string = "" ;
	myNoteText: string = "";
	showInp:boolean = true;

	contactID: string;
	myNotes:any=[];
	tmpObj: CONTACT;

	addedMarker:any;
	nameInputbutton: boolean = true;
	
    constructor(private route: ActivatedRoute,
				private CategoryService: CategoryService,
				private ContactService: ContactService) {}
    
    ngOnInit() {
		this.nameInputbutton= true;
    	this.tmpObj = new CONTACT();
		this.contactID = (this.route.snapshot.paramMap.get('contactID'));
		this.getContact();
		this.userSettings = {
			"inputString":"Bangalore,karnataka"
			
		}
		
		// var mapProp = {
		// 	center: new google.maps.LatLng(17.385044, 78.4877),
		// 	zoom: 13,
		// 	mapTypeId: google.maps.MapTypeId.ROADMAP
		// };
		// this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
		//this.myMarker = navigator.geolocation.getCurrentPosition((position) => {});	
		
		this.geocoder = new google.maps.Geocoder;
		
		// google.maps.event.addListener(this.map, 'click', (event)=>{
		//    this.placeMarker(event);
		// });
    }

	toggleInput(){
		this.nameInputbutton = !this.nameInputbutton;
	}
	getContact(){
		console.log("Contact Added from Component");
		this.ContactService.fetchContactById(this.contactID)
			.subscribe(
				data => {
					this.tmpObj = data[0] as CONTACT;
					//this.myNotes = this.tmpObj.notes;
					this.userSettings = {
						"inputString": this.tmpObj.location
						/* ,"showSearchButton": false */
					}
					var myPos = new google.maps.LatLng(this.tmpObj.position.lat, this.tmpObj.position.lng)
					var mapProp = {
						center: myPos,
						zoom: 13,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
					
					this.addedMarker = new google.maps.Marker({
							position: myPos,
							map: this.map,
							title: this.tmpObj.name,
							draggable: true
					});
					this.addedMarker.addListener('position_changed', (event)=>{
						//console.log("position_changed");
						this.userSettings = {
							"inputString": this.tmpObj.location
						}
					});
					console.log(data[0].notes);
				},
				error => alert(error),
				()=> console.log("done")
			);
    }
	updateContact(){
		console.log("Contact Updated from Component");
		
		this.ContactService.updateContactById(this.tmpObj._id, this.tmpObj)
			.subscribe(
				data => {
					console.log("updated contact");
					console.log(data)
				},
				error => alert(error),
				()=> console.log("done")
			); 
    }
	saveField(){
		if(this.myNoteDate.length>0 && this.myNoteText.length>0){
			this.tmpObj.notes.push({
				date: this.myNoteDate,
				note: this.myNoteText
			});
			console.log(this.tmpObj.notes)
			this.updateContact();
			this.myNoteDate = "";
			this.myNoteText = "";
		}else{
			console.log("Enter Some Notes")
		}
	}
	saveLocation(){
		this.tmpObj.position = this.addedMarker.position;
		this.geocoder.geocode({'location': this.addedMarker.position}, (results, status)=> {
			if (status === 'OK') {
				console.log(results[0].formatted_address)
				if (results[0]) {
					this.tmpObj.location = results[0].formatted_address;
					this.userSettings = {
						"inputString": this.tmpObj.location
					}
				} else {
					window.alert('No results found');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}
        });
		this.updateContact();
	}
	autoCompleteCallback1(selectedData:any) {
		console.log(selectedData);
		
		this.tmpObj.position= selectedData.data.geometry.location;
		this.tmpObj.location = selectedData.data.formatted_address;
		this.userSettings = {
						"inputString": this.tmpObj.location
					}
		let location = new google.maps.LatLng(this.tmpObj.position.lat, this.tmpObj.position.lng);
		this.map.panTo(location);
		
		this.addedMarker.setMap(null);
		this.addedMarker = 	new google.maps.Marker({
								position: this.tmpObj.position,
								map: this.map,
								title: this.tmpObj.name,
								draggable: true
							});
		this.addedMarker.addListener('position_changed', (event)=>{
						//console.log("position_changed");
						this.userSettings = {
							"inputString": this.tmpObj.location
						}
					});
		
	}
}
