# Change history for ui-agreements

## 12.1.0 IN PROGRESS
  * ERM-3705 Update UI to reflect BE changes: `userLimit` type (`number` → `string`) and schema cleanup

## 12.0.2 2024-04-15
  * ERM-3673 Agreements: query mixup in Agreements and Local KB package search box
  * ERM-3652 Extend tests for Package multi-select/synchronise switch

## 12.0.1 2025-04-01
  * ERM-3670 When package `syncContentsFromSource` is not set, display with a `-`

## 12.0.0 2025-03-13
  * ERM-3608 *BREAKING* Stripes v10 dependencies update
    * Updated all stripes-* dependencies for the stripes v10 upgrade along with react-intl and formatjs/cli
  * ERM-3581 Support changing the sync status of a single package in the local KB
  * ERM-3580 feat: Add checkbox functionality to package list
  * ERM-3569 Add search and filter options by package synchronise property
  * ERM-3568 Add package synchronise property in UI
  * ERM-3452 Centralise content filter array used in Licenses and Agreements
  * ERM-3446 Agreements: Basket should use the agreements look-up component instead of single select search

## 11.1.1 2024-11-29
  * ERM-3449 The Agreement content filter is not set back to original empty selection state
  * ERM-3392 Agreements: Changes to the field content type are not saved, but a success message is displayed
  * ERM 3390 Agreements > Show columns: Name column should not be in the list of unselectable columns

## 11.1.0 2024-10-31
  * ERM-3375 Update module license and guidance for ui-agreements
  * ERM-3365 UI Agreements does not display monograph information if TitleInstance.Type.label is changed
  * ERM-3362 Error on viewing ERM basket
  * ERM-3350 Review and cleanup Module Descriptor for ui-agreements
  * ERM-3332 Add documents filter to agreement line search
  * ERM-3331 Add documents to agreement lines
  * ERM-3297 Block save on invalid date in agreement edit
  * ERM-3277 Add Material Type filter (Print/Electronic) to Title search
  * ERM-3276 Agreements: Can't save page size = 100 in display settings
  * ERM-3240 Inline MCL Prev/Next pagination can try to access non-existant pages when syncToLocation != true
  * ERM-3231 React v19: refactor ui-agreements away from default props for functional components
  * ERM-3183 Create agreement line form does not clear on "Save and create another"
  * ERM-3165 Replace moment with dayjs across app suite
  * ERM-3135 Sort by Name column does not work in Agreement line search and sort

## 11.0.3 2024-07-05
  * ERM-3288 Fix permission on /erm/files/{id}/raw in mod-agreements
  * FOLIO-4086 Fix GitHub Actions workflow not running for tags

## 11.0.2 2024-05-28
  * ERM-3248 Use static endpoints for /resources and /entitlementOptions in Poppy Compatible release 
  * ERM-3246 Improve performance of entitlementOptions endpoint
  * ERM-3239 Query all titles rather than just /electronic in local KB title search
  * ERM-3220 Update pagination mechanisms for MCLs to work without stats
  * ERM-3186 Change default search options for Local KB titles to exclude identifiers

## 11.0.1 2024-04-19
  * Change default search options for Local KB titles to exclude identifiers
  * ERM-3182 Scrolling content in license view pane can overlap header (Also impacted agreements)
  * ERM-3172 The failure of reference object when displaying agreement line should be handled elegantly
  * Translations

## 11.0.0 2024-03-22
* ERM-3168 Add option to control which columns display in the Agreement search and sort results
* ERM-3167 Add option to control which columns display in the Agreement Line search and sort results
* ERM-3133 Add option to control which columns display in the Agreement->Agreement Lines MCL
* ERM-3129 Remove explicit typescript version
* ERM-3128 Focus "Start date" on "Add custom coverage"
* ERM-3119 Add Organisation status to organisation card display
* ERM-3093 Switch to pagination (from 'load more') controls in Title view
* ERM-3092 Switch to pagination (from 'load more') controls in Package view
* ERM-3091 Switch to pagination (from 'load more') controls in Agreements view
* ERM-3085 Use document filter from stripes-erm-components, remove changes from ERM-2983
* ERM-3081 Do not add a space after search operator when doing groupings
* ERM-3062 Add has/has not filter in Licenses and amendments
* ERM-1908 Swap Agreements Pick lists settings screen to single 4 pane based layout
* *BREAKING* Switched to erm interface 7, licenses interface 6

