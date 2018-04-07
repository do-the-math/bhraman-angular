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
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit {
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
	
	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private CategoryService: CategoryService,
		private ContactService: ContactService,
		private authService: AuthService,
		private _location: Location,
	) {
		this.myForm = this.fb.group({
			name: new FormControl(),
			items: {value: ItemsFormArrayComponent.buildItems(),  disabled:true},
			location: new FormControl()
		});
	}
  
	ngOnInit() {
		this.nameInputbutton= true;
		this.editBtn = false;
		this.curContactObj = new CONTACT();
		this.user = new USER();
		this.contactID = (this.route.snapshot.paramMap.get('contactID'));
		// this.showModal = false;
		this.getContact(this.contactID);	
		
		this.geocoder = new google.maps.Geocoder;
		this.userSettings = {
			"inputString": this.curContactObj.location
		}
		
	}
	
	getContact(contactID){
		console.log("Contact fetched from Component");

		this.ContactService.fetchContactById(contactID)
			.subscribe(
				data => {
					this.curContactObj = data[0] as CONTACT;
					this.oriContactObj = data[0] as CONTACT;
					this.createForm(this.curContactObj);
					
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
					this.addListerToMarker(this.curContactMarker);
					console.log(data[0].notes);

					this.myForm.valueChanges.subscribe(newValues => {
						this.disableSaveBtn = this.valuesMatch(newValues, this.oriContactObj)
					})
				},
				error => {alert(error)},
				()=> console.log("done")
			);
	}
	addListerToMarker(marker){

		marker.addListener('dragstart', (event)=>{
			this.userSettings = {
				"inputString": this.curContactObj.location
			}
		});
		marker.addListener('dragend', (event)=>{
			this.geocoder.geocode({'location': marker.position}, (results, status)=> {
				if (status === 'OK') {
					console.log(results[0].formatted_address)
					if (results[0]) {
						this.userSettings = {
							"inputString": results[0].formatted_address
						}
						this.myForm.controls['location'].patchValue(results[0].formatted_address);

						this.curContactObj.location = results[0].formatted_address;
						this.curContactObj.position.lat = marker.position.lat();
						this.curContactObj.position.lng = marker.position.lng();				
						
					} else {
						window.alert('No results found');
					}
				} else {
					window.alert('Geocoder failed due to: ' + status);
				}
				
			});
			google.maps.event.trigger(marker, 'click');
		});
		
	}
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
			name: new FormControl({value: obj.name, disabled: false}),
			items: ItemsFormArrayComponent.buildItems(),
			location: new FormControl({value: obj.location, disabled: false}),
		});
		
		this.setNotes(this.curContactObj.notes);
	}
	toggleEditBtn(){
		console.log("sdasd")
		this.editBtn = !this.editBtn;
		// if(this.editBtn){
		// 	this.myForm.controls['name'].enable();
		// 	this.myForm.controls['location'].enable();
		// }
		// else{
		// 	this.myForm.controls['name'].disable();
		// 	this.myForm.controls['location'].disable();
		// }
	}
	setNotes(notes: NOTE[]) {
    	const notesFGs = notes.map(address => this.fb.group(address));
    	const notesFormArray = this.fb.array(notesFGs);
		this.myForm.setControl('items', notesFormArray);
	}
	updateContact(contactObj: CONTACT){
		console.log("Contact Updated from Component");
		
		this.ContactService.updateContactById(contactObj._id, contactObj)
			.subscribe(
				data => {
					console.log("updated contact");
					console.log(data);
				},
				error => {alert(error)},
				()=> console.log("done")
			); 
  }
  deleteContact(){
		console.log('Contact Deleted from Component');
		
		this.ContactService.deleteContactById(this.curContactObj._id)
			.subscribe(
				data => {
					console.log("Contact deleted and data"+data);
					this._location.back();
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

		console.log(submitContact);
		this.updateContact(submitContact);
		this.disableSaveBtn = true;
	}
	
	autoCompleteCallback1(selectedData:any) {
		console.log(selectedData);
		
		this.curContactObj.position= selectedData.data.geometry.location;
		this.curContactObj.location = selectedData.data.formatted_address;
		this.myForm.controls['location'].patchValue(this.curContactObj.location);
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
		this.addListerToMarker(this.curContactMarker);
	}
	backClicked(){
		if(this.disableSaveBtn==false){
			$('#myModal').addClass('in');
			$('#myModal').css('display','block');
			$(document.body).addClass("modal-open")
			$('body').append("<div id='my-element'class='modal-backdrop fade in'></div>")
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


@Component({
	selector: 'items-array',
	template:
	`
	<fieldset>	
		<item-control
		*ngFor="let item of itemsFormArray.controls; let i=index"
		[index]="i" [item]="item" (removed)="itemsFormArray.removeAt($event)">
		</item-control>
	</fieldset>
	<button type="button" class="btn btn-default" (click)="addItem()">Add another note</button>
	`,
	styles: [':host {display:block;}']
  })
  export class ItemsFormArrayComponent {
  
		@Input()
		public itemsFormArray: FormArray;
		
		addItem() {
			this.itemsFormArray.push(ItemFormControlComponent.buildItem(''))
		}
		
		static buildItems() {
			return new FormArray([
				ItemFormControlComponent.buildItem(''),
				ItemFormControlComponent.buildItem('')])
		}
  }
  
  
  // class ItemsValidators {
  
	// 	static minQuantitySum(val: number) {
	// 		return (c: AbstractControl) => {
	// 		let sum = c.value
	// 			.map(item => item.quantity)
	// 			.reduce((acc, cur) => acc + cur, 0 );

	// 		if (sum < val) {
	// 			return { minSum: val };
	// 		}
	// 		}
	// 	}

  // }
  
  
  @Component({
	selector: 'item-control',
	template:
	`
	<div class="form-group row" [formGroup]="item">
		<div class="col-sm-3 col-xs-12" style="padding-left:0" >
			<label [attr.for]="'date'+index"></label>
			<textarea placeholder="label" type="text" class="form-control" required [attr.id]="'date'+index" formControlName="date" style="resize:vertical;" #nam1></textarea>
	
		</div>
		<div class="col-sm-8 col-xs-11" style="padding-left:0" >
			<label [attr.for]="'note'+index"></label>
			<textarea placeholder="Note"  type="text" class="form-control" required [attr.id]="'note'+index" formControlName="note" style="resize:vertical;" #nam2></textarea>
		
		</div>
		<div class="col-sm-1 col-xs-1" style="padding:0px; height: 59px;padding-top:1em">
			<button type="button" class="btn btn-sm btn-danger" (click)="removed.emit(index)" >X</button>
		</div>
	</div>
	`
  })
  export class ItemFormControlComponent {
  
	@Input()
	public index: number;
  
	@Input()
	public item: FormGroup;
  
	@Output()
	public removed: EventEmitter<number> = new EventEmitter<number>();
  
	static buildItem(val: string) {
	  return new FormGroup({
			date: new FormControl(val, Validators.required),
			note: new FormControl(val,  Validators.required)
	  })
	}
  }
  

