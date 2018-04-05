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
		
		var opts = {
			lines: 20, // The number of lines to draw
			length: 5, // The length of each line
			width: 20, // The line thickness
			radius: 25, // The radius of the inner circle
			scale: 2, // Scales overall size of the spinner
			corners: 1, // Corner roundness (0..1)
			color: 'white', // CSS color or array of colors
			fadeColor: 'transparent', // CSS color or array of colors
			opacity: 0.1, // Opacity of the lines
			rotate: 0, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			speed: 0.5, // Rounds per second
			trail: 60, // Afterglow percentage
			fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			className: 'spinner', // The CSS class to assign to the spinner
			top: '0%', // Top position relative to parent
			left: '50%', // Left position relative to parent
			position: 'absolute' // Element positioning
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
}



