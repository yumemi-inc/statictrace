import { Project } from "ts-morph";
import path from "path";

type FlowName = string;

const project = new Project({
  tsConfigFilePath: path.resolve(process.cwd(), "fixtures/tsconfig.json"),
});

class Trace {
  flowName: string;
  order: string;
  funcName: string;

  constructor(flowName: string, order: string, funcName: string) {
    this.flowName = flowName;
    this.order = order.trim();
    this.funcName = funcName;
  }
}

for (let sourceFile of project.getSourceFiles()) {
  const executionFlows: Map<FlowName, Array<Trace>> = new Map();

  for (let func of sourceFile.getFunctions()) {
    const signature = func.getSignature();
    const traceTags = signature
      .getJsDocTags()
      .filter((tag) => tag.getName() == "trace");

    const traces = traceTags.map((tag) => {
      const { text } = tag.getText()[0];
      const [flowName, order] = text.split(":");
      return new Trace(flowName, order, func.getName()!);
    });

    for (const trace of traces) {
      if (!executionFlows.get(trace.flowName)) {
        executionFlows.set(trace.flowName, []);
      }

      let trs = executionFlows.get(trace.flowName)!;
      trs.push(trace);
      executionFlows.set(trace.flowName, trs);
    }
  }

  for (const [flowName, traces] of executionFlows.entries()) {
    traces.sort((a, b) => Number(a.order < b.order));
    console.log(flowName);
    console.log(traces.map((t) => t.funcName).join(" -> "));
  }
}
