

export class CONTACT {
	_id: string;
	name: string;
	userID: string;
	categoryID: string;
	notes: [{
			date: string;
			note: string;
	}];
	location: string;
	position: {
		lat: number;
		lng: number;
	}

	constructor(){
		this._id = "";
		this.userID = "";
		this.name = null;
		this.categoryID = "";
		this.notes = [{
			date: "",
			note: ""
		}];
		this.location = null;
		this.position = {	
			lat: 0.0,
			lng: 0.0
		}
		this.notes.splice(0, 1);
	}
}
