import { Component, EventEmitter, Input, OnInit, Output,ViewChild } from '@angular/core'
import { } from '@types/googlemaps';
import { CategoryService } from '../../services/category.service';
import { ContactService } from '../../services/contact.service';
import { CONTACT } from '../../models/contactBO';
import { CATEGORY } from '../../models/categoryBO';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { USER } from '../../models/userBO';
import {Location} from '@angular/common';

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
	user: USER;
	curContactMarker:any;
	nameInputbutton: boolean = true;
	showInp: boolean;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private CategoryService: CategoryService,
		private ContactService: ContactService,
		private authService: AuthService,
		private _location: Location
	) {
		this.userSettings = {
			"inputString": "Getting Position..."
		}
	}
  
	ngOnInit() {
		this.nameInputbutton= true;
		this.curContactObj = new CONTACT();
		this.user = new USER();
		this.contactID = (this.route.snapshot.paramMap.get('contactID'));

		this.getContact(this.contactID);	
		
		this.geocoder = new google.maps.Geocoder;
		this.myForm = this.fb.group({
			name: new FormControl(),
			items: ItemsFormArrayComponent.buildItems(),
			location: new FormControl()
		});
	}
  
	submit() {
	  console.log("Reactive Form submitted: ", this.myForm.value)
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
								google.maps.event.trigger(this.curContactMarker, 'click');
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
				error => {alert(error)},
				()=> console.log("done")
			);
	}
	createForm(obj: CONTACT){
		// build the form model and (initialise it)
		this.myForm = this.fb.group({
			name: obj.name,
			items: ItemsFormArrayComponent.buildItems(),
			location: obj.location
		});
	}
	
	ngOnChanges() {
		this.rebuildForm();
	}

	rebuildForm() {
		this.myForm.reset({
			name: this.curContactObj.name
		});
		//this.setAddresses(this.curContactObj.addresses);
	}

}


@Component({
	selector: 'items-array',
	template:
	`
	<fieldset>
		<h6>Items</h6>
		<div *ngIf="itemsFormArray.hasError('minSum')">
		You must buy a total sum of at least {{ itemsFormArray.getError('minSum') }}.
		</div>
		<item-control
		*ngFor="let item of itemsFormArray.controls; let i=index"
		[index]="i" [item]="item" (removed)="itemsFormArray.removeAt($event)">
		</item-control>
	</fieldset>
	<button type="button" class="btn btn-link" (click)="addItem()">Add another item</button>
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
		  ItemFormControlComponent.buildItem('aaa'),
		  ItemFormControlComponent.buildItem('')],
		  ItemsValidators.minQuantitySum(300))
	}
  }
  
  
  class ItemsValidators {
  
	static minQuantitySum(val: number) {
	  return (c: AbstractControl) => {
		let sum = c.value
		  .map(item => item.quantity)
		  .reduce((acc, cur) => acc + cur, 0 );

		if (sum < val) {
		  return { minSum: val };
		}
	  }
	}

  }
  
  
  @Component({
	selector: 'item-control',
	template:
	`
	<div class="form-group row" [formGroup]="item">
		<div class="col-sm-6">
		<label [attr.for]="'name'+index">Name</label>
		<input type="text" class="form-control" [attr.id]="'name'+index" formControlName="name">
		</div>
		<div class="col-sm-5">
		<label [attr.for]="'quantity'+index">Quantity</label>
		<input type="text" class="form-control" [attr.id]="'quantity'+index" formControlName="quantity">
		</div>
		<div class="col-sm-1 py-1">
		<button type="button" class="btn" (click)="removed.emit(index)">-</button>
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
		name: new FormControl(val, Validators.required),
		quantity: new FormControl(100)
	  })
	}
  }
  

