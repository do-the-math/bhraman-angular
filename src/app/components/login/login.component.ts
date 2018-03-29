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
	username: string;
	password: string;
	
	constructor(  private authService: AuthService,
			      private router: Router,
				  private flashMessage: FlashMessagesService,
				   private notif: NotificationsService
				  ) { }

	ngOnInit() {
		this.notif.info(
					'Enter Password',
					'You are not logged in',
					{
						timeOut: 5000,
						showProgressBar: true,
						pauseOnHover: false,
						clickToClose: false,
						maxLength: 10,
						preventLastDuplicates: true
					}
				)
	}
	
	onLoginSubmit() {
		const user = {
		  username: this.username,
		  password: this.password
		}

		this.authService.authenticateUser(user).subscribe(data => {
			if(data.success) {
				//////////
				this.authService.storeUserData(data.token, data.user);
				//this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 5000});
				this.notif.success(
					'Success',
					'You are now logged in',
					{
						timeOut: 5000,
						showProgressBar: true,
						pauseOnHover: false,
						clickToClose: false,
						maxLength: 10,
						preventLastDuplicates: true
					}
				)
				this.router.navigate(['/dashboard']);
			} else {
			  
			  this.router.navigate(['login']);
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
