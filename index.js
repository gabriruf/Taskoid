const { parse } = require('path');

function main() {
    /* 
    
        // Exemplo de tarefa:
        
        "1": indice da tarefa
        "[ ]": status da tarefa
            "[x]": done
            "[ ]": todo
            "[-]": in-progress
        "Comprar comida": nome da tarefa
    
        // 1 - [ ]: Comprar comida
    */
    console.log("> Taskoid, Conqueror of Tasks ")

    const fs = require('fs')

    if (!(fs.existsSync('tasksList.json'))) {
        fs.writeFileSync('tasksList.json', `{ "tasks": [] }`)
    }




    // Reads the file contents and parses it into objects.
    //const taskFile = fs.readFileSync('tasksList.json', 'utf-8')
    //let parsedJsonObj = JSON.parse(taskFile)
    let parsedJsonObj = require("./tasksList.json");

    // Defines id at start and sees which is the latest available id.
    let taskId = 1;
    if (parsedJsonObj.tasks && Array.isArray(parsedJsonObj.tasks) && parsedJsonObj.tasks.length > 0) {
      // Find the maximum existing ID
      const maxId = parsedJsonObj.tasks.reduce((max, user) => Math.max(max, user.id || 0), 0);
      taskId = maxId + 1;
    }
    



   







    let mode = process.argv[2]
    switch(mode) {
        case "add":
            let taskInput = process.argv[3]
            let tasks = { "id": taskId, "progress": "[ ]", "name": taskInput } 

            if (taskInput != "") {
                parsedJsonObj.tasks.push(tasks)
                
                const updatedJson = JSON.stringify(parsedJsonObj, null, 4)

                fs.writeFile('tasksList.json', updatedJson, function(err) {
                    if (err) throw err
                    console.log(`Task added successfully: (ID: ${taskId})`)
                })
            } else {
                console.log("Error: you didn't specify a task name.")
            }
            break;

        case "update":
            break;

        case "mark":
            let idInput = parseInt(process.argv[3])
            let statusInput = process.argv[4]

            const done = "[x]"
            const todo = "[ ]"
            const inProgress = "[-]"

            let finder = parsedJsonObj.tasks.map(function(task){
                if (task.id == idInput) {
                    if (statusInput == "done") {
                        return {
                            id: task.id,
                            progress: done,
                            name: task.name
                        }
                    } else if (statusInput == "todo") {
                        return {
                            id: task.id,
                            progress: todo,
                            name: task.name
                        }
                    } else if (statusInput == "inProgress") {
                        return {
                            id: task.id,
                            progress: inProgress,
                            name: task.name
                        }
                    } else {
                        console.log("ERROR: No status type were specified for change")
                    }
                } else {
                    return task 
                }
            }) 

            jsonFinder = JSON.stringify(finder,null,4)

            finalFinder = `{\n "tasks": ${jsonFinder}\n}` 

            fs.writeFile('tasksList.json', finalFinder, function (err) {
                if (err) throw err
                console.log(`Task marked successfully: (ID: ${idInput})`)
            })

            break;

        case "del":
            console.log("foo");
            break;

        case "list":
            for (let index = 0; index < parsedJsonObj.tasks.length; index++) {
                console.log(`${parsedJsonObj.tasks[index].id} - ${parsedJsonObj.tasks[index].progress}: ${parsedJsonObj.tasks[index].name}`) 
            }
            break;

        default:
            console.log("ERROR: This command is not available, try another!");
            break;

    }    

    
}

main()