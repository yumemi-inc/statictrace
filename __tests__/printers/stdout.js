const { run } = require("../../build/lib");

it("Prints to stdout correctly", () => {
  const output = run(process.env.TS_PROJECT_TEST_CONFIG);
  expect(output).toMatchSnapshot();
});