## 10.0.1 2023-11-09
* ERM-3082 Backport grouping and spaces fix for Poppy
* ERM-3065 Agreement lines are displayed by default on the "Agreement lines" pane.
* ERM-3061 On setting document filter spaces are stripped from filter value

## 10.0.0 2023-10-12
* ERM-3052 In Document filter builder OR displays on screen instead of AND
* ERM-3046 Agreement lines search MCL - Implement MCL Next/Previous pagination
* ERM-3038 Creating adding an eHolding resource to a new agreement fails
* ERM-3036 unlock @rehooks/local-storage from 2.4.4
* ERM-3026 *BREAKING* bump `react-intl` to `v6.4.4`
* ERM-3016 QIndex control for Titles SASQ
* ERM-3013 Icon of the associated agreements should change if it is a closed agreement
* ERM-3012 Agreement relationship type translations don't show in Agreements UI
* ERM-3010 Add has/has not filter in Agreements
* ERM-3001 Update Node.js to v18 in GitHub Actions
* ERM-2992 Switch default behaviour for Agreements to not expand items
* ERM-2983 Added documents filter to Agreements search and sort
* ERM-2979 Add agreement line summary information and navigation link to Agreement edit view
  * reuse FormLines component
* ERM-2978 Edition, volume, issue render on new line
* ERM-2973 Replace naive fetch hooks with parallelised ones (and deprecate)
* ERM-2967 Use useChunkedCQLFetch consistently across ERM
* ERM-2937 Titles Tab - Implement MCL Next/Previous pagination
* ERM-2934 Agreement lines simple search widget definition
* ERM-2923 Add created/updated metadata for Resources in local KB
* ERM-2922 On changing the fields to be searched, the text string is cleared from the search box
* ERM-2920 Replace "External data source" search
* ERM-2641 Upgrade to Grails 5 (including Hibernate 5.6.x) for Poppy
  * Added okapi interface dependency on new erm interface 6.0
  * Added okapi interface dependency on new licenses interface 5.0
* ERM-2630 Add new endpoint for external KB "push" process
* ERM-2624 Add view only permissions for Agreement settings
* ERM-2612 Add support for content type property on Agreement
* ERM-2506 Display licenses sorted in predictable order in Agreements
* ERM-2421 Remove Agreement lines from Agreement Edit view
* ERM-2054 Platforms Tab - Implement MCL Next/Previous pagination
* ERM-2053 Packages Tab - Implement MCL Next/Previous pagination
* ERM-2052 Agreements Tab - Implement MCL Next/Previous pagination
* ERM-1110 Add templated URLs to PCI display
* STRIPES-870 *BREAKING* upgrade react to v18
  * ERM-2991 Upgrade ui-agreements React to v18

## 9.0.0 2023-02-22
* ERM-2613 Remove unneeded `react-redux`. Upgrade `stripes-acq-components` to `v4`
* ERM-2596 Increment ui-agreements to Stripes v8
* ERM-2574 fix deprecated default export from 'zustand' in ui-agreements
* ERM-2572 fix deprecated default export from 'zustand'
* ERM-2562 Increment ui-agreements to Stripes v8
* ERM-2533 Refactor interfaces code to react-query
* ERM-2511 Make use of titles/electronic endpoint in ui-agreements
* ERM-2510 Titles Endpoint does not have functionality of eresources "electronic" endpoint
* ERM-2489 Reduce number eresource retrieved to 25 rather than 100
* ERM-2486 Refactor agreement routes
* ERM-2481 Add "Reason for closure" filter to Agreements search
* ERM-2468 Give titles, packages and PCIs separate icons
* ERM-2467 Change export file name and file extension in Agreements and Local KB admin
* ERM-2465 Is Perpetual dropdown not populated in Agreement create/edit form
* ERM-2463 Implement FormattedDateTime Interactor Pattern
* ERM-2454 Bump ui-agreements erm-components dep
* ERM-2452 Remove eresources search
* ERM-2449 Add Cancellation date filter to Agreements search and sort
* ERM-2445 Display a callout when exporting an Agreement
* ERM-2434 "customProperties.ctx.title": "" in en.json
* ERM-2423 Performance issues on displaying external agreement lines
* ERM-2417 Do not show results on local KB e-resource search until a search or filter applied
* ERM-2416 Separate title search and package search in local KB e-resource searching
* ERM-2399 Missing Translations
* ERM-2397 AgreementFilters should not be rendered within <form> intended for search field
* ERM-2356 Add an option to "create another" agreement line
* ERM-2339 Return no results on first display of Agreement Line search
* ERM-2330 Add new tab group for switching between Agreements and Local KB searches
* ERM-2309 Filter package resources by availabilityConstraints
* ERM-2308 Display list of availabilityConstraints in package display
* ERM-2289 Agreement line search and filter screen initial implementation
* ERM-2183 Basket functionality still uses stripes-connect
* ERM-1242 Frontend tests for URL customisation in RTL

