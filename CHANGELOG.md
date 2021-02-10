# Change history for ui-agreements

##  6.0.0 IN PROGRESS
* Added optionalOkapiInterfaces to package.json. ERM-940
* Rename instance-bulk to inventory-record-bulk. UIIN-1368
* Upgrade to Stripes 6.0
* Refactored AgreementFilters to functional component, added date filter. ERM-1532
* Changed Other Periods accordion to All Periods ERM-1531
* Tweaked display to highlight current/next/previous period ERM-1534
* Modify keyboard shortcuts, use handlers from stripes-components, stripes-erm-components
* Support order-lines 2.0 interface. ERM-1549
* Added conditional rendering of accordions in Agreement view. ERM-1537
##  5.0.1 2020-11-05
* Added permission check when displaying the add agreement line button. ERM-1197
* Fixes bug where incorrect Dates are saved when tenant timezone is ahead of UTC. ERM-1202
* Added permission check to fetch associated internal contacts data on editing an agreement. ERM-1200
* Bumped the limit to fetch 100 results for user definable pick lists. ERM-1192

##  5.0.0 2020-10-15
* Enhance eHoldings display in Agreement Line view. ERM-948
* Added ability to set and view notes on organizations. ERM-966
* Retrieve upto 100 results from users endpoint. ERM-980
* Upgrade to Stripes v5.0.
* Refactor `miragejs` from `bigtest/mirage`.
* Added support for the new publication type property. ERM-943
* Added support for searching by publication type property. ERM-944
* Separate organization and role filter. ERM-1043
* Added option to not display "Suppress from discovery" checkbox. ERM-1004
* Added new workflow for adding agreement lines to agreements. ERM-1000
* Improvements to agreement edit pane and added empty accordion messages. ERM-862
* Fixed coverage date format on submit. ERM-1091, ERM-1092
* Added Description to Agreement Line display in Edit Agreement view. ERM-1099
* Display eholdings icon on external resource cards. ERM-1106
* Retrieve upto 100 entitlement options. ERM-1158
* Added load more functionality to covered eresources MCL. ERM-1128

##  4.0.2 2020-07-06
* Fixed issue with only 10 results being retrieved for internal contacts. ERM-980

##  4.0.0 2020-06-11
* Added permission set and ability to delete agreements. ERM-777
* Show/hide pick list actions based on refdata category type. ERM-735
* Added ability to set and view agreement line notes. ERM-779
* Display Embargo information in "E-resources in package" and "Agreement line" display. ERM-805
* Added support for "Alternative names" for agreements. ERM-827
* Added coverage details to "options for acquiring E-resources" view. ERM-845
* Added ability to view and edit PCI information. ERM-847
* Added ability to view and edit Agreement line information. ERM-870 871 844 872 885
* Added ability to search/filter agreements based on custom properties. ERM-876
* Added new agreement-agreement relationships. ERM-889
* Added external links to titles on platforms. ERM-859
* Display information from siblingInstances in the agreements resources results. ERM-774 776
* Added Tags UI to eresources and agreement line display. ERM-919 ERM-920
* Added ability to view/edit "Suppress from discovery" for agreement lines. ERM-923 924
* Added ability to view/edit "Suppress from discovery" for PCIs. ERM-933
* Display Embargo details when viewing/editing an agreement line. ERM-938 939
* Display number of titles selected for agreement lines from eholdings. ERM-451
* Bumped the required node version to 10.

##  3.4.1 2020-03-12
* Set coverage columns to be fixed-width.

##  3.4.0 2020-03-11
* Switched to using `<FormattedUTCDate>` from Stripes. ERM-635
* Switched to using `<Spinner>` from Stripes. ERM-635
* Keyboard navigation and focus improvements. ERM-416 613 620 624
* Hid "Delete Agreement" permission set. ERM-617
* Added support for monograph fields. ERM-481 482 485 486 678
* Display callouts and confirmation modals. ERM-726
* Upgrade to Stripes 3.0

## 3.3.0 2019-12-04
* Update stripes to v2.10.1 to support PaneFooter.
* Move the Save & close button and add a Cancel button to Pane Footer. ERM-411.
* Apply the new large headline design to Agreements. ERM-260.
* Display coverage for Agreement lines on Create Agreement pane. ERM-168.
* Added ability to manage amendments for linked licenses. ERM-428 ERM-429
* Added agreement line active from/to dates. ERM-456
* Added ability to manage and view agreement periods. ERM-466 467 468
* Improve the header for the display of e-resources in agreements. ERM-472
* Added support for interface `erm` version `2.0`.
* Added support for interface `licenses` version `2.0`.
* Updated permission sets. ERM-477
* Updated forms to use React Final Form instead of Redux Form
* Added filter buttons to view future, dropped or all content of a package. ERM-394 ERM-396
* Added ability to search E-resources by identifier. ERM-519
* Added ability to manage and view linked agreements. ERM-460
* Updated linked Agreements, Contacts, Licenses, Organizations, PO Lines, and UDPs with new "link" and "replace" verbiage. ERM-451 452 453
* Added ability to duplicate an agreement. ERM-459
* Added ability to link multiple PO lines to a single agreement line. ERM-508

## 3.2.4 2019-09-10
* Added support for interface `invoice` version `2.0`.

## 3.2.3 2019-09-10
* Added agreement filtering by internal contact role. ERM-422

## 3.2.2 2019-09-09
* Fixed package version mismatch.

## 3.2.1 2019-09-09
* Re-added erroneously-deleted translation string.

