import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from "@angular/router";
import { CategoryService } from '../../services/category.service';
import { category } from '../../models/categoryBO';
import { CATEGORIES } from '../../models/category-mock';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
	mockcategories: category[] = [];
	newCategoryName: string;
	tmp: any;
	selectedID: any;
	
	newCategoryObj: category = CATEGORIES[0];
	
	constructor(
		private CategoryService: CategoryService, 
		private router: Router
		) { }

	ngOnInit() {
		this.getCategories();
	}

	passID(passedCategory){
	  this.selectedID = passedCategory._id;
	  this.newCategoryObj = passedCategory;
	}

	
	getCategories(){
		console.log('Categories Fetched from Component');
		this.mockcategories = CATEGORIES; 
		
		
		this.CategoryService.fetchCategoryAll()
			.subscribe(
				data => {
					this.mockcategories = data
					console.log(data)
				},
				error => {/* alert(error) */},
				()=> console.log("done")
			);
	}
	addCategory() {
		console.log('Categories Added from Component');

		if(this.newCategoryName==='' || this.newCategoryName==undefined){

		}
		else{
		  this.newCategoryName=this.
		  newCategoryName.charAt(0).toUpperCase() + this.newCategoryName.slice(1).toLowerCase();
		  
		  var newObj = new category();
		  newObj.name = this.newCategoryName;
		  newObj.count = 0;
		  newObj.date = "12 May";

		  // save this on database
		  this.CategoryService.addCategory(newObj)
			.subscribe(
				data => {
					console.log("added");
					this.getCategories();
				},
				error => alert(error),
				()=> console.log("done")
			);
		} 
	}
	updateCategory(){
		this.newCategoryName=this.newCategoryName.charAt(0).toUpperCase() + this.newCategoryName.slice(1).toLowerCase();
		this.newCategoryObj.name = this.newCategoryName;
		
		this.CategoryService.updateCategoryById(this.selectedID, this.newCategoryObj)
			.subscribe(
				data => {
					console.log("updated contact");
					console.log(data)
				},
				error => alert(error),
				()=> console.log("done")
			); 
    }
	deleteCategory(){
		console.log('Categories Deleted from Component');
		console.log("ID deleted  "+this.selectedID);
		this.CategoryService.deleteCategoryById(this.selectedID)
			.subscribe(
				data => {
					console.log("category deleted and data"+data);
					this.getCategories();
				},
				error => alert(error),
				()=> console.log("done")
		); 
		
	}

	autoCompleteCallback1(selectedData:any) {
	  //do any necessery stuff.
	  console.log(selectedData);
	}
}