## 8.3.0 2022-10-27
* ERM-2382 Unchecking all search field boxes in Agreements carries out search with no fields
* ERM-2377 Show a user-friendly message when deleting a pick list with 0 values which is assigned to a Supplementary Property
* ERM-2371 In custom property Type dropdown Refdata and Refdata (multi-select) should be labelled "Pick list" and "Pick list (multi-select)"
* ERM-2369 Agreements: Open Access properties accordion name is incorrect
* ERM-2368 Add links from the Agreement lines search to the parent Agreements
* ERM-2359 Values entered into decimal and integer supp prop fields display as "NaN"
* ERM-2355 Aria label for agreement line search incorrect
* ERM-2353 Replace "Detached" with "Unlinked" in Agreement Line filter
* ERM-2352 Navigation to switch between Agreements / Local KB does not display correctly if basket button not present
* ERM-2351 Show error on Agreement line view if user does not have permission for orders.po-lines.collection.get
* ERM-2347 Add all available package identifiers to extended package information in the package view
* ERM-2346 Related Entitlement endpoint unnecessarily hit on package view
* ERM-2344 Add link from an Agreement to an Agreement lines search filtered by the agreementAdd link from an Agreement to an Agreement lines search filtered by the agreement
* ERM-2343 Default selection of Agreement text search fields
* ERM-2340 "Reset all" in Agreement Line search does not correctly reset Agreement or Order filters
* ERM-2338 Selecting "Agreement line type" boxes in filter should use OR (||) not AND
* ERM-2335 Agreement lines search and filter updates
* ERM-2318 stripes-erm-components should be a peer
* ERM-2316 Update for stripes-kint-components translation handling changes
* ERM-2315 Display all identifiers in a namespace for a resource
* ERM-2293 Remove BigTest/Nightmare dependencies and tests (ui-agreements)
* ERM-2290 Add property options to Agreements text search
* ERM-2283 Upgrade Users interface to 16.0
* ERM-2278 Refactor ui-plugin-find-agreement to react-query
* ERM-2234 Replace withKiwtFieldArray with useKiwtFieldArray
* ERM-2233 Remove redundant duplicate utility functions in ui-agreements
* ERM-2220 ERM Comparisons: e-resources plugin is not filtering by Package when used for first time
* ERM-2214 Migrate ERM Picklist Settings to new EditableRefdataList component
  * ERM-2215 Migrate ui-agreements Picklist Settings
* ERM-2173 New / Edit supplementary property and Term modals: UX improvements (Settings app)
* ERM-2157 Add multi-select support for custom properties
* ERM-2120 Display package identifiers in Agreements UI
* ERM-1986 Move identifiers between title instances
* ERM-1906 Re-work Supplementary Properties settings screen to use list that can be filtered and fourth pane display
* Bump to stripes-erm-components ^7.0.0

## 8.2.2 2022-08-02
* ERM-2297 Number of tags doesn't update on adding tags to agreement or agreement line

## 8.2.1 2022-07-29
* ERM-2300 On loading entitlements for Agreement edit screen incorrect parameters are supplied
* ERM-2299 Error on trying to save an agreement with a linked license
* ERM-2297 Number of tags doesn't update on adding tags to agreement or agreement line
* ERM-2284 Attempt to delete Agreement Line fails
* ERM-2282 Toast message fails to display to user
* ERM-2280 Incorrect labels in move identifiers UI

