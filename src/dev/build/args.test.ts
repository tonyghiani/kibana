/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { ToolingLog } from '@kbn/tooling-log';
import { createAnyInstanceSerializer } from '@kbn/jest-serializers';

import { readCliArgs } from './args';

expect.addSnapshotSerializer(createAnyInstanceSerializer(ToolingLog));

it('renders help if `--help` passed', () => {
  expect(readCliArgs(['node', 'scripts/build', '--help'])).toMatchInlineSnapshot(`
    Object {
      "log": <ToolingLog>,
      "showHelp": true,
      "unknownFlags": Array [],
    }
  `);
});

it('build default and oss dist for current platform, without packages, by default', () => {
  expect(readCliArgs(['node', 'scripts/build'])).toMatchInlineSnapshot(`
    Object {
      "buildOptions": Object {
        "buildCanvasShareableRuntime": true,
        "createArchives": true,
        "createCdnAssets": true,
        "createDebPackage": false,
        "createDockerCloud": false,
        "createDockerCloudFIPS": false,
        "createDockerContexts": true,
        "createDockerFIPS": false,
        "createDockerServerless": false,
        "createDockerUBI": false,
        "createDockerWolfi": false,
        "createGenericFolders": true,
        "createPlatformFolders": true,
        "createRpmPackage": false,
        "dockerContextUseLocalArtifact": null,
        "dockerCrossCompile": false,
        "dockerNamespace": null,
        "dockerPush": false,
        "dockerTag": null,
        "dockerTagQualifier": null,
        "downloadCloudDependencies": true,
        "downloadFreshNode": true,
        "eprRegistry": "snapshot",
        "initialize": true,
        "isRelease": false,
        "targetAllPlatforms": false,
        "targetServerlessPlatforms": false,
        "versionQualifier": "",
        "withExamplePlugins": false,
        "withTestPlugins": false,
      },
      "log": <ToolingLog>,
      "showHelp": false,
      "unknownFlags": Array [],
    }
  `);
});

it('builds packages if --all-platforms is passed', () => {
  expect(readCliArgs(['node', 'scripts/build', '--all-platforms'])).toMatchInlineSnapshot(`
    Object {
      "buildOptions": Object {
        "buildCanvasShareableRuntime": true,
        "createArchives": true,
        "createCdnAssets": true,
        "createDebPackage": true,
        "createDockerCloud": true,
        "createDockerCloudFIPS": true,
        "createDockerContexts": true,
        "createDockerFIPS": true,
        "createDockerServerless": true,
        "createDockerUBI": true,
        "createDockerWolfi": true,
        "createGenericFolders": true,
        "createPlatformFolders": true,
        "createRpmPackage": true,
        "dockerContextUseLocalArtifact": null,
        "dockerCrossCompile": false,
        "dockerNamespace": null,
        "dockerPush": false,
        "dockerTag": null,
        "dockerTagQualifier": null,
        "downloadCloudDependencies": true,
        "downloadFreshNode": true,
        "eprRegistry": "snapshot",
        "initialize": true,
        "isRelease": false,
        "targetAllPlatforms": true,
        "targetServerlessPlatforms": false,
        "versionQualifier": "",
        "withExamplePlugins": false,
        "withTestPlugins": false,
      },
      "log": <ToolingLog>,
      "showHelp": false,
      "unknownFlags": Array [],
    }
  `);
});

