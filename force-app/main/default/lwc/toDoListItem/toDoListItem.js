import { LightningElement,api } from 'lwc';

export default class ToDoListItem extends LightningElement {

    @api itemId;
    @api todoName;
    @api done = false;
   
    
    get todoClass () {
        console.log('hi suj--'+this.done);
        return this.done ? "todo completed" : "todo upcoming";
    }
}