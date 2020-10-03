import { LightningElement,track,api } from 'lwc';
import addToDo from "@salesforce/apex/ToDoController.addToDo";
import getCurrentToDos from "@salesforce/apex/ToDoController.getCurrentToDos";

export default class ToDoManager extends LightningElement {
    @track time = "8.15 PM";
    @track greeting = "Good Morning";
    @track todos = [];

    connectedCallback() {  
        this.getTime(); 
        this.fetchToDos();
        //this.populateTodos();   
        setInterval(() => {
            this.getTime();
        }, 1000*60);
    }

    getTime() {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)} ${this.getMidDay(hour)}`;
        this.setGreeting(hour);
    }
    getMidDay(hour) {
        return hour>=12 ? 'PM' : 'AM';
    }
    getDoubleDigit(digit) {
        return digit<10 ? ("0"+digit) : digit;
    }
    getHour(hour) {
        return hour === 0 ? 12 : hour > 12 ? (hour-12) : hour;
    }
    setGreeting(hour) {
        if(hour<12) {
            this.greeting = "Good Morning";
        }
        else if(hour>=12 && hour<17) {
            this.greeting = "Good Afternoon";
        }
        else {
            this.greeting = "Good Evening";
        }
    }
    addToDoHandler() {
        const inputBox = this.template.querySelector("lightning-input");
        const todo = {
            todoName : inputBox.value,
            done : false
        }  
        let self = this;  
        addToDo({ payload: JSON.stringify(todo) })
        .then(result => {
        if (result) {
          //fetch fresh list of todos
          console.log('item added');
          console.log('hi suj fetch');
          getCurrentToDos().then(result => {
              console.log('successin fetching'+JSON.stringify(result));
              this.todos = result;
          }).catch(error => {
              console.error('error in fetching '+JSON.stringify(error));
          });
        }
      })
      .catch(error => {
        console.error("Error in adding todo suj" + JSON.stringify(error));
      });

    inputBox.value = "";
    }
    updateHandler(event) {
        console.log('hi update --'+event);
        if(event)
        this.fetchToDos();
    }
    deleteHandler(event) {
        console.log('hi delete --'+event);
        if(event)
        this.fetchToDos();
    }
    get upcomingTasks() {
        if(this.todos && this.todos.length) {
            return this.todos.filter( todo => !todo.done);
        }
        else {
            return [];
        }
        //return (this.todos && this.todos.length) ? 
                //this.todos.filter( todo => {!todo.done}) : [];
    }
    get completedTasks() {
        if(this.todos && this.todos.length) {
            return this.todos.filter( todo => todo.done);
        }
        else {
            return [];
        }
    }
    populateTodos() {
        const todos = [
            {
                todoId: 0,
                todoName : 'Read a book',
                done : false,
                todoDate : new Date()
            },
            {
                todoId: 1,
                todoName : 'Eat Breakfast',
                done : false,
                todoDate : new Date()
            },
            {
                todoId: 2,
                todoName : 'Prepare lunch',
                done : true,
                todoDate : new Date()
            }
        ];
        this.todos = todos;
    }
    fetchToDos() {
        console.log('hi suj fetch');
        getCurrentToDos().then(result => {
            console.log('successin fetching'+JSON.stringify(result));
            this.todos = result;
        }).catch(error => {
            console.error('error in fetching '+JSON.stringify(error));
        });
    }
}