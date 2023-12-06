// import OpenAI from "openai";

const OpenAImod = await import('https://esm.sh/openai@4.20.1')
const openai = new OpenAImod.OpenAI({ 
    apiKey: localStorage.GPT_API_key,
    dangerouslyAllowBrowser: true // with assurance key value not ever commited 
});

//check that key is valid
async function verifyKey(key=localStorage.GPT_API_key){
  try {
    const response = await fetch('https://api.openai.com/v1/engines/davinci', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      }
    });
    if (response.ok) {
      console.log('API key is valid.');
      return true
    } else {
      console.error('Invalid API key. Please check your key and try again.');
      let k = prompt('API key validation failed.\nYou can generate your own at https://platform.openai.com/account/api-keys. Please provide a valid key:')
      //console.log('k:',k)
      if(typeof(k)=='string'){
        return await verifyKey(k)
      }else{
        return false
      }
    }
  }
  catch (error) {
    console.error('Error occurred while checking API key:', error.message);
  }
}
verifyKey()

let assistantList=[]

// Creating a new instance of an assistant,
// default object is borrowed from tutorial at
// https://platform.openai.com/docs/api-reference/assistants/createAssistant
async function createAssistant(opt={ // the object parameterizing the new assistant instance
    instructions:
      "You are a personal math tutor. When asked a question, write and run JavaScript code to answer the question.",
    name: "Math Tutor",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4",
  }) {
  const newAssistant = await openai.beta.assistants.create(opt);
  assistantList.push(newAssistant)
  //console.log(`newAssistant (${newAssistant.id})`, newAssistant);
  return newAssistant;
}

// retrieving an existing assistant
async function retrieveAssistant(id){
    if(!id){
      return Error('No assistant id provided')
    }else{
      return openai.beta.assistants.retrieve(id) 
    }
}

// deleting an existing assistant
async function deleteAssistant(id){
    if(!id){
      return Error('No assistant id provided')
    }else{
      return openai.beta.assistants.delete(id) 
    }
}

// User interface
function UI(div='assistantDiv'){
  if(!div){
    div = document.createElement('div')
    document.body.appendChild(div)
  }
  if(typeof(div)=='string'){
    div = document.getElementById(div)
  }
  div.innerHTML=`<b style="color:maroon">Working on the UI ...</b><br>${Date()}<br>For a quick peek try <code>a1 = await (await import('https://episphere.github.io/assistant/assistant.mjs')).createAssistant()</code>.`
  return div
}

//main();
export{
  createAssistant,
  retrieveAssistant,
  assistantList,
  deleteAssistant,
  verifyKey,
  UI
}