import React,{useState, useEffect} from 'react'
import useCheckExpire from 'clients/hooks/useCheckExpire'
import { useRouter } from 'next/router'

const projectRepo = require('clients/project/project-repo')
const processListRepo = require('clients/processList/processList-repo')

function index() {
  const [projectList, setProjectList] = useState([])
  const [checkTokenExpired] = useCheckExpire('')
  const router = useRouter()
  const { pid } = router.query
  console.log(`next's pid = ${pid}`)
  useEffect(() => {
    async function getProjects() {
      console.log(projectRepo)
      const token = localStorage.getItem('accessToken')
      console.log(`in projects index, token = ${token}`)
      // const id = this.props.match.params.id;
      console.log(`link = ${window.location}`)
      // console.log(`id = ${id}`)
      var checkedToken = await checkTokenExpired(token)
      console.log(checkedToken)
      Promise.all([
        projectRepo.getAll('api/v1/', checkedToken),
        processListRepo.thisProject('api/v1/', checkedToken, ),
      ])
      .then(result => console.log(result))
      // const result = await projectRepo.getAll('api/v1/', checkedToken)
      // console.log(`result = `)
      // console.log(result)
      // setProjectList(result.entities)
    }
    getProjects()
    return () => {
      // cleanup
    }
  }, [])
  return (
    <div>
      {console.log('projectList=')}
      {console.log(projectList)}
      in projects!!
    </div>
  )
}

export default index
