import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap'
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { FlashMessagesModule } from 'angular2-flash-messages';
import 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';

// Services
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { ValidateService } from './services/validate.service';
import { CategoryService } from './services/category.service';
import { ContactService } from './services/contact.service';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { Error404Component } from './components/error404/error404.component';

const appRoutes: Routes = [ 
	{ path: 'login', component: LoginComponent },  	
	{ path: 'register', component: RegisterComponent },  
	{ 
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
		children: [
			{path: '', redirectTo: 'home', pathMatch: 'full'},
			{ path: 'home', component: SandboxComponent },
			{ path: 'category', component: CategoryComponent }, 
			{ path: 'category/contacts/:categoryID',component: ContactsComponent },
			{ path: 'category/contactdetail/:contactID', component: ContactDetailComponent },
			{ path: 'category/contactform/:categoryID', component: ContactFormComponent },
			{ path: 'sandbox', component: SandboxComponent },
			{ path: '**', component: Error404Component }
		]
	},
	{ path: '**', redirectTo: '/login' }
];


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    CategoryComponent,
    ContactsComponent,
    ContactDetailComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SandboxComponent,
    ContactFormComponent,
    Error404Component
  ],
  imports: [
    BrowserModule,
	RouterModule.forRoot(appRoutes),
	Ng4GeoautocompleteModule.forRoot(),
	FormsModule,
	HttpModule,
	FlashMessagesModule.forRoot(),
	SimpleNotificationsModule.forRoot(),
	BrowserAnimationsModule
  ],
  providers: [  ValidateService, 
				AuthService, 
				AuthGuard,
				CategoryService,
				ContactService,
				BrowserAnimationsModule
			],
  bootstrap: [AppComponent]
})
export class AppModule { }
