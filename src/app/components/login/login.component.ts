import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { Spinner } from 'spin.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	spinner:any;
	opts: any;
	target: any;

	usernameFP: string;

	constructor(  private authService: AuthService,
			      private router: Router,
				   private notif: NotificationsService
				  ) { }

	ngOnInit() {
		if(this.authService.getUser()!=null || this.authService.getUser()!=undefined){
			this.router.navigate(['/dashboard']);
			return;
		}
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
		);
		this.opts = {
			top: "25%",
			color: '#5cb85c',
			radius: 10

		};
		this.target = document.getElementById('myloader');
	}
	
	onLogin(value: any) {
		this.spinner = new Spinner(this.opts).spin(this.target);
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
				this.spinner.stop();
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
				);
				this.spinner.stop();
			}
		});
	}

	submit(){
		// console.log("Forgot Password UserName submitted from componet "+this.usernameFP);

		this.spinner = new Spinner(this.opts).spin(this.target);
		this.authService.forgotPassword(this.usernameFP)
			.subscribe(data => {
				if(data.success) {
					// console.log("sucess");
					// console.log(data);
				} else {
					// console.log("bad");
					
				}
			});
		this.usernameFP = "";
		this.spinner.stop();
	}
}



