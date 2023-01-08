// FUNCTION TO CHECK TIME OVERLAP OF EVENTS
export const eventTimeCheck = (event1, event2) => {
	console.log('Time Overlap Check - ', event1, ' and ', event2);
	let start1 = new Date(event1.start_time);
	let start2 = new Date(event2.start_time);

	let end1 = new Date(event1.end_time);
	let end2 = new Date(event2.end_time);
	if (start2.getTime() < start1.getTime()) {
		if (end2.getTime() <= start1.getTime()) return false;
		else return true;
	} else if (start2.getTime() >= end1.getTime()) {
		return false;
	} else return true;
};

// DISPLAY TIME FROM DATE IN HH:MM FORMAT
export const extractDate = dateStr => {
	return new Date(dateStr).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});
};
