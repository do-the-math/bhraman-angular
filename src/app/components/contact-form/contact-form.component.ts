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
	nameInputbutton:boolean;
	categoryID: string;
	
	curContactObj: CONTACT;
	user: USER;
	curContactMarker:any;
	

    constructor(private route: ActivatedRoute,
    			private router: Router,
				private CategoryService: CategoryService,
				private ContactService: ContactService,
				private authService: AuthService,
				private _location: Location) { }
    
    ngOnInit() {
    	this.categoryID = (this.route.snapshot.paramMap.get('categoryID'));
		this.nameInputbutton = true;
    	this.curContactObj = new CONTACT();
    	this.user = new USER();
		this.geocoder = new google.maps.Geocoder;
		
		this.authService.getProfile().subscribe(profile => {
				this.user = profile.user;	
				this.createContact(this.user);			
			},
			err => {
				console.log(err);
				return false;
		});
		this.userSettings = {
						"inputString": "Enter Location"
					}
		
    }

	toggleInput(){
		if(this.curContactObj.name != null && this.curContactObj.location != null)
			this.nameInputbutton = false;
	}



	createContact(user: USER){
		this.curContactObj.userID = user._id;
		this.curContactObj.categoryID = this.categoryID;
		this.curContactObj.location = "Search Location";

		navigator.geolocation.getCurrentPosition((position) => {
			var myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var mapProp = {
				center: myPos,
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
			
			this.curContactMarker = new google.maps.Marker({
					position: myPos,
					map: this.map,
					title: this.curContactObj.name,
					draggable: true
			});
		
			this.curContactMarker.addListener('dragend', (event)=>{
				this.geocoder.geocode({'location': this.curContactMarker.position}, (results, status)=> {
					if (status === 'OK') {
						console.log(results[0].formatted_address)
						if (results[0]) {
							this.userSettings = {
								"inputString": results[0].formatted_address
							}
							this.curContactObj.location = results[0].formatted_address;
							this.curContactObj.position.lat = this.curContactMarker.position.lat();
							this.curContactObj.position.lng = this.curContactMarker.position.lng();
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

		this.ContactService.addContact(this.curContactObj)
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
	onSubmit(value: any){
		console.log("contact saved")
		console.log(this.curContactObj);
		//console.log(value);
		this.curContactObj.name = value.name;
		this.curContactObj.createdDate = new Date();
		this.curContactObj.updatedDate = new Date();

		this.addContact();
	}


	addNote(){
		if(this.myNoteDate.length>0 && this.myNoteText.length>0){
			this.curContactObj.notes.push({
				date: this.myNoteDate,
				note: this.myNoteText
			});
			console.log(this.curContactObj.notes)
			this.myNoteDate = "";
			this.myNoteText = "";
		}else{
			console.log("Enter Some Notes")
		}
	}
	removeNote(note){
		console.log("clicked");
	
		var idx = this.curContactObj.notes.indexOf(note);
		this.curContactObj.notes.splice(idx, 1);
	}

	autoCompleteCallback1(selectedData:any) {
		console.log(selectedData);
		
		this.curContactObj.position= selectedData.data.geometry.location;
		this.curContactObj.location = selectedData.data.formatted_address;
		this.userSettings = {
						"inputString": this.curContactObj.location
					}
		let location = new google.maps.LatLng(this.curContactObj.position.lat, this.curContactObj.position.lng);
		this.map.panTo(location);
		
		this.curContactMarker.setMap(null);
		this.curContactMarker = 	new google.maps.Marker({
								position: this.curContactObj.position,
								map: this.map,
								title: this.curContactObj.name,
								draggable: true
							});
	}
	backClicked() {
        this._location.back();
    }
}