## 3.2.0 2019-09-09
* Show/hide interface credentials. Fixes ERM-263
* Fixed package content lists being truncated at 1000 entries. ERM-409
* Fixed bug where not all the agreement lines were being fetched.
* Fixed bug where resetting query term wouldn't execute a search. ERM-426
* Added ability to filter e-resources by source KB. ERM-299
* Added agreement filtering by internal contact. ERM-421
* Display coverage in e-resources/e-resources in package. ERM-372
* Fixed links to titles from basket contents. ERM-438
* Tweaked license status widths. ERM-439

## 3.1.1 2019-08-21
* Use locally-defined saveAndClose translation key.

## 3.1.0 2019-08-20
* Allow only one Vendor organization to be selected.
* Render Internal Contacts as cards. ERM-309
* Added support for `mod-organizations-storage` 2.0

## 3.0.0 2019-07-23
* Support Orders interface 7.0. ERM-350
* Added ability to attach ERM Usage Data Providers to Agreements. ERM-273
* Added ability to attach PO Lines to Agreement Lines. ERM-239, 240, 242
* Support date strings instead of datetime strings. ERM-276
* Changed various accordion layouts,  IDs and tags. ERM-318, 340
* Changed navigation between Agreements and E-Resources. ERM-237
* Refactored to use `SearchAndSortQuery`. ERM-253

## 2.5.0 2019-06-11
* Added ability to manage Notes for Agreements. ERM-284

## 2.4.0 2019-05-21
 * ERM-238 Clearing the organization filter value not working as expected in Agreements
 * ERM-222 System error on saving an agreement with an empty organization field group
 * ERM-221 System error on saving an agreement with an empty Agreement Line
 * ERM-220 Support Organizations app as source of Organizations in Agreements
   * ERM-234 Front-end updates
 * ERM-216 "Preview" panel does not open after the "Search & filter" panel has been collapsed and uncollapsed.
 * ERM-212 Remove horizontal rules between filters in Agreements and License apps
 * ERM-186 Change the 'hide e-resource functionality' option in Agreements
 * ERM-180 Use generalised contacts component
 * ERM-75  Clearing the organization filter value not working as expected

## 2.3.0 2019-05-07

 * ERM-197 Change "ERM" to "Agreements" in UI
 * ERM-166 Remove unwanted extra license section
 * ERM-133 Configure Document Categories
 * ERM-143 Add License / Supplementaty License Information Panel UI
 * ERM-181 Fix data sync issue with GOKb (Resumption Token and Broken Coverage)
 * ERM-139 Convert from SearchAndSort to SearchAndSortQuery
 * ERM-79 Set supplementary informaiton for a license
 * ERM-173 Manage Tags on Agreements
 * ERM-174 Seach Agreements by Tag
 * ERM-194 BUGFIX: Opening edit/create license with only one page does not work

## 2.2.0 2019-04-08

 * ERM-115 Provide correct data for agreement line
 * ERM-111 Build Settings Page
 * ERM-112 Build Wrapper Component for supression
 * ERM-113 Use Wrapper Component in Agreements
 * ERM-114 Write tests
 * ERM-98 Rendering Controlling Terms License
 * ERM-127 Resources with no coverage set should not display
 * ERM-110 Agreement Detail record - View attached EBSCO eResource
 * ERM-109 Support the ability to create an agreement from eHoldings
 * ERM-108 Supress agreements app functions
 * ERM-64 Show Controlling License Terms

## 2.1.0 2019-03-22
 * ERM-130 Sort order of multiple coverage statements should be ascending by start date
 * ERM-129 Cannot edit custom coverage dates once they have been added
 * ERM-90 Display identifiers in e-resource preview pane
 * ERM-89 Display identifiers in e-resource search & sort
 * ERM-78 General license note (on agreement) should not display if not populated
 * ERM-65 Manage custom entitlement coverage for titles
   * ERM-91 Indicate the coverage for a title within an Agreement

## 2.0.3 2019-03-12
 * ERM-59 Manage licenses linked to agreements
 * ERM-46 Update note about a license for an agreement
 * ERM-41 Manage external licenses for an Agreement
   * ERM-44 Remove an external license from an Agreement
   * ERM-43 Edit external license details
   * ERM-42 Add external license for an Agreement
 * ERM-35 Filter Agreement Search Results by Organisation Role
 * ERM-7 Add an Organisation to a License
   * ERM-29 Create and use erm-stripes-components repo

## 2.0.1 2019-02-23

 * ERM-1 eResource Managers can manually create licenses
 * ERM-6 Set pre-defined Terms for a License
 * ERM-7 Add an Organisation to a License
 * ERM-8 Add an Organisation to an existing License
 * ERM-10 Remove an Organisation from a License
 * ERM-11 eResource Managers can edit basic license details
 * ERM-12 Filter License Search Results by License Status
 * ERM-13 Filter License Search Results by License Type
 * ERM-16 Set open-ended License Expiry
 * ERM-17 See basic License details in search results
 * ERM-35 Filter Agreement Search Results by Organisation RoleZ

## 2.0.0 2019-01-18

* Upgrade to Stripes 2.0
* Use @folio/stripes-erm-components for shared components.
* Added ability to set External Licenses for Agreements.

## 1.3.0 2019-01-18

* Added support to enable ui-plugin-find-agreement.
* Added Organizations filter to Agreements.

## 1.2.0 2019-01-04

* Work on controlled vocab settings
* Added ability to add internal contacts to Agreements.

## 1.1.0 2018-12-11

* Added Basket
* Removed Titles and KB views.
* Added ability to add entitlements to Agreements
* Added ability to add organizations to Agreements

## 1.0.0 2018-11-24

* New app created with stripes-cli
* Added Agreements, Titles, and KB list views.
* Added Agreement detail view.
* Added Agreement lines view.
* Added E-resources pane, list, and detail view.
