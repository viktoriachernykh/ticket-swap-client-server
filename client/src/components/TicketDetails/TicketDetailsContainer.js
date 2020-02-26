import React, { Component } from "react";
import { connect } from "react-redux";

import { fetchComments } from "../../store/comment/actions";

import TicketDetails from "./TicketDetails";
import CommentsList from "../CommentsList/CommentsList";
import AddCommentFormContainer from "../AddComment/AddCommentFormContainer";

class TicketDetailsContainer extends Component {
  componentDidMount() {
    const currentId = Number(this.props.match.params.id);
    this.props.fetchComments(currentId);
  }

  render() {
    const currentId = Number(this.props.match.params.id);

    const currentTicket =
      // this.props.tickets &&
      this.props.tickets.find(ticket => ticket.id === currentId);

    const currentTicketEvent =
      // this.props.events &&
      this.props.events.find(event => event.id === currentTicket.eventId);

    const currentTicketAuthor =
      // this.props.users &&
      this.props.users.find(user => user.id === currentTicket.userId);

    let risk = 5;

    this.props.comments.length > 3 && (risk += 5);

    const everyTicketPrice = this.props.tickets
      .filter(ticket => ticket.eventId === currentTicket.eventId)
      .map(ticket => ticket.price);

    const avgPrice =
      everyTicketPrice.reduce((total, current) => total + current, 0) /
      everyTicketPrice.length;

    const percentageDifference = Math.floor(
      100 - (currentTicket.price * 100) / avgPrice
    );
    percentageDifference > 0
      ? (risk += percentageDifference) // if cheaper
      : percentageDifference < -10 // if more expensive
      ? (risk -= 10)
      : (risk += percentageDifference);

    const sameAuthorTickets = this.props.tickets.filter(
      ticket => ticket.userId === currentTicketAuthor.id
    );
    sameAuthorTickets.length === 1 && (risk += 10);

    // console.log(sameAuthorTickets);
    // console.log(percentageDifference);
    // console.log(avgPrice);

    console.log(currentTicket.createdAt);
    risk < 5 && (risk = 5);
    risk > 95 && (risk = 95);

    return (
      <div>
        <h2>
          Risk: We calculated that the risk of this ticket being a fraud is{" "}
          {risk}%
        </h2>
        <TicketDetails
          ticket={currentTicket}
          event={currentTicketEvent}
          author={currentTicketAuthor}
        />
        We have {this.props.comments.length} comments!
        <CommentsList comments={this.props.comments} users={this.props.users} />
        {this.props.token && <AddCommentFormContainer ticket={currentTicket} />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log("state", state);
  return {
    events: state.events,
    tickets: state.tickets,
    comments: state.comments,
    users: state.users,
    user: state.session.user,
    token: state.session.jwt
  };
}

export default connect(mapStateToProps, { fetchComments })(
  TicketDetailsContainer
);
