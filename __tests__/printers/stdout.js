const { run } = require("../../build/lib");
const dotenv = require("dotenv");

dotenv.config();

it("Prints to stdout correctly", () => {
  const output = run(process.env.TS_PROJECT_TEST_CONFIG);
  expect(output).toMatchSnapshot();
});
