# Nightshift detection

The detection engine of Nightshift: it runs detection strategies per space on a one-minute tick and
stores what they find as detection signals. It replaces Discovery; the design is in
[nightshift-program#2053](https://github.com/elastic/nightshift-program/issues/2053). This plugin is server-only and built with Kibana DI (`server/setup/`).

Phase 1 ([nightshift-program#2054](https://github.com/elastic/nightshift-program/issues/2054)) lays the skeleton: the plugin, the strategy contracts, the
signal format and store, the state index with its run lease, the service account setup and the
bound workflow that calls `_tick`. No strategy detects anything yet.

## Availability

The plugin is off by default (`xpack.nightshiftDetection.enabled: false`) and off in every shipped
config. When loaded, `AvailabilityService` also requires the `nightshift.enabled` feature flag, an
Observability project on Serverless, the `streams:significant-events` pricing feature and an
Enterprise license.

## Elasticsearch clients

Two clients, two identities:

- `EngineDataClient`: the space's detection service account, request-scoped. Generators read
  customer data with it.
- `DetectionEngineSystemClient`: `asInternalUser` (kibana_system). Every read and write on
  `.nightshift-detection_engine-*` goes through it.

## Terms

The prototype used other names. The code uses the one pager's:

| Prototype | Code |
| --- | --- |
| `ISignalStrategy` | `DetectionStrategy` token |
| `StrategyObservation`, `EngineSignal` | `DetectionSignal` |
| `triage_step` | detection signals triager |
| triage agent | judge |
| `run_activity` | activity log |

## Running it locally

Add to `config/kibana.dev.yml`:

```yaml
xpack.nightshiftDetection.enabled: true
xpack.security.serviceAccounts.enabled: true
```

## Setting up a space

The engine runs a space as the deployment's `nightshift_detection` service account. Kibana never
creates the account: a user with `manage_security` runs the setup, and the server only binds the
space to the account it is given.

```sh
node x-pack/solutions/observability/plugins/nightshift_detection/scripts/enable.js --space default
```

The script finds the account by name (or creates it, and reuses it when it exists), then calls
`POST /internal/nightshift/detection/service_account/_enable` for the space and prints the account
id. Running it again gives the same id; another space reuses the account. Flags: `--space`,
`--kibana-url`, `--username`, `--password` (defaults match the local dev stack) and `--serverless`.

Setting a space up also installs and enables its engine workflow, `system-nightshift-detection-engine-<space>`,
bound to the same account. It runs every minute and calls `POST /internal/nightshift/detection/_tick`
as the account. A user with `manage_nightshift` can call `_tick` too, and runs as the account;
`{ "skip_backlog": true }` starts every due strategy at its latest settled step instead of replaying
what it missed, and reports the minutes it skipped.

`GET /internal/nightshift/detection/service_account` reports the account a space runs as, the role
it must hold and whether the current user may set the space up.

The account's role must exist, and the engine never creates it:

- Stateful: create `nightshift_detection` with `ensureNightshiftServiceAccountRoles` from
  `@kbn/nightshift-shared` (tests, evals and local development do).
- Serverless: the role `_nightshift_detection` is predefined.

## Watching ticks

Each `_tick` answers with its `run_id`, a `status` (`completed`, `busy` when another tick holds the
space's lease, `unavailable` when the engine turns off between the route's check and the run; an engine that is off answers 404 before that) and, per strategy, the window it covered, the
signals it wrote, the minutes it skipped, its notes and its error if it failed. A workflow run that
shows `busy` is normal while a long tick outlives its minute. The signals are in the hidden data
stream `.nightshift-detection_engine-detection_signals`, and each strategy's progress in
`.nightshift-detection_engine-state`. The runs themselves are in the workflow's execution history in
the Workflows app, under the space.

Turning the plugin off leaves the installed workflow calling a route that answers 404 every minute.
That is accepted, and there is no cleanup.
