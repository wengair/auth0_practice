import {useState} from 'react'

function useInput(initialValue=null) {
  const [value, setValue] = useState(initialValue)

  const bind = {
    value: value, // or just value
    onChange: e => {
      setValue(e.target.value)
    }
  }

  const reset = (initialValue) => {
    setValue(initialValue)
  }

  return [value, bind, reset]
}

export default useInput
