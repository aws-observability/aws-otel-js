# Releasing AWS OpenTelemetry JavaScript Packages

## Starting the Release

Open the release build workflow in your browser [here](https://github.com/aws-observability/aws-otel-js/actions?query=workflow%3A.github%2Fworkflows%2Frelease-build.yml).

You will see a button that says "Run workflow". Press the button, enter the version number you want which follows semver to release in the input field that pops up, and then press "Run workflow".

This triggers the release process, which builds the packages, updates the packages with the new version numbers, publishes the packages, and creates and pushes
a git tag with the version number.

## Announcement
   
Once the GitHub workflow completes, go to Github [release
page](https://github.com/aws-observability/aws-otel-js/releases), press
`Draft a new release` to write release notes about the new release. If there is already a draft release notes, just point it at the created tag.

You can use the Github [compare tool](https://github.com/open-telemetry/opentelemetry-java/compare/)
to view a summary of all commits since last release as a reference.

In addition, you can refer to
[CHANGELOG.md](https://github.com/aws-observability/aws-otel-js/blob/main/docs/releases/v0.12.0.md)
for a list of major changes since last release.

## Update release versions in documentations and CHANGELOG files

After releasing is done, you need to update
[CHANGELOG.md](https://github.com/aws-observability/aws-otel-js/blob/release-notes/docs/releases/v0.12.0.md).

Create a PR to mark the new release in
[CHANGELOG.md](https://github.com/aws-observability/aws-otel-js/blob/release-notes/docs/releases/v0.12.0.md)
on main branch.
