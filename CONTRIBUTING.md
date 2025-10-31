Contributing to Docusaurus
Docusaurus is our way to hopefully help make open-source documentation easier. We currently have multiple open source projects using it, with many more planned. If you're interested in contributing to Docusaurus, this document should make the process clear.

The Open Source Guides website has a collection of resources for individuals, communities, and companies who want to learn how to run and contribute to an open-source project. Contributors and people new to open source alike will find the following guides especially useful:

How to Contribute to Open Source

Building Welcoming Communities

Code of Conduct
Meta has adopted a Code of Conduct that we expect all project participants to adhere to. Please read the full text so you can understand what actions will and will not be tolerated.

Get Involved: Ways to Contribute
There are many ways to contribute to Docusaurus, and many of them do not involve writing any code. Here are a few ideas to get started:

Start Using Docusaurus: Go through the Getting Started guide. If anything doesn't work as expected, we are always looking for improvements—let us know by opening an issue.

Help Triage Issues: Look through the open issues. Provide workarounds, ask for clarification, or suggest labels.

Fix a Bug: If you find an issue you'd like to fix, open a pull request (PR). Issues tagged as Good first issue are a great place to start.

Improve Documentation: Read through the Docusaurus docs. If you find anything confusing or something that could be improved, you can click "Edit this page" at the bottom of most docs, which takes you directly to the GitHub interface to propose changes.

Build a Feature: Review the features requested by the community and consider opening a pull request if you see something you want to work on.

Contributions are very welcome. If you need help planning your contribution, feel free to ping us on X at @docusaurus and let us know you're looking for a bit of help.

Join our Discord Channel
We have the #contributors channel on Discord to discuss all things about Docusaurus development. You can also be of great help by assisting other users in the #help-and-questions channel.

Triaging Issues and Pull Requests
Helping to triage issues and pull requests as they come in is a great way to contribute to the project without writing any code. You can:

Ask for more information if you believe the issue lacks the details required to solve it.

Suggest labels that can help categorize issues.

Flag issues that are stale or should be closed.

Ask for test plans and review code.

Our Development Process
Docusaurus uses GitHub as its source of truth, and the core team works directly there. All changes are public from the beginning.

Branch Organization
Docusaurus has one primary branch, main. We use feature branches with deploy previews to deliver new features via pull requests.

All pull requests are checked by the continuous integration system, GitHub actions. This includes unit tests, end-to-end tests, performance tests, style tests, and much more.

Issues
When opening a new issue, always make sure to fill out the issue template. This step is very important! Not doing so may delay the management of your issue. Don't take it personally if this happens; simply open a new issue once you've gathered all the required information.

Please don't use the GitHub issue tracker for questions. If you have questions about using Docusaurus, use any of our support channels, and we will do our best to answer.

Bugs
We use GitHub Issues for our public bugs. If you want to report a problem, look around to see if someone already opened an issue about it. If you are certain this is a new, unreported bug, you can submit a bug report.

One Issue, One Bug: Please report a single bug per issue.

Provide Reproduction Steps: List all the steps necessary to reproduce the issue. The person reading your report should be able to follow these steps with minimal effort.

If you're only fixing a bug, it's fine to submit a pull request right away, but we still recommend filing an issue detailing what you're fixing. This helps us track the issue even if we don't accept that specific fix.

Security Bugs
Meta has a bounty program for the safe disclosure of security bugs. With that in mind, please do not file public issues; go through the process outlined on that page instead.

Feature Requests
If you would like to request a new feature or enhancement but aren't planning to open a pull request yet, you can file an issue with the feature template in the form of an elaborated RFC. Alternatively, use the Canny board for more casual feature requests and to gain enough traction before proposing an RFC.

Proposals
If you intend to make any non-trivial changes to existing implementations, we recommend filing an issue with the proposal template. This lets us reach an agreement on your proposal before you put significant effort into it. These types of issues should be rare.

Claiming Issues and Getting Started
We maintain a list of beginner-friendly issues to help you get your feet wet in the Docusaurus codebase and familiar with our contribution process. This is a great starting place.

Apart from the good first issue tag, look for:

help wanted: If you have specific knowledge in one domain, working on these issues can make your expertise shine.

status: accepting pr: Community contributors are free to claim any of these.

Claiming Process
If you want to work on any of these issues, simply drop a message saying "I am working on this" in the issue comments. You do not need to ask for assignment to work on any issue explicitly marked as welcoming external contributions.

Important: Don't "cookie lick," or squat on an issue without sending a PR. You are automatically considered as giving up if you don't send a PR within seven days after your comment, and the issue automatically becomes up for grabs again.

Alternatively, when opening an issue, you can click the "self service" checkbox to indicate you'd like to work on the issue yourself, which will also mark the issue as "claimed."