## 8.2.0 2022-07-04
* ERM-2229 On creating Agreement, agreement creation view does not close after save
* ERM-2225 Amendment/License link status values do not update immediately after Agreement edit
* ERM-2223 Select tags in Search and Filter screen does not work
* ERM-2217 In custom property Type dropdown Refdata and Refdata (multi-select) should be labelled "Pick list" and "Pick list (multi-select)"
* ERM-2208 Resources per page for "E-resources in package" not obeying display setting
* ERM-2207 User with permission "ui-agreements.generalSettings.manage" cannot edit settings
* ERM-2206 ISSN not displaying in "E-resources covered by this agreement" list
* ERM-2205 List of Agreement statuses in search and filter does not update after changing label
* ERM-2204 Toast error message not displayed on failure to delete custom property
* ERM-2203 Only retrieve license terms if there is at least one license linked to agreement
* ERM-2176 Chunked order line fetching broken in Agreements following migration to react-query
* ERM-2175 Migrate Edit/Create routes to react-query where we have regressions
* ERM-2159 Bump frontend dependency on stripes-kint-components
* ERM-2147 update outdated dependencies in ui-agreements
* ERM-2106 Refactor away from react-intl-safe-html (ui-agreements)
* ERM-2096 Replace babel-eslint with @babel/eslint-parser
* ERM-2086 Labels in PackageInfo component are not translatable
* ERM-2079 Display of related license terms in agreements should use stripes-kint-components
* ERM-2076 Display package status and availability in package card
* ERM-2072 A maximum of 10 custom properties are retrieved for agreements and licenses
* ERM-2066 Number of tags doesn't update on adding tags to agreement line (Refactor to react-query from stripes-connect)
* ERM-2063 Users information not retrieved/displayed for Internal Contact for agreement
* ERM-2061 Search by extended Package metadata in resource search
* ERM-2060 Display extended Package metadata in package display
* ERM-2048 Add support for Date across Agreement filters
* ERM-2044 Ability to make custom properties deprecated
* ERM-1979 Add/Edit configurable OA properties for an Agreement
* ERM-1971 Bump eslint-config stripes version
* ERM-778 Add Date type to customProperties

## 8.1.0 2022-03-03
* ERM-1999. "Load More" button not working - Agreement Lines
* ERM-1990. Add hyperlink to ERM Comparison comparison points (Registry entry)
* ERM-1976. Agreements > Agreement line: Wrong date format when in view screen
* ERM-1974. Agreements: Organization interface credentials malfunction
* ERM-1973. Agreements: Organization interface data hidden
* ERM-1953. Re-implement display of acquistionsMethods following order-lines 3.0 interface
* ERM-1948. Error on accessing /erm/eresources
* ERM-1940. Add AppSettings panel to Agreements
* ERM-1937. Support order-lines 3.0 interface
* ERM-1931. Sort agreement lines by name then reference then UUID in the UI
* ERM-1929. Support configuration of document storage in agreement settings
* ERM-1922. Display "-" in Count column for Agreement lines that do not link to a resource
* ERM-1921. Display selected status of single title resources from eHoldings in Agreement Line
* ERM-1893. Upgrade `@folio/react-intl-safe-html` for `@folio/stripes` `v7` compatibility.
* ERM-1887. Select an agreement results in Error
* ERM-1762. Add hide accordions option to settings.
* ERM-1757. Agreements: Apply keyboard shortcuts modal guidelines
* ERM-1744. Add Organisations to Agreements simple search widget definition
* ERM-1490. Remove `OrgRoleSettings` from `src/settings`.
* FAT-81. ui-agreements: UI tests replacement with RTL/Jest
  * ERM-1661. components / views
    * ERM-1681. UrlCustomizerForm
    * ERM-1680. UrlCustomizer
    * ERM-1678. TitleForm
    * ERM-1677. Title
    * ERM-1676. Platforms
    * ERM-1673. Platform
    * ERM-1672. Package
    * ERM-1671. PCIForm
    * ERM-1670. PCI
    * ERM-1669. EResources
    * ERM-1668. EResource
    * ERM-1667. Basket
    * ERM-1666. Agreements
    * ERM-1665. AgreementLineForm
    * ERM-1664. AgreementLine
    * ERM-1663. AgreementForm
    * ERM-1662. Agreement
  * ERM-1495. SupplementaryPropertiesConfigForm
  * ERM-1494. SuppressFromDiscoveryFields
  * ERM-1493. SupplementaryPropertiesConfigRoute
  * ERM-1492. PickListValueSettings
  * ERM-1491. PickListSettings
  * ERM-1490. OrgRoleSettings
  * ERM-1489. GeneralSettingsForm
  * ERM-1488. GeneralSettings
  * ERM-1487. withFileHandlers
  * ERM-1486. UrlCustomizerViewRoute
  * ERM-1485. UrlCustomizerEditRoute
  * ERM-1484. UrlCustomizerCreateRoute
  * ERM-1483. PlatformsRoute
  * ERM-1482. PlatformViewRoute
  * ERM-1481. PlatformEditRoute
  * ERM-1480. NoteViewRoute
  * ERM-1479. NoteEditRoute
  * ERM-1478. NoteCreateRoute
  * ERM-1477. EResourcesRoute
  * ERM-1476. EResourceViewRoute
  * ERM-1475. EResourceEditRoute
  * ERM-1474. BasketRoute
  * ERM-1472. AgreementViewRoute
  * ERM-1471. AgreementLineViewRoute
  * ERM-1470. AgreementLineEditRoute
  * ERM-1469. AgreementLineCreateRoute
  * ERM-1468. AgreementEditRoute
  * ERM-1467. AgreementCreateRoute
  * ERM-1292 UsageDataProvidersFieldArray
    * ERM-1411. UsageDataProvidersFieldArray
    * ERM-1410. UsageDataProviderField
  * ERM-1291. TitleCardExternal
  * ERM-1290. TitleCard
    * ERM-1409. TitleCardInfo
    * ERM-1408. TitleCard
    * ERM-1407. SerialResourceInfo
    * ERM-1406. MonographResourceInfo
  * ERM-1289. RelatedTitleInfo
  * ERM-1287. PlatformSections
    * ERM-1403. PlatformUrlCustomization
    * ERM-1402. PlatformProxySettings
    * ERM-1401. PlatformInfo
  * ERM-1286. PackageCardExternal
  * ERM-1285. PackageCard
  * ERM-1284. POLinesFieldArray
    * ERM-1400. POLinesFieldArray
    * ERM-1399. POLineField
  * ERM-1282. OpenBasketButton
  * ERM-1269. EResourceFilters
  * ERM-1260. AgreementsPeriodsFieldArray
    * ERM-1357. AgreementPeriodsFieldArray
    * ERM-1356. AgreementPeriodField
  * ERM-1259. AgreementLinesFieldArray
    * ERM-1355. AgreementLinesFieldArray
    * ERM-1354. AgreementLineField
  * ERM-1258. AgreementLineSections
    * ERM-1348. FormEresource
  * ERM-1257. AgreementFilters

