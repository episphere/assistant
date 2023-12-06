console.log(`index.js loaded\n${Date()}`);

(async function(){
    //assistant = (await import('./assistant.mjs')).createAssistant()
    let div = (await import('./assistant.mjs')).UI()
})()
