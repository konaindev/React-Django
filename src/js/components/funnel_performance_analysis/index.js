import React from "react";
import { string, number, object, array, arrayOf, shape } from "prop-types";

import "./funnel_performance_analysis.scss";
import processData from "./data_processor";
import Container from "../container";
import SectionHeader from "../section_header";

export function FunnelPerformanceAnalysis({ funnelHistory }) {
  processData(funnelHistory);

  return (
    <Container className="funnel-performance-analysis">
      <SectionHeader title="Funnel Performance Analysis" />
    </Container>
  );
}

FunnelPerformanceAnalysis.propTypes = {
  funnelHistory: arrayOf(
    shape({
      month: string,
      monthly_volumes: shape({
        usv: number,
        inq: number,
        tou: number,
        app: number,
        exe: number
      }).isRequired,
      weekly_volumes: shape({
        usv_inq: array,
        inq_tou: array,
        tou_app: array,
        app_exe: array,
        usv_exe: array
      }).isRequired,
      monthly_conversions: shape({
        usv: number,
        inq: number,
        tou: number,
        app: number,
        exe: number
      }).isRequired,
      weekly_conversions: shape({
        usv_inq: array,
        inq_tou: array,
        tou_app: array,
        app_exe: array,
        usv_exe: array
      }).isRequired,
      monthly_costs: object,
      weekly_costs: object
    })
  ).isRequired
};

export default FunnelPerformanceAnalysis;
