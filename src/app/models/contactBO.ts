

export class CONTACT {
	_id: string;
	name: string;
	categoryID: string;
	location: string;
	notes: [{
			date: string;
			note: string;
	}];
	position: {
		lat: number;
		lng: number;
	}
}
