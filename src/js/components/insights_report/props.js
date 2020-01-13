import { action } from "@storybook/addon-actions";

const onClose = () => {
  action("onClose")();
};

export const insights = [
  {
    date: "08/01/19 - 08/31/19",
    text:
      "Your top-to-bottom, or ‘search to lease’ funnel conversion rate has been Off Track for 4 weeks; your Number of Tours (TOU) has negatively impacted it most."
  },
  {
    date: "08/01/19 - 08/31/19",
    text:
      "Your top-to-bottom, or ‘search to lease’ funnel conversion rate has been Off Track for 4 weeks; your Number of Tours (TOU) has negatively impacted it most."
  },
  {
    date: "08/01/19 - 08/31/19",
    text:
      "Your top-to-bottom, or ‘search to lease’ funnel conversion rate has been Off Track for 4 weeks; your Number of Tours (TOU) has negatively impacted it most."
  },
  {
    date: "08/01/19 - 08/31/19",
    text:
      "Your top-to-bottom, or ‘search to lease’ funnel conversion rate has been Off Track for 4 weeks; your Number of Tours (TOU) has negatively impacted it most."
  },
  {
    date: "08/01/19 - 08/31/19",
    text:
      "Your top-to-bottom, or ‘search to lease’ funnel conversion rate has been Off Track for 4 weeks; your Number of Tours (TOU) has negatively impacted it most."
  }
];

export const props = {
  insights,
  onClose
};
