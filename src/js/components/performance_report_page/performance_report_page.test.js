// import renderer from "react-test-renderer";
// import PerformanceReportPage from "./index";
// import props from "./props";
// import { Provider } from "react-redux";
// import { createStore } from "redux";

// describe("PerformanceReportPage", () => {
//   beforeEach(() => {
//     Math.random = jest.fn(() => "12345");
//   });

//   it("renders correctly", () => {
//     const tree = renderer
//       .create(
//         <Provider store={createStore(() => props)}>
//           <PerformanceReportPage {...props} />
//         </Provider>
//       )
//       .toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });
