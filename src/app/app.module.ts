import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap'
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoryComponent } from './components/category/category.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { HomeComponent } from './components/home/home.component';


// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// Services
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { ValidateService } from './services/validate.service';
import { CategoryService } from './services/category.service';
import { ContactService } from './services/contact.service';
import { SandboxComponent } from './components/sandbox/sandbox.component';

const appRoutes: Routes = [ 
	{ path: 'sandbox', component: SandboxComponent }, 
	{ path: 'login', component: LoginComponent },  	
	{ path: 'register', component: RegisterComponent },  
	{ 
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
		children: [
			{path: '', redirectTo: 'home', pathMatch: 'full'},
			{ path: 'home', component: HomeComponent },
			{ path: 'category', component: CategoryComponent }, 
			{ path: 'category/contacts/:categoryID',component: ContactsComponent },
			{ path: 'category/contactdetail/:contactID', component: ContactDetailComponent }
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
    SandboxComponent
  ],
  imports: [
    BrowserModule,
	MultiselectDropdownModule,
	RouterModule.forRoot(appRoutes),
	Ng4GeoautocompleteModule.forRoot(),
	FormsModule,
	HttpModule
  ],
  providers: [  ValidateService, 
				AuthService, 
				AuthGuard,
				CategoryService,
				ContactService
			],
  bootstrap: [AppComponent]
})
export class AppModule { }
