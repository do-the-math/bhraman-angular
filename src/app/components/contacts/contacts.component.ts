import { Component, OnInit } from '@angular/core';
import { CONTACT } from '../../models/contactBO';
import { CATEGORY } from '../../models/categoryBO';

import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import { USER } from '../../models/userBO';
import {Location} from '@angular/common';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
	categoryID: string;
	addNewLink: string;
    contactList: CONTACT[];
	newContactName = "";
	selectedID: any;
	pageCategory: CATEGORY = new CATEGORY();
    newContactObj: CONTACT = new CONTACT();
	userSettings: any;
	
	user: USER;
	constructor(
		private route: ActivatedRoute, 
		private CategoryService: CategoryService,
        private ContactService: ContactService,
        private authService: AuthService,
        private _location: Location) {
			this.route.params.subscribe( params => console.log(params) );
		}

    ngOnInit() {
		this.categoryID = (this.route.snapshot.paramMap.get('categoryID'));
		this.addNewLink = "../../contactform/"+this.categoryID;
		console.log("passed id "+this.categoryID)
		
		this.userSettings = {
			"inputString":"Bangalore,karnataka"
		}
		this.user = new USER();
		this.authService.getProfile().subscribe(profile => {
			this.user = profile.user;
			this.getCategory(this.categoryID );
			this.getContacts(this.categoryID);
		},
		err => {
			console.log(err);
			return false;
		});
    }
	
	passContact(passedContact: CONTACT){
	  console.log("ID passed="+passedContact._id);
	  this.selectedID = passedContact._id;
	  this.newContactObj = passedContact;
	  this.userSettings = {
			"inputString": passedContact.location
		}
	}
	
	
	
	// <! SERVICES--------------------------------------------
	getCategory(categoryID: string){
		console.log("category fetched from Component");
		
		this.CategoryService.fetchCategoryById(categoryID)
			.subscribe(
				data => {
					this.pageCategory = data
					console.log(data)
				},
				error => alert(error),
				()=> console.log("done")
			);
    }
	getContacts(categoryID: string){
		console.log("Contacts fetched from Component");
		//this.contactList = CONTACTS;
		this.ContactService.fetchContactByCategoryId(this.user._id, categoryID)
			.subscribe(
				data => {
					// this.mockcategories.push(JSON.parse(JSON.stringify(data))),
					this.contactList = data
					console.log(data)
				},
				error => alert(error),
				()=> console.log("done")
			);
    }
	addContact(){
		console.log("Contact Added from Component");
		
		this.newContactObj.categoryID = this.route.snapshot.paramMap.get('categoryID');
		this.newContactObj.name = this.newContactName;
		this.newContactObj.userID = this.user._id;
		
		console.log(this.newContactObj)

		this.ContactService.addContact(this.newContactObj)
			.subscribe(
				data => {
					this.contactList.push(data.createdContact);
					console.log(data)
				},
				error => alert(error),
				()=> console.log("done")
			);

	}
	updateContact(){
		console.log("Contact Updated from Component");
		
		this.newContactObj.name = this.newContactName;
		this.newContactObj.userID = this.user._id;
		this.ContactService.updateContactById(this.newContactObj._id, this.newContactObj)
			.subscribe(
				data => {
					console.log("updated contact");
					console.log(data)
				},
				error => alert(error),
				()=> console.log("done")
			); 
    }
	deleteContact(){
		console.log('Categories Deleted from Component');
		
		console.log("ID deleted  "+this.selectedID);
		this.ContactService.deleteContactById(this.selectedID)
			.subscribe(
				data => {
					console.log("category deleted and data"+data);
					
							
					this.getContacts(this.categoryID);
				},
				error => alert(error),
				()=> console.log("done")
		); 
		
	}
	
	autoCompleteCallback1(selectedData:any) {
		console.log(selectedData);

		this.newContactObj.position= selectedData.data.geometry.location;
		this.newContactObj.location = selectedData.data.formatted_address;
	}
	backClicked() {
        this._location.back();
    }
}
