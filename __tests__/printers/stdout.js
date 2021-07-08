const { run } = require('../../build/lib');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const configPath = path.join(
  process.env.TS_PROJECT_TEST,
  'basic',
  'tsconfig.json'
);

it('Prints to stdout correctly', async () => {
  const output = await run(configPath);
  expect(output).toMatchSnapshot();
});
