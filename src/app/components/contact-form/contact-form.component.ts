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
		curContactObj: CONTACT;
		oriContactObj: CONTACT;
		user: USER;
		curContactMarker:any;
		nameInputbutton: boolean = true;
		showInp: boolean;
		disableSaveBtn = true;
		editBtn = false;
		display: string = 'none';
		categoryID: string;
		itemsFormArray: FormArray;
	
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
			this.nameInputbutton= true;
			this.editBtn = false;
			this.curContactObj = new CONTACT();
			this.user = new USER();
		
			this.geocoder = new google.maps.Geocoder;

			this.myForm = this.fb.group({
				name: new FormControl("" ,Validators.required),
				items: this.fb.array([]),
				location: new FormControl("" ,Validators.required),
			});

			this.userSettings = {
				"inputString": this.curContactObj.location
			}
			this.authService.getProfile().subscribe(profile => {
				this.user = profile.user;	
				this.createContact(this.user);			
			},
			err => {
				console.log(err);
				return false;
			});
	
		
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

								this.myForm.controls['location'].patchValue(results[0].formatted_address);
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
		
		addContact(obj: CONTACT){
			console.log("Contact Updated from Component");
	
			this.ContactService.addContact(obj)
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
		submit(){
			var submitContact: CONTACT = new CONTACT();
			submitContact.userID = this.user._id;
			submitContact.categoryID = this.categoryID;
			submitContact.name = this.myForm.value.name;
			submitContact.notes = this.myForm.value.items;
			submitContact.location = this.curContactObj.location;
			submitContact.position = this.curContactObj.position;
			console.log(submitContact);

			this.disableSaveBtn = true;
			this.addContact(submitContact);
		}
		
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
		//    this.myForm.controls['item'].enable();
			const control = <FormArray>this.myForm.controls['items'];
			control.push(this.initItemRows());
		}
	
		deleteRow(index: number) {
			const control = <FormArray>this.myForm.controls['items'];
			control.removeAt(index);
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