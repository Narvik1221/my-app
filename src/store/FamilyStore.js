import {makeAutoObservable} from "mobx";

export default class FamilyStore {
    constructor() {
 
        makeAutoObservable(this)
    }



}
