import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import TutorialModal from "../tutorial_modal";
import img_apartments from "../../../images/tutorial_images/apartments.png";
import img_portfolio_analysis from "../../../images/tutorial_images/portfolio_analysis.png";
import img_invite_users from "../../../images/tutorial_images/invite_users.png";

const getTutorials = url => [
  {
    image_url: `${url}${img_apartments}`,
    caption:
      "Keep tabs on all of your properties and how they’re performing towards their goals."
  },
  {
    image_url: `${url}${img_portfolio_analysis}`,
    caption:
      "Have a bird's eye view on performance across your entire portfolio."
  },
  {
    image_url: `${url}${img_invite_users}`,
    caption:
      "Invite members in your organization to stay up to date and collaborate across properties."
  }
];

class TutorialView extends React.PureComponent {
  static propTypes = {
    static_url: PropTypes.string,
    is_show_tutorial: PropTypes.bool
  };

  static defaultProps = {
    static_url: "/",
    is_show_tutorial: false
  };

  constructor(props) {
    super(props);
    props.dispatch({
      type: "API_TUTORIAL"
    });
  }

  onClose = () => {
    this.props.dispatch({
      type: "API_TUTORIAL",
      data: { is_show_tutorial: false }
    });
  };

  render() {
    const { static_url, is_show_tutorial } = this.props;
    return (
      <TutorialModal
        title="Quickstart"
        tutorials={getTutorials(static_url)}
        open={is_show_tutorial}
        onClose={this.onClose}
        onFinish={this.onClose}
      />
    );
  }
}

export default connect(x => x.tutorialView)(TutorialView);
