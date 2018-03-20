import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import 'rxjs/add/operator/map'

import { category } from '../models/categoryBO';
import { Contact } from '../models/contactBO';

@Injectable()
export class CategoryService {
	isDev: any;
	
	constructor(private http: Http) { }
	
	//Category Services
	fetchCategoryAll() : Observable<category[]> {
		console.log('category fetched from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://172.16.0.31:3000/category/', {headers: headers})
			.map(res => res.json())
	}
	fetchCategoryById(id: any) : Observable<category> {
		console.log('perticular category fetched from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://172.16.0.31:3000/category/'+id, {headers: headers})
			.map(res => res.json())
	}
	addCategory(newCategory: category){
		console.log('category added from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://172.16.0.31:3000/category/', newCategory, {headers: headers})
			.map(res => res.json())
	}
	updateCategoryById(id: any, updatedCategory: category){
		console.log('category updated from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.patch('http://172.16.0.31:3000/category/'+id, updatedCategory, {headers: headers})
			.map(res => res.json())
	}
	deleteCategoryById(id: any){
		console.log('category deleted from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.delete('http://172.16.0.31:3000/category/'+id, {headers: headers})
			.map(res => res.json())
	}
	
	
	
	
	//Contacts Services
	fetchContactAll() : Observable<Contact[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://172.16.0.31:3000/contact/', {headers: headers})
			.map(res => res.json())
	}
	fetchContactByCategoryId(categoryID: String) : Observable<Contact[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://172.16.0.31:3000/contact/cat/'+categoryID, {headers: headers})
			.map(res => res.json())
	}
	fetchContactById(contactID: String) : Observable<Contact[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://172.16.0.31:3000/contact/'+contactID, {headers: headers})
			.map(res => res.json())
	}
	addContact(newContact: Contact){
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://172.16.0.31:3000/contact/',newContact, {headers: headers})
			.map(res => res.json())
	}
	updateContactById(id:any, newContact: Contact){
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.patch('http://172.16.0.31:3000/contact/'+id, newContact, {headers: headers})
			.map(res => res.json())
	}
	deleteContactById(id: any){
		console.log('Contact deleted from service');
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.delete('http://172.16.0.31:3000/contact/'+id, {headers: headers})
			.map(res => res.json())
	}

}
