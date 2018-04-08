

export class CONTACT {
	_id: string;
	name: string;
	userID: string;
	categoryID: string;
	notes: NOTE[];
	
	location: string;
	position: {
		lat: number;
		lng: number;
	};
	createdDate: Date;
	updatedDate: Date;
	
	createdAt: any;
	updatedAt: any;

	constructor(){
		this._id = "";
		this.userID = "";
		this.name = null;
		this.categoryID = "";
		this.notes = [{
			date: "",
			note: ""
		}];
		this.location = "";
		this.position = {	
			lat: 0.0,
			lng: 0.0
		}
		this.notes.splice(0, 1);
		this.createdDate = new Date();
		this.updatedDate = new Date();
	}
}

export class NOTE{
	date: string;
	note: string;
}