it('limits packages if --rpm passed with --all-platforms', () => {
  expect(readCliArgs(['node', 'scripts/build', '--all-platforms', '--rpm'])).toMatchInlineSnapshot(`
    Object {
      "buildOptions": Object {
        "buildCanvasShareableRuntime": true,
        "createArchives": true,
        "createCdnAssets": true,
        "createDebPackage": false,
        "createDockerCloud": false,
        "createDockerCloudFIPS": false,
        "createDockerContexts": true,
        "createDockerFIPS": false,
        "createDockerServerless": false,
        "createDockerUBI": false,
        "createDockerWolfi": false,
        "createGenericFolders": true,
        "createPlatformFolders": true,
        "createRpmPackage": true,
        "dockerContextUseLocalArtifact": null,
        "dockerCrossCompile": false,
        "dockerNamespace": null,
        "dockerPush": false,
        "dockerTag": null,
        "dockerTagQualifier": null,
        "downloadCloudDependencies": true,
        "downloadFreshNode": true,
        "eprRegistry": "snapshot",
        "initialize": true,
        "isRelease": false,
        "targetAllPlatforms": true,
        "targetServerlessPlatforms": false,
        "versionQualifier": "",
        "withExamplePlugins": false,
        "withTestPlugins": false,
      },
      "log": <ToolingLog>,
      "showHelp": false,
      "unknownFlags": Array [],
    }
  `);
});

it('limits packages if --deb passed with --all-platforms', () => {
  expect(readCliArgs(['node', 'scripts/build', '--all-platforms', '--deb'])).toMatchInlineSnapshot(`
    Object {
      "buildOptions": Object {
        "buildCanvasShareableRuntime": true,
        "createArchives": true,
        "createCdnAssets": true,
        "createDebPackage": true,
        "createDockerCloud": false,
        "createDockerCloudFIPS": false,
        "createDockerContexts": true,
        "createDockerFIPS": false,
        "createDockerServerless": false,
        "createDockerUBI": false,
        "createDockerWolfi": false,
        "createGenericFolders": true,
        "createPlatformFolders": true,
        "createRpmPackage": false,
        "dockerContextUseLocalArtifact": null,
        "dockerCrossCompile": false,
        "dockerNamespace": null,
        "dockerPush": false,
        "dockerTag": null,
        "dockerTagQualifier": null,
        "downloadCloudDependencies": true,
        "downloadFreshNode": true,
        "eprRegistry": "snapshot",
        "initialize": true,
        "isRelease": false,
        "targetAllPlatforms": true,
        "targetServerlessPlatforms": false,
        "versionQualifier": "",
        "withExamplePlugins": false,
        "withTestPlugins": false,
      },
      "log": <ToolingLog>,
      "showHelp": false,
      "unknownFlags": Array [],
    }
  `);
});

it('limits packages if --docker passed with --all-platforms', () => {
  expect(readCliArgs(['node', 'scripts/build', '--all-platforms', '--docker-images']))
    .toMatchInlineSnapshot(`
    Object {
      "buildOptions": Object {
        "buildCanvasShareableRuntime": true,
        "createArchives": true,
        "createCdnAssets": true,
        "createDebPackage": false,
        "createDockerCloud": true,
        "createDockerCloudFIPS": true,
        "createDockerContexts": true,
        "createDockerFIPS": true,
        "createDockerServerless": true,
        "createDockerUBI": true,
        "createDockerWolfi": true,
        "createGenericFolders": true,
        "createPlatformFolders": true,
        "createRpmPackage": false,
        "dockerContextUseLocalArtifact": null,
        "dockerCrossCompile": false,
        "dockerNamespace": null,
        "dockerPush": false,
        "dockerTag": null,
        "dockerTagQualifier": null,
        "downloadCloudDependencies": true,
        "downloadFreshNode": true,
        "eprRegistry": "snapshot",
        "initialize": true,
        "isRelease": false,
        "targetAllPlatforms": true,
        "targetServerlessPlatforms": false,
        "versionQualifier": "",
        "withExamplePlugins": false,
        "withTestPlugins": false,
      },
      "log": <ToolingLog>,
      "showHelp": false,
      "unknownFlags": Array [],
    }
  `);
});

