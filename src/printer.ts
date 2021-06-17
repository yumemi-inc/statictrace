import { Into, Printable, Printer } from "./types";

export class TextPrinter implements Printer {
  print(entrypointGraph: Into<Printable>) {
    const printable = entrypointGraph.into();

    let output = "";

    for (const [ep, tracedCalls] of printable.entries()) {
      output += "=======================\n";
      output += "Entrypoint: " + ep + "\n";
      for (const call of tracedCalls) {
        output += "\t".repeat(call.level()) + call.name() + "\n";
      }
      output += "\n";
    }

    return output;
  }
}

/* export class MermaidPrinter implements Printer {
  print(graph: Into<Printable>) {
    const printable = graph.into();

    let mermaidGraphs = [];

    for (const [ep, calls] of printable.entries()) {
      let arrows = lines.push();
    }
  }
} */
