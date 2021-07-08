const { run } = require('../../build/lib');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

it('Prints mermaid correctly', async () => {
  const configPath = path.join(
    process.env.TS_PROJECT_TEST,
    'basic',
    'tsconfig.json'
  );
  const output = await run(configPath, 'mermaid');
  expect(output).toMatchSnapshot();
});
