import React from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

const MembershipPlans = [
  {
    title: "Basic Membership",
    price: "$10/month",
    features: [
      "Access to basic community forum",
      "10GB storage space",
      "Basic support via email",
    ],
    buttonText: "Join Now",
    buttonLink: "/membership/basic",
  },
  {
    title: "Premium Membership",
    price: "$25/month",
    features: [
      "Access to exclusive community forum",
      "50GB storage space",
      "Priority support",
      "Early access to new features",
    ],
    buttonText: "Join Now",
    buttonLink: "/membership/premium",
  },
  {
    title: "Enterprise Membership",
    price: "$100/month",
    features: [
      "Dedicated account manager",
      "Unlimited storage space",
      "Customizable features",
      "24/7 support",
    ],
    buttonText: "Contact Us",
    buttonLink: "/contact",
  },
];

function MembershipPlan({ title, price, features, buttonText, buttonLink }) {
  return (
    <div className={clsx("col col--4", styles.membershipPlan)}>
      <div className="text--center padding-horiz--md">
        <Heading
          as="h3"
          style={{ color: "#05eaff", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {title}
        </Heading>
        <p>
          <strong>{price}</strong>
        </p>
        <ul>
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <Link className="button button--primary" to={buttonLink}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export default function MembershipPage() {
  return (
    <section className={styles.features} style={{ backgroundColor: "#1de9b6" }}>
      <div className="container">
        <div className="row">
          {MembershipPlans.map((plan, index) => (
            <MembershipPlan key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
