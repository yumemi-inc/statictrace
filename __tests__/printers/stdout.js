const { run } = require("../../build/lib");
const dotenv = require("dotenv");

dotenv.config();

it("Prints to stdout correctly", () => {
  const output = run(process.env.TS_PROJECT_TEST_CONFIG);
  expect(output).toMatchSnapshot();
});

it("Accepts custom printers", () => {
  const output = run(process.env.TS_PROJECT_TEST_CONFIG, new JsonPrinter());
  expect(output).toMatchSnapshot();
});

class JsonPrinter {
  print(graph) {
    const printable = graph.into();
    let obj = {};
    for (let fns of printable.values()) {
      for (let fn of fns) {
        obj[fn.name] = fn.level;
      }
    }
    return JSON.stringify(obj, null, 2);
  }
}
