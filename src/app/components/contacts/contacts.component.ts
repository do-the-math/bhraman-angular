import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contactBO';
import { CONTACTS } from '../../models/contact-mock';
import { category } from '../../models/categoryBO';

import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
	categoryID: String;
    contactList: Contact[];
	newContactName = "";
	selectedID: any;
	pageCategory: category;
	
    newContactObj: Contact = new Contact;
	userSettings: any;
	notes = this.newContactObj.notes ;


	
	constructor(
		private route: ActivatedRoute, 
		private CategoryService: CategoryService) {
			this.route.params.subscribe( params => console.log(params) );
		}

    ngOnInit() {
		this.categoryID = (this.route.snapshot.paramMap.get('categoryID'));
		console.log("passed id "+this.categoryID)
		this.getCategory(this.categoryID );
		this.getContacts(this.categoryID);
		this.userSettings = {
			"inputString":"Bangalore,karnataka"
		}
    }
	
	passContact(passedContact){
	  console.log("ID passed="+passedContact._id);
	  this.selectedID = passedContact._id;
	  this.newContactObj = passedContact;
	  this.userSettings = {
			"inputString": passedContact.location
		}
	}
	
	
	
	// <! SERVICES--------------------------------------------
	getCategory(categoryID: any){
		console.log("Contact Added from Component");
		//this.contactList = CONTACTS;
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
	getContacts(categoryID: String){
		console.log("Contact Added from Component");
		//this.contactList = CONTACTS;
		this.CategoryService.fetchContactByCategoryId(categoryID)
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
		console.log("xxxxxxxxxx    "+this.newContactObj.name);
		
		this.CategoryService.addContact(this.newContactObj)
			.subscribe(
				data => {
					// this.mockcategories.push(JSON.parse(JSON.stringify(data))),
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
		this.CategoryService.updateContactById(this.newContactObj._id, this.newContactObj)
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
		this.CategoryService.deleteContactById(this.selectedID)
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
}
