import moment from 'moment';

moment.updateLocale('en', {
	weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
});

class Utils {
	static sortListOfObjects(list, firstAttribute) {
		list.sort((a, b) => {
			if (a[firstAttribute].toLowerCase() < b[firstAttribute].toLowerCase()) return -1;
			if (a[firstAttribute].toLowerCase() > b[firstAttribute].toLowerCase()) return 1;
			return 0;
		});
	}

	static formatDate(dateStr) {
		const date = new Date(dateStr);
		return moment(date)
			.format('ddd, MMM Do YYYY hh:mm a');
	}

	static formatDateForDatabase(dateStr) {
		const date = new Date(dateStr);
		return moment(date)
			.format('YYYY-MM-DD HH:mm:ss');
	}
}

export default Utils;
