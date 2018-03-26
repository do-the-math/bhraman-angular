import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import 'rxjs/add/operator/map'

import { CATEGORY } from '../models/categoryBO';
import { GlobalVariable } from '../services/general.js';


@Injectable()
export class CategoryService {
	isDev: any;
	
	constructor(private http: Http) { }
	
	//Category Services
	fetchCategoryAll() : Observable<CATEGORY[]> {
		console.log('category fetched from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get(GlobalVariable.BASE_API_URL+'/category/', {headers: headers})
			.map(res => res.json())
	}
	fetchCategoryById(id: any) : Observable<CATEGORY> {
		console.log('perticular category fetched from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get(GlobalVariable.BASE_API_URL+'/category/'+id, {headers: headers})
			.map(res => res.json())
	}
	addCategory(newCategory: CATEGORY){
		console.log('category added from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(GlobalVariable.BASE_API_URL+'/category/', newCategory, {headers: headers})
			.map(res => res.json())
	}
	updateCategoryById(id: any, updatedCategory: CATEGORY){
		console.log('category updated from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.patch(GlobalVariable.BASE_API_URL+'/category/'+id, updatedCategory, {headers: headers})
			.map(res => res.json())
	}
	deleteCategoryById(id: string){
		console.log('category deleted from service');
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.delete(GlobalVariable.BASE_API_URL+'/category/'+id, {headers: headers})
			.map(res => res.json())
	}

}
