import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import 'rxjs/add/operator/map'

import { CONTACT } from '../models/contactBO';
import { GlobalVariable } from '../services/general.js';

@Injectable()
export class ContactService {
	isDev: any;
	
	constructor(private http: Http) { }	
	
	//Contacts Services
	fetchContactAll() : Observable<CONTACT[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get(GlobalVariable.BASE_API_URL+'/contact/', {headers: headers})
			.map(res => res.json())
	}
	fetchContactByCategoryId(categoryID: string) : Observable<CONTACT[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get(GlobalVariable.BASE_API_URL+'/contact/cat/'+categoryID, {headers: headers})
			.map(res => res.json())
	}
	fetchContactById(contactID: string) : Observable<CONTACT[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get(GlobalVariable.BASE_API_URL+'/contact/'+contactID, {headers: headers})
			.map(res => res.json())
	}
	addContact(newContact: CONTACT){
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(GlobalVariable.BASE_API_URL+'/contact/',newContact, {headers: headers})
			.map(res => res.json())
	}
	updateContactById(id:any, newContact: CONTACT){
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.patch(GlobalVariable.BASE_API_URL+'/contact/'+id, newContact, {headers: headers})
			.map(res => res.json())
	}
	deleteContactById(id: string){
		console.log('Contact deleted from service');
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.delete(GlobalVariable.BASE_API_URL+'/contact/'+id, {headers: headers})
			.map(res => res.json())
	}

}