import { Component, EventEmitter, Input, OnInit, Output,ViewChild } from '@angular/core'
import { } from '@types/googlemaps';
import {Location} from '@angular/common';
import { CONTACT, NOTE } from '../../models/contactBO';
import { CATEGORY } from '../../models/categoryBO';
import { USER } from '../../models/userBO';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { ContactService } from '../../services/contact.service';
import * as $ from 'jquery';
import { Spinner } from 'spin.js';

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
	myForm: FormGroup;

	contactID: string;
	curContactObj: CONTACT;
	user: USER;
	curContactMarker:any;
	tmpContactMarker = {
		position: {
			lat: 0,
			lng: 0
		},
		location: ""
	}
	nameInputbutton: boolean = true;
	showInp: boolean;
	disableSaveBtn = true;
	editBtn = false;
	searchTyp: boolean = true;
	myPos: any;
	itemsFormArray: FormArray;
	spinner: any;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private CategoryService: CategoryService,
		private ContactService: ContactService,
		private authService: AuthService,
		private _location: Location,
	) { }
  
	ngOnInit() {
		if(this.authService.loggedIn()==false){
			console.log("YOU WERE LOGGED OUT | JWT EXPIRED")
			this.router.navigate(['/login']);
			return;
		}
		var opts = {
			top: "50%",
			color: '#5cb85c',
			radius: 20
		};
		var target = document.getElementById('myPage');
		this.spinner = new Spinner(opts).spin(target);

		this.nameInputbutton= true;
		this.editBtn = false;
		this.curContactObj = new CONTACT();
		this.user = new USER();
		this.contactID = (this.route.snapshot.paramMap.get('contactID'));
		// this.showModal = false;
		this.getContact(this.contactID);	
		
		this.geocoder = new google.maps.Geocoder;
		this.myForm = this.fb.group({
			name: new FormControl({value: "", disabled: true}),
			items: this.fb.array([]),
			location: new FormControl({value: "", disabled: true}),
		});
		this.userSettings = {
			"inputString": this.curContactObj.location
		}
		this.toggleForm('disable');
		
	}
	getContact(contactID){
		// console.log("Contact fetched from Component");

		this.ContactService.fetchContactById(contactID)
			.subscribe(
				data => {
					// console.log(data[0]);
					this.curContactObj = data[0] as CONTACT;
					this.createForm(this.curContactObj);
					this.myForm.valueChanges.subscribe(newValues => {
						this.disableSaveBtn = false;
					});
					
					// modal init
					this.userSettings = {
						"inputString": this.curContactObj.location
					}
					this.tmpContactMarker.position = this.curContactObj.position;

					// map init
					this.myPos = new google.maps.LatLng(this.curContactObj.position.lat,
														this.curContactObj.position.lng);
					var mapProp = {
						center: this.myPos,
						zoom: 13,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
					
					this.curContactMarker = new google.maps.Marker({
						position: this.myPos,
						map: this.map,
						title: this.curContactObj.name,
						draggable: true
					});
					this.addListerToMarker(this.curContactMarker);
					this.spinner.stop();
				},
				error => {alert(error)},
				()=> console.log("done")
			);
	}
	addListerToMarker(marker){
		marker.addListener('dragend', (event)=>{
			this.geocoder.geocode({'location': marker.position}, (results, status)=> {
				if (status === 'OK') {
					// console.log(results[0].formatted_address)
					if (results[0]) {
						this.userSettings = {
							"inputString": results[0].formatted_address
						}
						
						this.tmpContactMarker.location = results[0].formatted_address;
						this.tmpContactMarker.position.lat = marker.position.lat();
						this.tmpContactMarker.position.lng= marker.position.lng();
					} else {
						window.alert('No results found');
					}
				} else {
					window.alert('Geocoder failed due to: ' + status);
				}
			});
		});
	}
	

  	deleteContact(){
		// console.log('Contact Deleted from Component');
		
		this.ContactService.deleteContactById(this.curContactObj._id)
			.subscribe(
				data => {
					// console.log("Contact deleted and data"+data);
					this._location.back();
				},
				error => {alert(error)},
				()=> console.log("done")
		); 
	}
	updateContact(contactObj: CONTACT){
		// console.log("Contact Updated from Component");
		
		this.ContactService.updateContactById(contactObj._id, contactObj)
			.subscribe(
				data => {
					// console.log("updated contact");
					// console.log(data);
				},
				error => {alert(error)},
				()=> console.log("done")
			); 
  	}
  	submit(){
		var submitContact: CONTACT = new CONTACT();
		submitContact._id = this.curContactObj._id;
		submitContact.userID = this.curContactObj.userID;
		submitContact.categoryID = this.curContactObj.categoryID;
		submitContact.name = this.myForm.value.name;
		submitContact.notes = this.myForm.value.items;
		submitContact.location = this.curContactObj.location;
		submitContact.position = this.curContactObj.position;

		// console.log(submitContact);
		this.toggleForm('disable');
		this.toggleEditBtn();
		this.disableSaveBtn = true;
		this.updateContact(submitContact);
	}
	locationSelected(){
		// console.log("location selected")
		
		this.curContactObj.location = this.tmpContactMarker.location;
		this.curContactObj.position = this.tmpContactMarker.position;
		this.myForm.controls['location'].patchValue(this.tmpContactMarker.location);
		this.disableSaveBtn = false;

		// this.curContactMarker.setPosition(this.myPos);
		this.userSettings.inputString = this.tmpContactMarker.location;
		let location = new google.maps.LatLng(this.tmpContactMarker.position.lat, this.tmpContactMarker.position.lng);
		this.map.panTo(location);
	}
	mapClosed(){
		this.curContactMarker.setPosition(this.myPos);
		this.userSettings.inputString =  "search location again";
		this.map.panTo(this.myPos);
	}
	autoCompleteCallback1(selectedData:any) {
		// console.log(selectedData);

		this.tmpContactMarker.position = selectedData.data.geometry.location;
		this.tmpContactMarker.location = selectedData.data.formatted_address;
		this.userSettings = {
			"inputString": selectedData.data.formatted_address
		}	

		let location = new google.maps.LatLng(this.tmpContactMarker.position.lat, this.tmpContactMarker.position.lng);
		this.map.panTo(location);
		
		this.curContactMarker.setMap(null);
		this.curContactMarker = new google.maps.Marker({
			position: this.tmpContactMarker.position,
			map: this.map,
			title: this.curContactObj.name,
			draggable: true
		});
		this.addListerToMarker(this.curContactMarker);
	}
	get formData() { return this.myForm.get('items'); }

	latLngSubmit(value){
		// console.log(value.lng+" "+ value.lat)

		var latlng = {lat: parseFloat(value.lat), lng: parseFloat(value.lng)};
		this.geocoder.geocode({'location': latlng}, (results, status) =>{
			if (status === 'OK') {
				if (results[0]) {
					let location = new google.maps.LatLng(latlng.lat, latlng.lng);
					// this.map.panTo(location);
					
					this.curContactMarker.setMap(null);
					this.curContactMarker = new google.maps.Marker({
						position: location,
						map: this.map,
						title: this.curContactObj.name,
						draggable: true
					});
					this.addListerToMarker(this.curContactMarker);

					this.userSettings.inputString = results[0].formatted_address;
					this.tmpContactMarker.location = results[0].formatted_address;
					this.tmpContactMarker.position = latlng;
					this.map.panTo(location);

				} else {
					window.alert('No results found');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}
		});
	}


	// FORM CODE
	valuesMatch (val1,val2):boolean {
		if(val1.name == val2.name){
			if(val1.location == val2.location){
				if(val1.items.length == 0 && val2.notes.length==0){
					return true;
				}
				else if(val1.items.length == val2.notes.length){
					var flag = true;
					for(var e=0; e<val1.items.length; e++){
						if(val1.items[e].date === val2.notes[e].date &&
							val1.items[e].note === val2.notes[e].note){
								flag = true;
						}else{
							flag = false;
						}
					}
					return flag;
				}else 
					return false;
			} else{
				return false;
			}
		}
		return false;
	}
	createForm(obj: CONTACT){
		this.myForm = this.fb.group({
			name: new FormControl(this.curContactObj.name, Validators.required),
			items: this.fb.array([]),
			location: new FormControl(this.curContactObj.location, Validators.required),
		});
		this.setNotes(this.curContactObj.notes);
		this.toggleForm('disable');
	}
	
	toggleForm(val:string){
		this.myForm.controls['name'][val]();
		this.myForm.controls['location'][val]();
		this.myForm.controls['items'][val]();
	}
	toggleEditBtn(){
		// console.log("toggle Edit")
		this.editBtn = !this.editBtn;
		if(this.editBtn){
			this.toggleForm('enable');
			this.disableSaveBtn = false;
		}
		else{
			this.toggleForm('disable');			
		}
	}
	setNotes(notes: NOTE[]) {
    	const notesFGs = notes.map(address => this.fb.group(address));
    	const notesFormArray = this.fb.array(notesFGs);
		this.myForm.setControl('items', notesFormArray);
	}
	getControls(frmGrp: FormGroup, key: string) {
		return (<FormArray>frmGrp.controls[key]).controls;
	}

	initItemRows() {
        return this.fb.group({
			date: new FormControl("", Validators.required),
			note: new FormControl("",  Validators.required)
        });
	}
	addNewRow() {
	//    this.myForm.controls['item'].enable();
		const control = <FormArray>this.myForm.controls['items'];
		control.push(this.initItemRows());
		this.disableSaveBtn = false;
	}
	deleteRow(index: number) {
		const control = <FormArray>this.myForm.controls['items'];
		control.removeAt(index);
		this.disableSaveBtn = false;
	}
	backClicked(){
		if(this.myForm.invalid || this.myForm.dirty){
			// $('#myModal').addClass('in');
			// $('#myModal').css('display','block');
			$(document.body).addClass("modal-open")
			$('body').append("<div id='my-element'class='modal-backdrop fade in'></div>");

			document.getElementById('myModal').classList.add('in');
			document.getElementById('myModal').style.display = 'block'
			
		}
		else{
			this._location.back();
		}
	}
	stay(val){
		if(val=='back'){
			document.getElementById("my-element").remove();
			this._location.back();
		}
		else if(val == 'stay'){
			$('#myModal').removeClass('in');
			$('#myModal').css('display','none');
			document.getElementById("my-element").remove();
		}
	}
	
}