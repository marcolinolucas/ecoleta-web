import React from 'react';

import './styles.css';

interface Props {
	valid: boolean;
	message: string;
}

const ValidationMessage: React.FC<Props> = ({ valid, message }: Props) => {

	return (
		<div className='error-msg'>
			{!valid ? message : ''}
		</div>
	)
};

export default ValidationMessage;
