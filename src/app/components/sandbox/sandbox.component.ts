import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { CategoryService } from '../../services/category.service';
import { ContactService } from '../../services/contact.service';
import { CONTACT } from '../../models/contactBO';
import { CATEGORY } from '../../models/categoryBO';
import { ActivatedRoute } from '@angular/router';
import { SelectControlValueAccessor } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { USER } from '../../models/userBO';


@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit {
	@ViewChild('gmap') gmapElement: any;	

	map: google.maps.Map;
	// My place on map
	myOriginalPosition: any;
	myOriginalMarker: google.maps.Marker;
	myCurrentPosition = {
		latitude: 0,
		longitude: 0
	};
	myCurrentMarker: google.maps.Marker;

	myCircleRadius: number;
	myCircle: google.maps.Circle;
	zoomLevel: number=14;
	markerList: any[];
	contactList: CONTACT[];
	filteredContactListByCategory: CONTACT[];
	searchContactList: CONTACT[];
	categoryList: CATEGORY[];

	optionSelected: string[];
	infowindow_open:any = null;
	user: USER;

	// marker color
	colorMap : Map<string, string>;
	CSS_COLOR_NAMES = [
		
		
		"yellow", "pink", "green", "blue", "orange", "brown", "lavender", "navy", "violet",
		"#ff0000", //youtube
		"#6dc993", //instagram
		"#6e5494", //github
		"#3b5998", //facebook
		"#00a9cd", //linkedin
		"#6dc5dd", //twitter
		
	]



	constructor(
		private route: ActivatedRoute, 
		private CategoryService: CategoryService,
		private ContactService: ContactService,
		private authService: AuthService) {
			this.route.params.subscribe( params => console.log(params) );
			this.myCircleRadius = 1000; // 1km
		}

	ngOnInit() { 
		this.user = new USER();
		this.optionSelected = [];
		this.myCircleRadius = 1000; // 1km
		this.infowindow_open = null;
		this.markerList = []
		this.colorMap = new Map<string, string>();
		this.setZoomLevel();
		var mapProp = {
			center: new google.maps.LatLng(17.385044, 78.4877),
			zoom: this.getZoomLevel(),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		};
			
		// this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
		
		// // service call
		// this.authService.getProfile().subscribe(profile => {
		// 		this.user = profile.user;
		// 		this.getCategory(this.user);
		// 	},
		// 	err => {
		// 		console.log(err);
		// 		return false;
		// });
	}
	getCategory(user: USER){
		console.log('Categories Fetched from Component');
		
		this.CategoryService.fetchCategoryAll(user._id)
			.subscribe(
				data => {
					this.categoryList = data;
					for(var s=0; s< this.categoryList.length;s++){
						this.categoryList[s].color = this.CSS_COLOR_NAMES[s];
						this.colorMap.set(this.categoryList[s]._id, this.CSS_COLOR_NAMES[s]);
						this.optionSelected.push(this.categoryList[s]._id);
					}	
					this.getContact(this.user);
									
				},
				error => {},
				()=> console.log("done")
			); 
	}
	getContact(user: USER){
		console.log("Contacts Fetched from Component");
		
		this.ContactService.fetchContactAll(user._id)
			.subscribe(
				data => {
					this.contactList = data;
					this.filteredContactListByCategory = data;
					this.displayMapOne();
				},
				error => { },
				()=> console.log("done")
			);
    }
	chooseCat(catID){
		console.log("chooseCat");

		var idx = this.optionSelected.indexOf(catID);
		if(idx > -1){
			this.optionSelected.splice(idx, 1);
			
		} else {
			this.optionSelected.push(catID);
		}
		this.filterContacts();
		this.onOptionChange();
	}
	getZoomLevel(){
		return this.zoomLevel;
	}
	setZoomLevel(){
		if(window.screen.width>700){
			this.zoomLevel = 15;
		}
	}
	getRadius(){
		return this.myCircleRadius;
	}
	setRadius(val: number){
		this.myCircleRadius = val;
	}

	clearMap(option: string){
		for (var i = 0; i < this.markerList.length; i++) {
          this.markerList[i].setMap(null);
        }
        if(option=="all"){
			this.myCircle.setMap(null);
		}
	}

	clearaOptions(){
		this.clearMap("");
		this.optionSelected = [];
	}
	drawCircleOnMap(position){
		console.log("drawCircleOnMap");

		this.myCurrentPosition = position.coords;
		this.myOriginalPosition = position.coords;
		let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		this.map.panTo(location);
		
		var circle = new google.maps.Circle({
			center: location,
			map: this.map,
			radius: this.getRadius(), 
			fillColor: '#00628B',
			fillOpacity: 0.2,
			strokeColor: "#FFF",
			strokeWeight: 0
		});
		this.myCircle = circle;

		this.myCurrentMarker = new google.maps.Marker({
			position: location,
			map: this.map,
			title: 'You are Here!'
		});
		this.findNearByContacts();
	}

	filterContacts(){
		console.log("filter contact");

		this.filteredContactListByCategory = this.contactList.filter(contact => {
				for(var s=0;s<this.optionSelected.length;s++){
					if(contact.categoryID === this.optionSelected[s]) {
						//console.log(s);
						return true;
					}
				}
			});
			//console.log(this.filteredContactListByCategory)
	}
	getFilteredContacts(){
		return this.filteredContactListByCategory;
	}
	displayMapOne(){	
		console.log("display Map One");

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				console.log("curr location found")
				this.drawCircleOnMap(position);
			}, (err) => {
				console.log(err);
			});
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	}

	onOptionChange(){
		console.log("onOptionChange");

		this.clearMap("marker");
		this.findNearByContacts();
	}

	findNearByContacts() {
		console.log("findNearByContacts");

		var searchContactList = this.getFilteredContacts()
		searchContactList.forEach(contact => {
			var dist = this.findDistance(
										this.myCurrentPosition.latitude, 
										this.myCurrentPosition.longitude,
										contact.position.lat, 
										contact.position.lng);
			console.log(dist)
			if (dist*1000 < this.getRadius()) {
				this.showContactInMap(contact);
			}
		});
	}

	showContactInMap(contact: CONTACT) {
		console.log("showContactInMap");

		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(contact.position.lat, 
											contact.position.lng),
			map: this.map,
			title: contact.name,
			icon: this.pinSymbol(this.colorMap.get(contact.categoryID))
		});

		var infoWindowContent = this.InfoWinContent(contact)
		marker.addListener('click',(tmp)=>{
			if( this.infowindow_open ) {
			   this.infowindow_open.close();
			}
			var myInfowindow = new google.maps.InfoWindow({ content: infoWindowContent });
			this.infowindow_open = myInfowindow;
			myInfowindow.open(this.map, marker);
	    });
		this.markerList.push(marker);
	}

	findDistance(lat1, lon1, lat2, lon2, unit="K") {
		var radlat1 = Math.PI * lat1/180
		var radlat2 = Math.PI * lat2/180
		var theta = lon1-lon2
		var radtheta = Math.PI * theta/180
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist)
		dist = dist * 180/Math.PI
		dist = dist * 60 * 1.1515
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist
	}
	
	InfoWinContent(obj: CONTACT){
		var listContent = ""
		for(var t=0;t<obj.notes.length;t++){
			listContent  = listContent + "<li style='word-wrap: break-word; padding-top: 7px'>" + "<b>"+obj.notes[t].date+":</b> " + obj.notes[t].note  +"</li>"
		}
		var infoWindowContent = "<div style='width: 300px' >"+
									"<h2 class='firstHeading'><b>Name:</b> " + obj.name + "</h2>"+
									"<hr>"+
									"<h2> Notes: </h2>"+
									"<ol style='padding-left:20px'>"+
										listContent+
									"</ol>"+
								"</div>"
								// "<a href='#addNotes' data-toggle='modal' class='delete btn btn-danger btn-xs'"+
								// 	"passId("+obj._id+")> Add </a>"
		
		return infoWindowContent;
	}
	pinSymbol(color="blue") {
		return {
			//path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
			path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
			fillColor: color,
			fillOpacity: 1,
			strokeColor: '#000',
			strokeWeight: 2,
			scale: 1
		};
	}
}


