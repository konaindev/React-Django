import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { Sort } from "../../icons";
import SearchInput from "./index";
import "./search_input.scss";

class SearchWithSort extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sort: props.initialSort
    };
  }

  onSort = () => {
    let sortValue;
    if (this.state.sort === "asc") {
      sortValue = "desc";
    } else {
      sortValue = "asc";
    }
    this.props.onSort(sortValue);
    this.setState({ sort: sortValue });
  };

  render() {
    const {
      className,
      sortClass,
      theme,
      initialSort,
      onSort,
      ...props
    } = this.props;
    const classes = cn(
      "search-with-sort__button",
      `search-with-sort__button--${this.state.sort}`,
      { [`search-with-sort__button--${theme}`]: !!theme },
      sortClass
    );
    const wrapClasses = cn("search-with-sort", className);
    return (
      <div className={wrapClasses}>
        <SearchInput
          className="search-with-sort__input"
          theme={theme}
          {...props}
        />
        <Sort className={classes} onClick={this.onSort} />
      </div>
    );
  }
}

SearchWithSort.propTypes = {
  className: PropTypes.string,
  sortClass: PropTypes.string,
  initialSort: PropTypes.oneOf(["desc", "asc"]),
  theme: PropTypes.oneOf(["", "highlight", "gray"]),
  value: PropTypes.any,
  onSearch: PropTypes.func,
  onSort: PropTypes.func
};
SearchWithSort.defaultProps = {
  initialSort: "asc",
  theme: "",
  onSearch() {},
  onSort() {}
};
export { SearchWithSort };