## 8.0.1 2021-11-08
* Handle 414 error exception when requesting an agreement line with large number of POLines. Refs ERM-1915
## 8.0.0 2021-10-07
* Refactor mod-configuration permissions to require specific perms instead of all permissions. ERM-1881
* Fixed bug with error on saving an agreement if a change is made to the visibility (internal) flag of a primary property without populating it. ERM-1771
* Upgrade to stripes v7
* Support separate options to duplicate supplementary docs and supplementary properties on duplicating an agreement. ERM-1848
* Standardise identifier display for titleInstances and relatedTitles. ERM-1773
* Fall back to using identifier from `issn` namespace if no identifier in `eissn` namespace. ERM-1772
* Add date created and last updated metadata into to Agreements. ERM-1231
* UX improvements. ERM-1145, ERM-1853
* Display eresource icon in eresources covered by this agreement MCL. ERM-1556
* Fixed bug with license note not displaying in Agreements view. ERM-1750
* Display keyboard shortcuts modal. ERM-1642
* Add sorting capability on Agreement status by its label. ERM-1691
* Included interface dependency for erm 5.0
* Included interface dependency for licenses 4.0

## 6.1.0 2021-06-16
* ERM-1725 Update version of interfaces due to supporting MARC Authority records
* ERM-1682 Set up ui-agreements Registry entry.
* ERM-1640 Locked rehooks/local-storage version to 2.4.0
* ERM-1621 Permissions for view agreements, resources, platforms should be linked
* ERM-1619 Actions menu doesn't display for Agreements even when there are valid actions for the user
* ERM-1610 Implement sort by start/end/cancellation dates in Agreements search and sort MCL
* ERM-1609 Hide supplementary properties accordion if zero populated terms and no primary terms
* ERM-1607 Add count of populated custom properties in accordion header
* ERM-1593 Add descriptions to visible permission set in ui-agreements
* ERM-1547 Related agreements: Improve error management when the user attempts to link an agreement to itself
* ERM-1215 "Platforms" button should only display in search and filter pane to users with "ui-agreements.platforms.view" permission
* ERM-1214 "E-resources" button should only display in search and filter pane to users with "ui-agreements.resources.view" permission
* Add a surface for Stripes handler modules to present extensions
* Babel Parser dependency fixes

