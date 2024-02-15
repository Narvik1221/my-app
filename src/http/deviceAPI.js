import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";


export const blockUser= async (id,blocked) => {
    const {data} = await $authHost.put('api/family/block' ,{ id,blocked })
    return data
  };

export const fetchFamilies = async () => {
    const {data} = await $host.get('api/family/')
    return data
}
export const fetchAllFamilies = async () => {
    const {data} = await $authHost.get('api/family/all')
    return data
}
export const fetchFamiliesSearch = async (params) => {
    const {data} = await $host.get('api/family/search/'+params)
    return data
}
export const fetchOneTree = async (id) => {
    const {data} = await $host.get('api/family/' + id)
    return data
}
export const fetchOneFamily = async (id) => {
    const {data} = await $host.get('api/family/one/' + id)
    return data
}
export const changePerson = async (id,person) => {
    const {data} = await $authHost.put('api/family/person/' + id,person)
    return data
}
export const changeSpouse = async (id,person) => {
    const {data} = await $authHost.put('api/family/spouse/' + id,person)
    return data
}
export const createPerson = async (person,) => {
    const {data} = await $authHost.post('api/family/person',person)
    return data
}


export const createParent = async (person,) => {
    const {data} = await $authHost.post('api/family/parent',person)
    return data
}


export const deleteSpouse = async (id,personId,familyId) => {
    const {data} = await $authHost.delete('api/family/spouse/' + id+"/"+personId+"/"+familyId)
    return data
}
export const deletePerson = async (id,familyId) => {
    const {data} = await $authHost.delete('api/family/person/'+ id+"/"+familyId)
    return data
}
export const createSpouse = async (person) => {
    const {data} = await $authHost.post('api/family/spouse',person)
    return data
}

export const createFamily = async (person) => {
    const {data} = await $authHost.post('api/family/',person)
    return data
}
export const createFamilyGed = async (person) => {
    const {data} = await $authHost.post('api/family/addFile',person)
    return data
}
export const putFamily = async (id,person) => {
    const {data} = await $authHost.put('api/family/'+id,person)
    return data
}
export const delFamily = async (id) => {
    const {data} = await $authHost.delete('api/family/'+id)
    return data
}
export const createBasketDevice = async (basketId,deviceId) => {
    const {data} = await $authHost.post('api/device/basket', {basketId,deviceId})
    return data
}

export const fetchBasketDevice = async (id) => {
    const {data} = await $authHost.get('api/device/basket/' + id)
    return data
}
