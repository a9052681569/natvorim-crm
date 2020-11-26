import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { opacityChangeAnimation } from 'src/app/shared/animations';




@Component({
  selector: 'ntv-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [opacityChangeAnimation]
})
export class SearchComponent implements OnInit {

	public searchForm: FormGroup;

	constructor(private formBuilder: FormBuilder) {
		this.searchForm = formBuilder.group({
			request: ''
		});
	}

	ngOnInit(): void {
	}
}
