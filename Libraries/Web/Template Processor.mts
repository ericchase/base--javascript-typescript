import * as Parser from 'node-html-parser.mts';
import NodeFs from 'node:fs/promises.mts';

const fileMap = new Map<string, string>();
export async function loadHtmlFile(filepath: string) {
  if (!fileMap.has(filepath)) {
    const text = await NodeFs.readFile(filepath, { encoding: 'utf8' });
    fileMap.set(filepath, text.trim());
  }
  const text = fileMap.get(filepath);
  if (text) {
    return Parser.parse(text);
  }
  throw 'Could not load ' + filepath + '.';
}
export async function saveHtmlFile(root: Parser.HTMLElement, filepath: string) {
  await NodeFs.writeFile(filepath, root.toString(), { encoding: 'utf8' });
}
export async function processTemplateNode(root: Parser.HTMLElement) {
  const stack = toReversed(root.childNodes);
  while (stack.length > 0) {
    const item = stack.pop()!;
    if (item instanceof Parser.HTMLElement) {
      if (item.tagName === 'INCLUDE') {
        const newItem = await processInclude(item);
        stack.push(...toReversed(newItem.childNodes));
      } else {
        stack.push(...toReversed(item.childNodes));
      }
    }
  }
  return root;
}
export async function processTemplateFile(templatePath: string, outputPath: string) {
  saveHtmlFile(await processTemplateNode(await loadHtmlFile(templatePath)), outputPath);
}

function toReversed(tree: Parser.Node[]) {
  const reversed: Parser.Node[] = [];
  for (let index = tree.length; index > 0; index--) {
    reversed.push(tree[index - 1]);
  }
  return reversed;
}
function findSlot(root: Parser.HTMLElement) {
  const stack = toReversed(root.childNodes);
  while (stack.length > 0) {
    const item = stack.pop()!;
    if (item instanceof Parser.HTMLElement) {
      if (item.tagName === 'SLOT') {
        return item;
      }
      stack.push(...toReversed(item.childNodes));
    }
  }
  return undefined;
}
function trimNodelist(nodes: Parser.Node[]) {
  let start = 0;
  for (const node of nodes) {
    if (node.nodeType === 3) {
      if (node.rawText.trim() === '') {
        start++;
        continue;
      }
    }
    break;
  }
  let end = nodes.length;
  for (const node of toReversed(nodes)) {
    if (node.nodeType === 3) {
      if (node.rawText.trim() === '') {
        end--;
        continue;
      }
    }
    break;
  }
  return nodes.slice(start, end);
}
async function processInclude(oldItem: Parser.HTMLElement) {
  const includeName = Object.keys(oldItem.attributes)[0];
  oldItem.removeAttribute(includeName);
  const root = await loadHtmlFile(includeName + '.html');
  if (root) {
    const childNodes = oldItem.childNodes;
    const newItem = (function () {
      switch (root.childNodes.length) {
        case 0:
          oldItem.replaceWith(root);
          return root;
        case 1:
          oldItem.replaceWith(root.childNodes[0]);
          return root.childNodes[0];
        default:
          for (const child of root.childNodes) {
            if (child instanceof Parser.HTMLElement) {
              oldItem.replaceWith(child);
              return child;
            }
          }
          break;
      }
      return oldItem;
    })();
    if (newItem instanceof Parser.HTMLElement) {
      newItem.setAttributes({ ...oldItem.attributes, ...newItem.attributes });
      const classList = [...oldItem.classList.values(), ...newItem.classList.values()];
      for (const name of newItem.classList.values()) {
        newItem.classList.remove(name);
      }
      for (const name of classList) {
        newItem.classList.add(name);
      }
    }
    if (newItem !== oldItem) {
      if (childNodes.length > 0) {
        const slot = findSlot(root);
        if (slot) {
          slot.replaceWith(...trimNodelist(childNodes));
        }
      }
      return newItem;
    }
  }
  return oldItem;
}
