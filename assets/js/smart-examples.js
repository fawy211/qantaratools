/* QantaraTools Smart Testing - ready-to-use examples for specialized tools. */
(function(){
  const examples={
    'json-formatter': {label:'Load Example', fields:{'#jsonInput':`{"name":"Alex Morgan","age":31,"active":true,"skills":["design","coding"],"address":{"city":"New York","zip":"10001"}}`}, focus:'#jsonInput', run:'#formatBtn'},
    'json-csv': {label:'Load Example', fields:{'#jcIn':`[{"name":"Alex","email":"alex@example.com","age":31},{"name":"Sarah","email":"sarah@example.com","age":27},{"name":"Omar","email":"omar@example.com","age":34}]`}, focus:'#jcIn'},
    'jwt-decoder': {label:'Load Example JWT', fields:{'#jwtIn':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggTW9yZ2FuIiwiaWF0IjoxNzAwMDAwMDAwfQ.demo-signature'}, focus:'#jwtIn', run:'#jwtRun'},
    'regex-tester': {label:'Load Example', fields:{'#rxPat':'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b','#rxFlags':'gi','#rxText':'Contact alex@example.com or support@qantaratools.com. This one is not-an-email.'}, focus:'#rxPat', run:'#rxRun'},
    'timestamp-converter': {label:'Load Example', fields:{'#tsIn':'1700000000','#dateIn':'2023-11-14T22:13:20Z'}, focus:'#tsIn', run:'#tsToDate'},
    'hash-generator': {label:'Load Example', fields:{'#hashIn':'QantaraTools Smart Testing','#hashAlg':'SHA-256'}, focus:'#hashIn', run:'#hashRun'},
    'sql-formatter': {label:'Load Example SQL', fields:{'#sqlIn':'SELECT users.id, users.name, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.total > 100 ORDER BY orders.total DESC;'}, focus:'#sqlIn', run:'#sqlRun'},
    'code-formatter': {label:'Load Example Code', fields:{'#cfType':'HTML','#cfIn':'<div class="card"><h2>Hello</h2><p>Welcome to QantaraTools</p><button>Start</button></div>'}, focus:'#cfIn', run:'#cfRun'},
    'url-encoder': {label:'Load Example', fields:{'#urlText':'https://example.com/search?q=hello world&category=tools'}, focus:'#urlText', run:'#urlEnc'},
    'base64': {label:'Load Example', fields:{'#base64Input':'QantaraTools makes everyday web tasks easier.'}, focus:'#base64Input', run:'#encodeBtn'},
    'html-entity': {label:'Load Example', fields:{'#heInput':'<div class="notice">Tom & Jerry</div>'}, focus:'#heInput', run:'#heGo'},
    'markdown-html': {label:'Load Example Markdown', fields:{'#mdIn':'# QantaraTools\n\n## Smart Testing\n\n- Easy examples\n- Local processing\n- Fast results\n\n**Try it now!**'}, focus:'#mdIn', run:'#mdRun'},
    'text-diff': {label:'Load Example', fields:{'#diffOriginal':'QantaraTools is a free tools platform.\nFast browser utilities.\nPrivate local processing.','#diffModified':'QantaraTools is a free tools platform.\nFast browser utilities for work.\nPrivate local processing.\nNew tools are added regularly.'}, focus:'#diffOriginal', run:'#compareBtn'},
    'color-converter': {label:'Load Example Color', fields:{'#ccHex':'#2563eb'}, focus:'#ccHex', run:'#ccCopy'},
    'uuid-generator': {label:'Generate Example UUIDs', fields:{'#uuidCount':'3'}, focus:'#uuidCount', run:'#uuidGo'},
    'csv-cleaner': {label:'Load Example CSV', run:'#loadSampleCsvBtn'},
    'duplicate-remover': {label:'Load Example', fields:{'#dupInput':'Apple\nBanana\nApple\nOrange\n banana \nOrange'}, focus:'#dupInput', run:'#dupGo'},
    'rtl-cleaner': {label:'Load Example', fields:{'#unicodeInput':'Hello\u200F world  with   extra   spaces'}, focus:'#unicodeInput', run:'#cleanUnicodeBtn'},
    'text-sorter': {label:'Load Example', fields:{'#sortIn':'Orange\nApple\nBanana\n10\n2\n20'}, focus:'#sortIn', run:'#sortAZ'},
    'lorem-ipsum': {label:'Generate Example', fields:{'#liCount':'2'}, focus:'#liCount', run:'#liRun'},
    'text-case': {label:'Load Example', fields:{'#caseInput':'qantaratools makes everyday work easier'}, focus:'#caseInput', run:'#btnTitle'},
    'arabic-fixer': {label:'Load Example', fields:{'#arabicInput':'مرحبا بكم في QantaraTools'}, focus:'#arabicInput', run:'#fixArabicBtn'},
    'word-counter': {label:'Load Example', fields:{'#wcInput':'QantaraTools helps people complete everyday digital tasks faster and more easily.'}, focus:'#wcInput'},
    'password-generator': {label:'Generate Example Password', fields:{'#pgLen':'16'}, focus:'#pgLen', run:'#pgGo'},
    'discount-calculator': {label:'Load Example', fields:{'#dcPrice':'1500','#dcPercent':'20'}, focus:'#dcPrice', run:'#dcGo'},
    'vat-calculator': {label:'Load Example', fields:{'#vatAmount':'1000','#vatRate':'14'}, focus:'#vatAmount', run:'#vatGo'},
    'loan-calculator': {label:'Load Example', fields:{'#loanAmount':'250000','#loanRate':'12','#loanYears':'5'}, focus:'#loanAmount', run:'#loanGo'},
    'qr-generator': {label:'Load Example', fields:{'#qrText':'https://qantaratools.com','#qrSize':'300'}, focus:'#qrText', run:'#qrGo'}
  };
  function setValue(el,value){ if(!el)return; el.value=value; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); }
  window.applySmartExample=function(toolId){
    const ex=examples[toolId]; if(!ex)return;
    const box=document.getElementById('active-tool-box'); if(!box)return;
    const old=box.querySelector('[data-smart-example]'); if(old)old.remove();
    const bar=document.createElement('div'); bar.setAttribute('data-smart-example','1'); bar.className='mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3';
    bar.innerHTML='<span class="text-xs text-slate-400">New to this tool?</span><button type="button" class="smart-example-btn bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition">'+ex.label+'</button><span class="text-xs text-slate-500">Use a safe sample to test the tool.</span>';
    box.prepend(bar);
    bar.querySelector('button').onclick=()=>{
      Object.entries(ex.fields||{}).forEach(([sel,val])=>setValue(box.querySelector(sel),val));
      const focus=box.querySelector(ex.focus); if(focus)focus.focus();
      if(ex.run) box.querySelector(ex.run)?.click();
    };
  };
})();
