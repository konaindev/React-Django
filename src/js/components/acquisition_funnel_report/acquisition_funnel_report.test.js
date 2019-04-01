import { AcquisitionFunnelReport } from "./index";
import { PERFORMANCE_REPORT, BASELINE_REPORT } from "./props";

describe("AcquisitionFunnelReport", () => {
  it('renders baseline', () => {
    shallow(<AcquisitionFunnelReport {...BASELINE_REPORT} />);
  });

  it('renders performance', () => {
    shallow(<AcquisitionFunnelReport {...PERFORMANCE_REPORT} />);
  });
});