it('limits packages if --docker passed with --skip-docker-ubi and --all-platforms', () => {
  expect(
    readCliArgs([
      'node',
      'scripts/build',
      '--all-platforms',
      '--docker-images',
      '--skip-docker-ubi',
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "buildOptions": Object {
        "buildCanvasShareableRuntime": true,
        "createArchives": true,
        "createCdnAssets": true,
        "createDebPackage": false,
        "createDockerCloud": true,
        "createDockerCloudFIPS": true,
        "createDockerContexts": true,
        "createDockerFIPS": true,
        "createDockerServerless": true,
        "createDockerUBI": false,
        "createDockerWolfi": true,
        "createGenericFolders": true,
        "createPlatformFolders": true,
        "createRpmPackage": false,
        "dockerContextUseLocalArtifact": null,
        "dockerCrossCompile": false,
        "dockerNamespace": null,
        "dockerPush": false,
        "dockerTag": null,
        "dockerTagQualifier": null,
        "downloadCloudDependencies": true,
        "downloadFreshNode": true,
        "eprRegistry": "snapshot",
        "initialize": true,
        "isRelease": false,
        "targetAllPlatforms": true,
        "targetServerlessPlatforms": false,
        "versionQualifier": "",
        "withExamplePlugins": false,
        "withTestPlugins": false,
      },
      "log": <ToolingLog>,
      "showHelp": false,
      "unknownFlags": Array [],
    }
  `);
});

it('limits packages if --all-platforms passed with --skip-docker-fips', () => {
  expect(readCliArgs(['node', 'scripts/build', '--all-platforms', '--skip-docker-fips']))
    .toMatchInlineSnapshot(`
    Object {
      "buildOptions": Object {
        "buildCanvasShareableRuntime": true,
        "createArchives": true,
        "createCdnAssets": true,
        "createDebPackage": true,
        "createDockerCloud": true,
        "createDockerCloudFIPS": true,
        "createDockerContexts": true,
        "createDockerFIPS": false,
        "createDockerServerless": true,
        "createDockerUBI": true,
        "createDockerWolfi": true,
        "createGenericFolders": true,
        "createPlatformFolders": true,
        "createRpmPackage": true,
        "dockerContextUseLocalArtifact": null,
        "dockerCrossCompile": false,
        "dockerNamespace": null,
        "dockerPush": false,
        "dockerTag": null,
        "dockerTagQualifier": null,
        "downloadCloudDependencies": true,
        "downloadFreshNode": true,
        "eprRegistry": "snapshot",
        "initialize": true,
        "isRelease": false,
        "targetAllPlatforms": true,
        "targetServerlessPlatforms": false,
        "versionQualifier": "",
        "withExamplePlugins": false,
        "withTestPlugins": false,
      },
      "log": <ToolingLog>,
      "showHelp": false,
      "unknownFlags": Array [],
    }
  `);
});

it('limits packages if --all-platforms passed with --skip-docker-cloud-fips', () => {
  expect(readCliArgs(['node', 'scripts/build', '--all-platforms', '--skip-docker-cloud-fips']))
    .toMatchInlineSnapshot(`
    Object {
      "buildOptions": Object {
        "buildCanvasShareableRuntime": true,
        "createArchives": true,
        "createCdnAssets": true,
        "createDebPackage": true,
        "createDockerCloud": true,
        "createDockerCloudFIPS": false,
        "createDockerContexts": true,
        "createDockerFIPS": true,
        "createDockerServerless": true,
        "createDockerUBI": true,
        "createDockerWolfi": true,
        "createGenericFolders": true,
        "createPlatformFolders": true,
        "createRpmPackage": true,
        "dockerContextUseLocalArtifact": null,
        "dockerCrossCompile": false,
        "dockerNamespace": null,
        "dockerPush": false,
        "dockerTag": null,
        "dockerTagQualifier": null,
        "downloadCloudDependencies": true,
        "downloadFreshNode": true,
        "eprRegistry": "snapshot",
        "initialize": true,
        "isRelease": false,
        "targetAllPlatforms": true,
        "targetServerlessPlatforms": false,
        "versionQualifier": "",
        "withExamplePlugins": false,
        "withTestPlugins": false,
      },
      "log": <ToolingLog>,
      "showHelp": false,
      "unknownFlags": Array [],
    }
  `);
});
