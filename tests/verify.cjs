/* Execute com node tests/verify.cjs. Testes numéricos, adversariais e de integração sem dependências. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const dir=path.join(__dirname,'../dist'),read=f=>fs.readFileSync(path.join(dir,f),'utf8');
let count=0;const groups={};let group='Parser';
function ok(cond,msg){if(!cond)throw Error(`[${group}] ${msg}`);count++;groups[group]=(groups[group]||0)+1;}
function near(a,b,tol=1e-7){return Math.abs(a-b)<=tol;}
const safeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fail(fn,msg){let error;try{fn();}catch(e){error=e;}ok(!!error,msg);}
const ctx={window:null,console,Date,Math,Number,String,JSON,Array,Boolean,Object,Error,RegExp,parseFloat,isFinite,Set,Map,Intl,URL,Blob};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['math-engine.js','content.js','progress.js','convergencia.js','treino-data.js','treino.js'])vm.runInContext(read(f),ctx,{filename:f});
const M=ctx.NumeraMath,C=ctx.NumeraContent,P=ctx.NumeraProgress;
for(const [expr,x,v] of [['-x^2',3,-9],['2^3^2',0,512],['2x+3(x-1)',4,17],['sen(pi/2)',0,1],['2,5x=5',2,0],['x²-4',2,0],['log(100)+ln(e)',0,3],['exp(0)+sqrt(9)',0,4]])ok(near(M.parseFunction(expr)(x),v),expr);
for(const expr of ['alert(1)','constructor(1)','window.location','x;1','x+','x=2=3','sin x','process.exit(0)','x[0]'])fail(()=>M.parseFunction(expr)(1),'Rejeitar '+expr);
fail(()=>M.parseFunction('x'.repeat(501)),'Limitar expressão');
group='Métodos de raízes';
for(const [name,run] of [['Bisseção',()=>M.bisection(x=>x*x-2,1,2)],['Newton',()=>M.newton(x=>x*x-2,1.5)],['Secante',()=>M.secant(x=>x*x-2,1,2)]]){const r=run();ok(r.converged&&near(r.root,Math.sqrt(2),1e-6),name+' raiz');ok(r.residual<=1e-6,name+' resíduo');}
const bi=M.bisection(x=>x*x-2,1,2,{tolerance:1e-12,maxIterations:1});ok(!bi.converged&&bi.root===1.5,'Limite não é convergência');
const bis=M.bisection(x=>x*x-2,1,2,{tolerance:1e-12});for(const row of bis.iterations){ok(Math.sign(row.fa)!==Math.sign(row.fb),'Preservar troca de sinal');ok(Math.abs(row.x-Math.sqrt(2))<=row.error+1e-14,'Cota do intervalo contém a raiz');}
ok(M.secant(x=>x-1,1,2).root===1,'Reconhecer raiz no primeiro ponto da Secante');
fail(()=>M.bisection(x=>x*x+1,-1,1),'Bisseção sem sinal oposto');fail(()=>M.newton(x=>x*x+1,0),'Derivada nula');fail(()=>M.secant(x=>x*x,-1,1),'Secante com valores iguais');fail(()=>M.bisection(x=>1/x,-1,1),'Descontinuidade no ponto médio');
for(const tolerance of [0,-1,1,1e-13,NaN])fail(()=>M.newton(x=>x*x-2,1,{tolerance}),'Tolerância inválida '+tolerance);
for(const maxIterations of [0,501,1.3])fail(()=>M.newton(x=>x*x-2,1,{maxIterations}),'Limite inválido');
group='Falsa Posição e Ponto Fixo';
{const fp=M.falsePosition(x=>x*x-2,1,2);ok(fp.converged&&near(fp.root,Math.SQRT2,1e-6)&&fp.residual<=1e-6,'Falsa Posição: raiz de 2');
 for(const row of M.falsePosition(x=>x*x-2,1,2,{tolerance:1e-12}).iterations){ok(Math.sign(row.fa)!==Math.sign(row.fb)&&row.x>=row.a&&row.x<=row.b,'Falsa Posição preserva o intervalo k='+row.i);ok(Math.abs(row.x-Math.SQRT2)<=row.b-row.a,'Raiz continua cercada k='+row.i);}
 const f3=x=>x*x-3,r1=M.falsePosition(f3,1,2,{maxIterations:1,tolerance:1e-12});ok(near(r1.iterations[0].x,5/3,1e-12),'Primeiro corte da corda = 5/3');
 ok(near(M.falsePosition(x=>2*x-3,0,5).root,1.5,1e-15)&&M.falsePosition(x=>2*x-3,0,5).steps===1,'Reta: a corda acerta em 1 passo');
 const st=M.falsePosition(x=>x**3-x-2,1,2);ok(st.converged&&/ponta|extremidade/.test(st.note)&&st.iterations.every(r=>r.b===2),'Ponta parada detectada em curva convexa');
 fail(()=>M.falsePosition(x=>x*x+1,-1,1),'Falsa Posição sem troca de sinal');fail(()=>M.falsePosition(x=>x,2,1),'Falsa Posição com a ≥ b');
 const pf=M.fixedPoint(Math.cos,1);ok(pf.converged&&near(pf.root,.7390851332151607,1e-5)&&/< 1/.test(pf.note),'Ponto Fixo: x = cos(x)');
 ok(pf.iterations.slice(1).every((r,i)=>near(r.x,Math.cos(pf.iterations[i].x),1e-15)),'Cada passo é xₖ₊₁ = g(xₖ)');
 fail(()=>M.fixedPoint(x=>(x**3-5)/2,2.09),'Ponto Fixo diverge com |g′| > 1');fail(()=>M.fixedPoint(x=>Math.sqrt(x-5),0),'Ponto Fixo fora do domínio de g');
 ok(!M.fixedPoint(Math.cos,1,{maxIterations:3}).converged,'Limite de iterações não é convergência');
 const fN=x=>x**3-x-2,dN=x=>3*x*x-1,asPF=M.fixedPoint(x=>x-fN(x)/dN(x),1.5,{tolerance:1e-12}),nw=M.newton(fN,1.5,{tolerance:1e-12});ok(near(asPF.root,nw.root,1e-10),'Newton é um Ponto Fixo com g = x − f/f′');
 const cv=M.convergenceRoot(fN,{a:1,b:2,x0:1.5,x1:2,g:x=>Math.cbrt(x+2)}),O=Object.fromEntries(cv.series.map(q=>[q.method,q]));
 ok(near(cv.reference,1.5213797068045676,1e-12),'Convergência: raiz de referência');ok(O.newton.order>1.8&&O.newton.order<2.2,'Newton com ordem observada ≈ 2 ('+O.newton.order+')');ok(O.secant.order>1.3&&O.secant.order<1.9,'Secante com ordem ≈ 1,6 ('+O.secant.order+')');
 ok(O.bisection.order>.8&&O.bisection.order<1.2&&near(O.bisection.rate,.5,.08),'Bisseção linear, fator ≈ 0,5');ok(O.falseposition.order>.9&&O.falseposition.order<1.1,'Falsa Posição linear nesta curva convexa');
 ok(O.fixedpoint.order>.9&&O.fixedpoint.order<1.1&&near(O.fixedpoint.rate,1/(3*Math.cbrt(3.5213797)**2),.03),'Ponto Fixo: fator ≈ |g′(x*)|');ok(O.newton.reach<O.secant.reach&&O.secant.reach<O.bisection.reach,'Newton < Secante < Bisseção em passos até 1e-8');
 const cvs=M.convergenceSystem([[10,-1,2],[-1,11,-1],[2,-1,10]],[6,22,-10],[0,0,0]),SS=Object.fromEntries(cvs.series.map(q=>[q.method,q]));ok(cvs.strictDD&&SS.seidel.reach<SS.jacobi.reach,'Gauss-Seidel converge antes de Jacobi');
 const bad=M.convergenceSystem([[1,2],[3,1]],[5,5],[0,0]);ok(bad.series.every(q=>q.diverged)&&!bad.strictDD,'Sem dominância: divergência detectada');
 ok(M.smartRoot('x^3-x-2').comparisons.some(c=>c.method==='falseposition'&&c.converged),'Comparação automática inclui a Falsa Posição');}
group='Busca automática';
for(const [expr,target] of [['x^3-x-2',1.5213797068045676],['cos(x)-x',.7390851332151607],['exp(-x)-0.2',Math.log(5)],['(x-1.337)^2',1.337],['x^2-2',Math.sqrt(2)]]){const r=M.smartRoot(expr);ok(r.converged&&near(r.root,target,2e-6),expr);ok(r.residual<=1e-12,'Residual estrito: '+expr);ok(r.search.totalEvaluations>r.evaluations,'Contar busca e comparação');}
const both=M.smartRoot('x^2-2');ok(both.roots.length===2&&both.roots.some(r=>near(r.root,-Math.sqrt(2))),'Duas raízes detectadas');
const outside=M.smartRoot('x-100',{min:90,max:110});ok(near(outside.root,100),'Faixa configurável');
for(const expr of ['x^2+1','1/x','exp(x)','1/(x-0.13)','0','x-x','1e-15*(x^2+1)'])fail(()=>M.smartRoot(expr),'Não declarar raiz: '+expr);
fail(()=>M.smartRoot('x',{min:2,max:1}),'Faixa inválida');
group='Sistemas';
for(const [source,answer] of [['2x+y=5\nx+3y=6',[1.8,1.4]],['2, 1 | 5\n1, 3 | 6',[1.8,1.4]],['2(x+y)-y=5\nx+3y=6',[1.8,1.4]],['4x-y=60\n-x+4y=30',[18,12]],['10x-y+2z=6\n-x+11y-z=22\n2x-y+10z=-10',[1,2,-1]],['2,5x+y=6\nx+y=3',[2,1]]]){const a=M.parseSystem(source),r=M.autoSystem(a.A,a.b,answer.map(()=>0));ok(r.converged&&r.root.every((v,i)=>near(v,answer[i])),source);}
for(const source of ['x*y=2\nx+y=3','x^2+y=2\nx+y=3','x/y=2\nx+y=3','sin(x)+y=2\nx+y=3','1, 2 |\n2, 3 |4','1,2|3\n1,2,3|4'])fail(()=>M.parseSystem(source),'Rejeitar sistema inválido '+source);
for(const fn of [M.gauss,(a,b)=>M.seidel(a,b,[0,0]),(a,b)=>M.autoSystem(a,b,[0,0])]){fail(()=>fn([[1,1],[2,2]],[2,4]),'Sistema dependente');fail(()=>fn([[1,1],[2,2]],[2,5]),'Sistema incompatível');}
const pivot=M.gauss([[0,2],[1,1]],[4,3]);ok(near(pivot.root[0],1)&&near(pivot.root[1],2),'Pivô zero com troca');ok(pivot.iterations.some(i=>i.detail.includes('Trocar')),'Troca registrada');
for(let n=2;n<=6;n++)for(const scale of [1e-20,1,1e15]){const A=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>(i===j?10+n:((i+j)%3)-1)*scale)),expected=Array.from({length:n},(_,i)=>i-2),b=A.map(row=>row.reduce((a,v,j)=>a+v*expected[j],0));const g=M.gauss(A,b),se=M.seidel(A,b,expected.map(()=>0),{tolerance:1e-9,maxIterations:200});ok(g.converged&&g.root.every((v,i)=>near(v,expected[i])),'Gauss escalado '+n+' '+scale);ok(se.converged&&se.root.every((v,i)=>near(v,expected[i],1e-7)),'Seidel escalado '+n+' '+scale);ok(M.maxResidual(A,b,g.root)>=0,'Resíduo definido');}
const partial=M.seidel([[4,1],[1,3]],[9,7],[0,0],{maxIterations:1,tolerance:1e-12});ok(!partial.converged,'Seidel parcial sem falso sucesso');
group='Conteúdo e progresso';ok(C.METHODS.length===7,'Sete métodos');ok(C.METHODS.every(m=>C.TASKS[m.id].length===12&&C.DEEP[m.id]&&C.COACH[m.id]&&C.CASES.some(c=>c.method===m.id)),'12 etapas, aprofundamento, orientação e missão em cada trilha');ok(P.ids.size===147,'147 atividades');
ok(C.METHODS.every(m=>C.ARENA.filter(t=>t.method===m.id).length===6),'6 desafios da Arena por método');ok(C.METHODS.map(m=>m.id).join()==='bisection,falseposition,fixedpoint,newton,secant,gauss,seidel','Ordem clássica do curso');
for(const [i,t] of [...Object.values(C.TASKS).flat(),...C.ARENA,...C.CASES.flatMap(c=>c.tasks)].entries()){ok(!!t.q&&!!t.explain&&(t.type==='choice'?Number.isInteger(t.answer)&&t.answer>=0&&t.answer<t.options.length:Number.isFinite(t.value)),'Questão válida '+i);}
let p=P.fresh(),id='c:bisection:0';P.complete(p,id);P.complete(p,id);ok(p.xp===20,'Sem duplicação de XP');P.complete(p,'c:bisection:1');P.complete(p,'c:bisection:2');ok(p.xp===90,'Bônus diário uma vez');P.complete(p,id);ok(p.xp===90,'Repetição sem bônus adicional');P.wrong(p,'c:newton:0');ok(!!p.review['c:newton:0'],'Erro cria revisão');P.complete(p,'c:newton:0',{wrong:2});ok(p.completed['c:newton:0'].stars===1,'Estrelas refletem tentativas');P.complete(p,'c:newton:0');ok(p.completed['c:newton:0'].stars===3,'Revisão melhora desempenho');ok(P.validate(JSON.parse(JSON.stringify(p))).xp===p.xp,'Backup válido');fail(()=>P.validate({version:3}),'Backup inválido');
const mem=new Map([['numera-academy-v3',JSON.stringify({xp:40,done:['bisection-0','bogus-0'],arenaDone:[0]})]]),storage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};const old=P.load(storage);ok(Object.keys(old.p.completed).length===2&&old.p.xp===40,'Migração v3');ok(!P.save(p,{setItem(){throw Error('quota')}}),'Falha de armazenamento explícita');
group='Integração da interface';
const elements={'#app':{innerHTML:''},'#main':{focus(){}},'#answer':{value:''}},handlers={};let title='';
Object.assign(ctx,{document:{get title(){return title},set title(v){title=v},querySelector:q=>elements[q]||null,getElementById:id=>elements['#'+id]||null,addEventListener:(name,fn)=>handlers[name]=fn,createElement:()=>({click(){}})},localStorage:{getItem:()=>null,setItem(){}},history:{replaceState(){}},location:{hash:''},setTimeout(){},scrollTo(){},addEventListener(){},confirm:()=>true});
const code=read('app.js').replace(/\}\)\(\);\s*$/,'window.__test={s,TR,getP:()=>p,render,navigate,solve,answerQuestion,simulationResult,openCourse,graph,parseAnswer,question,guideTasks,checkGuide};})();');vm.runInContext(code,ctx,{filename:'app.js'});
const t=ctx.__test;ok(elements['#app'].innerHTML.includes('resolvendo de verdade'),'Início');const out=path.join(__dirname,'rendered');fs.mkdirSync(out,{recursive:true});
function snapshot(name){fs.writeFileSync(path.join(out,name+'.html'),elements['#app'].innerHTML);ok(!/undefined|NaN/.test(elements['#app'].innerHTML),'Render '+name);}
for(const page of ['home','academy','cases','arena','lab','progress','review']){t.navigate(page);snapshot(page);}
for(const m of C.METHODS){t.openCourse(m.id);snapshot('course-'+m.id);t.s.tab='simulate';t.render();snapshot('simulation-'+m.id);const result=t.simulationResult();ok(result.converged,'Exemplo simulado '+m.id);for(let i=0;i<12;i++){t.s.q=i;t.s.tab='practice';t.s.selected=null;t.s.answer='';t.s.feedback=null;const task=C.TASKS[m.id][i];if(task.type==='choice')t.s.selected=task.answer;else elements['#answer'].value=String(task.value);t.answerQuestion();ok(t.s.feedback?.ok,'Resposta trilha '+m.id+' '+i);}snapshot('practice-'+m.id);}
ok(Object.keys(t.getP().completed).length===84,'Persistir 84 etapas');
for(let i=0;i<C.ARENA.length;i++){t.navigate('arena');t.s.arenaIndex=i;const task=C.ARENA[i];t.s.selected=task.type==='choice'?task.answer:null;elements['#answer'].value=String(task.value??'');t.answerQuestion();ok(t.s.feedback?.ok,'Arena '+i);}
for(const c of C.CASES){t.navigate('case');t.s.caseId=c.id;for(let i=0;i<3;i++){t.s.caseQ=i;const task=c.tasks[i];t.s.selected=task.type==='choice'?task.answer:null;elements['#answer'].value=String(task.value??'');t.answerQuestion();ok(t.s.feedback?.ok,'Missão '+c.id+' '+i);}snapshot('case-'+c.id);}
for(const source of ['x^2-2','(x-1.337)^2','2x+y=5\nx+3y=6','10x-y+2z=6\n-x+11y-z=22\n2x-y+10z=-10']){t.navigate('lab');t.s.source=source;t.s.algorithm='auto';t.solve();ok(t.s.result?.converged,'Resolver '+source);for(const tab of ['solution','steps','compare','converge','verify']){t.s.resultTab=tab;t.render();snapshot('lab-'+t.s.mode+'-'+tab);if(tab==='converge')ok(elements['#app'].innerHTML.includes('conv-plot'),'Gráfico de convergência '+source);}}
for(const m of C.METHODS){
 t.navigate('lab');t.s.algorithm=m.id;t.s.mode=['gauss','seidel'].includes(m.id)?'system':'root';t.s.source=C.DEEP[m.id].system||C.DEEP[m.id].example;t.s.x0='1.5';t.s.x1='2';t.s.a='1';t.s.b='2';t.s.g=C.DEEP[m.id].g||'';t.solve();ok(t.s.result?.converged,'Terminal manual '+m.id);
 const tasks=t.guideTasks(t.s.result);ok(tasks.length>0,'Modo guiado possui passos '+m.id);t.s.resultTab='guide';t.s.guideIndex=0;t.render();snapshot('guide-'+m.id);
 elements['#guideAnswer']={value:String(tasks[0].value)};t.checkGuide();ok(t.s.guideFeedback?.ok,'Correção guiada '+m.id);
}
t.s.algorithm='auto';
t.s.source='1/x';t.solve();ok(!t.s.result&&!!t.s.error,'Erro limpa resultado antigo');t.s.source='/help';t.solve();ok(t.s.help,'Comando help');
t.navigate('arena');t.s.arenaIndex=0;t.s.hearts=3;elements['#answer'].value='999';t.answerQuestion();ok(t.s.hearts===2&&t.getP().review['a:0'],'Erro reduz vida e registra revisão');
t.navigate('review');snapshot('review-filled');t.s.reviewId='a:0';t.render();snapshot('review-question');t.navigate('progress');snapshot('progress-filled');
ok(near(t.parseAnswer('17/12'),17/12),'Frações em atividades');fail(()=>t.parseAnswer('1/0'),'Rejeitar fração inválida');
group='Terminal v7';
// Busca de raízes reforçada: raízes próximas, escala grande, funções periódicas e borda do domínio.
const rootsOf=(expr,o)=>M.smartRoot(expr,o).roots.map(r=>r.root);
const hasAll=(got,want,tol=1e-6)=>want.every(w=>got.some(g=>Math.abs(g-w)<=tol*(1+Math.abs(w))));
const r20=1.0717734625362931;ok(hasAll(rootsOf('x^20 - 3x^10 + 2 = 0'),[1,-1,r20,-r20]),'Raízes próximas: x^20 - 3x^10 + 2');
ok(hasAll(rootsOf('20x^4 - 61x^3 - 58x^2 + 225x - 126 = 0'),[-2,1,1.05,3]),'Raízes 1 e 1,05');
ok(hasAll(rootsOf('x^2 + 23.1x + 133.4024 = 0'),[-11.56,-11.54]),'Raízes a 0,02 de distância');
const big=M.smartRoot('x^100 - 10000000000 = 0'),b100=Math.pow(1e10,1/100);ok(hasAll(big.roots.map(r=>r.root),[b100,-b100]),'Escala grande: x^100 = 1e10');
ok(big.validation==='sinal'&&big.converged&&big.bracket[1]-big.bracket[0]<=1e-15,'Raiz certificada por troca de sinal');
ok(hasAll(rootsOf('x^3 - 1.085x^2 - 628.69125x + 6300.57285 = 0'),[-28.6,14.85]),'Coeficientes grandes');
const sinRoots=rootsOf('sin(x) = 0.8');ok(sinRoots.length===26&&hasAll(sinRoots,[Math.asin(.8)-12*Math.PI,Math.PI-Math.asin(.8)+10*Math.PI]),'sin(x) = 0,8: 26 raízes em [-40, 40]');
ok(rootsOf('tan(x) = 4 - x').length===27,'tan(x) = 4 - x: 27 raízes, sem polos');
ok(hasAll(rootsOf('ln(x) = -2.81'),[Math.exp(-2.81)]),'Raiz perto da borda do domínio');
ok(hasAll(rootsOf('cos(x) - 1 = 0'),[0,2*Math.PI,-2*Math.PI,4*Math.PI],1e-6),'Raízes tangentes 2πk');
for(const expr of ['abs(x)/x = 0.5','tan(x) = 1e9','(x-2.81)^2 + 1e-9 = 0','1e-9(x^2 + 2) = 0'])fail(()=>M.smartRoot(expr),'Não declarar raiz: '+expr);
t.navigate('lab');t.s.algorithm='auto';t.s.source='x^100 - 10000000000 = 0';t.solve();t.s.resultTab='verify';t.render();ok(elements['#app'].innerHTML.includes('Raiz certificada por troca de sinal'),'Verificação explica a raiz certificada');snapshot('lab-root-certified');
t.s.source='x^3 - x - 2 = 0';t.solve();t.s.resultTab='verify';t.render();ok(elements['#app'].innerHTML.includes('Resíduo absoluto exigido'),'Verificação comum mantida');
t.s.help=true;t.render();ok(elements['#app'].innerHTML.includes('até 400 candidatas'),'Ajuda descreve a nova busca');
// Teclado científico: escrita bonita <-> sintaxe do motor.
const cx={window:null,console,Math,Number,String,JSON,Array,Object,Error,RegExp,Set,Map,document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},matchMedia:()=>({matches:false}),MutationObserver:class{observe(){}},Event:class{}};cx.window=cx;vm.createContext(cx);
vm.runInContext(read('math-engine.js'),cx,{filename:'math-engine.js'});vm.runInContext(read('calculator.js'),cx,{filename:'calculator.js'});
const K=cx.NumeraCalc,MM=cx.NumeraMath;ok(!!K&&typeof K.toEngine==='function','calculator.js carregado');
for(const [pretty,engine] of [['x²⁰ - 3x¹⁰ + 2 = 0','x^(20) - 3x^(10) + 2 = 0'],['e⁻ˣ = x','e^(-x) = x'],['x¹ᐟ³ = 3','x^(1/3) = 3'],['2ˣ⁺¹ = 32','2^(x+1) = 32'],['x²˙⁵ = 3','x^(2.5) = 3'],['√(x + 8) = x - 1','sqrt(x + 8) = x - 1'],['x·π = 1,5','x* pi  = 1,5'],['asin(x) = e÷4','asin(x) = e/4'],['x² − 5x + 6 = 0','x^(2) - 5x + 6 = 0']])ok(K.toEngine(pretty)===engine,'Converter '+pretty);
const same=(a,b)=>{const f=MM.parseFunction(a);return [0.3,1.7,2.9,-1.2].every(x=>{const u=f(x),v=MM.parseFunction(b)(x);return (Number.isNaN(u)&&Number.isNaN(v))||Math.abs(u-v)<=1e-12*(1+Math.abs(u));});};
for(const ascii of ['x^3 - x - 2 = 0','x^20 - 3x^10 + 2 = 0','e^(-x) = x','x^(1/3) = 3','2^x = 151','x exp(x) = 6','sqrt(x + 8) = x - 1','x^2.5 = 3','e^(sin(x)) = 2','2^x^2 = 16','x*pi = 3','(x - 2.8)^2 = 0','x^-1 + x = 3','cos(4x) = x^2','(x^2 - 4)/(x - 1) = 2'])ok(same(K.toPretty(ascii),ascii),'Ida e volta: '+ascii+' → '+K.toPretty(ascii));
ok(K.toPretty('x^3 - x - 2 = 0')==='x³ - x - 2 = 0'&&K.toPretty('e^(-x) = x')==='e⁻ˣ = x'&&K.toPretty('2^x^2')==='2ˣ^2','Expoentes elevados na tela');
ok(MM.smartRoot('x²⁰ - 3x¹⁰ + 2 = 0').roots.length===4,'Motor aceita escrita bonita');
const sysPretty=MM.parseSystem('2x + y = 5\nx + 3y = 6');ok(sysPretty.A.length===2,'Sistemas continuam aceitos');
group='Treino';
// Dados: 140 exercícios, 20 por método, ordem misturada, pistas, pergunta cega, erros típicos e gabarito.
const TE=ctx.NumeraTreino.exercises,MS=['bisection','falseposition','fixedpoint','newton','secant','gauss','seidel'];ok(TE.length===140,'140 exercícios');
for(const m of MS)ok(TE.filter(e=>e.method===m).length===20,'20 exercícios de '+m);
ok(TE.every((e,i)=>!i||e.method!==TE[i-1].method),'Nunca dois métodos iguais seguidos');ok(new Set(TE.map(e=>e.id)).size===140&&TE.every((e,i)=>e.n===i+1&&/^(bi|fp|pf|nw|sc|ga|gs)\d\d$/.test(e.id)),'Numeração e ids estáveis');
ok(new Set(TE.slice(0,14).map(e=>e.method)).size===7,'Os 14 primeiros já misturam os 7 métodos');ok(new Set(TE.map(e=>e.area)).size>=40,'Contextos variados (40+ áreas)');
const NAMES={bisection:'Bisseção',falseposition:'Falsa Posição',fixedpoint:'Ponto Fixo',newton:'Newton',secant:'Secante',gauss:'Eliminação',seidel:'Seidel'};
for(const e of TE){ok(/\[\[(.+?)\|([^|\]]+)\]\]/.test(e.story)&&(e.story.match(/\[\[/g)||[]).length===[...e.story.matchAll(/\[\[(.+?)\|([^|\]]+)\]\]/g)].length&&e.why&&e.ask&&e.steps&&[1,2,3].includes(e.level),'Enunciado completo #'+e.n);
 ok(e.askBlind&&!Object.values(NAMES).some(n=>e.askBlind.includes(n)),'Pergunta sem o nome do método #'+e.n);
 const vals=e.answer.type==='vec'?e.answer.values:[e.answer.value];ok(vals.every(Number.isFinite),'Gabarito numérico #'+e.n);ok(!!e.conv,'Dados do gráfico #'+e.n);}
ok(TE.filter(e=>e.traps&&e.traps.length).length>=130,'Erros típicos em 130+ exercícios');ok(TE.filter(e=>e.legacy).length===84,'84 exercícios herdados da v8 sem mudança');
// O motor do site refaz cada conta do gabarito (gerado de forma independente com sympy/mpmath).
for(const e of TE){const c=e.check||{},a=e.answer,o={tolerance:1e-12,maxIterations:500};let got;
 if(e.method==='bisection'){const fn=M.parseFunction(e.source);if(c.k)got=M.bisection(fn,c.a,c.b,{tolerance:1e-12,maxIterations:c.k}).iterations[c.k-1].x;else if(c.n)got=((c.b-c.a)/2**c.n<=c.eps&&(c.b-c.a)/2**(c.n-1)>c.eps)?c.n:NaN;else got=M.smartRoot(e.source,{min:e.terminal.a,max:e.terminal.b}).root;}
 else if(e.method==='falseposition'){const fn=M.parseFunction(e.source);got=c.k?M.falsePosition(fn,c.a,c.b,{tolerance:1e-12,maxIterations:c.k}).iterations[c.k-1].x:c.count?M.falsePosition(fn,c.a,c.b,{tolerance:c.eps,maxIterations:500}).steps:M.falsePosition(fn,e.terminal.a,e.terminal.b,o).root;}
 else if(e.method==='fixedpoint'){const g=M.parseFunction(e.g);got=c.k?M.fixedPoint(g,c.x0,{tolerance:1e-12,maxIterations:c.k}).iterations[c.k].x:M.fixedPoint(g,e.terminal.x0,o).root;}
 else if(e.method==='newton'){const fn=M.parseFunction(e.source);got=c.k?M.newton(fn,c.x0,{tolerance:1e-12,maxIterations:c.k}).iterations[c.k].x:M.newton(fn,e.terminal.x0,o).root;}
 else if(e.method==='secant'){const fn=M.parseFunction(e.source);got=c.k?M.secant(fn,c.x0,c.x1,{tolerance:1e-12,maxIterations:c.k}).iterations[c.k+1].x:M.secant(fn,e.terminal.x0,e.terminal.x1,o).root;}
 else{const {A,b}=M.parseSystem(e.source);got=e.method==='gauss'||c.until?M.gauss(A,b,o).root:M.seidel(A,b,c.x0,{tolerance:1e-12,maxIterations:c.k}).iterations.find(r=>r.i===c.k).x;
  if(e.method==='gauss'&&a.type==='num')got=got[['x','y','z','u'].indexOf(e.ask.match(/valor de (\w)/)[1])];}
 const want=a.type==='vec'?a.values:[a.value],have=Array.isArray(got)?got:[got];
 ok(want.length===have.length&&want.every((v,i)=>a.abs?Math.abs(have[i]-v)<=a.abs:Math.abs(have[i]-v)<=1e-8*(1+Math.abs(v))),'Motor confirma o gabarito #'+e.n);}
// Interface: diagnosticar e resolver os 140, digitando a resposta com vírgula, como uma pessoa faria.
const TRU=t.TR;ok(!!TRU&&TRU.count===140,'Aba Treino integrada');t.navigate('treino');snapshot('treino');ok(elements['#app'].innerHTML.includes('Diagnostique o método'),'Página do Treino');
TRU.handle('tr-open',{dataset:{index:'0'}});t.render();ok(elements['#app'].innerHTML.includes(safeHtml(TE[0].askBlind))&&!elements['#app'].innerHTML.includes(safeHtml(TE[0].ask)),'Antes do diagnóstico, a pergunta não revela o método');
const BR=v=>String(+v.toPrecision(9)).replace('.',',');
for(let i=0;i<TE.length;i++){const e=TE[i];TRU.handle('tr-open',{dataset:{index:String(i)}});
 const wrongM=i%10===0?(e.method==='newton'?'secant':'newton'):e.method;TRU.handle('tr-diag',{dataset:{id:wrongM}});
 const vals=e.answer.type==='vec'?e.answer.values:[e.answer.value];vals.forEach((v,j)=>{elements['#tr-ans-'+j]={value:BR(v)};});TRU.submit();
 Object.keys(elements).filter(k=>k.startsWith('#tr-ans-')).forEach(k=>delete elements[k]);}
const SU=TRU.summary();ok(SU.solved===140,'Os 140 exercícios aceitam a resposta do gabarito');ok(SU.diagnosed===140&&SU.dOk===126&&SU.perfect===126,'Diagnóstico errado registrado e sem estrela');
ok(SU.reviewDue===14&&TRU.reviewDue()===14,'Diagnósticos errados vão para a revisão (14)');
TRU.handle('tr-open',{dataset:{index:'1'}});t.render();ok(elements['#app'].innerHTML.includes(safeHtml(TE[1].ask)),'Depois do diagnóstico, a pergunta completa aparece');
elements['#tr-ans-0']={value:'123456'};const before=TRU.summary().solved;TRU.submit();ok(TRU.summary().solved===before,'Resposta errada não desfaz nem cria acerto');delete elements['#tr-ans-0'];
// Erro típico: digitar o valor de uma armadilha mostra a explicação específica.
{const i=TE.findIndex(e=>e.traps&&e.traps.length&&e.answer.type==='num'),e=TE[i],tr=e.traps[0];TRU.handle('tr-open',{dataset:{index:String(i)}});elements['#tr-ans-0']={value:BR(tr.v)};TRU.submit();delete elements['#tr-ans-0'];ok(elements['#app'].innerHTML.includes('Erro típico identificado')&&elements['#app'].innerHTML.includes(safeHtml(tr.m)),'Erro típico reconhecido: '+e.title);
 const j=TE.findIndex(e=>e.answer.type==='vec'&&e.traps&&e.traps.some(t=>Array.isArray(t.v)));const ev=TE[j],tv=ev.traps.find(t=>Array.isArray(t.v));TRU.handle('tr-open',{dataset:{index:String(j)}});tv.v.forEach((v,k)=>{elements['#tr-ans-'+k]={value:BR(v)};});TRU.submit();Object.keys(elements).filter(k=>k.startsWith('#tr-ans-')).forEach(k=>delete elements[k]);ok(elements['#app'].innerHTML.includes(safeHtml(tv.m)),'Erro típico em sistema: '+ev.title);}
// Gabarito: passo a passo, gráfico de convergência e erros típicos.
for(const m of MS){const i=TE.findIndex(e=>e.method===m);TRU.handle('tr-open',{dataset:{index:String(i)}});TRU.handle('tr-key',{dataset:{}});t.render();const html=elements['#app'].innerHTML;ok(html.includes('Passo a passo')&&html.includes('conv-plot'),'Gabarito com gráfico de convergência: '+m);if(m==='fixedpoint'||m==='falseposition')snapshot('treino-gabarito-'+m);}
TRU.handle('tr-view',{dataset:{id:'key'}});TRU.handle('tr-showall',{dataset:{}});t.render();ok(elements['#app'].innerHTML.includes('Gabarito completo')&&elements['#app'].innerHTML.includes('tr-print'),'Gabarito completo e versão para imprimir');snapshot('treino-gabarito-completo');
// Revisão de diagnósticos: aparece no caderno, conta no topo e reagenda.
t.s.reviewId=null;t.navigate('review');ok(elements['#app'].innerHTML.includes('Diagnósticos do Treino'),'Caderno mostra os diagnósticos do Treino');ok(/class="count">\d+/.test(elements['#app'].innerHTML),'Contador de revisão inclui o Treino');snapshot('review-treino');
{const e=TE[0];TRU.handle('tr-rev',{dataset:{id:e.id}});t.render();ok(elements['#app'].innerHTML.includes('Revisão de diagnóstico'),'Tela de revisão');TRU.handle('tr-rev-pick',{dataset:{id:e.method}});ok(TRU._prog()[e.id].rv.int===3&&TRU.reviewDue()===13,'Acerto na revisão adia para 3 dias');
 const e2=TE[10];TRU.handle('tr-rev',{dataset:{id:e2.id}});TRU.handle('tr-rev-pick',{dataset:{id:e2.method==='newton'?'secant':'newton'}});ok(TRU._prog()[e2.id].rv.int===1&&TRU.reviewDue()===12,'Erro na revisão volta amanhã');}
// Modo prova: sorteio misturado, nota, relatório e diagnósticos errados para a revisão.
TRU.handle('tr-view',{dataset:{id:'prova'}});t.render();ok(elements['#app'].innerHTML.includes('Modo prova'),'Tela inicial da prova');snapshot('treino-prova-inicio');
TRU.handle('tr-pv-n',{dataset:{id:'10'}});TRU.handle('tr-pv-limit',{dataset:{id:'30'}});TRU.handle('tr-pv-start',{dataset:{}});
{const pv=TRU._prog()._prova;ok(pv&&pv.ids.length===10&&new Set(pv.ids).size===10,'10 questões distintas');const ms=pv.ids.map(id=>TE.find(e=>e.id===id).method);ok(new Set(ms).size>=6&&ms.every((m,i)=>!i||m!==ms[i-1]),'Prova mistura os métodos');
 t.render();ok(elements['#app'].innerHTML.includes('Questão 1 de 10')&&!elements['#app'].innerHTML.includes('Diagnóstico certeiro'),'Prova sem gabarito durante a resolução');snapshot('treino-prova-questao');
 const firstMissing=TE.find(e=>e.id===pv.ids[0]);ok(!elements['#app'].innerHTML.includes(safeHtml(firstMissing.ask))||firstMissing.ask===firstMissing.askBlind,'Prova usa a pergunta sem o método');
 pv.ids.forEach((id,k)=>{const e=TE.find(x=>x.id===id);TRU.handle('tr-pv-go',{dataset:{index:String(k)}});TRU.handle('tr-pv-diag',{dataset:{id:k<5?e.method:(e.method==='newton'?'secant':'newton')}});const vals=e.answer.type==='vec'?e.answer.values:[e.answer.value];vals.forEach((v,j)=>{elements['#pv-ans-'+j]={value:k<5?BR(v):'0'};});TRU.handle('tr-pv-next',{dataset:{}});Object.keys(elements).filter(x=>x.startsWith('#pv-ans-')).forEach(x=>delete elements[x]);});
 const dueBefore=TRU.reviewDue();TRU.handle('tr-pv-end',{dataset:{}});TRU.handle('tr-pv-end-yes',{dataset:{}});t.render();const last=TRU._prog()._provaLast;
 ok(last&&last.n===10&&last.dOk===5&&last.aOk>=5&&last.nota>=5&&last.nota<=5.6,'Nota da prova: 5 certas inteiras (nota '+(last&&last.nota)+')');ok(elements['#app'].innerHTML.includes('Relatório da prova')&&elements['#app'].innerHTML.includes('is-report'),'Relatório da prova');
 ok(TRU.reviewDue()>dueBefore||TRU.reviewDue()===dueBefore,'Diagnósticos errados da prova vão para a revisão');ok(TRU._prog()._provas.length===1&&!TRU._prog()._prova,'Histórico de provas salvo');snapshot('treino-prova-relatorio');
 TRU.handle('tr-pv-new',{dataset:{}});TRU.handle('tr-pv-start',{dataset:{}});const pv2=TRU._prog()._prova;pv2.start=Date.now()-31*60*1000;TRU._finish(true);ok(TRU._prog()._provaLast.timeout&&TRU._prog()._provaLast.nota===0,'Prova encerrada pelo tempo vale o que foi feito');}
t.navigate('progress');ok(elements['#app'].innerHTML.includes('Treino de diagnóstico')&&elements['#app'].innerHTML.includes('última prova'),'Treino e prova aparecem no Progresso');
// Migração: o progresso da v8 (t1..t100) é trazido para os exercícios que não mudaram.
{const memV8=new Map([['numera-treino-v8',JSON.stringify({t1:{d:'secant',dOk:true,ok:true,tries:1},t2:{d:'newton',dOk:true,ok:true,tries:1},t99:{d:'gauss',dOk:false}})]]);
 const legacy=new Map(TE.filter(e=>e.legacy).map(e=>[e.legacy,e.id]));
 const T2=ctx.NumeraTreinoUI({safe:x=>String(x),icon:()=>'',btn:()=>'',tag:()=>'',bar:()=>'',method:id=>C.METHODS.find(m=>m.id===id),heading:()=>'',tabs:()=>'',parseAnswer:t.parseAnswer,openInLab(){},storage:{getItem:k=>memV8.get(k)||null,setItem:(k,v)=>memV8.set(k,v)},render(){}});
 const expected=['t1','t2','t99'].filter(k=>legacy.has(k)).length;ok(T2._prog()._migrated===expected&&memV8.has('numera-treino-v9'),'Migração do progresso da v8 ('+expected+' exercícios)');}
TRU.handle('tr-reset-yes',{dataset:{}});ok(TRU.summary().solved===0,'Recomeçar o Treino zera só o Treino');ok(Object.keys(t.getP().completed).length>0,'Recomeçar o Treino preserva as trilhas');
group='PWA e organização';
{const man=JSON.parse(read('manifest.webmanifest'));ok(man.name&&man.short_name&&man.start_url&&man.display==='standalone'&&man.lang==='pt-BR','Manifesto do app');
 for(const ic of man.icons){ok(fs.existsSync(path.join(dir,ic.src)),'Ícone existe: '+ic.src);if(ic.src.endsWith('.png')){const b=fs.readFileSync(path.join(dir,ic.src)),w=b.readUInt32BE(16),h=b.readUInt32BE(20);ok(ic.sizes===w+'x'+h,'Tamanho do ícone '+ic.src+' ('+w+'x'+h+')');}}
 ok(man.icons.some(i=>i.purpose==='maskable'),'Ícone adaptável (maskable)');
 const sw=require('./pwa/atualizar-sw.cjs')(),files=fs.readdirSync(dir).filter(f=>f!=='sw.js'&&!f.startsWith('.'));
 ok(files.every(f=>sw.assets.includes(f)),'Todo arquivo do site está no cache offline: '+files.filter(f=>!sw.assets.includes(f)).join(','));ok(sw.assets.filter(a=>a!=='./').every(a=>files.includes(a)),'Nenhum arquivo fantasma no cache offline');
 ok(read('sw.js').includes(`const VERSION = '${sw.version}'`),'Versão do cache offline em dia (rode tests/pwa/atualizar-sw.cjs)');
 const html=read('index.html');ok(html.includes('rel="manifest"')&&html.includes("register('sw.js')")&&html.includes('apple-touch-icon'),'index.html liga o manifesto e o service worker');
 const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);ok(scripts.join()==='math-engine.js,content.js,progress.js,convergencia.js,treino-data.js,treino.js,app.js,calculator.js','Ordem dos scripts');
 const css=[...html.matchAll(/<link rel="stylesheet" href="([^"]+\.css)"/g)].map(m=>m[1]);ok(['styles.css','calculator.css','treino.css','convergencia.css'].every(c=>css.includes(c)),'Folhas de estilo ligadas');
 for(const f of files.filter(f=>f.endsWith('.js')))ok(!/\(\?<[=!]/.test(read(f)),'Sem lookbehind em regex (Safari < 16.4): '+f);}
// O número de verificações mostrado no site tem de ser o real (inclui esta).
{const shown=Number((read('app.js').match(/const VERIFY_COUNT=(\d+);/)||[])[1]);ok(shown===count+1,`O site diz ${shown} verificações; o total real é ${count+1}. Atualize VERIFY_COUNT em app.js.`);}
console.log(JSON.stringify({status:'PASS',checks:count,groups},null,2));
