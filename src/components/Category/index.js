import React from 'react';
import EventList from '../EventList';
import './index.css';

const Category = ({ selection, category }) => {
	return (
		<div className='row'>
			{/* SELECTION PROP : TO IDENTIFY SELECTED CATEGORY AND EVENTS */}
			<EventList selection={selection} category={category} />
		</div>
	);
};

export default Category;
