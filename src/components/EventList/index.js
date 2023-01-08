import React, { useContext } from 'react';
import './index.css';
import Event from '../Event';
import { EventContext } from '../../views/EventRegistration';

const EventList = ({ category, selection }) => {
	// USE CONTEXT
	const { events, selectedEvents } = useContext(EventContext);

	// SET EVENTLIST OF EVENTS OR SELECTED EVENTS BASED ON SELECTION PROP
	var categoryEvents = selection
		? selectedEvents.filter(event => {
				if (event.event_category === category) return event;
		  })
		: events.filter(event => {
				if (event.event_category === category) return event;
		  });

	// SORT EVENTS IN THE CATEGORY BASED ON THEIR TIMINGS
	categoryEvents = categoryEvents.sort(function (event1, event2) {
		return new Date(event1.start_time) - new Date(event2.start_time);
	});

	return (
		<div>
			<div>
				<div className='column category-name '>
					<h2 className='center'>{category}</h2>
				</div>

				<div className='column event-list'>
					<ul>
						{categoryEvents.map(event => (
							<li key={event.id} className='column event'>
								<Event selection={selection} event={event} />
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default EventList;
