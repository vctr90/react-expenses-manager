import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import SignIn from './SignIn/SignIn';
import { Col, Container, Row } from 'react-bootstrap';
import './Lobby.scss';

function Lobby({ user }) {
  const isThereAnyUser = () => user && user.email;
  const history = useHistory();

  return (
    <Container className='Lobby'>
      {
        !isThereAnyUser() ?
          <React.Fragment>
            <SignIn />
            <Row>
              <Col xs={12}>
                <Link className='btn btn-primary btn-block vertical-standard-space' to='/sign-up'>Sign up</Link>
              </Col>
            </Row>
          </React.Fragment>
          : <Redirect to={{ pathname: '/dashboard' }} />
      }
    </Container>
  )
}

const mapStateToProps = state => ({
  user: state.userManager.user
});

export default connect(mapStateToProps)(Lobby);