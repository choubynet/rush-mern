import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        textAlign: 'center',
        marginTop: 20
    }
}

const Footer = ({ classes }) => (
    <div className={classes.root}>
        <p>By Sébastien CHOUBRAC / Coding Academy Lyon 2020</p>
    </div>
)

export default withStyles(styles)(Footer);

