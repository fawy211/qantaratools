/* QantaraTools - Chat to Office File Converter
   Local-first: text stays in the browser. No upload is used by this tool. */
(function () {
  'use strict';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const xmlEsc = s => String(s ?? '').replace(/[<>&'\"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));
  const text = s => String(s ?? '').replace(/\r\n?/g, '\n');

  function parseConversation(raw) {
    raw = text(raw).trim();
    if (!raw) return [];
    const lines = raw.split('\n');
    const out = [];
    let current = null;
    const colonStart = /^(user|you|me|assistant|ai|chatgpt|claude|gemini|copilot)\s*[:：]\s*(.*)$/i;
    const bareStart = /^(user|you|me|assistant|ai|chatgpt|claude|gemini|copilot)\s*$/i;
    const push = () => { if (current && current.content.trim()) out.push({ ...current, content: current.content.trim() }); };
    for (const line of lines) {
      let m = line.match(colonStart);
      if (m) {
        push();
        const role = /^(assistant|ai|chatgpt|claude|gemini|copilot)$/i.test(m[1]) ? 'Assistant' : 'User';
        current = { role, content: m[2] };
        continue;
      }
      m = line.match(bareStart);
      if (m) {
        push();
        const role = /^(assistant|ai|chatgpt|claude|gemini|copilot)$/i.test(m[1]) ? 'Assistant' : 'User';
        current = { role, content: '' };
        continue;
      }
      if (current) current.content += (current.content ? '\n' : '') + line;
      else current = { role: 'Text', content: line };
    }
    push();
    return out;
  }

  function splitBlocks(s) {
    return text(s).split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
  }

  function markdownToHtml(s) {
    let h = esc(s);
    h = h.replace(/```(?:[\w-]+)?\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    h = h.replace(/^###\s+(.+)$/gm, '<h4>$1</h4>');
    h = h.replace(/^##\s+(.+)$/gm, '<h3>$1</h3>');
    h = h.replace(/^#\s+(.+)$/gm, '<h2>$1</h2>');
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
    h = h.replace(/^(?:[-*])\s+(.+)$/gm, '<li>$1</li>');
    h = h.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
    return h.split(/\n{2,}/).map(p => p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<ul') ? p : '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('');
  }

  function makeHtml(raw, title) {
    const msgs = parseConversation(raw);
    const source = msgs.length ? msgs : [{ role: 'Text', content: raw }];
    return '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(title) + '</title><style>@page{margin:18mm}body{font-family:Arial,sans-serif;line-height:1.55;margin:0;color:#111}h1{font-size:24px;margin:0 0 20px}h2{font-size:19px;margin-top:24px}.msg{border:1px solid #ddd;border-radius:10px;padding:14px;margin:12px 0;break-inside:avoid}.role{font-weight:bold;margin-bottom:8px;color:#315adf}pre{background:#f5f5f5;padding:12px;overflow:auto;white-space:pre-wrap}code{background:#f3f3f3;padding:2px 4px}a{color:#174ea6}ul{margin-top:6px}</style></head><body><h1>' + esc(title) + '</h1>' + source.map(m => '<section class="msg"><div class="role">' + esc(m.role) + '</div>' + markdownToHtml(m.content) + '</section>').join('') + '</body></html>';
  }

  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) { c ^= bytes[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0); }
    return (c ^ 0xffffffff) >>> 0;
  }
  function u16(n) { return new Uint8Array([n & 255, (n >>> 8) & 255]); }
  function u32(n) { return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]); }
  function cat(...parts) { let n = parts.reduce((a, b) => a + b.length, 0), o = new Uint8Array(n), p = 0; for (const b of parts) { o.set(b, p); p += b.length; } return o; }
  function zipStore(files) {
    const enc = new TextEncoder(), chunks = [], central = []; let offset = 0;
    for (const [name, content] of Object.entries(files)) {
      const nb = enc.encode(name), data = typeof content === 'string' ? enc.encode(content) : content, crc = crc32(data);
      const local = cat(new Uint8Array([80,75,3,4,20,0,0,0,0,0,0,0,0,0]), u32(crc), u32(data.length), u32(data.length), u16(nb.length), u16(0), nb, data);
      chunks.push(local);
      const cen = cat(new Uint8Array([80,75,1,2,20,0,20,0,0,0,0,0,0,0,0,0]), u32(crc), u32(data.length), u32(data.length), u16(nb.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nb);
      central.push(cen); offset += local.length;
    }
    const cd = cat(...central);
    const end = cat(new Uint8Array([80,75,5,6,0,0,0,0]), u16(central.length), u16(central.length), u32(cd.length), u32(offset), u16(0));
    return new Blob([cat(...chunks, cd, end)], { type: 'application/zip' });
  }

  function docxRunXml(value, opts = {}) {
    const rpr = [];
    if (opts.bold) rpr.push('<w:b/>');
    if (opts.italic) rpr.push('<w:i/>');
    if (opts.code) rpr.push('<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:shd w:fill="F1F5F9"/>');
    return '<w:r>' + (rpr.length ? '<w:rPr>' + rpr.join('') + '</w:rPr>' : '') + '<w:t xml:space="preserve">' + xmlEsc(value || ' ') + '</w:t></w:r>';
  }

  function inlineDocxRuns(line) {
    const out = [];
    let rest = String(line ?? '');
    const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/;
    while (rest) {
      const m = rest.match(re);
      if (!m) { out.push(docxRunXml(rest)); break; }
      if (m.index) out.push(docxRunXml(rest.slice(0, m.index)));
      const token = m[0];
      if (token.startsWith('**')) out.push(docxRunXml(token.slice(2, -2), {bold:true}));
      else if (token.startsWith('*')) out.push(docxRunXml(token.slice(1, -1), {italic:true}));
      else out.push(docxRunXml(token.slice(1, -1), {code:true}));
      rest = rest.slice(m.index + token.length);
    }
    return out.join('');
  }

  function docxParagraph(line, opts = {}) {
    const s = String(line ?? '');
    if (!s.trim()) return '<w:p/>';
    const heading = s.match(/^#{1,3}\s+(.+)$/);
    const bullet = s.match(/^\s*[-*]\s+(.+)$/);
    let ppr = '';
    let runs = '';
    if (heading) {
      const size = heading[0].startsWith('# ') ? '30' : heading[0].startsWith('## ') ? '26' : '23';
      runs = '<w:r><w:rPr><w:b/><w:sz w:val="' + size + '"/></w:rPr><w:t xml:space="preserve">' + xmlEsc(heading[1]) + '</w:t></w:r>';
    } else if (bullet) {
      ppr = '<w:pPr><w:ind w:left="360" w:hanging="180"/></w:pPr>';
      runs = docxRunXml('• ' + bullet[1]);
    } else {
      runs = inlineDocxRuns(s);
    }
    if (opts.spaceBefore) ppr = '<w:pPr><w:spacing w:before="' + opts.spaceBefore + '"/></w:pPr>';
    return '<w:p>' + ppr + runs + '</w:p>';
  }

  function docxTable(rows) {
    const cols = Math.max(...rows.map(r => r.length));
    let xml = '<w:tbl><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:color="CBD5E1"/><w:left w:val="single" w:sz="4" w:color="CBD5E1"/><w:bottom w:val="single" w:sz="4" w:color="CBD5E1"/><w:right w:val="single" w:sz="4" w:color="CBD5E1"/><w:insideH w:val="single" w:sz="4" w:color="CBD5E1"/><w:insideV w:val="single" w:sz="4" w:color="CBD5E1"/></w:tblBorders></w:tblPr>';
    for (let ri=0; ri<rows.length; ri++) {
      xml += '<w:tr>';
      for (let ci=0; ci<cols; ci++) {
        const value = rows[ri][ci] ?? '';
        xml += '<w:tc><w:tcPr><w:tcW w:w="2400" w:type="dxa"/></w:tcPr>';
        xml += '<w:p>' + (ri === 0 ? '<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">' + xmlEsc(value || ' ') + '</w:t></w:r>' : inlineDocxRuns(value)) + '</w:p></w:tc>';
      }
      xml += '</w:tr>';
    }
    return xml + '</w:tbl>';
  }

  function contentXml(raw) {
    const lines = text(raw).split('\n');
    let out = '';
    for (let i=0; i<lines.length;) {
      if (lines[i].includes('\t')) {
        const rows = [];
        let j=i;
        while (j<lines.length && lines[j].includes('\t')) {
          rows.push(lines[j].split('\t'));
          j++;
        }
        if (rows.length >= 2) { out += docxTable(rows); i=j; continue; }
      }
      out += docxParagraph(lines[i]);
      i++;
    }
    return out;
  }

  function docxXml(raw, title) {
    const msgs = parseConversation(raw), arr = msgs.length ? msgs : [{ role: 'Text', content: raw }];
    let body = '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="34"/></w:rPr><w:t>' + xmlEsc(title) + '</w:t></w:r></w:p>';
    body += '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="64748B"/></w:rPr><w:t>Created locally on your device</w:t></w:r></w:p>';
    for (const m of arr) {
      body += '<w:p><w:pPr><w:spacing w:before="260" w:after="100"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="2563EB"/></w:rPr><w:t>' + xmlEsc(m.role) + '</w:t></w:r></w:p>';
      body += contentXml(m.content);
    }
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body + '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="900" w:right="1080" w:bottom="900" w:left="1080"/></w:sectPr></w:body></w:document>';
  }

  function makeDocx(raw, title) {
    return zipStore({
      '[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>',
      '_rels/.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>',
      'word/document.xml':docxXml(raw,title),
      'word/styles.xml':'<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>',
      'word/settings.xml':'<?xml version="1.0" encoding="UTF-8"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/></w:settings>',
      'docProps/core.xml':'<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>'+xmlEsc(title)+'</dc:title><dc:creator>QantaraTools</dc:creator><cp:lastModifiedBy>QantaraTools</cp:lastModifiedBy></cp:coreProperties>',
      'docProps/app.xml':'<?xml version="1.0" encoding="UTF-8"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>QantaraTools</Application></Properties>'
    });
  }

  function colName(n) { let s=''; n++; while(n){ const r=(n-1)%26; s=String.fromCharCode(65+r)+s; n=Math.floor((n-1)/26); } return s; }
  function csvMatrix(raw) {
    const rows=[];
    for (const line of text(raw).split('\n')) {
      const cells=[]; let cur='', q=false;
      for (let i=0;i<line.length;i++) { const c=line[i]; if(c==='"'){ if(q && line[i+1]==='"'){cur+='"';i++;} else q=!q; } else if(c===','&&!q){cells.push(cur.trim());cur='';} else cur+=c; }
      cells.push(cur.trim()); if(cells.some(Boolean)) rows.push(cells);
    }
    return rows;
  }
  function sheetXml(rows) {
    const maxCols=Math.max(1,...rows.map(x=>x.length));
    const maxRows=Math.max(1,rows.length);
    let r='<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
    r+='<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>';
    r+='<sheetFormatPr defaultRowHeight="18"/>';
    r+='<cols>';
    for(let i=0;i<maxCols;i++){
      const width=i===0?18:64;
      r+='<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+width+'" customWidth="1"/>';
    }
    r+='</cols><sheetData>';
    rows.forEach((row,ri)=>{
      const rowHeight=ri===0?24:36;
      r+='<row r="'+(ri+1)+'" ht="'+rowHeight+'" customHeight="1">';
      row.forEach((v,ci)=>{
        const ref=colName(ci)+(ri+1);
        const style=ri===0?' s="1"':' s="2"';
        r+='<c r="'+ref+'" t="inlineStr"'+style+'><is><t xml:space="preserve">'+xmlEsc(v)+'</t></is></c>';
      });
      r+='</row>';
    });
    r+='</sheetData>';
    r+='<autoFilter ref="A1:'+colName(maxCols-1)+maxRows+'"/>';
    r+='<pageMargins left="0.25" right="0.25" top="0.5" bottom="0.5" header="0.2" footer="0.2"/>';
    r+='<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>';
    return r+'</worksheet>';
  }
  function makeXlsx(raw) {
    const msgs=parseConversation(raw);
    let rows;
    if(msgs.length) rows=[['Speaker','Message'],...msgs.map(m=>[m.role,m.content])];
    else rows=csvMatrix(raw);
    if(!rows.length) rows=[['Text','']];
    return zipStore({
      '[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      '_rels/.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      'xl/workbook.xml':'<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Conversation" sheetId="1" r:id="rId1"/></sheets></workbook>',
      'xl/styles.xml':'<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="solid"><fgColor rgb="E2E8F0"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border/><border><left style="thin"><color rgb="CBD5E1"/></left><right style="thin"><color rgb="CBD5E1"/></right><top style="thin"><color rgb="CBD5E1"/></top><bottom style="thin"><color rgb="CBD5E1"/></bottom></border></borders><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="0" fontId="1" fillId="1" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs></styleSheet>',
      'xl/_rels/workbook.xml.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
      'xl/worksheets/sheet1.xml':sheetXml(rows)
    });
  }

  // Robust local DOCX reader. Reads the ZIP central directory so normal
  // Office-generated DOCX files work even when entries are not stored.
  async function readZipEntry(bytes, wantedName) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const dec = new TextDecoder('utf-8');
    const u32at = (p) => view.getUint32(p, true);
    const u16at = (p) => view.getUint16(p, true);
    let eocd = -1;
    const min = Math.max(0, bytes.length - 65557);
    for (let p = bytes.length - 22; p >= min; p--) {
      if (u32at(p) === 0x06054b50) { eocd = p; break; }
    }
    if (eocd < 0) throw new Error('This Word file is not a valid ZIP-based document.');
    const entries = u16at(eocd + 10);
    const cdOffset = u32at(eocd + 16);
    let p = cdOffset;
    for (let i = 0; i < entries; i++) {
      if (u32at(p) !== 0x02014b50) break;
      const method = u16at(p + 10);
      const compressedSize = u32at(p + 20);
      const nameLen = u16at(p + 28);
      const extraLen = u16at(p + 30);
      const commentLen = u16at(p + 32);
      const localOffset = u32at(p + 42);
      const name = dec.decode(bytes.slice(p + 46, p + 46 + nameLen));
      if (name === wantedName) {
        if (u32at(localOffset) !== 0x04034b50) throw new Error('The Word document has an invalid file entry.');
        const localNameLen = u16at(localOffset + 26);
        const localExtraLen = u16at(localOffset + 28);
        const dataStart = localOffset + 30 + localNameLen + localExtraLen;
        const raw = bytes.slice(dataStart, dataStart + compressedSize);
        if (method === 0) return raw;
        if (method === 8 && 'DecompressionStream' in window) {
          const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
          return new Uint8Array(await new Response(stream).arrayBuffer());
        }
        throw new Error('This Word file uses compression your browser cannot read locally.');
      }
      p += 46 + nameLen + extraLen + commentLen;
    }
    throw new Error('The Word file does not contain a readable document.');
  }

  function docxXmlToText(xml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('The Word document could not be read.');
    const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const textOf = node => [...node.getElementsByTagNameNS(ns, 't')].map(n => n.textContent || '').join('');
    const paragraphs = [];
    const body = doc.getElementsByTagNameNS(ns, 'body')[0];
    if (!body) throw new Error('The Word document has no readable body.');
    for (const child of body.children) {
      if (child.localName === 'p') {
        let value = textOf(child);
        const tabs = child.getElementsByTagNameNS(ns, 'tab').length;
        if (tabs) value += '\t'.repeat(tabs);
        if (value || child.getElementsByTagNameNS(ns, 'r').length) paragraphs.push(value);
      } else if (child.localName === 'tbl') {
        for (const row of child.getElementsByTagNameNS(ns, 'tr')) {
          const cells = [...row.children].filter(x => x.localName === 'tc')
            .map(cell => textOf(cell).replace(/\s+/g, ' ').trim());
          if (cells.length) paragraphs.push(cells.join('\t'));
        }
        paragraphs.push('');
      }
    }
    return paragraphs.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  async function readDocxFile(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const xmlBytes = await readZipEntry(bytes, 'word/document.xml');
    return docxXmlToText(new TextDecoder('utf-8').decode(xmlBytes));
  }

  function safeFileName(value) {
    const v=String(value||'conversation').trim().replace(/[^a-z0-9 _-]/gi,'').replace(/\s+/g,'-').replace(/-+/g,'-');
    return (v||'conversation').slice(0,80);
  }
  function download(blob,name) { const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000); }
  function openPdfPrint(raw,title) { const w=window.open('','_blank'); if(!w){alert('Please allow pop-ups for the PDF preview.');return;} w.document.open();w.document.write(makeHtml(raw,title));w.document.close();w.focus();setTimeout(()=>w.print(),450); }

  window.loadAiToOfficeTool=function(){
    const box=document.getElementById('active-tool-box'),grid=document.getElementById('tools-grid-container'),view=document.getElementById('tool-view-container');
    if(grid)grid.classList.add('hidden');if(view)view.classList.remove('hidden');
    box.innerHTML=`<div dir="auto">
      <div class="mb-6"><h2 class="text-2xl font-bold text-slate-100 mb-2">Chat to Office File Converter</h2><p class="text-slate-400">Turn a copied AI conversation, text file, or Word document into a clean Word, Excel, or PDF file. Everything is processed on your device.</p></div>
      <div class="mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <label class="flex-1 text-sm text-slate-400">File name<input id="ai-office-name" class="mt-1 w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100" value="conversation" maxlength="80"></label>
        <label class="px-4 py-3 rounded-xl border border-slate-700 text-slate-200 cursor-pointer text-center hover:bg-slate-800">Open a text or Word file<input id="ai-office-file" type="file" accept=".txt,.md,.csv,.docx,text/plain,text/markdown,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="hidden"></label>
        <button id="ai-example" class="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800">Load Example</button><button id="ai-clear" class="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800">Clear</button>
      </div>
      <textarea id="ai-office-input" rows="16" class="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" placeholder="Paste your AI conversation or any text here...\n\nExample:\nUser: Create a project plan\nAssistant: Here is the plan..."></textarea>
      <div class="mt-2 flex justify-between text-xs text-slate-500"><span id="ai-count">0 characters</span><span id="ai-status">Ready</span></div>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <button id="ai-word" class="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">Download Word file</button>
        <button id="ai-excel" class="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Download Excel file</button>
        <button id="ai-pdf" class="px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold">Create PDF file</button>
      </div>
      <div class="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-400"><strong class="text-slate-300">How it works:</strong> Word keeps each speaker and message easy to read. Excel creates a readable Speaker / Message table for conversations, with wrapped text, filters, and a frozen header. For tabular CSV-style text, it keeps the rows and columns. PDF opens a clean print view so you can choose Save as PDF. Your text is not uploaded.</div>
    </div>`;

    const input=document.getElementById('ai-office-input'), count=document.getElementById('ai-count'), status=document.getElementById('ai-status'), name=document.getElementById('ai-office-name');
    const update=()=>{const n=input.value.length;count.textContent=n.toLocaleString()+' character'+(n===1?'':'s');const msgs=parseConversation(input.value);status.textContent=input.value.trim()?(msgs.length>1?msgs.length+' messages detected':'Ready to convert'):'Waiting for text';};
    input.addEventListener('input',update);
    document.getElementById('ai-example').onclick=()=>{input.value='User: Create a short project plan\nAssistant: Here is a clear plan.\n\nUser: Include a simple table.\nAssistant: Name\tStatus\nWebsite\tReady\nTesting\tIn progress';name.value='qantaratools-example';update();status.textContent='Example loaded';};
    document.getElementById('ai-clear').onclick=()=>{input.value='';update();input.focus();};
    document.getElementById('ai-office-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const isDocx=/\.docx$/i.test(file.name)||file.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document';input.value=isDocx?await readDocxFile(file):await file.text();name.value=safeFileName(file.name.replace(/\.[^.]+$/,''));update();status.textContent=isDocx?'Word document loaded locally':'Text loaded locally';}catch(err){status.textContent='Could not open the selected file';alert(err?.message||'The selected file could not be opened locally.');}e.target.value='';};
    const ensure=()=>{if(!input.value.trim()){alert('Please paste or open some text first.');return false;}return true;};
    document.getElementById('ai-word').onclick=()=>{if(!ensure())return;download(makeDocx(input.value,name.value.trim() || 'Conversation'),safeFileName(name.value)+'.docx');status.textContent='Word file created locally';};
    document.getElementById('ai-excel').onclick=()=>{if(!ensure())return;download(makeXlsx(input.value),safeFileName(name.value)+'.xlsx');status.textContent='Excel file created locally';};
    document.getElementById('ai-pdf').onclick=()=>{if(!ensure())return;openPdfPrint(input.value,name.value.trim() || 'Conversation');status.textContent='PDF print view opened locally — choose Save as PDF';};
    update();
    requestAnimationFrame(() => window.QTToolFeedback?.add('ai-office', 'AI Chat & Content to Office Converter'));
  };
})();
