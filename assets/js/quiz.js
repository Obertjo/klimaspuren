(() => {
const form = document.getElementById('quiz-form'); if(!form)return;
form.addEventListener('submit',(e)=>{
 e.preventDefault(); const fd=new FormData(form), answers={q1:'b',q2:'a',q3:'c'};
 const score=Object.keys(answers).filter(k=>fd.get(k)===answers[k]).length;
 document.getElementById('quiz-result').innerHTML=`<div class="quiz-result"><strong>${score} von 3 richtig.</strong><p>Wichtig: Ein Luftbild zeigt sichtbare Strukturen; Pflanzen können über Verschattung und Verdunstung wirken; der Sky View Factor beschreibt den sichtbaren Himmelsanteil.</p></div>`;
});
})();
