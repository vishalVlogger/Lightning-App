trigger OpportunityTrigger on Opportunity (after insert, after update) {
    if(Trigger.isAfter){
        if(Trigger.isInsert){
            OpportunityTriggerHandler.countAllOpportunityAmount(trigger.new, null);
        }else if(Trigger.isUpdate){
            OpportunityTriggerHandler.countAllOpportunityAmount(trigger.new, trigger.oldMap);
        }
    }
}