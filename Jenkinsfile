@Library ('folio_jenkins_shared_libs') _

buildNPM {
  publishModDescriptor = 'yes'
  runRegression = 'no'
  runLint = 'yes'
  runSonarqube = true
  runTest = 'yes'
  runTestOptions = '--karma.singleRun --karma.browsers ChromeDocker --karma.reporters mocha junit --coverage'
}
