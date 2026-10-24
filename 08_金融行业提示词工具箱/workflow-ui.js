const recipes=window.OFFICE_RECIPES||[];
const recipePanel=document.createElement('section');
recipePanel.className='recipe-panel';
recipePanel.innerHTML='<h2>具体任务，从组合开始</h2><p>选择场景 → 查看材料与执行顺序 → 新建独立提示词组 → 填写材料并预览。</p><p>音频需交给支持音频的模型或先转写；图表需在有执行能力的工具中运行。本页只组装指令。</p><label>查找办公场景 <input id="recipe-search" type="search" placeholder="记账、录音、折线图、招聘…"></label><div id="recipe-results"></div>';
document.querySelector('.search-row').before(recipePanel);
document.querySelector('.brand strong').textContent='金融与办公提示词工具箱';
document.querySelector('.brand small').textContent='FINANCE & OFFICE PROMPT DESK';
document.querySelector('.library-foot span:first-child').textContent='金融与办公模板可按你的流程、资料和交付要求调整。';
const helpStep=document.createElement('li');
helpStep.textContent='场景组合会显示必需材料、执行顺序与交付目标；点击使用后新建独立组，原有提示词组和自定义内容仍保留。';
document.querySelector('.guide-list').prepend(helpStep);
document.querySelector('.page-heading p').textContent='保留金融模板，扩展财务、会议、绘图、数据与办公任务。'+BUILTINS.length+' 个模块 · '+recipes.length+' 套场景组合。';
function renderRecipes(){
 const term=$('recipe-search').value.trim().toLowerCase();
 const found=recipes.map((r,i)=>({r,i})).filter(({r})=>r.join(' ').toLowerCase().includes(term));
 $('recipe-results').innerHTML=found.map(({r,i})=>'<details class="recipe"><summary>'+esc(r[0]+' · '+r[1])+'</summary><p><b>准备材料：</b>'+esc(r[3])+'</p><p><b>执行顺序：</b>'+esc(r[2].split(',').map(id=>BUILTINS.find(x=>x.id===id)?.name||id).join(' → '))+'</p><p><b>交付：</b>'+esc(r[4])+'</p><button type="button" class="secondary-button" data-recipe="'+i+'">使用此组合（新建组）</button></details>').join('')||'<p>没有找到场景，可换关键词或自行组合。</p>';
 $('recipe-results').querySelectorAll('[data-recipe]').forEach(b=>b.onclick=()=>{
  persistFields(); const r=recipes[+b.dataset.recipe];
  const g={id:uid(),name:r[1],title:r[1],promptIds:r[2].split(','),context:'任务目标：'+r[1]+'\n预期交付：'+r[4]+'\n请补充：'+r[3]+'\n【在这里填入真实材料；未填写不得假设已提供】',language:'简体中文',detail:'专业详尽',guardrail:true};
  state.groups.push(g);state.activeGroup=g.id;save();render();
  $('composer').classList.remove('collapsed');$('context-input').focus();notify('组合已新建，请填写材料后预览指令');
 });
}
$('recipe-search').oninput=renderRecipes;
renderRecipes();
// Make stage handoffs explicit for all assembled combinations.
const baseAssemble=assemble;
assemble=function(){return baseAssemble()+'\n\n## 分阶段执行与衔接\n按模块顺序执行，后一阶段使用前一阶段已核实的产物。未填写的占位符不是事实；先列最少必需材料。涉及音频、附件读取或代码运行时先检查当前工具能力，不能执行则说明并提供替代步骤，不伪造产物。发现影响金额、结论或图形的关键缺口时暂停依赖步骤，先请求确认。每阶段写明输入、产出与待复核项。';};
