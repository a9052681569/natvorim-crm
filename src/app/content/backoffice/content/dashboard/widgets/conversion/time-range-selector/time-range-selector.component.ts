import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ALL_MONTHS, Month, MONTHS } from 'src/app/enums/months/months';

@Component({
	selector: 'ntv-time-range-selector',
	templateUrl: './time-range-selector.component.html',
	styleUrls: ['./time-range-selector.component.scss']
})
export class TimeRangeSelectorComponent {

	/**
	 * возможные месяцы доставки
	 */
	months: Month[] = ALL_MONTHS;

	@Input() selectedMonth: Month = MONTHS[0];

	@Output() selectionChange = new EventEmitter<Month>();

	select(month: Month): void {
		this.selectionChange.emit(month);
	}

}
