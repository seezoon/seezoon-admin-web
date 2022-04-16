import {defHttp} from "/@/utils/http/axios";

enum Api {
  GetDict = '/public/dict/get_dict'
}

export async function getDict() {
  let allDicts = await defHttp.get({url:Api.GetDict});
  return allDicts;
}
