import {makeAutoObservable} from "mobx";

export default class FamilyStore {
    constructor() {
        this._names = []
        // this._brands = []
        // this._baskets=[]
        // this._devices = []
        // this._selectedType = {}
        // this._selectedBrand = {}
        makeAutoObservable(this)
    }

    setNames(names) {
        this._names = names
    }
    // setBrands(brands) {
    //     this._brands = brands
    // }
    // setBaskets(baskets) {
    //     this._baskets =baskets
    // }
    // setDevices(devices) {
    //     this._devices = devices
    // }
    get names() {
        return this._names
    }
    // get brands() {
    //     return this._brands
    // }
    // get baskets() {
    //     return this._baskets
    // }
    // get devices() {
    //     return this._devices
    // }
    // get selectedType() {
    //     return this._selectedType
    // }
    // get selectedBrand() {
    //     return this._selectedBrand
    // }
    // get totalCount() {
    //     return this._totalCount
    // }
    // get page() {
    //     return this._page
    // }
    // get limit() {
    //     return this._limit
    // }
}
