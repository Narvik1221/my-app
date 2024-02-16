import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
      
        this._role = false
        this._userId = false
        this._name = false
        this._surname = false
        this._cuserId = false
        this._cname = false
        this._csurname = false
        this._data = {}
        this._searchValue = false
        this._searchTable = false
        this._currentTree = -1
        makeAutoObservable(this)
    }
    setSearchValue(v) {
        this._searchValue = v
    }
    get searchValue() {
        return this._searchValue
    }
    setSearchTable(v) {
        this._searchTable = v
    }
    get data() {
        return this._data
    }
    setData(v) {
        this._data = v
    }
    get searchTable() {
        return this._searchTable
    }
    setIsAuth(bool) {
        this._isAuth = bool
    }
    setRole(role) {
        this._role = role
    }
    setUser(user) {
        this._user = user
    }
    setName(name) {
        this._name = name
    }
    setSurname(surname) {
        this._surname = surname
    }
    setUserId(userId) {
        this._userId = userId
    }
    setCName(cname) {
        this._cname = cname
    }
    setCSurname(csurname) {
        this._csurname = csurname
    }
    setCUserId(cuserId) {
        this._cuserId = cuserId
    }
    setCurrentTree(v) {
        this._currentTree = v
    }
    get isAuth() {
        return this._isAuth
    }
    get role() {
        return this._role
    }
    get user() {
        return this._user
    }
    get name() {
        return this._name
    }
    get surname() {
        return this._surname
    }
    get userId() {
        return this._userId
    }
    get cname() {
        return this._name
    }
    get csurname() {
        return this._csurname
    }
    get cuserId() {
        return this._cuserId
    }

    get currentTree() {
        return this._currentTree
    }
}
