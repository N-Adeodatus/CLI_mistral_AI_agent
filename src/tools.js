import os from "os"
import fs from "fs/promises"
import { resolve } from "path"

function delay() {
    return new Promise(resolve => setTimeout(resolve, 1000))
}

export async function read_shell_history() {
    await delay()
    let historyFile
    const shell = process.env.ComSpec
  
    // if(shell.includes('bash')){
    //     historyFile = `${os.homedir()}/.bash_history`
    // }
    // else if(shell.includes('zsh')){
    //     historyFile = `${os.homedir()}/.zsh_history`
    // }
    // else {
    //     return "history file not found"
    // }
    historyFile = `${os.homedir()}/.bash_history`
    try {
        const data = await fs.readFile(historyFile, 'utf-8')
        const commands = data.trim().split('\n').slice(-50).join('\n')
        // console.log(commands)
        return commands
    } catch (error) {
        console.log(`Error reading file: ${err}`)
    }   
}

export const tools = [
    {
        "type": "function",
        "function": {
            "name": "read_shell_history",
            "description": "Get history of commands which consists of the past 50 commands run.",
            "parameters": {}
        },
    }
]