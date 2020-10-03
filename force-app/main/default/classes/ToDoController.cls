public with sharing class ToDoController {
    class ToDo {
        @AuraEnabled
        public String todoId;
        @AuraEnabled
        public String todoName;
        @AuraEnabled
        public Date todoDate;
        @AuraEnabled
        public Boolean done;
    }
    class Item {
        @AuraEnabled
        public String itemId;
        @AuraEnabled
        public String todoName;
        @AuraEnabled
        public Boolean done;
    }
    class ToDoList {
        @AuraEnabled
        public String todoId;
        @AuraEnabled
        public String todoDate;
        @AuraEnabled
        public List<Item> items;
    }
    @AuraEnabled
    public static String addToDo(String payload) {
        system.debug('hi suj ==> '+payload);
        ToDo payloadObject = (ToDo) JSON.deserialize(payload,ToDo.class);
        SObject todo = (SObject)Type.forName('ToDo__c').newInstance();
        todo.put('Name',payloadObject.todoName);
        todo.put('Done__c',payloadObject.done);
        Database.SaveResult sr = Database.insert(todo,false);
        system.debug('hi suj sr ==> '+sr);
        return String.valueOf(sr.getId());
    }
    @AuraEnabled
    public static void updateToDo(String payload) {
        ToDo payloadObject = (ToDo) JSON.deserialize(payload,ToDo.class);
        SObject todo = (SObject)Type.forName('ToDo__c').newInstance();
        todo.put('Id',payloadObject.todoId);
        todo.put('Name',payloadObject.todoName);
        todo.put('Done__c',payloadObject.done);
        update todo;
    }
    @AuraEnabled
    public static void deleteToDo(String todoId) {
        SObject todo = (SObject)Type.forName('ToDo__c').newInstance();
        todo.put('Id',todoId);
        delete todo;
    }
    @AuraEnabled(cacheable=true)
    public static List<ToDoList> getAllToDos() {
        List<SObject> todoList = Database.query('Select Id,Name, CreatedDate, Done__c,ToDo_Date__c FROM ToDo__c WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate desc');
        return getToDoList(todoList);
    }
    @AuraEnabled
    public static List<ToDo> getCurrentToDos() {
        system.debug('hi suj fetch==> ');
        List<SObject> todoList = Database.query('Select Id,Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = TODAY ORDER BY CreatedDate desc');
        system.debug('hi suj 1 ==> '+todoList);
        system.debug('hi suj 2 ==> '+getToDos(todoList));
        return getToDos(todoList);
    }
    public static List<ToDo> getToDos(List<ToDo__c> toDoList) {
        List<ToDo> todos = new List<ToDo>();
        for(ToDo__c t : toDoList) {
            ToDo t1 = new ToDo();
            t1.todoId = t.id;
            t1.todoName = t.Name;
            DateTime myDate = t.CreatedDate;
            t1.todoDate = date.newInstance(myDate.year(),myDate.month(),myDate.day());           
            t1.done = t.Done__C;
            todos.add(t1);
        }
        return todos;
    }
    public static List<ToDoList> getToDoList(List<ToDo__c> toDoList) {
        List<ToDoList> todoListWrapper = new List<ToDoList>();
        Map<String,List<ToDo__c>> dateMap = new Map<String,List<ToDo__c>>();
        for(ToDo__c t : toDoList) {
            DateTime dT = t.CreatedDate;
            Date myDate = date.newinstance(dT.year(), dT.month(), dT.day());
            if(dateMap.get(String.valueOf(myDate))!=null) {
                dateMap.get(String.valueOf(myDate)).add(t);
            }
            else {
                dateMap.put(String.valueOf(myDate),new List<ToDo__c>{t});
            }   
        }
        if(dateMap!=null) {
            for(String createdDate : dateMap.keyset()) {
                ToDoList tList = new ToDoList();
                tList.todoId = String.valueOf(dateMap.values().size());
                tList.todoDate = createdDate;
                tList.items = new List<Item>();
                for(ToDo__c item : dateMap.get(createdDate)) {
                    Item itemWrapper = new Item();
                    itemWrapper.itemId = item.Id;
                    itemWrapper.todoName = item.Name;
                    itemWrapper.done = item.Done__c;
                    tList.items.add(itemWrapper);
                }
                todoListWrapper.add(tList);
            }
        }
        return todoListWrapper;
    }
}
