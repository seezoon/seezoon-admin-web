
import { defineStore } from 'pinia';
import {getDict} from "/@/api/sys/dict";
import {DictInfo} from "/@/api/sys/model/dictInfoModle";
import {toRaw} from "vue";

const defaultDict:DictInfo = {value:'',label:'请选择'};


interface DictState {
  allDicts:any,
  dictMap: Map<string,DictInfo>;
}

export const useDictStore = defineStore({
  id: 'app-dict',
  state: (): DictState => (
     {
       allDicts:undefined,
       dictMap: new Map<string,DictInfo> ()
     }
  ),
  getters: {
    getAllDicts():any{
      return this.allDicts;
    },
    getDictMap():Map<string,DictInfo>{
      return this.dictMap;
    }
  },
  actions: {
    async init() {
      let allDicts = await getDict();
      for (const key in allDicts) {
        for (let dict of allDicts[key]){
          this.dictMap.set(key + '@' + dict.value,dict)
        }
      }
      this.allDicts = allDicts;
    },
  },
});

export function getDictList(key:string,addDefault=true):DictInfo[] {
  const dictStore = useDictStore();
  let allDicts = toRaw(dictStore.getAllDicts);
  let dicts = allDicts[key];
  if (addDefault)  {
     return [defaultDict,...dicts];
  } else {
    return dicts
  }
}


export function getDictTitle(key:string,value:string|number):any {
  const dictStore = useDictStore();
  let dictMap = toRaw(dictStore.getDictMap);
  return dictMap.get(key + '@' + value)?.label;
}

export function getDictColor(key:string,value:string|number):any {
  const dictStore = useDictStore();
  let dictMap = toRaw(dictStore.getDictMap);
  return dictMap.get(key + '@' + value)?.color;
}

