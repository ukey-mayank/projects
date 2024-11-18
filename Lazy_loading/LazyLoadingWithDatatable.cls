public with sharing class LazyLoadingWithDatatable {
    public LazyLoadingWithDatatable() {}

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getAccounts(String pageNumber, String pageSize){
        if(pageNumber!=null && pageSize!=null){
            Integer currentPage = Integer.valueOf(pageNumber);
            Integer pageLimit = Integer.valueOf(pageSize);
            Integer offset = (currentPage - 1) * pageLimit;
            List<Account> accList = [SELECT Id, Name, Rating FROM Account LIMIT :pageLimit OFFSET :offset];
            Integer totalRecords = [SELECT COUNT() FROM Account];
            Map<String, Object> result = new Map<String, Object>();

            if(!accList.isEmpty() && accList!=null && totalRecords>0){
                result.put('accounts', accList);
                result.put('totalRecords', totalRecords);
            }

            if(result!=null){
                return result;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
}