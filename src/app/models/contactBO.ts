

export class Contact {
	_id: String;
	name: String;
	categoryID: String;
	location: String;
	notes: [{
			date: String;
			note: String;
	}];
	position: {
		lat: Number;
		lng: Number;
	}
}

export class Markerr
{
	position:string;
	map: string;
	title: string;
}