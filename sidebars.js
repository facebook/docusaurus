const sidebars = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Tutorial Basics",
      items: [
        "tutorial-basics/intro",
        "tutorial-basics/stealer-logs-overview",
        "tutorial-basics/bank-check",
        "tutorial-basics/Request ULP",
        "tutorial-basics/Inbox Requests",
        "tutorial-basics/Bullet Software",
      ],
    },
    {
      type: "category",
      label: "Carding Guides",
      items: [
        {
          type: "category",
          label: "The Carding Basics",
          items: ["tutorial-basics/bank-check"],
        },
        {
          type: "category",
          label: "Payment Gateways",
          items: ["Carding-Methods/method-intro"],
        },
        {
          type: "category",
          label: "Phone Banking Systems",
          items: [
            {
              type: "doc",
              id: "Phone-Banking-Systems/Capital One",
              label: "Capital One",
            },
            {
              type: "doc",
              id: "Phone-Banking-Systems/Wellsfargo",
              label: "Wellsfargo",
              customProps: {
                image:
                  "https://pbs.twimg.com/profile_images/1336717992831430657/HdqvXIvG_400x400.png",
              },
            },
            {
              type: "doc",
              id: "Phone-Banking-Systems/Chase",
              label: "Chase",
            },
            {
              type: "doc",
              id: "Phone-Banking-Systems/Citi Bank",
              label: "Citi Bank",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Carding Methods",
      items: [
        {
          type: "category",
          label: "➡️ Direct Access Targets",
          items: [
            "Carding-Methods/➡️ Direct Access Targets/➡️ Direct Access Targets",
          ],
        },
        {
          type: "category",
          label: "🎁💳 EGift Cards",
          items: ["Carding-Methods/🎁💳 EGift Cards/🎁💳 EGift Cards"],
        },
        {
          type: "category",
          label: "🏦 AN RN Accepted",
          items: [
            "Carding-Methods/🏦 AN RN Accepted/🏦 AN RN Accepted",
            "Carding-Methods/🏦 AN RN Accepted/APSX, LLC.",
            "Carding-Methods/🏦 AN RN Accepted/TME",
          ],
        },
        {
          type: "category",
          label: "👨‍🏭 Net-30 Sites",
          items: [
            "Carding-Methods/👨‍🏭 Net-30 Sites/👨‍🏭 Net-30 Sites",
            "Carding-Methods/👨‍🏭 Net-30 Sites/Shirtsy",
            "Carding-Methods/👨‍🏭 Net-30 Sites/Uline",
          ],
        },
        {
          type: "category",
          label: "👻 Builds",
          items: [
            "Carding-Methods/👻 Builds/👻 Builds",
            "Carding-Methods/👻 Builds/Husky Armory",
          ],
        },
        {
          type: "category",
          label: "🔗 Link and Smack",
          items: [
            "Carding-Methods/🔗 Link and Smack/🔗 Link and Smack",
            "Carding-Methods/🔗 Link and Smack/🎁 Light in The Box",
            "Carding-Methods/🔗 Link and Smack/Meta",
          ],
        },
        {
          type: "category",
          label: "🔰 Email Access Targets",
          items: [
            "Carding-Methods/🔰 Email Access Targets/🔰 Email Access Targets",
            "Carding-Methods/🔰 Email Access Targets/💲 Important Documents & Finances",
            "Carding-Methods/🔰 Email Access Targets/💳 Smacking with Payment on File",
          ],
        },
        {
          type: "category",
          label: "🎰 Gambling",
          items: [
            "Carding-Methods/🎰 Gambling/🎰 Gambling",
            "Carding-Methods/🎰 Gambling/Bookies",
            "Carding-Methods/🎰 Gambling/Sweepstake Casinos",
          ],
        },
        {
          type: "category",
          label: "🏠 AVS Enforced Sites",
          items: [
            "Carding-Methods/🏠 AVS Enforced Sites/🏠 AVS Enforced Sites",
          ],
        },
        {
          type: "category",
          label: "🏦 Bank Specific Guides",
          items: [
            "Carding-Methods/🏦 Bank Specific Guides/🏦 Bank Specific Guides",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
