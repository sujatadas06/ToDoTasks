import { LightningElement,api } from 'lwc';
import updateToDo from "@salesforce/apex/ToDoController.updateToDo";
import deleteToDo from "@salesforce/apex/ToDoController.deleteToDo";

export default class ToDoItem extends LightningElement {
@api todoId;
@api todoName;
@api done = false;

get containerClass() {
    return this.done ? "todo completed" : "todo upcoming";
}
get iconName() {
    return this.done ? "utility:check" : "utility:add";
}
updateDoHandler() {
    const todo = {
        todoId : this.todoId,
        todoName : this.todoName,
        done : !this.done
    }
    updateToDo({
        payload : JSON.stringify(todo)
    })
    .then(result => {
        console.log('success in updating');
        const updateEvent = new CustomEvent("update", { detail: todo });
        this.dispatchEvent(updateEvent);
    })
    .catch(error => {
        console.error("Error in adding todo" + JSON.stringify(error));
    })
}
deleteDoHandler() {
    deleteToDo({
        todoId : this.todoId
    })
    .then(result => {
        console.log('success in deleting');
        this.dispatchEvent(new CustomEvent("delete", { detail: this.todoId }));
    })
    .catch(error => {
        console.error("Error in adding todo" + JSON.stringify(error));
    })
}
}