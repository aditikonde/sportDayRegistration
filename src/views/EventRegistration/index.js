import React, { useEffect, useState, createContext } from 'react';
import './index.css';
import Category from '../../components/Category';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { data } from '../../assets/data';
import { eventTimeCheck } from '../../utils/helper';
import api from '../../services/apiCall';

const EventContext = createContext();
const EventRegistration = () => {
	const maxEventsAllowed = 3;
	const [loading, setLoading] = useState(true);
	const [events, setEvents] = useState([]);
	const [selectedEvents, setSelectedEvents] = useState([]);
	const [allcategories, setAllCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const getEvents = async () => {
		// FETCH DATA FROM THE API
		// const data = await api
		// 	.fetchUsers()
		// 	.then(response => {
		// 		return response;
		// 	})
		// 	.catch(error => {
		// 		setEvents([]);
		// 		return;
		// 	});
		// setLoading(false);

		// CHECK FOR VALID DATA
		if (data) {
			let eventData = data.filter((event, idx) => {
				let startTime = new Date(event.start_time).getTime();
				let endTime = new Date(event.end_time).getTime();
				if (startTime < endTime) return event;
				else console.error('Wrong event, hence not considered - ', event);
			});
			setEvents(eventData);

			// SET UNIQUE CATEGORIES
			const categories = [
				...new Set(eventData.map(event => event.event_category)),
			].sort();
			setAllCategories(categories);
			setLoading(false);
		}
	};

	useEffect(() => {
		// called twice : heres why : https://upmostly.com/tutorials/why-is-my-useeffect-hook-running-twice-in-react#:~:text=Even%20if%20they%20have%20a,might%20pause%20or%20restart%20work

		// heres also why : https://stackoverflow.com/questions/50819162/why-is-my-function-being-called-twice-in-react
		getEvents();
	}, []);

	// FUNCTION TO ADD THE SELECTED EVENT
	const addEvent = selectedEvent => {
		// CONDITION : User can select only 3 event
		if (selectedEvents.length === maxEventsAllowed) {
			toast.error('You can select only upto 3 events!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1500,
			});
			return;
		}

		// CONDITION : If conflicting event raise toast
		if (
			selectedEvent.hasOwnProperty('hasConflict') &&
			selectedEvent.hasConflict
		) {
			toast.error('Time overlap!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1500,
			});
			return;
		}

		// CHECK IF SELECTED EVENT HAS OVERLAP WITH OTHER EVENTS AND SET EVENTS
		let newEvents = events.filter((event, idx) => {
			if (event.id !== selectedEvent.id) {
				let isConflictingEvent = eventTimeCheck(event, selectedEvent);
				if (isConflictingEvent && !event.hasConflict) {
					event.hasConflict = isConflictingEvent;
				}
				return event;
			}
		});
		setEvents(newEvents);

		// SET NEW LIST OF SELECTED EVENTS
		setSelectedEvents(oldEvents => [...oldEvents, selectedEvent]);

		// SET CATEGORIES LIST
		if (!selectedCategories.includes(selectedEvent.event_category)) {
			let newSelectedCategories = [
				...selectedCategories,
				selectedEvent.event_category,
			].sort();

			setSelectedCategories(newSelectedCategories);
		}
		console.log('Added Event - ', selectedEvent);
	};

	// FUNCTION TO REMOVE THE SELECTED EVENT
	const removeEvent = selectedEvent => {
		// REMOVE EVENT FROM LIST OF SELECTED EVENTS
		let newSelectedEvents = selectedEvents.filter(item => {
			if (item.id != selectedEvent.id) return item;
		});
		setSelectedEvents(newSelectedEvents);

		// RESET CONFLICT PROPERTY FOR THE EVENTS THAT OVERLAPPED WITH SELECTED EVENT
		events.map((item, idx) => {
			if (item.hasConflict) {
				let isConflicting = eventTimeCheck(item, selectedEvent);
				item.hasConflict = !isConflicting;
			}
		});

		// SET NEW LIST OF EVENTS
		selectedEvent.hasConflict = false;
		let newEvents = [...events, selectedEvent];
		setEvents(newEvents);

		// REMOVE CATEGORY IF NO EVENTS FOR THAT CATEGORY EXIST IN THE SELECTED LIST
		let isCategoryEvent = newSelectedEvents.filter(event => {
			if (selectedEvent.event_category === event.event_category) return event;
		});
		if (isCategoryEvent.length === 0) {
			let idx = selectedCategories.indexOf(selectedEvent.event_category);
			let newCat = selectedCategories;
			newCat.splice(idx, 1);
			setSelectedCategories(newCat);
		}

		console.log('Removed Event - ', selectedEvent);
	};

	return (
		<EventContext.Provider
			value={{ events, selectedEvents, addEvent, removeEvent }}>
			<h1>Sports Day Registration</h1>
			{allcategories.length > 0 && !loading ? (
				allcategories.map((category, idx) => {
					return <Category selection={false} key={idx} category={category} />;
				})
			) : !loading ? (
				<h2 className='no-data'>No Events to display</h2>
			) : (
				''
			)}
			{selectedCategories.length > 0 && (
				<div>
					<h1>Selected Events</h1>
					{selectedCategories.map((category, idx) => {
						return <Category selection={true} key={idx} category={category} />;
					})}
				</div>
			)}
			<ToastContainer hideProgressBar={true} />
		</EventContext.Provider>
	);
};

export { EventRegistration, EventContext };