Development Environment
Online One-Click Setup
We offer two easy, in-browser options for contributing:

Gitpod (Recommended): Use Gitpod (a free, online, VS Code-like IDE) for contributing. With a single click, it will launch a workspace (for Docusaurus 2) and automatically:

Clone the Docusaurus repo.

Install the dependencies.

Run yarn start.

github.dev: While browsing any file, change the domain name from github.com to github.dev in your browser's address bar to open an online editor. You can start making changes and sending pull requests right away.

Local Installation
Ensure you have Yarn installed.

After cloning the repository, run yarn install in the root of the repository. This installs all dependencies and builds all local packages.

To start a development server, run yarn workspace website start.

Code Conventions
The most important rule is: Look around. Match the style you see used in the rest of the project. This applies to formatting, naming files, code, and documentation.

We use Prettier (a formatter) and ESLint (a syntax linter) to catch most stylistic problems. If you're working locally, these tools should automatically fix some issues during every git commit.

For documentation: Do not wrap lines at 80 characters—configure your editor to soft-wrap when editing documentation.

Don't worry too much about styles in general; the maintainers will help you fix them as they review your code.

Pull Requests
So, you've decided to contribute code by opening a pull request. We appreciate the time you've invested and will do our best to review your PR quickly.

Tip: Working on your first Pull Request? You can learn how from this free video series: .

Please make sure you complete the following checklist when submitting a pull request:

Keep your PR small. Small pull requests (~300 lines of diff) are much easier to review and more likely to get merged. Ensure the PR does only one thing; otherwise, please split it.

Use descriptive titles. It is recommended to follow the semantic commit message style outlined below.

Test your changes. Describe your test plan in your pull request description.

CLA. If you haven't already, sign the CLA.

All pull requests should be opened against the main branch.

Your code contributions are more important than sticking to procedures, though completing this checklist will surely save everyone's time.

Semantic Commit Messages
Using a minor change to your commit message style can make you a better programmer.

Format: <type>(<scope>): <subject> <scope> is optional. If your change is specific to one or two packages, consider adding the scope (e.g., content-docs, theme-classic, core).

Example:

Versioned Docs
If you are making only documentation changes, be aware of versioned docs:

website/docs: The files here are responsible for the "next" version at https://docusaurus.io/docs/next/installation. This is where you should contribute new documentation.

website/versioned_docs/version-X.Y.Z: These are the docs for the specific, released version at https://docusaurus.io/docs/X.Y.Z/installation.

Do not edit files in versioned_docs/. Information about new features should not be documented in older versions, and edits made to older versions will not propagate to newer versions of the docs.

Test Plan
A good test plan includes the exact commands you ran and their output, and it provides screenshots or videos if the pull request changes the UI. If you've changed APIs, update the documentation.

We run tests in our continuous integration system, but for significant code changes, performing exhaustive local tests first saves both your time and the maintainers' time.

Types of tests you may encounter:

Build and Typecheck: We use TypeScript in our codebase, which helps ensure consistency and catches obvious mistakes early.

Unit Tests: We use Jest for unit tests. Run yarn test in the root directory to run all tests, or yarn test path/to/your/file.test.ts to run a specific test.

Dogfooding: Our website covers many potential configurations. Don't be afraid to update our website's configuration in your PR—it can help the maintainers preview the effects.

E2E Tests: You can simulate the distribution and installation of the code with your changes. Check out the doc on doing local third-party testing if you need help.

Licensing
By contributing to Docusaurus, you agree that your contributions will be licensed under its MIT license. Copy and paste this to the top of your new file(s):

Contributor License Agreement (CLA)
To accept your pull request, we need you to submit a CLA. You only need to do this once. If you are submitting a PR for the first time, the Meta GitHub Bot will reply with a link to the CLA form. You may also complete your CLA here.

CLAs are required for us to merge your pull request. PRs that are ready to merge but are missing a CLA and have no response from the author will be closed within two weeks of opening.

If your PR gets closed because you were unavailable, feel free to reopen it once it's ready! We are happy to review and merge it.

AI-Assisted PRs
We welcome the use of AI tools for authoring PRs, but please be mindful of this etiquette to respect our time:

Be Transparent: If a significant portion of your code is AI-generated, please indicate that in your PR description.

Be Accountable: You are responsible for the code you submit. You should be able to explain every line, ensure all tests pass, and address our reviews.

Be Reasonable: Significant, unsolicited changes (e.g., 1k+ lines of code) require prior communication and approval from the team in the form of an issue.

We retain the right to close any PR that we deem unproductive or low-effort, even if we agree with the spirit of the change.

Breaking Changes
Breaking changes should be discussed in the issue tracker before being implemented. When adding a new breaking change, use this template in your pull request:
