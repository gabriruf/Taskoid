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
        console.log("No tasks list found, creating one now!!!")
        fs.writeFileSync('tasksList.json', `{ "tasks": [] }`)
    }


    const statusDone = "[x]"
    const statusToDo = "[ ]"
    const statusInProgress = "[-]"


    // Reads the file contents and parses it into objects.
    let parsedTasks = require("./tasksList.json");


    // Defines id at start and sees which is the latest available id.
    let taskId = 1;
    if (parsedTasks.tasks && Array.isArray(parsedTasks.tasks) && parsedTasks.tasks.length > 0) {
      // Find the maximum existing ID
      const maxId = parsedTasks.tasks.reduce((max, user) => Math.max(max, user.id || 0), 0);
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
                parsedTasks.tasks.push(tasks)

                const updatedJson = JSON.stringify(parsedTasks, null, 4)

                fs.writeFile('tasksList.json', updatedJson, err => {
                    if (err) throw err
                    console.log(`Task added successfully: (ID: ${taskId})`)
                })
            } else {
                console.log("Error: you didn't specify a task name.")
            }
            break;



            

            
        case "update":
            const updateIdInput = parseInt(process.argv[3])
            const updateInput = process.argv[4]

            let updateFinder = parsedTasks.tasks.map(function(task){
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

            let strTasks = JSON.stringify(updateFinder,null,4)

            let finalOutput = `{\n "tasks": ${strTasks}\n}` 

            fs.writeFile('tasksList.json', finalOutput, err => {
                if (err) throw err
                console.log(`Task updated successfully: (ID: ${updateIdInput})`)
            })
            break;






        case "mark":
            const markIdInput = parseInt(process.argv[3])
            const statusInput = process.argv[4]

            let markFinder = parsedTasks.tasks.map(task => {
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

            strTasks = JSON.stringify(markFinder,null,4)

            finalOutput = `{\n "tasks": ${strTasks}\n}` 

            fs.writeFile('tasksList.json', finalOutput, err => {
                if (err) throw err
                console.log(`Task marked successfully: (ID: ${markIdInput})`)
            })

            break;






        case "del":
            const delIdInput = parseInt(process.argv[3])
            
            delIdInput -= 1

            let deletedTasks = parsedTasks.tasks.toSpliced(delIdInput,1)

            // this was made so that tasks' ids would be renumbered if needed to not break the sequence.
            while (delIdInput < parsedTasks.tasks.length) {
                parsedTasks.tasks[delIdInput].id--
                delIdInput++
            }

            strTasks = JSON.stringify(deletedTasks, null, 4)

            finalOutput = `{\n"tasks": ${strTasks}\n}`

            fs.writeFile('tasksList.json', finalOutput, err => {
                if (err) throw err
                console.log(`Task deleted successfully: (ID: ${process.argv[3]})`)
            })

            break;



            


        case "list":
            const sortList = process.argv[3]

            console.clear()          

            // Sweet spot!
            const sortOptions = {
                done: statusDone,
                todo: statusToDo,
                inProgress: statusInProgress
            }

            const filter = sortOptions[sortList]

            // ternary operator => (filter: condition; first element: if; second element: else)
            const sortedTasks = filter ? parsedTasks.tasks.filter(task => task.progress == filter) : parsedTasks.tasks

            sortedTasks.forEach(tasks => {
                console.log(`${tasks.id} - ${tasks.progress}: ${tasks.description}`)
            })
            break;



            


        case "help":
            console.clear()
            console.log("Taskoid Commands:")
            console.log(`add: adds a task.\n\nupdate: updates a task's description.\n\nmark: marks a task as "done", "todo" or "inProgress".\n\ndel: deletes a task.\n\nlist: lists all tasks or lists tasks by sorting.\n\nhelp: shows all Taskoid commands and what they do.\n`)
            break;






        default:
            console.log("ERROR: This command is not available, try another!");
            break;
    }    
}

main()