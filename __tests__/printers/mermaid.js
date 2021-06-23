const { run } = require('../../build/lib');
const dotenv = require('dotenv');
const { MermaidPrinter } = require('../../build/printer');

dotenv.config();

it('Prints mermaid correctly', async () => {
  const output = await run(process.env.TS_PROJECT_TEST_CONFIG, new MermaidPrinter());
  expect(output).toMatchSnapshot();
});
