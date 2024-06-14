import { LoadIncludeFile, ProcessTemplateFile } from '../Template Processor.mts';

await LoadIncludeFile('button', './component/button.html');
await ProcessTemplateFile('./index.template.html', './index.html');
