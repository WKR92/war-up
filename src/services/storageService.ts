export const setStore = (key: string, value: any) => {
  try {
      localStorage.setItem(key, value)
  }
  catch (e){
      console.error(`Cannot set ${value} for ${key} to local storage`)
  }
}

export const getStore = (key: string) => {
  try {
      return localStorage.getItem(key)
  }
  catch (e){
      console.error(`Cannot get value for ${key} or does not exist`)
  }
}