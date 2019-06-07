import React, { Component } from "react";
import ReactDOM from "react-dom";
import firebase from "../../Firebase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import { deleteStep } from "../../store/actions/stepActions";
import { editStep } from "../../store/actions/stepActions";

import StepEdit from "./StepEdit";

class StepsShow extends Component {
  state = {
    title: "",
    link: "",
    description: "",
    ShowEditForm: false
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.editStep(this.state); // ①createProject Actionにstateを渡す
  };

  render() {
    const { steps, auth } = this.props;

    // handle delete
    const handleDelete = id => {
      this.props.deleteStep(id);
    };

    // handle Change edit form
    const onChange = e => {
      // e.target.name.value = e.target.value;
      const state = this.state;
      state[e.target.name] = e.target.value;
      console.log(state);
      this.setState(state);
    };

    let stepCount = 0;
    const stepNodes =
      steps &&
      steps.map(step => {
        return step.overviewID === this.props.overviewID ? (
          <div>
            <ul className="timeline">
              <li>
                <label className="label">
                  STEP{stepCount + 1}
                  {(() => {
                    stepCount++;
                  })()}
                </label>

                {/* display editform or not */}
                <div className="wrapper" id={step.id}>
                  <h5>
                    {step.title}
                    {"  "}
                    {/* display link if exists */}
                    {step.link ? (
                      <a target="_blank" href={step.link}>
                        <FontAwesomeIcon icon={faLink} />
                      </a>
                    ) : null}
                  </h5>
                  <p style={{ fontSize: "0.9em" }}>{step.description}</p>
                  {step.authorID === auth.uid ? (
                    <div className="text-right">
                      {/* display edit form */}
                      <Link
                        onClick={() => StepEdit(step, onChange, this.state)}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </Link>
                      <Link
                        className="ml-3"
                        onClick={e => handleDelete(step.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </li>
            </ul>
          </div>
        ) : null;
      });
    return <div>{stepNodes}</div>;
  }
}

// project.id === comment.projectID
const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    steps: state.firestore.ordered.steps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteStep: step => dispatch(deleteStep(step)),
    editStep: step => dispatch(editStep(step))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "steps", orderBy: ["createdAt", "asc"] }])
)(StepsShow);
