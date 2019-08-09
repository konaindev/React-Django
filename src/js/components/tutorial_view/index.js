import React from "react";

import TutorialModal from "../tutorial_modal";
import { getCookie, setCookie } from "../../utils/cookies";
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

const TutorialView = ({ staticUrl }) => {
  let isOpen = true;
  const isLogin = getCookie("isLogin");
  if (isLogin) {
    isOpen = false;
  }
  const [, forceUpdate] = React.useState(true);
  const onClose = () => {
    setCookie("isLogin", true);
    forceUpdate({});
  };
  return (
    <TutorialModal
      title="Quickstart"
      tutorials={getTutorials(staticUrl)}
      open={isOpen}
      onClose={onClose}
      onFinish={onClose}
    />
  );
};

export default React.memo(TutorialView);
