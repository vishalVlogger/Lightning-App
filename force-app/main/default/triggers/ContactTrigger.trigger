trigger ContactTrigger on Contact (before insert, before update, after insert, after update) {
    if(Trigger.isAfter){
        if(Trigger.isInsert){
            ContactTriggerHandler.updateLastModifyDate(trigger.new);
        }
    }
    
    if(Trigger.isBefore){
        if(Trigger.isInsert || Trigger.IsUpdate){
            ContactTriggerHandler.assignContactToAccount(trigger.new);
        }
    }
}