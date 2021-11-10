import {lightBlue, red} from '@material-ui/core/colors';
import {fuseDark} from '@fuse/fuse-colors';

const themesConfig = {
    default    : {
        palette: {
            type     : 'light',
            primary  : fuseDark,
            secondary: {
                light: lightBlue[400],
                main : lightBlue[600],
                dark : lightBlue[700]
            },
            error    : red
        },
        status : {
            danger: 'orange'
        }
    }
};

export default themesConfig;
