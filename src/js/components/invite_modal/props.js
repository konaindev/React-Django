const members = [
  {
    user_id: "peep_00001",
    profile_image_url: "/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00002",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00003",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "admin"
  },
  {
    user_id: "peep_00004",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00005",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00006",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00007",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00008",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00009",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00010",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00011",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00012",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  },
  {
    user_id: "peep_00013",
    profile_image_url:
      "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
    account_name: "Remarkably Client",
    email: "client@remarkably.com",
    role: "member"
  }
];

export const props = {
  open: true,
  properties: [
    {
      property_name: "The Chalet",
      members: members
    }
  ]
};

export const multiProps = {
  open: true,
  properties: [
    {
      property_name: "Del Mar",
      members: members.slice(0, 1)
    },
    {
      property_name: "The Chalet",
      members: members.slice(1)
    }
  ]
};
