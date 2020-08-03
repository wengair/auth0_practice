var urlJoin = require('url-join')

const ProjectEntity = (name, status, clientId) => {
  return {
    name,
    status,
    clientId,
      getName: () => {
        return name
      },
  }
}

const baseUrl = '/project'
const names = {
  singular: 'project',
  plurarl: 'projects',
}
// export const add = async (apiUrl, firstName, lastName, email) => {
//   const response = await fetch(urlJoin(apiUrl, baseUrl), {
//       firstName,
//       lastName,
//       email,
//   })
// ​
//   if(response.ok) {
//       if(response.data.isValid) {
//           return {
//               success: true,
//               id: response.data.id,
//           }
//       }
//       else {
//           return {
//               success: false,
//               errors: response.data.errors,
//               paramErrors: response.data.paramErrors,
//           }
//       }
//   }
//   else {
//       return {
//           success: false,
//           errors: [`Something went wrong and the ${names.singular} could not be added.`],
//           paramErrors: {},
//       }
//   }
// },

export const getOne = async (apiUrl, accessToken, id) => {
  // fetch a single project from database
  const response = await fetch(urlJoin(apiUrl, baseUrl, id))
  const option = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }
  if(response.ok) {
      return {
          success: true,
          entity: UserEntity(response.data.firstName, response.data.lastName, response.data.email)
      }
  }
  else {
      return {
          success: false,
          errors: [`Something went wrong and the ${names.singular} could not be read.`],
      }
  }
  return 
}

export const getAll = async (apiUrl, accessToken) => {
  // fetch all projects from database
  console.log(apiUrl)
  console.log(urlJoin(apiUrl, names.plurarl))
  return fetch(urlJoin(apiUrl, names.plurarl), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res=>res.json())
    .then(data => {
      return {
            success: true,
            entities: data.map(x => ProjectEntity(x.name, x.status, x.clientId)),
            numTotal: data.length,
        }
    })
    .catch(err => {
        return {
            success: false,
            errors: [`Something went wrong and the list of ${names.plural} could not be read.`],
        }
    })
  .catch(err => {
    return {
      success: false,
      errors: [`Unable to refresh accessToken`],
  }
  })
  return response
}