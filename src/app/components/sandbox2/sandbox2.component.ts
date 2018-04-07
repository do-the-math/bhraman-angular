import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sandbox2',
  templateUrl: './sandbox2.component.html',
  styleUrls: ['./sandbox2.component.css']
})
export class Sandbox2Component implements OnInit {

  obj = {
    name: "aman",
    notes: [
      {
        date: "today",
        note: "now"
      },
      {
        date: "jgjhgj",
        note: "kjhkjhk"
      }
  ]
  }
  constructor() { }

  ngOnInit() {
    console.log(document.getElementById('myid'));
  }
  private count:number = 1;

phoneNumberIds:number[] = [1];

remove(i:number) {
  this.obj.notes.splice(i, 1);
}

add() {
  this.obj.notes.push({
    date: "",
    note: ""
  });
  console.log(this.obj.notes)
}

}
