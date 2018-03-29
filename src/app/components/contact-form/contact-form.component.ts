import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import { USER } from '../../models/userBO';
import { CONTACT } from '../../models/contactBO';
import {Location} from '@angular/common';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
	@ViewChild('gmap') gmapElement: any;
	map: google.maps.Map;
	geocoder;
	userSettings: any;
	myNoteDate: string = "" ;
	myNoteText: string = "";
	showInp:boolean = true;
	categoryID: string;
	myNotes:any=[];
	tmpObj: CONTACT = new CONTACT();
	user: USER;
	addedMarker:any;
	nameInputbutton: boolean = true;
	newContactName:string;
	

    constructor(private route: ActivatedRoute,
    			private router: Router,
				private CategoryService: CategoryService,
				private ContactService: ContactService,
				private authService: AuthService,
				private _location: Location) { }
    
    ngOnInit() {
    	this.categoryID = (this.route.snapshot.paramMap.get('categoryID'));
    	this.newContactName = null;
		this.nameInputbutton= true;
    	this.tmpObj = new CONTACT();
    	this.user = new USER();
		this.geocoder = new google.maps.Geocoder;
		
		this.authService.getProfile().subscribe(profile => {
				this.user = profile.user;
				this.tmpObj.userID = this.user._id;
				this.tmpObj.categoryID = this.categoryID 
				this.tmpObj.location = null;
				this.tmpObj.name = null;
				//this.tmpObj.notes = [];
				this.tmpObj.position = {
					"lat":0,
					"lng":0
				}
				
				console.log(this.tmpObj)
			},
			err => {
				console.log(err);
				return false;
		});
		this.userSettings = {
						"inputString": "Enter Location"
					}
		this.createContact();
    }

	toggleInput(){
		if(this.tmpObj.name != null && this.tmpObj.location != null)
			this.nameInputbutton = false;
	}



	createContact(){
		navigator.geolocation.getCurrentPosition((position) => {
			var myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
		
			this.addedMarker.addListener('dragend', (event)=>{
				this.geocoder.geocode({'location': this.addedMarker.position}, (results, status)=> {
					if (status === 'OK') {
						console.log(results[0].formatted_address)
						if (results[0]) {
							this.userSettings = {
								"inputString": results[0].formatted_address
							}
							this.tmpObj.location = results[0].formatted_address;
							this.tmpObj.position.lat = this.addedMarker.position.lat();
							this.tmpObj.position.lng = this.addedMarker.position.lng();
						} else {
							window.alert('No results found');
						}
					} else {
						window.alert('Geocoder failed due to: ' + status);
					}
		        });
			});
		});
	}

	addContact(){
		console.log("Contact Updated from Component");
		
		this.tmpObj.name = this.newContactName;
		this.tmpObj.categoryID = this.categoryID
		this.ContactService.addContact(this.tmpObj)
			.subscribe(
				data => {
					console.log("added contact");
					console.log(data);
					this._location.back();
				},
				error => alert(error),
				()=> console.log("done")
			); 
    }
	saveContact(){
		console.log("contact saved")
		console.log(this.tmpObj)
		this.addContact();
	}


	addNote(){
		if(this.myNoteDate.length>0 && this.myNoteText.length>0){
			this.myNotes.push({
				date: this.myNoteDate,
				note: this.myNoteText
			});
			this.tmpObj.notes = this.myNotes;
			console.log(this.tmpObj.notes)
			this.myNoteDate = "";
			this.myNoteText = "";
		}else{
			console.log("Enter Some Notes")
		}
	}
	removeNote(note){
		console.log("clicked");
		console.log(note.note);
		var idx = this.myNotes.notes.indexOf(note);
		this.myNotes.notes.splice(idx, 1);
	}
	// saveLocation(){
	// 	this.tmpObj.position = this.addedMarker.position;
	// 	this.geocoder.geocode({'location': this.addedMarker.position}, (results, status)=> {
	// 		if (status === 'OK') {
	// 			console.log(results[0].formatted_address)
	// 			if (results[0]) {
	// 				this.tmpObj.location = results[0].formatted_address;
	// 				this.userSettings = {
	// 					"inputString": this.tmpObj.location
	// 				}
	// 				this.updateContact();
	// 			} else {
	// 				window.alert('No results found');
	// 			}
	// 		} else {
	// 			window.alert('Geocoder failed due to: ' + status);
	// 		}
 	//  });
	// }

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
	}
	backClicked() {
        this._location.back();
    }
}
