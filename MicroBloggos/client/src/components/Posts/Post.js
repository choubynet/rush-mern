import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deletePost } from '../../actions/postActions';

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
    },
    time: {
        marginLeft: 10,
        color: '#bbb',
        fontSize: 14
    },
    btnBlock: {
        width: '100%',
        textAlign: 'right'
    },
    btnDelete: {
        backgroundColor: '#7584ff',
        color: 'white',
        '&:hover': {
            color: '#7584ff',
            borderColor: '#7584ff',
            backgroundColor: 'white'
        }
    }
}

class Post extends Component {
    constructor (props) {
        super(props)
        
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete (){
        const postData = {
            id: this.props.post._id
        }

        this.props.deletePost(postData);
        this.forceUpdate();
	}

    render () {
        const { classes, post, auth, user } = this.props;
        let userActions = null;
        if (auth.isAuthenticated) {
            if (post.user.id === user._id) {
                userActions = (<div className={classes.btnBlock}>
                    <Button
                        size="small"
                        variant='outlined'
                        className={classes.btnDelete}
                        onClick={this.handleDelete}>
                        Delete
                    </Button>
                </div>)
            }
        }

        return (
            <Paper className={classes.paper}>
                <div
                    className={classes.avatar}
                    style={{
                        backgroundColor: `#${post.user.id.slice(post.user.id.length - 3)}`
                    }}
                />  
                <div>
                    <h3 className={classes.login}>
                        <Link to={`/profile/${post.user.id}`}>{post.user.login}</Link>
                        <span className={classes.time}>{(new Date(post.createdAt)).toLocaleString()}</span>
                    </h3>
                    {post.text}
                </div>
                { userActions }
            </Paper>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.auth.user
})

export default connect(mapStateToProps, { deletePost })(withStyles(styles)(Post));