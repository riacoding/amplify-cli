const fs = require('fs');
const { readJsonFromDart } = require('../lib/dart-fs');

describe('Dart configuration file', () => {
  let tmpDir;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync('amplify-frontend-flutter');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  const writeTempConfig = config => {
    const filepath = `${tmpDir}/amplifyconfiguration.dart`;
    fs.writeFileSync(filepath, config);
    return filepath;
  };

  const runTest = (name, config) => {
    it(name, () => {
      const configPath = writeTempConfig(config);
      const parsedConfig = readJsonFromDart(configPath);
      expect(parsedConfig).toMatchObject({
        UserAgent: 'aws-amplify-cli/2.0',
        Version: '1.0',
      });
    });
  };

  runTest('parses old format', `const amplifyconfig = ''' {
    "UserAgent": "aws-amplify-cli/2.0",
    "Version": "1.0"
}''';`);

  runTest('parses new format', `const amplifyconfig = '''{
    "UserAgent": "aws-amplify-cli/2.0",
    "Version": "1.0"
}''';`);

  runTest('parses with data before', `
    const someOtherConfig = '{}';

    const amplifyconfig = '''{
        "UserAgent": "aws-amplify-cli/2.0",
        "Version": "1.0"
    }''';`);

  runTest('parses with data after', `
  const amplifyconfig = '''{
        "UserAgent": "aws-amplify-cli/2.0",
        "Version": "1.0"
    }''';
    
    const someOtherConfig = {};`);
});
