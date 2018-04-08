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
  selector: 'app-sandbox2',
  templateUrl: './sandbox2.component.html',
  styleUrls: ['./sandbox2.component.css']
})
export class Sandbox2Component implements OnInit {
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
		this.nameInputbutton= true;
		this.editBtn = false;
		this.curContactObj = new CONTACT();
    	
		this.curContactObj = {
			_id: "21312",
		  name: "demo user",
		  location: "demo location",
		  position: {
		    lat: 12,
		    lng: 12
		  },
		  categoryID: "23123",
		  userID: "243234",
		  notes: [{
		    date: "demo label",
		    note: "demo note"
		  }],
		  createdAt: "12312",
		  updatedAt: "123123",
		  createdDate: new Date(),
		  updatedDate: new Date()
		}
		
		this.myForm = this.fb.group({
			name: new FormControl({value: this.curContactObj.name, disabled: true}),
			items: this.fb.array([]),
			location: new FormControl({value: this.curContactObj.location, disabled: true}),
		});
		this.setNotes(this.curContactObj.notes);
		this.myForm.controls['items'].disable();
		
    
	}
	setNotes(notes: NOTE[]) {
    	const notesFGs = notes.map(address => this.fb.group(address));
    	const notesFormArray = this.fb.array(notesFGs);
		this.myForm.setControl('items', notesFormArray);
	}
	initItemRows() {
        return this.fb.group({
			date: [''],
			note: ['']
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
	toggleEditBtn(){
		console.log("sdasd")
		this.editBtn = !this.editBtn;
		if(this.editBtn){
			this.myForm.controls['name'].enable();
			this.myForm.controls['location'].enable();
			this.myForm.controls['items'].enable();
			this.myForm.controls['items'].enable();
		}
		else{
			this.myForm.controls['name'].disable();
			this.myForm.controls['location'].disable();
			this.myForm.controls['items'].disable();
			this.myForm.controls['items'].disable();
			
		}
	}
	submit(){

	}
	
}