import React from "react";
import { storiesOf } from "@storybook/react";

import ReleaseNoteDetails from "./index";

const props = {
  release_note: {
    id: 1,
    title: "Release: Alderaan",
    version: "2.13.18",
    date: "2018-11-11",
    content: `## Milestones

* Onboarded our first two clients to the platform: El Cortez (Phoenix, AZ) & Meridian (Salt Lake City, UT)
* Updated the web application to the new branding
* Completed Total Addressable Market Analysis & Modeling web views

## Features

* UI Component: Market Size Map (ticket #164087086)
* UI View: Total Addressable Market (ticket #164223104)
* UI View Mod: Acquisition Funnel Re-Design (ticket #164176117)
* UI View: Modeling (ticket #164088038)
* Django Route: Load static TAM data from local file system (ticket #164127938)
* Django Route: Loading static modeling data from local file system (ticket #164127939)
* UI Component: Button Group (ticket #164182899)
* Add meaningful <title> for each page (ticket #164488236)
* UI Component: Modeling Comparison (ticket #164088130)
* UI View: Add '4-Week Average' to Acquisition Funnel, Volume of Activity (ticket #164502616)
* Rebrand Work (ticket #164549346)
* Cut DNS over to Route53 (ticket #164648812)

## Bugs

* UI View Mod: Rent to Income Ratio (ticket #164479371)
* El Cortez - Change Leasable/Occupiable Units KPI to pull most recent entry (ticket #164478795)
* El Cortez - Override Leased Units to = 113 (ticket #164478763)
* UI View Mod: Limit Map Movement (Click and Drag) Function (ticket #164479394)
* Acquisition funnel "Volume of app" primary data value and delta are mis-formatted (ticket #164559037)
* Acquisition and retention investment amounts have improperly formatted deltas (ticket #164559010)
* Campaign Investment box layout and numerical formatting is buggy (ticket #164558982)
* Campaign URL leads to a Django Error page (ticket #164590391)
* UI View Mod: Estimated Revenue Change '+' or '-' in Remarkably blue (ticket #164478961)
* UI View Mod: ROMI 'X' in Remarkably blue (ticket #164478824)
* UI View Mod: Remove '0' from Volume of Activity in Acquisition Funnel (ticket #164479154)
* LeasingPerformanceReport: Cannot read property 'end' of undefined (ticket #164503330)
* Retention Delta appears incorrect (ticket #164590434)
* 4-Week Average Figure Not Populating from Data (ticket #164586537)
* Colored negative values don't always display correctly (ticket #164556186)
* USV > EXE Formatting (ticket #164558261)
* Income to Rent Chart rounds Rents incorrectly (ticket #164613869)
`
  }
};

storiesOf("ReleaseNoteDetails", module).add("default", () => (
  <ReleaseNoteDetails {...props} />
));
