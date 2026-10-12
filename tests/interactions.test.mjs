import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import * as catalog from '../public/assets/js/plans.js';
const source = (await readFile(new URL('../public/assets/js/site.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/,'');
function harness(reduce=false){
  const frames=new Map();let frameId=0;const nodes=new Map();
  const node=()=>({textContent:'',attributes:{},classes:new Set(),listeners:{},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,v){this.listeners[k]=v},focus(){this.focused=true},classList:{add(){},remove(){},toggle(){}}});
  const buttons=['monthly','yearly'].map(period=>Object.assign(node(),{dataset:{period}}));
  for(const id of Object.keys(catalog.PLAN_CATALOG)){
    const price=node(),value=node();value.closest=()=>price;
    nodes.set(`[data-price="${id}"]`,value);nodes.set(`[data-billing="${id}"]`,node());
  }
  for(const selector of ['.billing-switch','#pricing-announcement','#year'])nodes.set(selector,node());
  const environment={...catalog,window:{matchMedia:()=>({matches:reduce})},performance:{now:()=>0},document:{querySelector:s=>nodes.get(s),querySelectorAll:()=>buttons},requestAnimationFrame:cb=>{frames.set(++frameId,cb);return frameId},cancelAnimationFrame:id=>frames.delete(id),Date,Map};
  vm.runInNewContext(source,environment);
  const click=i=>buttons[i].listeners.click();
  const flush=()=>{const callbacks=[...frames.values()];frames.clear();callbacks.forEach(cb=>cb(1000))};
  return {frames,nodes,buttons,click,flush};
}
test('reduced motion applies annual prices without scheduling animation',()=>{
  const h=harness(true);h.click(1);assert.equal(h.frames.size,0);
  assert.equal(h.nodes.get('[data-price="premium"]').textContent,'95,92');
  assert.match(h.nodes.get('#pricing-announcement').textContent,/1.151,04/);
});
test('rapid switching cancels outstanding frames and ends at the last selection',()=>{
  const h=harness();h.click(1);h.click(0);h.click(1);assert.equal(h.frames.size,3);h.flush();
  assert.deepEqual([...Object.keys(catalog.PLAN_CATALOG)].map(id=>h.nodes.get(`[data-price="${id}"]`).textContent),['23,92','47,92','95,92']);
  assert.equal(h.buttons[1].attributes['aria-pressed'],'true');
});
test('monthly restores original prices after annual animation',()=>{
  const h=harness();h.click(1);h.flush();h.click(0);h.flush();
  assert.equal(h.nodes.get('[data-price="premium"]').textContent,'119,90');
  assert.equal(h.nodes.get('[data-billing="premium"]').textContent,'Cobrado mensalmente');
});
test('keyboard changes period and moves focus',()=>{
  const h=harness(true);let prevented=false;
  h.buttons[0].listeners.keydown({key:'ArrowRight',preventDefault(){prevented=true}});
  assert.ok(prevented);assert.ok(h.buttons[1].focused);assert.equal(h.buttons[1].attributes['aria-pressed'],'true');
  h.buttons[1].listeners.keydown({key:'Home',preventDefault(){}});
  assert.ok(h.buttons[0].focused);assert.equal(h.buttons[0].attributes['aria-pressed'],'true');
});
