/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import expect from '@kbn/expect';

import { FtrProviderContext } from '../ftr_provider_context';

export default function ({ getService, getPageObjects }: FtrProviderContext) {
  const retry = getService('retry');
  const esArchiver = getService('esArchiver');
  const kibanaServer = getService('kibanaServer');
  const queryBar = getService('queryBar');
  const browser = getService('browser');
  const { common, header, discover, timePicker, unifiedFieldList } = getPageObjects([
    'common',
    'header',
    'discover',
    'timePicker',
    'unifiedFieldList',
  ]);

  describe('discover tab with new fields API', function describeIndexTests() {
    this.tags('includeFirefox');
    before(async function () {
      await kibanaServer.savedObjects.clean({ types: ['search', 'index-pattern'] });
      await kibanaServer.importExport.load(
        'src/platform/test/functional/fixtures/kbn_archiver/discover.json'
      );
      await esArchiver.loadIfNeeded(
        'src/platform/test/functional/fixtures/es_archiver/logstash_functional'
      );
      await kibanaServer.uiSettings.replace({
        defaultIndex: 'logstash-*',
      });
      await timePicker.setDefaultAbsoluteRangeViaUiSettings();
      await common.navigateToApp('discover');
    });
    describe('field data', function () {
      it('search php should show the correct hit count', async function () {
        const expectedHitCount = '445';
        await retry.try(async function () {
          await queryBar.setQuery('php');
          await queryBar.submitQuery();
          const hitCount = await discover.getHitCount();
          expect(hitCount).to.be(expectedHitCount);
        });
      });

      it('the search term should be highlighted in the field data', async function () {
        // marks is the style that highlights the text in yellow
        await unifiedFieldList.clickFieldListItemAdd('extension');
        const marks = await discover.getMarks();
        expect(marks.length).to.be.greaterThan(0);
        expect(marks.indexOf('php')).to.be(0);
        await unifiedFieldList.clickFieldListItemRemove('extension');
      });

      it('search type:apache should show the correct hit count', async function () {
        const expectedHitCount = '11,156';
        await queryBar.setQuery('type:apache');
        await queryBar.submitQuery();
        await retry.try(async function tryingForTime() {
          const hitCount = await discover.getHitCount();
          expect(hitCount).to.be(expectedHitCount);
        });
      });

      it('doc view should show @timestamp and Summary columns', async function () {
        const Docheader = await discover.getDocHeader();
        expect(Docheader).to.contain('@timestamp');
        expect(Docheader).to.contain('Summary');
      });

      it('a bad syntax query should show an error message', async function () {
        const expectedError =
          'Expected ":", "<", "<=", ">", ">=", AND, OR, end of input, ' +
          'whitespace but "(" found.';
        await queryBar.setQuery('xxx(yyy))');
        await queryBar.submitQuery();
        await discover.showsErrorCallout();
        const message = await discover.getDiscoverErrorMessage();
        expect(message).to.contain(expectedError);
      });

      it('shows top-level object keys', async function () {
        await queryBar.setQuery('election');
        await queryBar.submitQuery();
        const currentUrl = await browser.getCurrentUrl();
        const [, hash] = currentUrl.split('#/');
        await common.navigateToUrl(
          'discover',
          hash.replace('columns:!()', 'columns:!(relatedContent)'),
          { useActualUrl: true }
        );

        await header.waitUntilLoadingHasFinished();
        await retry.try(async function tryingForTime() {
          expect(await discover.getDocHeader()).to.contain('relatedContent');

          const field = await discover.getDocTableIndex(1);
          expect(field).to.contain('relatedContent.url');
        });

        const marks = await discover.getMarks();
        expect(marks.length).to.be.above(0);
        expect(marks).to.contain('election');
      });

      // we used to add _source as a column by default when `discover:searchFieldsFromSource` existed
      it('should show @timestamp and Summary columns for legacy links with _source as a column', async function () {
        const currentUrl = await browser.getCurrentUrl();
        const [, hash] = currentUrl.split('#/');
        const nextHash = hash
          .replace('columns:!(relatedContent)', 'columns:!(_source)')
          .replace('election', 'club');

        expect(nextHash).to.contain('columns:!(_source)');

        await common.navigateToUrl('discover', nextHash, { useActualUrl: true });

        await header.waitUntilLoadingHasFinished();
        await discover.waitUntilSearchingHasFinished();

        const gridHeader = await discover.getDocHeader();
        expect(gridHeader).to.contain('@timestamp');
        expect(gridHeader).to.contain('Summary');

        const marks = await discover.getMarks();
        expect(marks.length).to.be.above(0);
        expect(marks).to.contain('club');

        expect(await browser.getCurrentUrl()).to.contain('columns:!()');
      });
    });
  });
}
