import { Component, OnInit, HostListener } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from "@angular/router";
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { CATEGORY } from '../../models/categoryBO';
import { USER } from '../../models/userBO';
import {Location} from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
	mockcategories: CATEGORY[] = [];
	newCategoryName: string;
	user: USER = new USER();;
	//tmp: any;
	//selectedID: any;
	
	tmpCatObj: CATEGORY = new CATEGORY();
	
	constructor(
		private CategoryService: CategoryService, 
		private authService: AuthService,
		private router: Router,
		private _location: Location
		) { }

	ngOnInit() {
		// if(this.authService.getUser()==null || this.authService.getUser()==undefined){
		// 	this.router.navigate(['/login']);
		// 	return;
		// }
		if(this.authService.loggedIn()==false){
			console.log("YOU WERE LOGGED OUT | JWT EXPIRED")
			this.router.navigate(['/login']);
			return;
		}

		// OLD CODE | NO  NEED FOR SERVICE CALL FOR USER
		// this.authService.getProfile().subscribe(profile => {
		// 	this.user = profile.user;
		// 	console.log(this.user._id);
		// 	this.getCategories(this.user);
		// },
		// err => {
		// 	console.log(err);
		// 	return false;
		// });
		let userTmp = JSON.parse(this.authService.getUser());
		this.user = userTmp;
		this.user._id = userTmp.id;
		console.log(this.user);
		this.getCategories(this.user);
	}

	passObj(passedCategory: CATEGORY){
	  this.tmpCatObj = passedCategory;
	}

	
	getCategories(user: USER){
		console.log('Categories Fetched from Component');		

		this.CategoryService.fetchCategoryAll(this.user._id)
			.subscribe(
				data => {
					this.mockcategories = data
					// console.log(data)
				},
				error => { alert(error) },
				()=> console.log("done")
			);
	}
	addCategory() {
		// console.log('Categories Added from Component');

		if(this.newCategoryName==='' || this.newCategoryName==undefined){
			// no body
		}
		else{
		  this.newCategoryName = this.newCategoryName.charAt(0).toUpperCase() + this.newCategoryName.slice(1).toLowerCase();
		  
		  var newObj = new CATEGORY();
		  newObj.name = this.newCategoryName;
		  newObj.userID = this.user._id;
		  newObj.count = 0;
		  newObj.date = "12 May";

		  // save this on database
		  this.CategoryService.addCategory(newObj)
			.subscribe(
				data => {
					// console.log("added");
					this.getCategories(this.user);
					this.newCategoryName=""
				},
				error => alert(error),
				()=> console.log("done")
			);
		} 
	}
	updateCategory(){
		this.newCategoryName = this.newCategoryName.charAt(0).toUpperCase() + this.newCategoryName.slice(1).toLowerCase();
		this.tmpCatObj.name = this.newCategoryName;
		
		this.CategoryService.updateCategoryById(this.tmpCatObj._id, this.tmpCatObj)
			.subscribe(
				data => {
					// console.log("updated contact");
					// console.log(data);
				},
				error => alert(error),
				()=> console.log("done")
			); 
    }
	deleteCategory(){
		// console.log('Categories Deleted from Component');
		
		this.CategoryService.deleteCategoryById(this.tmpCatObj._id)
			.subscribe(
				data => {
					// console.log("category deleted and data"+data);
					this.getCategories(this.user);
				},
				error => {alert(error)},
				()=> console.log("done")
		); 
		
	}

	autoCompleteCallback1(selectedData:any) {
		//  do any necessery stuff.
		//  console.log(selectedData);
	}

	backClicked() {
        this._location.back();
	}
	// @HostListener(){}
}
