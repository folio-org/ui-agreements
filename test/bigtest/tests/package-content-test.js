import { beforeEach, describe, it } from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageContentInteractor from '../interactors/package-content';

const PKG = {
  name: 'access_start_access_end_tests Package',
  filters: {
    all: {
      name: 'all',
      expectedContent: [
        { name: 'Afghanistan' },
        { name: 'Archaeological and Environmental Forensic Science' },
        { name: 'Archives of Natural History' },
        { name: 'Bethlehem University Journal' },
      ]
    },
    current: {
      name: 'current',
      expectedContent: [
        { name: 'Archaeological and Environmental Forensic Science' },
      ]
    },
    dropped: {
      name: 'dropped',
      expectedContent: [
        { name: 'Afghanistan' },
        { name: 'Archives of Natural History' },
      ]
    },
    future: {
      name: 'future',
      expectedContent: [
        { name: 'Bethlehem University Journal' },
      ]
    },
  },
};

describe('PackageContentCRUD', () => {
  setupApplication();
  const packagecontent = new PackageContentInteractor();

  describe('packagecontent tests', () => {
    const testData = [
      { pti: { titleInstance: { id: '1234', name: 'testInstance1' } }, accessStart: () => faker.date.recent().toISOString() },
      { pti: { titleInstance: { id: '234', name: 'testInstance2' } }, accessStart: () => faker.date.future().toISOString() },
      { pti: { titleInstance: { id: '734', name: 'testInstance3' } }, accessEnd: () => faker.date.recent().toISOString() },
    ];

    beforeEach(async function () {
      const eresource = this.server.create('eresource', { name: PKG.name, testData });
      this.visit(`/erm/eresources/${eresource.id}`);
    });

    describe('returns the list of eresources of type package', () => {
      it('renders expected package', () => {
        expect(packagecontent.headline).to.equal(PKG.name);
      });

      it('renders the expected eresource', () => {
        expect(packagecontent.eresourceName).to.equal(testData[0].pti.titleInstance.name);
      });
    });

    describe('future eresource', () => {

      beforeEach(async function () {
        await packagecontent.clickFuture();
      });

      it('renders expected future resource', () => {
        expect(packagecontent.eresourceName).to.equal(testData[1].pti.titleInstance.name);
      });
    });

    describe('dropped eresource', () => {

      beforeEach(async function () {
        await packagecontent.clickDropped();
      });

      it('renders expected dropped resource', () => {
        expect(packagecontent.eresourceName).to.equal(testData[2].pti.titleInstance.name);
      });
    });

    describe('View basket and create agreement', () => {

      beforeEach(async function () {
        await packagecontent.addToBasketButtion();
        await packagecontent.clickOpenBasket();
        await packagecontent.clickCreateNewAgreement();
        await packagecontent.fillName('adi');
        await packagecontent.selectStatus('Draft');
        await packagecontent.processDate('2020-04-01');
        await packagecontent.createAgreement();
      });

      it('renders expected dropped resource', () => {
        expect(packagecontent.eresourceName).to.equal(testData[2].pti.titleInstance.name);
      });
    });
  });
});

    //     it('renders the expected count of external data sources', () => {
    //       expect(externaldatasources.externalDataSourceList.size).to.equal(1);
    //     });

    //     it('renders the delete button', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isDeleteButtonPresent).to.be.true;
    //     });

    //     it('renders the edit button', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isEditButtonPresent).to.be.true;
    //     });

    //     it('renders the name Field', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isNamePresent).to.be.true;
    //     });

    //     it('renders the expected name', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).name.value.text).to.equal(dataSource.name);
    //     });

    //     it('renders the type Field', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isTypePresent).to.be.true;
    //     });

    //     it('renders the expected type', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).type.value.text).to.equal(dataSource.type);
    //     });

    //     it('renders the record type Field', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isRecordTypePresent).to.be.true;
    //     });

    //     it('renders the expected record type', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).recordType.value.text).to.equal('Package');
    //     });

    //     it('renders the URI Field', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isURIPresent).to.be.true;
    //     });

    //     it('renders the expected URI', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).uri.value.text).to.equal(dataSource.uri);
    //     });

    //     it('renders the isActive checkbox', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isActivePresent).to.be.true;
    //     });

    //     it('renders the expected isActive checkobx status', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isActive.value.text).to.equal('Yes');
    //     });

    //     it('renders the supportsHarvesting checkbox', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isSupportsHarvestingPresent).to.be.true;
    //     });

    //     it('renders the expected isSupportsHarvesting checkobx status', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isSupportsHarvesting.value.text).to.equal('Yes');
    //     });

    //     it('renders the activationEnabled checkbox', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isActivationEnabledPresent).to.be.true;
    //     });

    //     it('renders the expected isActivationEnabled checkobx status', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isActivationEnabled.value.text).to.equal('No');
    //     });

    //     it('renders the listPrefix Field', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isListPrefixPresent).to.be.true;
    //     });

    //     it('renders the expected listPrefix', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).listPrefix.value.text).to.equal(dataSource.listPrefix);
    //     });

    //     it('renders the fullPrefix Field', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isFullPrefixPresent).to.be.true;
    //     });

    //     it('renders the expected fullPrefix', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).fullPrefix.value.text).to.equal(dataSource.fullPrefix);
    //     });

    //     it('renders the principal Field', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isPrincipalPresent).to.be.true;
    //     });

    //     it('renders the expected principal', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).principal.value.text).to.equal(dataSource.principal);
    //     });

    //     it('renders the credentials Field', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).isCredentialsPresent).to.be.true;
    //     });

    //     it('renders the expected credentials', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).credentials.value.text).to.equal(dataSource.credentials);
    //     });
    //   });
    // });

    // describe('Creating, editing and cancelling data source', () => {
    //   const name = 'aa';
    //   const type = 'org.olf.kb.adapters.GOKbOAIAdapter';
    //   const recordType = 'Package';
    //   const URI = 'http://abcd.com';
    //   const isActive = true;
    //   const supportsHarvesting = false;
    //   const activationEnabled = true;

    //   beforeEach(async function () {
    //     this.visit('/settings/local-kb-admin/external-data-sources');
    //     await externaldatasources.clickNewButton();
    //     await externaldatasources.externalDataSourceList.itemsEdit(0).editName(name);
    //     await externaldatasources.externalDataSourceList.itemsEdit(0).editType(type);
    //     await externaldatasources.externalDataSourceList.itemsEdit(0).editRecordType(recordType);
    //     await externaldatasources.externalDataSourceList.itemsEdit(0).editURI(URI);
    //     await externaldatasources.externalDataSourceList.itemsEdit(0).clickSaveButton();
    //   });

    //   describe('creating a new data source', () => {
    //     it('should render the expected source', () => {
    //       expect(externaldatasources.externalDataSourceList.items(0).name.value.text).to.equal(name);
    //     });

    //     describe('edit', () => {
    //       const editedName = 'aa edited name';

    //       beforeEach(async function () {
    //         await externaldatasources.externalDataSourceList.items(0).clickEditButton();
    //         await externaldatasources.externalDataSourceList.itemsEdit(0).editName(editedName);
    //         await externaldatasources.externalDataSourceList.itemsEdit(0).editIsActive(isActive);
    //         await externaldatasources.externalDataSourceList.itemsEdit(0).editSupportsHarvesting(supportsHarvesting);
    //         await externaldatasources.externalDataSourceList.itemsEdit(0).editActivationEnabled(activationEnabled);
    //         await externaldatasources.externalDataSourceList.itemsEdit(0).clickSaveButton();
    //       });

    //       describe('editing and saving the source', () => {
    //         it('should render the edited data source name', () => {
    //           expect(externaldatasources.externalDataSourceList.items(0).name.value.text).to.equal(editedName);
    //         });

    //         it('should render the edited isActive checkbox status', () => {
    //           expect(externaldatasources.externalDataSourceList.items(0).isActive.value.text).to.equal('Yes');
    //         });

    //         it('should render the edited supportsHarvesting checkbox status', () => {
    //           expect(externaldatasources.externalDataSourceList.items(0).isSupportsHarvesting.value.text).to.equal('No');
    //         });

    //         it('should render the edited activationEnabled checkbox status', () => {
    //           expect(externaldatasources.externalDataSourceList.items(0).isActivationEnabled.value.text).to.equal('Yes');
    //         });
    //       });
    //     });

    //     describe('edit and cancel', () => {
    //       beforeEach(async function () {
    //         await externaldatasources.externalDataSourceList.items(0).clickEditButton();
    //         await externaldatasources.externalDataSourceList.itemsEdit(0).clickCancelButton();
    //       });

    //       describe('editing and canceling the source', () => {
    //         it('should render the previous name', () => {
    //           expect(externaldatasources.externalDataSourceList.items(0).name.value.text).to.equal(name);
    //         });

    //         it('should render the previous isActive checkbox status', () => {
    //           expect(externaldatasources.externalDataSourceList.items(0).isActive.value.text).to.equal('No');
    //         });

    //         it('should render the previous supportsHarvesting checkbox status', () => {
    //           expect(externaldatasources.externalDataSourceList.items(0).isSupportsHarvesting.value.text).to.equal('Yes');
    //         });

    //         it('should render the previous activationEnabled checkbox status', () => {
    //           expect(externaldatasources.externalDataSourceList.items(0).isActivationEnabled.value.text).to.equal('No');
    //         });
    //       });
    //     });
    //   });
    // });

    // describe('externaldatasources tests for multiple data sources', () => {
    //   const externalDataSourceCount = 10;
    //   beforeEach(async function () {
    //     this.server.createList('externalDataSource', 10);
    //     this.visit('/settings/local-kb-admin/external-data-sources');
    //   });

    //   describe('viewing the data sources', () => {
    //     it('renders the list of external data sources', () => {
    //       expect(externaldatasources.isFormPresent).to.be.true;
    //     });

    //     it('renders the expected count of external data sources', () => {
    //       expect(externaldatasources.externalDataSourceList.size).to.equal(externalDataSourceCount);
    //     });

    //     describe('deleting 2 sources', () => {
    //       beforeEach(async function () {
    //         await externaldatasources.externalDataSourceList.items(0).clickDeleteButton();
    //         await externaldatasources.externalDataSourceList.items(1).clickDeleteButton();
    //       });

    //       it('reduces the count of data sources by 2', () => {
    //  s       expect(externaldatasources.externalDataSourceList.size).to.equal(externalDataSourceCount - 2);
    //       });
    //     });
    //   });
    // });
  //});