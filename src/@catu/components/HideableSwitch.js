import React from 'react';
import _ from '@lodash';
import {Switch} from '@material-ui/core';

function HideableSwitch(props) {
    const checked = props.checked;
    const hidden = props.hidden
    
    return ( hidden && <Switch {...props} checked={checked}/> )
}

export default React.memo(HideableSwitch);
