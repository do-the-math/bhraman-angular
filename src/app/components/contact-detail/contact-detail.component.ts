import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contactBO';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
	
	contactID: String;
	userSettings: any;
	myNoteDate: String = "12 may" ;
	myNoteText: String;
	myNotes:any;
	newObj = new Contact();


    constructor(private route: ActivatedRoute,
				private CategoryService: CategoryService) {}
    
    ngOnInit() {
		this.myNotes = [];
		this.contactID = (this.route.snapshot.paramMap.get('contactID'));
		this.getContact(this.contactID);
		this.userSettings = {
			"inputString":"Bangalore,karnataka"
		}
    }
	getContact(contactID: String){
		console.log("Contact Added from Component");
		this.CategoryService.fetchContactById(contactID)
			.subscribe(
				data => {
					this.newObj = data[0];
					this.userSettings = {
						"inputString": this.newObj.location
					}
					console.log(data);
				},
				error => alert(error),
				()=> console.log("done")
			);
    }

	addNote(){
		console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWW");
		console.log(this.newObj.notes);
		
		this.newObj.notes.push({
			date: this.myNoteDate,
			note: this.myNoteText
		});
		this.CategoryService.updateContactById(this.contactID, this.newObj)
			.subscribe(
				data => {
					console.log("updated contact");
					console.log(data);
				},
				error => alert(error),
				()=> console.log("done")
			); 
			
	}
    
	
	autoCompleteCallback1(selectedData:any) {
		
	}
}
