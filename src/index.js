import { Mistral } from "@mistralai/mistralai";
import readline from "node:readline"
import dotenv from "dotenv"

dotenv.config()

const apiKey = process.env.VITE_MISTRAL_API
console.log('Type "exit", ctrl+c or ctrl+d to exit');
console.log('How can I Help?')

const mistralClient = new Mistral({apiKey: apiKey})

// Function to create an interface to read and write data.
let userInput
let result = ''
const messages = []
const rw = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
async function interactWithUser() {

    
        const prompt = await new Promise((resolve) => {
            rw.question( "\nAsk AI: \n", (answer) => {
                if(answer !== '') {
                    resolve(answer)
                } else {
                    console.log("Please enter a prompt")
                    interactWithUser()
                }
            })
        })

        if(prompt.toLowerCase() === "exit"){
            console.log("Good bye😊!")
            rw.close()
            return
        }

        userInput = prompt
        messages.push()
        // Ensure the debounce function finishes before continuing
        await generateResponse()
        interactWithUser()
    
        
    


}
interactWithUser()

async function agent(query) {
    // message array to store the conversation with the agent
    messages.push({role: 'user', content: query})
    // const messages = [
    //     {role: 'user', content: query}
    // ]
    
    //response from the agent.
    const response =  await mistralClient.chat.stream({
        
        model: 'mistral-large-latest',
        messages: messages,
        stream: true
    
})

    // Handling the chunks of response
    try{
        
        for await(const chunk of response){
            process.stdout.write(chunk.data.choices[0].delta.content)
            if(chunk.data.choices[0].finishReason === 'stop'){
                result += `${chunk.data.choices[0].delta.content}`
                console.log()
            } else {
                result += chunk.data.choices[0].delta.content
            }
        }
        messages.push({role: 'assistant', content: result})
        return result
    }
    catch(err){
        console.error('An error occurred during handling the chunks of response:', err)
    }
       
}

// Function to call the agent while adding some other code to be run whe the agent is called
async function generateResponse() {
    await agent(userInput)
}

// debounce function to handle the rate limit of the mistral api call
function debounce(func, delay) {
    let timeoutId
    return async function(...args) {
        const context = this
        if(timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func.apply(context, args),delay)
        if(args[0]) args[0]()
    }
}

const debounceOutput = debounce(generateResponse, 1000)

