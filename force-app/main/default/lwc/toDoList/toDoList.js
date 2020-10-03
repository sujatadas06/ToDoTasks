import { LightningElement } from 'lwc';
import getAllToDos from "@salesforce/apex/ToDoController.getAllToDos";
export default class ToDoList extends LightningElement {
    todos = [];
    
    connectedCallback() {
        //this.populateToDos();
        this.fetchToDos();
        console.log('hi suj--> '+this.todos);
    }
    populateToDos() {
        let dateToday = new Date();
        let dateYesterday = new Date();
        dateYesterday.setDate(dateYesterday.getDate() - 1);  
        this.todos = [
            {
                todoId : 0,
                todoDate: dateYesterday.getDate() + '/' + dateYesterday.getMonth() +'/' + dateYesterday.getFullYear(),
                items: [
                    {
                        itemId: 0,
                        todoName : 'Read a book',
                        done : true
                    },
                    {
                        itemId: 1,
                        todoName : 'Eat Chicken',
                        done : false
                    }               
                ]
            },
            {
                todoId : 1,
                todoDate: dateToday.getDate() + '/' + dateToday.getMonth() +'/' + dateToday.getFullYear(),
                items: [
                    {
                        itemId: 0,
                        todoName : 'Watch Peekapoo',
                        done : false
                    },
                    {
                        itemId: 1,
                        todoName : 'Watch friends',
                        done : true
                    },
                    {
                        itemId: 2,
                        todoName : 'Video Call',
                        done : false
                    },
                    {
                        itemId: 2,
                        todoName : 'Study SF',
                        done : true
                    }
                ]
            }
            
        ];
    }
    get completedTasks() {
        if(this.todos && this.todos.length) {
            return this.todos.filter(todo => this.todo);
        }
    }
    get upcomingTasks() {
        if(this.todos && this.todos.length) {
            return this.todos.filter(todo => !this.todo);
        }
    }
    fetchToDos() {
        getAllToDos()
        .then(result => {
            console.log('hi '+result);
            this.todos = result;
        })
        .catch(error => {

        })
    }
}