import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userId = false
        this._role = false
        makeAutoObservable(this)
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
    setUserId(userId) {
        this._userId = userId
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
    get userId() {
        return this._userId
    }
}
