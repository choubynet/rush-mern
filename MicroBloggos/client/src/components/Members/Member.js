import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';

const styles = {
    paper: {
        padding: 10,
        display: 'flex',
        marginTop: 10
    },
    avatar: {
        minWidth: 10,
        margin: '4px 10px 4px 4px'
    },
    login: {
        marginBottom: 5
    }
}

class Member extends Component {
    render () {
        const { classes, member } = this.props;
        return (
            <Paper className={classes.paper}>
                <div
                    className={classes.avatar}
                    style={{
                        backgroundColor: `#${member._id.slice(member._id.length - 3)}`
                    }}
                />  
                <div>
                    <h3 className={classes.login}>
                        <Link to={`/profile/${member._id}`}>{member.login}</Link>
                    </h3>
                </div>
            </Paper>
        )
    }
}

export default withStyles(styles)(Member);