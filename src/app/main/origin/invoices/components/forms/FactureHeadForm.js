import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../tabs/Header';


function FactureHeadForm(props) {

	const { tabValue, setFormRef } = props;

	return (
			tabValue === 0 && (
				<div>
				<Header setFormRef={setFormRef}/>
				
				</div>
			)
	)
}

export default withRouter(FactureHeadForm);
