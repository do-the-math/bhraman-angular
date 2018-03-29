import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	
	constructor(  private authService: AuthService,
			      private router: Router,
				   private notif: NotificationsService
				  ) { }

	ngOnInit() {
		this.notif.info(
			'Enter Password',
			'You are not logged in',
			{
				timeOut: 2000,
				showProgressBar: true,
				pauseOnHover: false,
				clickToClose: true,
				maxLength: 10,
				preventLastDuplicates: true
			}
		)	
	}
	
	onLogin(value: any) {
		const user = {
			username: value.username,
			password: value.password
		}

		this.authService.authenticateUser(user).subscribe(data => {
			if(data.success) {
				this.notif.success(
					'Success',
					'You are now logged in',
					{
						timeOut: 3000,
						showProgressBar: true,
						pauseOnHover: false,
						clickToClose: true,
						maxLength: 10,
						preventLastDuplicates: true
					}
				)
				this.authService.storeUserData(data.token, data.user);
				this.router.navigate(['/dashboard']);
			} else {
				this.notif.error(
					'Auth Failed',
					'Enter Correct Credential',
					{
						timeOut: 3000,
						showProgressBar: true,
						pauseOnHover: false,
						clickToClose: true,
						maxLength: 50
					}
				)
			}
		});
	}
}



