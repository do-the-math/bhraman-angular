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

		// OLD CODE | NOT NEED FOR USER SERVICE CALL
		// this.authService.getProfile().subscribe(profile => {
		//   this.user = profile.user;
		//   console.log("dashboard "+this.user.name)
		// },
		// err => {
		// 	console.log(err);
		// 	return false;
		// });
		if(this.authService.loggedIn()==false){
			console.log("YOU WERE LOGGED OUT | JWT EXPIRED")
			this.router.navigate(['/login']);
			return;
		}
		else{
			this.user = JSON.parse(this.authService.getUser())
			// console.log(JSON.parse(this.authService.getUser()));
		}

	}

	sidebarToggle(){
	  this.clicked = !this.clicked;
	}
  onLogoutClick() {
		this.authService.logout();
		this.router.navigate(['/login']);
		return false;
	}

}
