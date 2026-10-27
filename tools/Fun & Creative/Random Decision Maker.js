export class DecisionMakerTool {
  constructor(id){this.container=document.getElementById(id);if(this.container)this.init()}
  init(){
    this.container.innerHTML=`<div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4"><div><h2 class="text-lg font-semibold text-white">Random Decision Maker</h2><p class="text-xs text-gray-400 mt-1">Enter two or more choices and let the tool pick one at random.</p></div><textarea id="rdInput" rows="6" placeholder="Pizza\nBurger\nSalad" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-100"></textarea><div id="rdError" class="hidden text-xs text-red-300"></div><div class="flex gap-2"><button id="rdGo" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2.5 rounded-lg">Pick One</button><button id="rdClear" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg">Clear</button></div><div id="rdOut" class="hidden bg-gray-950 border border-gray-800 rounded-xl p-5 text-center"><div class="text-xs text-gray-400">Your choice</div><div id="rdChoice" class="text-2xl font-bold text-emerald-400 mt-2 break-words"></div></div></div>`;
    const q=s=>this.container.querySelector(s);
    q('#rdGo').onclick=()=>{const a=this.choices();const e=q('#rdError');if(a.length<2){e.textContent='Please enter at least two choices.';e.classList.remove('hidden');q('#rdOut').classList.add('hidden');return}e.classList.add('hidden');q('#rdChoice').textContent=a[Math.floor(Math.random()*a.length)];q('#rdOut').classList.remove('hidden')};
    q('#rdInput').oninput=()=>q('#rdError').classList.add('hidden');
    q('#rdClear').onclick=()=>{q('#rdInput').value='';q('#rdOut').classList.add('hidden');q('#rdError').classList.add('hidden');q('#rdInput').focus()};
  }
  choices(){return this.container.querySelector('#rdInput').value.split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean)}
}
