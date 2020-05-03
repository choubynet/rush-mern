import React, { Component } from 'react';

import Member from './Member';
import { getAllMembers } from '../../actions/memberActions';
import { connect } from 'react-redux';

class MembersList extends Component {

    componentDidMount() {
        this.props.getAllMembers()
    }    

    render () {
        const { list } = this.props
        const items = list && list.map(el => <Member key={el._id} member={el} />)

        return (
            <div>
                { items }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    list: state.member.list,
    loading: state.member.loading
})

export default connect(mapStateToProps, { getAllMembers })(MembersList);