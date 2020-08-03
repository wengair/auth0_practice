import React,{useState, useEffect} from 'react'
import useCheckExpire from 'clients/hooks/useCheckExpire'

const projectRepo = require('clients/project/project-repo')

function index() {
  const [projectList, setProjectList] = useState([])
  const [checkTokenExpired] = useCheckExpire('')
  useEffect(() => {
    async function getProjects() {
      console.log(projectRepo)
      const token = localStorage.getItem('accessToken')
      console.log(`in projects index, token = ${token}`)
      var checkedToken = await checkTokenExpired(token)
      console.log(checkedToken)
      const result = await projectRepo.getAll('api/v1/', checkedToken)
      console.log(`result = `)
      console.log(result)
      setProjectList(result.entities)
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
      {projectList.map((project,idx) => 
        <div key={idx}>
          {project.name}
          {project.status}
          {project.clientId}
          {project.getName()}
        </div>
      )}
    </div>
  )
}

export default index
