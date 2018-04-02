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

	//Notes
	myNoteDate: string = "" ;
	myNoteText: string = "";

	contactID: string;
	curContactObj: CONTACT;
	user: USER;
	curContactMarker:any;
	nameInputbutton: boolean = true;
	showInp: boolean
	
    constructor(private route: ActivatedRoute,
    			private router: Router,
				private CategoryService: CategoryService,
				private ContactService: ContactService,
				private authService: AuthService,
				private _location: Location) {
			    	this.userSettings = {
									"inputString": "Getting Position..."
								}
    }
    
    ngOnInit() {
		this.nameInputbutton= true;
    	this.curContactObj = new CONTACT();
    	this.user = new USER();
		this.contactID = (this.route.snapshot.paramMap.get('contactID'));

		
		// this.authService.getProfile().subscribe(profile => {
		// 		this.user = profile.user;
		// 	},
		// 	err => {
		// 		console.log(err);
		// 		return false;
		// });
		this.getContact(this.contactID);	
		
		this.geocoder = new google.maps.Geocoder;
    }

	toggleInput(){
		this.nameInputbutton = !this.nameInputbutton;
	}
	getContact(contactID){
		console.log("Contact Added from Component");
		this.ContactService.fetchContactById(contactID)
			.subscribe(
				data => {
					this.curContactObj = data[0] as CONTACT;
					console.log(data[0])
					this.userSettings = {
						"inputString": this.curContactObj.location
					}
					var contactPos = new google.maps.LatLng(this.curContactObj.position.lat,
														this.curContactObj.position.lng);
					var mapProp = {
						center: contactPos,
						zoom: 13,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
					
					this.curContactMarker = new google.maps.Marker({
							position: contactPos,
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
										"inputString":results[0].formatted_address
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
					console.log(data[0].notes);
				},
				error => alert(error),
				()=> console.log("done")
			);
    }
	updateContact(contactObj: CONTACT){
		console.log("Contact Updated from Component");

		this.ContactService.updateContactById(contactObj._id, contactObj)
			.subscribe(
				data => {
					console.log("updated contact");
					console.log(data);
				},
				error => alert(error),
				()=> console.log("done")
			); 
    }

    onSubmit(formValue: any){
    	var submitContact: CONTACT = new CONTACT();
    	submitContact._id = this.curContactObj._id;
    	submitContact.userID = this.curContactObj.userID;
    	submitContact.categoryID = this.curContactObj.categoryID;
    	submitContact.name = this.curContactObj.name;
    	submitContact.notes = this.curContactObj.notes;
    	submitContact.location = this.curContactObj.location;
    	submitContact.position = this.curContactObj.position;

    	console.log(submitContact);
    	this.updateContact(submitContact);
    	this.toggleInput();
    }
	addNote(){
		if(this.myNoteDate.length>0 && this.myNoteText.length>0){
			this.curContactObj.notes.push({
				date: this.myNoteDate,
				note: this.myNoteText
			});
			//console.log(this.curContactObj.notes)
			this.myNoteDate = "";
			this.myNoteText = "";
		}else{
			console.log("Enter Some Notes")
		}
	}
	removeNote(note){
		console.log("removeNote");

		//console.log(note.note);
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
		this.curContactMarker = new google.maps.Marker({
								position: this.curContactObj.position,
								map: this.map,
								title: this.curContactObj.name,
								draggable: true
							});
		
	}
	backClicked() {
        this._location.back();
    }
    deleteContact(){
		console.log('Categories Deleted from Component');
		
		this.ContactService.deleteContactById(this.curContactObj._id)
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
