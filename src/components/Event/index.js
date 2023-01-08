import React, { useContext } from 'react';
import './index.css';
import { EventContext } from '../../views/EventRegistration';
import { extractDate } from '../../utils/helper';

const Event = ({ event, selection }) => {
	// USE CONTEXT
	const { addEvent, removeEvent } = useContext(EventContext);

	return (
		<div
			className={
				event.hasConflict
					? selection
						? 'card card-blue'
						: 'card card-grey'
					: 'card card-blue'
			}>
			<div className='event-name'>{event.event_name}</div>
			<div>
				<span className='time'>{extractDate(event.start_time)}</span>
				<span style={{ fontSize: 'smaller' }}>to</span>
				<span className='time'>{extractDate(event.end_time)}</span>
			</div>
			<div>
				{selection ? (
					<button className='button remove' onClick={() => removeEvent(event)}>
						Remove
					</button>
				) : (
					<button className='button' onClick={() => addEvent(event)}>
						Select
					</button>
				)}
			</div>
		</div>
	);
};

export default Event;
