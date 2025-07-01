function main() {
    /* 
    
        // Exemplo de tarefa:
        
        "1": indice da tarefa
        "[ ]": status da tarefa
            "[x]": statusDone
            "[ ]": statusToDo
            "[-]": in-progress
        "Comprar comida": nome da tarefa
    
        // 1 - [ ]: Comprar comida
    */
    console.log("> Taskoid, Conqueror of Tasks ")


    const fs = require('fs')


    if (!(fs.existsSync('tasksList.json'))) {
        console.log("No tasks list file, creating one now!!!")
        fs.writeFileSync('tasksList.json', `{ "tasks": [] }`)
    }


    const statusDone = "[x]"
    const statusToDo = "[ ]"
    const statusInProgress = "[-]"


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
    

    let taskDate = new Intl.DateTimeFormat("en-us", {
        dateStyle: "short",
        timeStyle: "medium"
    }).format(new Date())


    let mode = process.argv[2]
    switch(mode) {
        case "add":
            const taskInput = process.argv[3]

            let tasks = { "id": taskId, "description": taskInput, "progress": statusToDo, "createdAt": taskDate, "updatedAt": taskDate } 

            if (taskInput !== "") {
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
            let updateIdInput = parseInt(process.argv[3])
            let updateInput = process.argv[4]

            let updateFinder = parsedJsonObj.tasks.map(function(task){
                if (task.id == updateIdInput) {
                    return {
                        id: task.id,
                        description: updateInput,
                        progress: task.progress,
                        createdAt: task.createdAt,
                        updatedAt: taskDate
                    }
                } else {
                    return task 
                }
            })

            jsonFinder = JSON.stringify(updateFinder,null,4)

            finalFinder = `{\n "tasks": ${jsonFinder}\n}` 

            fs.writeFile('tasksList.json', finalFinder, function (err) {
                if (err) throw err
                console.log(`Task updated successfully: (ID: ${updateIdInput})`)
            })
            break;
        case "mark":
            let markIdInput = parseInt(process.argv[3])
            let statusInput = process.argv[4]

            let markFinder = parsedJsonObj.tasks.map(task => {
                if (task.id == markIdInput) {
                    if (statusInput == "done") {
                        return {
                            id: task.id,
                            description: task.description,
                            progress: statusDone,
                            createdAt: task.createdAt,
                            updatedAt: taskDate
                        }
                    } else if (statusInput == "todo") {
                        return {
                            id: task.id,
                            description: task.description,
                            progress: statusToDo,
                            createdAt: task.createdAt,
                            updatedAt: taskDate
                        }
                    } else if (statusInput == "inProgress") {
                        return {
                            id: task.id,
                            description: task.description,
                            progress: statusInProgress,
                            createdAt: task.createdAt,
                            updatedAt: taskDate
                        }
                    } else {
                        console.log("ERROR: No status type were specified for change")
                    }
                } else {
                    return task 
                }
            }) 

            jsonFinder = JSON.stringify(markFinder,null,4)

            finalFinder = `{\n "tasks": ${jsonFinder}\n}` 

            fs.writeFile('tasksList.json', finalFinder, function (err) {
                if (err) throw err
                console.log(`Task marked successfully: (ID: ${markIdInput})`)
            })

            break;
        case "del":
            let delIdInput = parseInt(process.argv[3])
            
            delIdInput -= 1

            let delFinder = parsedJsonObj.tasks.toSpliced(delIdInput,1)

            // this was made so that tasks' ids would be renumbered if needed to not break the sequence.
            while (delIdInput < parsedJsonObj.tasks.length) {
                parsedJsonObj.tasks[delIdInput].id--
                delIdInput++
            }

            jsonFinder = JSON.stringify(delFinder, null, 4)

            finalFinder = `{\n"tasks": ${jsonFinder}\n}`

            fs.writeFile('tasksList.json', finalFinder, err => {
                if (err) throw err
                console.log(`Task deleted successfully: (ID: ${process.argv[3]})`)
            })

            break;
        case "list":
            let sortList = process.argv[3]

            console.clear()          

            // Sweet spot!
            const sortOptions = {
                done: statusDone,
                todo: statusToDo,
                inProgress: statusInProgress
            }

            const filter = sortOptions[sortList]

            // ternary operator => (filter: condition; first element: if; second element: else)
            const sortedTasks = filter ? parsedJsonObj.tasks.filter(task => task.progress == filter) : parsedJsonObj.tasks

            sortedTasks.forEach(tasks => {
                console.log(`${tasks.id} - ${tasks.progress}: ${tasks.description}`)
            })
            break;
        default:
            console.log("ERROR: This command is not available, try another!");
            break;
    }    
}

main()