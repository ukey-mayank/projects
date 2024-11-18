import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/LazyLoadingWithDatatable.getAccounts';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const PAGE_SIZE = 10;
const COLUMNS = [
    {label: 'Id', fieldName:'Id', type:'text'},
    {label: 'Name', fieldName:'Name', type:'text'},
    {label: 'Rating', fieldName:'Rating', type:'text'},
];
export default class LazyLoadingWithDatatable extends LightningElement {
    columns = COLUMNS
    @track pageNumber = 1
    pageSize = PAGE_SIZE
    @track accounts = []
    totalRecords = 0

    @wire(getAccounts, {pageNumber:'$pageNumber', pageSize:'$pageSize'})
    wiredAccounts({error, data}){
        if(data){
            this.accounts = data.accounts
            this.totalRecords = data.totalRecords
        }else if(error){
            this.showToast(error)
        }
    }

    get pageNumber(){
        return this.pageNumber
    }

    get totalRecords(){
        return this.totalRecords
    }

    get pageSize(){
        return this.pageSize
    }

    get disablePrevious(){
        return this.pageNumber===1?true:false
    }

    get disableNext(){
        return this.pageNumber === Math.ceil(this.totalRecords/this.pageSize)?true:false
    }

    handlePrevious(){
        if(this.pageNumber>1){
            this.pageNumber -= 1
        }
    }

    handleNext(){
        if(this.pageNumber < Math.ceil(this.totalRecords/this.pageSize)){
            this.pageNumber += 1
        }
    }

    showToast(errorMsg){
        const event = new ShowToastEvent({
            title:'Error',
            message: errorMsg,
            variant: 'error'
        })
        this.dispatchEvent(event);
    }
}