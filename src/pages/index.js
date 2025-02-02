import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import "../css/custom.css"; // Go one level up in the directory structure
import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonRow}>
            <Link className="button button-first" to="/docs/intro">
              Stealer Log Basic
            </Link>
            <Link
              className="button button-first button--sm"
              to="/docs/advanced"
            >
              Advanced Tutorial - 10min ⏱️
            </Link>
          </div>
          <div className={styles.buttonRow}>
            <Link
              className="button button-first button--sm"
              to="/docs/features"
            >
              <div class="callout callout_success">
                Explore Features - 8min ⏱️
              </div>
            </Link>
            <Link
              className="button button-first button--sm"
              to="/docs/getting-started"
            >
              Getting Started - 6min ⏱️
            </Link>
            <Link
              className="button button-first button--sm"
              to="/docs/api-reference"
            >
              API Reference - 7min ⏱️
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

if (document.body.animate) {
  document
    .querySelectorAll(".button")
    .forEach((button) => button.addEventListener("click", pop));
}

function pop(e) {
  for (let i = 0; i < 30; i++) {
    createParticle(e.clientX, e.clientY, e.target.dataset.type);
  }
}

function createParticle(x, y, type) {
  const particle = document.createElement("particle");
  document.body.appendChild(particle);

  const size = Math.floor(Math.random() * 20 + 5);

  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  const destinationX = x + (Math.random() - 0.5) * 2 * 75;
  const destinationY = y + (Math.random() - 0.5) * 2 * 75;

  switch (type) {
    case "square":
      particle.style.background = `hsl(${Math.random() * 90 + 270}, 70%, 60%)`;
      particle.style.border = "1px solid white";
      break;
    case "circle":
      particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
      particle.style.borderRadius = "50%";
      break;
    default:
      particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
  }

  const animation = particle.animate(
    [
      {
        //Set the origin position of the particle
        //We offset the particle with half its size to center it around the mouse
        transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
        opacity: 1,
      },
      {
        //We define the final coordinates as the second keyframe
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 0,
      },
    ],
    {
      duration: 500 + Math.random() * 1000,
      easing: "cubic-bezier(0, .9, .57, 1)",
      delay: Math.random() * 200,
    }
  );

  animation.onfinish = () => {
    particle.removeParticle;
  };
}

function removeParticle(e) {
  e.srcElement.effect.target.remove();
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
