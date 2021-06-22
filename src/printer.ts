import { Into, Printable, Printer } from './types';

export class TextPrinter implements Printer {
  print(entrypointGraph: Into<Printable>) {
    const printable = entrypointGraph.into();

    let output = '';

    for (const [ep, tracedCalls] of printable.entries()) {
      output += '=======================\n';
      output += 'Entrypoint: ' + ep + '\n';
      for (const call of tracedCalls) {
        output += '\t'.repeat(call.level()) + call.name() + '\n';
      }
      output += '\n';
    }

    return output;
  }
}

export class MermaidPrinter implements Printer {
  print(graph: Into<Printable>) {
    const printable = graph.into();

    const mermaidGraphs = [];

    for (const [_, calls] of printable.entries()) {
      // Use set to avoid meaningless duplicated arrows
      const arrows = new Set();
      for (const call of calls) {
        let enclosing = call.enclosing();
        if (enclosing != null) {
          arrows.add(`\t${enclosing.name()} --> ${call.name()}\n`);
        }
      }
      mermaidGraphs.push(
        `\`\`\`mermaid\ngraph TD\n${Array.from(arrows).join('')}\`\`\``
      );
    }

    return mermaidGraphs.join('\n');
  }
}
