import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import "./collapsible.scss";

export default class Collapsible extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    trigger: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    renderChild: PropTypes.bool
  };

  static defaultProps = {
    renderChild: true,
    isOpen: false,
    className: ""
  };

  constructor(props) {
    super(props);
    let style = { height: 0 };
    if (props.isOpen) {
      style = { height: "auto" };
    }
    this.state = {
      style,
      isOpen: props.isOpen
    };
    this.innerRef = React.createRef();
  }

  componentDidMount() {
    if (this.state.isOpen) {
      this.setState({ style: { height: this.innerRef.current.scrollHeight } });
    }
  }

  toggleHandler = () => {
    let style = { height: 0 };
    if (!this.state.isOpen) {
      style = { height: this.innerRef.current.scrollHeight };
    }
    this.setState({
      isOpen: !this.state.isOpen,
      style
    });
  };

  renderChild = () => {
    if (this.props.renderChild) {
      return this.props.children;
    }
    return null;
  };

  render() {
    const { trigger, className, children } = this.props;
    const { isOpen } = this.state;
    const classes = cn("collapsible", className, {
      "collapsible--open": isOpen
    });
    return (
      <div className={classes}>
        <div className="collapsible__trigger" onClick={this.toggleHandler}>
          <div className="collapsible__trigger-content">{trigger}</div>
        </div>
        <div
          className="collapsible__content"
          style={this.state.style}
          ref={this.innerRef}
        >
          {this.renderChild()}
        </div>
      </div>
    );
  }
}

const Icon = ({ className }) => {
  const classes = cn("collapsible__icon", className);
  return <div className={classes} />;
};

Collapsible.Icon = React.memo(Icon);
