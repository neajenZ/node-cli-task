#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');

const TASKS_FILE = 'tasks.json';

class Task {
    constructor(description, completed = false) {
        this.description = description;
        this.completed = completed;
    }
}

class TaskList {
    constructor() {
        this.tasks = [];
    }

    addTask(description) {
        this.tasks.push(new Task(description));
        console.log(`Задача "${description}" добавлена.`);
    }

    deleteTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            console.log(`Задача "${this.tasks[index].description}" удалена.`);
            this.tasks.splice(index, 1);
        } else {
            console.log("Неккоректный номер задачи.");
        }
    }

    markAsCompleted(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks[index].completed = true;
            console.log(`Задача "${this.tasks[index].description}" успешно отмечена как завершённая.`);
        } else {
            console.log("Неккоректный номер задачи.");
        }
    }

    showTasks(showCompleted = false) {
        console.log("\nЗадачи:");
        this.tasks
            .filter((task) => showCompleted ? task.completed === showCompleted : task)
            .forEach((task, index) => {
                console.log(
                    `${index + 1}. [${task.completed ? 'x' : ' '}] ${task.description}`
                );
            });
        console.log();
    }

    saveToFile() {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(this.tasks, null, 2), 'utf-8');
        console.log("Задачи успешно сохранены.");
    }

    loadFromFile() {
        if (fs.existsSync(TASKS_FILE)) {
            const data = fs.readFileSync(TASKS_FILE, 'utf-8');
            this.tasks = JSON.parse(data).map(
                (task) => new Task(task.description, task.completed)
            );
            console.log("Задачи загружены с файла.");
        } else {
            console.log("Не были найдены сохраненные задачи.");
        }
    }
}

const taskList = new TaskList();
taskList.loadFromFile();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function showMenu() {
    console.log(`
  === Менеджер задач ===
  1. Показать все задачи
  2. Добавить задачу
  3. Удалить задачу
  4. Отметить как прочитанную
  5. Показать завершеннные задачи
  6. Сохранить в файл 
  7. Выйти
  `);

    rl.question("Выберите пункт: ", (choice) => {
        switch (choice) {
            case '1':
                taskList.showTasks();
                showMenu();
                break;
            case '2':
                rl.question("Ввeдите описание задачи: ", (desc) => {
                    taskList.addTask(desc);
                    showMenu();
                });
                break;
            case '3':
                rl.question("Ввeдите номер задачи чтобы удалить: ", (num) => {
                    taskList.deleteTask(parseInt(num) - 1);
                    showMenu();
                });
                break;
            case '4':
                rl.question("Ввeдите номер задачи чтобы отметить как прочитанную: ", (num) => {
                    taskList.markAsCompleted(parseInt(num) - 1);
                    showMenu();
                });
                break;
            case '5':
                taskList.showTasks(true);
                showMenu();
                break;
            case '6':
                taskList.saveToFile();
                showMenu();
                break;
            case '7':
                taskList.saveToFile();
                rl.close();
                break;
            default:
                console.log("Выбрать неккоректный пункт");
                showMenu();
                break;
        }
    });
}

showMenu();
