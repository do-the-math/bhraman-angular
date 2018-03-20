import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import 'rxjs/add/operator/map'

import { CONTACT } from '../models/contactBO';

@Injectable()
export class ContactService {
	isDev: any;
	
	constructor(private http: Http) { }	
	
	//Contacts Services
	fetchContactAll() : Observable<CONTACT[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://localhost:3000/contact/', {headers: headers})
			.map(res => res.json())
	}
	fetchContactByCategoryId(categoryID: string) : Observable<CONTACT[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://localhost:3000/contact/cat/'+categoryID, {headers: headers})
			.map(res => res.json())
	}
	fetchContactById(contactID: string) : Observable<CONTACT[]> {
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://localhost:3000/contact/'+contactID, {headers: headers})
			.map(res => res.json())
	}
	addContact(newContact: CONTACT){
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/contact/',newContact, {headers: headers})
			.map(res => res.json())
	}
	updateContactById(id:any, newContact: CONTACT){
		console.log("Contact Added from service");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.patch('http://localhost:3000/contact/'+id, newContact, {headers: headers})
			.map(res => res.json())
	}
	deleteContactById(id: string){
		console.log('Contact deleted from service');
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.delete('http://localhost:3000/contact/'+id, {headers: headers})
			.map(res => res.json())
	}

}
