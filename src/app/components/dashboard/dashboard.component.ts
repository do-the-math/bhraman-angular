import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	 user: Object;
	 
	constructor(  private authService: AuthService,
				  private router: Router) { }

	ngOnInit() {
		this.authService.getProfile().subscribe(profile => {
		  this.user = profile.user;
		},
		 err => {
		   console.log(err);
		   return false;
		 });
	}

	sideToggle = "home"
	clicked = false;
	
	sidebarToggle(){
	  this.clicked = !this.clicked;
	}
    onLogoutClick() {
		this.authService.logout();
		/* this.flashMessage.show('You are logged out', {
		  cssClass: 'alert-success', timeout: 3000
		}); */
		this.router.navigate(['/login']);
		return false;
	  }

}
