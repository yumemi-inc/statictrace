import { Printable, Printer } from "./types";

export class StdoutPrinter implements Printer {
  print(entrypointGraph: Printable) {
    let output = "";

    for (const [ep, tracedCalls] of entrypointGraph.entries()) {
      output += "=======================\n";
      output += "Entrypoint: " + ep + "\n";
      for (const call of tracedCalls) {
        output += "\t".repeat(call.level) + call.name + "\n";
      }
      output += "\n";
    }

    return output;
  }
}
