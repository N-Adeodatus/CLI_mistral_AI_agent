import os from "os"
import fs from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { resolve } from "path"

function delay() {
    return new Promise(resolve => setTimeout(resolve, 1000))
}

export async function read_shell_history() {
    console.log('read_shell_history run')
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
         console.log('these are the commands',commands)
        return commands
    } catch (error) {
        console.log(`Error reading file: ${err}`)
    }   
}

export async function getInfoFromFileInWd({fileName}) {
    console.log('getInfoFromFileInWd is called')
    await delay()
    const filePath = path.join(process.cwd(), fileName)
    if(!existsSync(filePath)){
        return "File does not exist in the current working directory"
    }
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return fileContent
}

export async function getInfoFromSpecificFile({pathToFile}) {
    console.log('getInfoFromSpecificFile is called')
    await delay()
    if(!existsSync(pathToFile)){
        return "File does not exist"
    }
    const fileContent = await fs.readFile(pathToFile, 'utf-8')
    return fileContent
}

export const tools = [
    {
        "type": "function",
        "function": {
            "name": "read_shell_history",
            "description": "Get history of commands which consists of the past 50 most recent commands run from the .bash_history file.",
            "parameters": {}
        },
    },
    {
        "type": "function",
        "function": {
            "name": "getInfoFromFileInWd",
            "description": "Get The content of a file that is the current working directory",
            "parameters": {
                "type": "object",
                "properties": {
                    "fileName": {
                        "type": "string",
                        "description": "The name of the file to read from the current working directory"
                    }
                },
                "required": ["fileName"]
            }
        },
    },
    {
        "type": "function",
        "function": {
            "name": "getInfoFromSpecificFile",
            "description": "Get The content of a specified file from a given path.",
            "parameters": {
                "type": "object",
                "properties": {
                    "pathToFile": {
                        "type": "string",
                        "description": "The path to the file to read."
                    }
                },
                "required": ["pathToFile"]
            }
        },
    },
]