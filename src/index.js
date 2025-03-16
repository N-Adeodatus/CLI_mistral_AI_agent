import { Mistral } from "@mistralai/mistralai";

const apiKey = import.meta.env.VITE_MISTRAL_API
console.log(apiKey);

const mistralClient = new Mistral({apiKey: apiKey})

async function agent(query) {
    // message array to store the conversation with the agent
    const messages = [
        {role: 'user', content: query}
    ]
    
    //response from the agent.
    const response =  await mistralClient.chat.stream({
        
        model: 'mistral-large-latest',
        messages: messages,
        stream: true
    
})

    // Handling the chunks of response
    try{
        let result = ''
        for await(const chunk of response){
            result += chunk.data.choices[0].delta.content
            console.log(result)
        }
        return result
    }
    catch(err){
        console.error('An error occurred during handling the chunks of response:', err)
    }
       
}

// Function to call the agent while adding some other code to be run whe the agent is called
async function generateResponse() {
    const responseFromAgent = await agent('hello')
    console.log('Final response', responseFromAgent)
}

// debounce function to handle the rate limit of the mistral api call
function debounce(func, delay) {
    let timeoutId
    return function(...args) {
        const context = this
        if(timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(func.apply(context, args),delay)
    }
}

const debounceOutput = debounce(generateResponse, 1000)

debounceOutput()