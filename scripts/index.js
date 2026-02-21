import { initDrag } from "./modules/drag.js";
import { initDocs } from "./modules/docs.js";
import { initPanel } from "./modules/panel.js";
import { initMobile } from "./modules/mobile.js";

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/base16/hardcore.css';

document.addEventListener("DOMContentLoaded", () => {
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('html', html);
  initMobile();
  initDrag();
  initDocs();
  initPanel(hljs);
});
