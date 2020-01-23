import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import "./collapsible.scss";

export default class Collapsible extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    trigger: PropTypes.node,
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
    this.state = {
      isOpen: props.isOpen
    };
    this.innerRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.trigger) {
      return { isOpen: props.isOpen };
    }
    return null;
  }

  componentDidMount() {
    this.forceUpdate();
  }

  toggleHandler = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  renderChild = () => {
    if (this.props.renderChild) {
      return this.props.children;
    }
    return null;
  };

  get style() {
    let style = { height: 0 };
    if (this.state.isOpen && this.innerRef.current) {
      style = { height: this.innerRef.current.scrollHeight };
    }
    if (this.state.isOpen && !this.innerRef.current) {
      style = { height: "auto" };
    }
    return style;
  }

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
          style={this.style}
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
