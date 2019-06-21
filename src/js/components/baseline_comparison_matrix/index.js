import React, { Component } from "react";
import PropTypes from "prop-types";

import BaselineComparisonTable from "./baseline_comparison_table";
import SectionHeader from "../section_header";
import "./baseline_comparison_matrix.scss";

/**
 * @class BaselineComparisonMatrix
 *
 * @classdesc Renders baseline comparison matrix with competitors
 */
export default class BaselineComparisonMatrix extends Component {
  render() {
    const {
      report: { competitors = [], ...report }
    } = this.props;
    const reports = [report, ...competitors];
    return (
      <div className="baseline-comparison-matrix">
        <SectionHeader title="Baseline Comparison Matrix" />
        <BaselineComparisonTable reports={reports} />
      </div>
    );
  }
}

BaselineComparisonMatrix.propTypes = {
  report: PropTypes.object.isRequired
};
