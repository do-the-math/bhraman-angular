import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	
	constructor( private validateService: ValidateService,
			     private authService: AuthService,
			     private router: Router,
				 private notif: NotificationsService
				) { }

	ngOnInit() {
		// if(this.authService.getUser()!=null || this.authService.getUser()!=undefined){
		// 	this.router.navigate(['/dashboard/home']);
		// 	return;
		// }
		if(this.authService.loggedIn()==true){
			console.log("YOU ARE ALREADY LOGGED IN")
			this.router.navigate(['/dashboard/home']);
			return;
		}
	}

	onSubmit(value: any) {
		const user = {
			name: value.name,
			email: value.email,
			username: value.username,
			password: value.password
		}

		// Required Fields
		if(!this.validateService.validateRegister(user)) {			
			this.notif.error(
				'Incomplete Form',
				'Please fill in all fields',
				{
					timeOut: 3000,
					showProgressBar: true,
					pauseOnHover: false,
					clickToClose: true,
					maxLength: 10,
					preventLastDuplicates: true
				}
			)
			return false;
		}

		// Validate Email
		if(!this.validateService.validateEmail(user.email)) {
			this.notif.error(
				'Invalid Email',
				'Enter a valid Email',
				{
					timeOut: 3000,
					showProgressBar: true,
					pauseOnHover: false,
					clickToClose: true,
					maxLength: 10,
					preventLastDuplicates: true
				}
			)
			return false;
		}

		// Register user
		this.authService.registerUser(user).subscribe(data => {
			if(data.success) {
				this.notif.success(
					'User Registered',
					'You may login',
					{
						timeOut: 3000,
						showProgressBar: true,
						pauseOnHover: false,
						clickToClose: true,
						maxLength: 10,
						preventLastDuplicates: true
					}
				)
				this.router.navigate(['/login']);
			} else {
				this.router.navigate(['/register']);
			}
		});
	}
}



