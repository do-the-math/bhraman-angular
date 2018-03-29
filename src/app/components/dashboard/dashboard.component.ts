import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { USER } from '../../models/userBO';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	user: USER;
	sideToggle = ''
	clicked = false;
	
	constructor(  private authService: AuthService,
				  private router: Router) { }

	ngOnInit() {
		this.user = new USER();
		this.sideToggle = 'home';
		this.authService.getProfile().subscribe(profile => {
		  this.user = profile.user;
		  console.log("dashboard "+this.user.name)
		},
		err => {
			console.log(err);
			return false;
		});
	}
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
