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
		myForm: FormGroup;
	
		contactID: string;
		user: USER;
		curContactObj: CONTACT;
		curContactMarker:any;

		tmpContactMarker = {
			position: {
				lat: 0,
				lng: 0
			},
			location: ""
		}
		nameInputbutton: boolean = true;
		searchTyp: boolean = true;
		disableSaveBtn = true;
		
		categoryID: string;
		itemsFormArray: FormArray;
		myPos: any; 

		constructor(
			private fb: FormBuilder,
			private route: ActivatedRoute,
			private router: Router,
			private CategoryService: CategoryService,
			private ContactService: ContactService,
			private authService: AuthService,
			private _location: Location,
		) {
		}
	  
		ngOnInit() {
			this.categoryID = (this.route.snapshot.paramMap.get('categoryID'));
			this.curContactObj = new CONTACT();
			this.user = new USER();
		
			this.geocoder = new google.maps.Geocoder;

			this.myForm = this.fb.group({
				name: new FormControl("" ,Validators.required),
				items: this.fb.array([]),
				location: new FormControl("" ,Validators.required),
			});

			this.userSettings = {
				"inputString": "Search Location.."
			}

			// OLD CODE | No Need for User Service Call
			// this.authService.getProfile().subscribe(profile => {
			// 	this.user = profile.user;	
			// 	this.createContact(this.user);			
			// },
			// err => {
			// 	console.log(err);
			// 	return false;
			// });

			let userTmp = JSON.parse(this.authService.getUser());
			this.user = userTmp;
			this.user._id = userTmp.id;
			// console.log(this.user);
			this.createContact(this.user);
		}

		createContact(user: USER){
			this.curContactObj.userID = user._id;
			this.curContactObj.categoryID = this.categoryID;
			this.curContactObj.location = "Search Location";
	
			navigator.geolocation.getCurrentPosition((position) => {
				this.myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var mapProp = {
					center: this.myPos,
					zoom: 13,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
				
				this.tmpContactMarker.location = "You did not search location..";
				this.tmpContactMarker.position.lat = position.coords.latitude;
				this.tmpContactMarker.position.lng = position.coords.longitude;

				this.curContactMarker = new google.maps.Marker({
					position: this.myPos,
					map: this.map,
					title: "You are here!",
					draggable: true
				});
				this.addListerToMarker(this.curContactMarker);
			});
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

		// Contact Form Code
		createForm(obj: CONTACT){
			this.myForm = this.fb.group({
				name: new FormControl({value: this.curContactObj.name, disabled: false}),
				items: this.fb.array([]),
				location: new FormControl({value: this.curContactObj.location, disabled: false}),
			});
			this.setNotes(this.curContactObj.notes);
		}
		
		setNotes(notes: NOTE[]) {
			const notesFGs = notes.map(address => this.fb.group(address));
			const notesFormArray = this.fb.array(notesFGs);
			this.myForm.setControl('items', notesFormArray);
		}
		initItemRows() {
			return this.fb.group({
				date: new FormControl("", Validators.required),
				note: new FormControl("",  Validators.required)
			});
		}
		addNewRow() {
		   	// this.myForm.controls['item'].enable();
			const control = <FormArray>this.myForm.controls['items'];
			control.push(this.initItemRows());
		}
		getControls(frmGrp: FormGroup, key: string) {
			return (<FormArray>frmGrp.controls[key]).controls;
		}
		deleteRow(index: number) {
			const control = <FormArray>this.myForm.controls['items'];
			control.removeAt(index);
		}
		
		submit(){
			var submitContact: CONTACT = new CONTACT();
			submitContact.userID = this.user._id;
			submitContact.categoryID = this.categoryID;
			submitContact.name = this.myForm.value.name;
			submitContact.notes = this.myForm.value.items;
			submitContact.location = this.myForm.value.location;
			submitContact.position.lat = this.curContactObj.position.lat;
			submitContact.position.lng = this.curContactObj.position.lng;
			// console.log(submitContact);

			this.disableSaveBtn = true;
			this.addContact(submitContact);
		}
		addContact(obj: CONTACT){
			// console.log("Contact Updated from Component");
	
			this.ContactService.addContact(obj)
				.subscribe(
					data => {
						// console.log("added contact");
						// console.log(data);
						this._location.back();
					},
					error => alert(error),
					()=> console.log("done")
				); 
		}

		backClicked(){
			if(this.myForm.dirty || this.disableSaveBtn==false){
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