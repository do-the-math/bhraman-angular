import { Component, OnInit, ViewChild } from '@angular/core';
import { CONTACT } from '../../models/contactBO';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import { USER } from '../../models/userBO';
import {Location} from '@angular/common';

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
	oldName: string = "";

	contactID: string;
	myNotes:any=[];
	tmpObj: CONTACT;

	addedMarker:any;
	nameInputbutton: boolean = true;
	
	user: USER;
    constructor(private route: ActivatedRoute,
    			private router: Router,
				private CategoryService: CategoryService,
				private ContactService: ContactService,
				private authService: AuthService,
				private _location: Location) {}
    
    ngOnInit() {
		this.nameInputbutton= true;
    	this.tmpObj = new CONTACT();
		this.contactID = (this.route.snapshot.paramMap.get('contactID'));

		this.user = new USER();
		this.authService.getProfile().subscribe(profile => {
				this.user = profile.user;
			},
			err => {
				console.log(err);
				return false;
		});
		this.getContact();
		
		
		
		// var mapProp = {
		// 	center: new google.maps.LatLng(17.385044, 78.4877),
		// 	zoom: 13,
		// 	mapTypeId: google.maps.MapTypeId.ROADMAP
		// };
		// this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
		//this.myMarker = navigator.geolocation.getCurrentPosition((position) => {});	
		
		this.geocoder = new google.maps.Geocoder;
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
					this.oldName = this.tmpObj.name;
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
					this.addedMarker.addListener('dragend', (event)=>{
						this.geocoder.geocode({'location': this.addedMarker.position}, (results, status)=> {
							if (status === 'OK') {
								console.log(results[0].formatted_address)
								if (results[0]) {
									this.userSettings = {
										"inputString":results[0].formatted_address
									}
								} else {
									window.alert('No results found');
								}
							} else {
								window.alert('Geocoder failed due to: ' + status);
							}
				        });
					});
					console.log(data[0].notes);
				},
				error => alert(error),
				()=> console.log("done")
			);
    }
	updateContact(){
		console.log("Contact Updated from Component");
		console.log(this.tmpObj.name+" "+this.oldName);
		if(this.tmpObj.name!=this.oldName){
			this.ContactService.updateContactById(this.tmpObj._id, this.tmpObj)
				.subscribe(
					data => {
						console.log("updated contact");
						console.log(data);
						this.oldName = this.tmpObj.name
					},
					error => alert(error),
					()=> console.log("done")
				); 
		}
    }
	addNote(){
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
	removeNote(note){
		console.log("clicked");
		console.log(note.note);
		var idx = this.tmpObj.notes.indexOf(note);
		this.tmpObj.notes.splice(idx, 1);
		this.updateContact();
		
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
		// this.addedMarker.addListener('position_changed', (event)=>{
		// 				this.userSettings = {
		// 					"inputString": this.tmpObj.location
		// 				}
		// });
		
	}
	backClicked() {
        this._location.back();
    }
    deleteContact(){
		console.log('Categories Deleted from Component');
		
		this.ContactService.deleteContactById(this.tmpObj._id)
			.subscribe(
				data => {
					console.log("category deleted and data"+data);
					this.router.navigate(['/dashboard/category'])
				},
				error => alert(error),
				()=> console.log("done")
		); 
		
	}
}
