import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../container";
import ButtonGroup from "../button_group";

import "./campaign_plan.scss";

/**
 * @class CampaignInvestmentReport
 *
 * @classdesc Renders all metrics and graphs related to investment
 */
export default class CampaignPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonIndex: 0
    };
  }

  onClickButton = index => {
    this.setState({ buttonIndex: index });
  };

  renderOption() {
    const options = [
      "https://imgur.com/6pa134E.png",
      "https://imgur.com/OlTT4NS.png",
      "https://imgur.com/xMhif74.png",
      "https://imgur.com/mglPaZN.png",
      "https://imgur.com/2eKTmPn.png"
    ];
    return <img src={options[this.state.buttonIndex]} />;
  }

  render() {
    const options = [
      { label: "Overview", value: 0 },
      { label: "Reputation Building", value: 1 },
      { label: "Demand Creation", value: 2 },
      { label: "Leasing Enablement", value: 3 },
      { label: "Market Intelligence", value: 4 }
    ];

    return (
      <div className="page campaign_plan-view">
        <Container>
          <div className="campaign_plan-view__subnav">
            <ButtonGroup
              onChange={this.onClickButton}
              value={this.state.buttonIndex}
              options={options}
            />
          </div>
        </Container>
        {this.renderOption()}
      </div>
    );
  }
}
