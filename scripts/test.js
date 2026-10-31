// Load every test in one process. This is portable across Windows/Linux and
// also works in restricted CI runners that disallow child-process isolation.
require('../apps/demo-api/test/app.test');
require('../tools/backup-validator/index.test');
require('../tools/container-cleaner/index.test');
require('../tools/deployment-verifier/index.test');
require('../tools/environment-doctor/index.test');
require('../tools/iac-drift-reporter/index.test');
require('../tools/namespace-bootstrapper/index.test');
