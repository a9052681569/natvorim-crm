export const MONTH_NAMES = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];

export interface Month {
	name: string;
	date: string;
}

export const MONTHS: Month[] = [];

export const initMonths = (): void => {
	const today = new Date();
	let month = today.getMonth();
	let year = today.getFullYear();

	for (let i = 0; i < 12; i++) {
		if (month === 12) {
			month = 0;
			year++;
		}
		MONTHS.push({
			name: `${MONTH_NAMES[month]} ${year}`,
			date: `${month + 1 > 9 ? month + 1 : '0' + (month + 1)}.01.${year}`
		});

		month++;
	}
};
