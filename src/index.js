import { Mistral } from "@mistralai/mistralai";
import readline from "node:readline"
import dotenv from "dotenv"
import { read_shell_history, tools } from "./tools.js";

dotenv.config()

const apiKey = "POjCwfVcJKDVERloIQnrmxndl1GeMjqb"
console.log('Type "exit", ctrl+c or ctrl+d to exit');
console.log('How can I Help?')

const mistralClient = new Mistral({apiKey: apiKey})

// Function to create an interface to read and write data.
let userInput

const messages = []
let result = ''
let availableFunctions = {read_shell_history}
const rw = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
// Interface to interact with the user.
async function interactWithUser() {

    
        const prompt = await new Promise((resolve) => {
            rw.question( "\nAsk AI: \n", (answer) => {
                if(answer !== '') {
                    resolve(answer)
                    console.log()
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
    
    for (let i = 0; i < 5; i++){

        //response from the agent.
        const response =  await mistralClient.chat.stream({
            model: 'mistral-large-latest',
            messages: messages,
            tools: tools,
            stream: true
        })
        
        // Handling the chunks of response
        try{
            for await(const chunk of response){
                if(chunk.data.choices[0].finishReason === 'stop'){ // If it is the last chunk
                    process.stdout.write(chunk.data.choices[0].delta.content)
                    result += `${chunk.data.choices[0].delta.content}`
                    messages.push({role: 'assistant', content: result})
                    console.log()
                    return
                } else if(chunk.data.choices[0].finishReason === 'tool_calls') { // If the AI model called a tool
                    const functionObj = chunk.data.choices[0].delta.toolCalls[0].function
                    const functionName = functionObj.name
                    const functionArguments = JSON.parse(functionObj.arguments)
                    const tool_call_id = chunk.data.choices[0].delta.toolCalls[0].id
                    const resultFromTool = await availableFunctions[functionName](functionArguments)
                    messages.push({role: 'assistant', toolCalls: [{id: tool_call_id, function: functionObj}]})
                    messages.push({role: 'tool', content: resultFromTool, toolCallId: tool_call_id})
                } else { // If the AI model got a prompt that does not require to call a tool
                    process.stdout.write(chunk.data.choices[0].delta.content)
                    result += chunk.data.choices[0].delta.content
                }
            }
             
        }
        catch(err){
            console.error('An error occurred during handling the chunks of response:', err)
        }
    }
       
}

// Function to call the agent while adding some other code to be run whe the agent is called
async function generateResponse() {
    await agent(userInput)
}

// debounce function to handle the rate limit of the mistral api call
// function debounce(func, delay) {
//     let timeoutId
//     return async function(...args) {
//         const context = this
//         if(timeoutId) clearTimeout(timeoutId)
//         timeoutId = setTimeout(() => func.apply(context, args),delay)
//         if(args[0]) args[0]()
//     }
// }

// const debounceOutput = debounce(generateResponse, 1000)

