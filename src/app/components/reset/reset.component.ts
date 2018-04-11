import { ValidateService } from '../../services/validate.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
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
// import {  } from '';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _location: Location,
  ) {
  }

  myLink: string;
  userId: string;

  ngOnInit() {
    this.myLink = (this.route.snapshot.paramMap.get('link'));
    this.userId = this.myLink.slice(0,24)
    this.myLink = this.myLink.slice(24,this.myLink.length)
  }

  onSubmit(myForm: any){
    console.log("password reset from component");

    var obj = new USER();
    obj.password = myForm.password1;
    console.log(this.userId + " "+this.myLink );
    this.authService.resetPassword(this.userId, obj);
  }

}
