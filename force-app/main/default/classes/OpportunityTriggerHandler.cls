public class OpportunityTriggerHandler {
    public static void countAllOpportunityAmount(List<Opportunity> newList, Map<Id, Opportunity> oldMap){
        Set<Id> accountId = new Set<Id>();
        Map<Id, Account> updateAnnualRevenue = new Map<Id, Account>();
        
        for(Opportunity opp : newList){
            if(opp.AccountId != null && (oldMap == null || opp.Amount != oldMap.get(opp.Id).Amount)){
                accountId.add(opp.AccountId);
            }
        }
        
        if(!accountId.isEmpty()){
            for(AggregateResult aggr : [SELECT AccountId, SUM(Amount) sumAmount FROM Opportunity WHERE AccountId IN: accountId GROUP BY AccountId]){
                Account acc = new Account();
                acc.Id = (Id)aggr.get('AccountId');
                acc.AnnualRevenue = (Decimal)aggr.get('sumAmount');
                updateAnnualRevenue.put(acc.Id, acc);
            }
        }
        
        if(updateAnnualRevenue.values() != null && updateAnnualRevenue.size() > 0){
            update updateAnnualRevenue.values();
        }
    }
}