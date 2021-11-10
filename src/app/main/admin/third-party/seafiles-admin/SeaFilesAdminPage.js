import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {FusePageSimple} from '@fuse';
import IframeComponent from '@catu/components/iFrameComponent';

const styles = () => ({
    root: {
        minHeight: 'auto'
    },
    layoutRoot: {
        minHeight: 'auto'
    },
});

function SeaFilesAdminPage (props) {
    const { classes } = props;
    const url = 'https://cloud.origin.expert/settings/user';
    
    return (
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            content={
                <IframeComponent url={url} />
            }
        />
    )
}

export default withStyles(styles, {withTheme: true})(SeaFilesAdminPage);