##  6.0.0 2021-03-18
* Purchase Order Line details not retrieved from /orders/order-lines for Entitlement. ERM-1606
* Update displayName for ui-agreements.platforms.X permissions. ERM-1592
* License and business terms accordion should only display when there is a Controlling license. ERM-1578
* When displaying Interfaces for organisations in an Agreement full details are only retrieved for 10. ERM-1559
* Update stripes-cli to v2. ERM-1550
* Support order-lines 2.0 interface. ERM-1549
* Add tag search to eresources search and sort. ERM-1544
* Added conditional rendering of accordions in Agreement view. ERM-1537
* Tweaked display to highlight current/next/previous period ERM-1534
* Agreement start and end dates should be the earliest period start and latest period end date respectively ERM-1533
* Refactored AgreementFilters to functional component, added date filter. ERM-1532
* Changed Other Periods accordion to All Periods ERM-1531
* Update on screen text on Agreements settings page ERM-1527
* Actions on the Agreement pane cause the fixed panel to become transparent ERM-1464
* New shortcut key | Duplicate a record. ERM-1458
* Error on viewing a URL Customiser. ERM-1456
* Add Discovery Settings accordion for "Suppress from discovery" information to Title Instance, PCI and Agreement Line display. ERM-1250
* Incorrect message on PCI screen. ERM-1236
* Add POL/Inventory Instance details to Agreement Line display. ERM-1228
* Platform: Action button should not show if user would see no options in Action dropdown. ERM-1225
* Removing content of "Local platform code" and saving should result in empty platform code. ERM-1224
* Agreement lines from previous agreement show when switching to view another agreement. ERM-1223
* Agreements > Platforms: "search" keyboard shortcut does not work. ERM-1219
* Incorrect error message is displayed when the user deletes a supplementary property which is in use on an agreement. ERM-1218
* Setup RTL test infrastructure. ERM-1216
* Dropdowns do not display values when editing Agreements. ERM-1206
* Agreement lines do not display correctly in Agreement edit view. ERM-1205
* Add UI settings to control the number of items displayed in Agreements MCLs. ERM-1190
* Add FOLIO keyboard shortcuts to Agreements-Platforms. ERM-1186
* Add "Edit" screen for title instance resources. ERM-1184
* Support user access to platform records. ERM-1156
* Add FOLIO keyboard shortcuts to Agreements. ERM-1151
* E-resources covered by this agreement: Link to PCI instead of TI. ERM-1148
* Apply a four column layout to the Agreement preview pane. ERM-1137
* Support for e-resource proxies and url customisers ERM-1102
  * UI for managing proxy server configurations. ERM-1109
  * UIs for managing proxy url and customiser url configurations from the Platform context. ERM-1194
* Added optionalOkapiInterfaces to package.json. ERM-940
* Removed edit button in agreements detail view. ERM-693
* UI tests replacement with RTL/Jest FAT-81
  * AgreementsRoute ERM-1473
  * MCLPaginationFields ERM-1460
  * NoPermissions ERM-1281
  * IfEResourcesEnabled ERM-1277
  * FolioLink ERM-1276
  * EntitlementsAgreementsList ERM-1275
  * EResourceSections ERM-1274
    * PackageInfo.js ERM-1395
    * PackageContents.js ERM-1394
    * PCIInfo.js ERM-1393
    * PCIFormInfo.js ERM-1392
    * PCIFormCoverage.js ERM-1391
    * PCICoverage.js ERM-1390
    * Agreements.js ERM-1389
    * AcquisitionOptions.js ERM-1388
  * EResourceProvider ERM-1273
  * EResourceLink ERM-1272
  * EResourceKB ERM-1271
  * EResourceIdentifier ERM-1270
  * EResourceCount ERM-1268
  * DuplicateAgreementModal ERM-1267
  * CustomCoverageIcon ERM-1266
  * CoverageFieldArray ERM-1265
  * Coverage ERM-1264
    * CoverageFieldArray.js ERM-1387
    * CoverageField.js ERM-1386
    * MonographCoverage.js ERM-1385
    * Coverage.js ERM-1384
  * BasketSelector ERM-1263
  * BasketList ERM-1262
  * AddToBasketButton ERM-1256
* Upgrade to Stripes 6.0
* Modify keyboard shortcuts, use handlers from stripes-components, stripes-erm-components
* Rename instance-bulk to inventory-record-bulk. UIIN-1368
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
