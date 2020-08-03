var urlJoin = require('url-join')

const ProcessListEntity = (name, ordering) => {
  return {
    name,
    ordering
  }
}

const baseUrl = '/project'
const names = {
  singular: 'project',
  plurarl: 'projects',
}


export const thisProject = async (apiUrl, accessToken, id) => {
  // fetch all projects from database
  console.log(apiUrl)
  console.log(urlJoin(apiUrl, baseUrl, id, names.plurarl))
  return fetch(urlJoin(apiUrl, baseUrl, id, names.plurarl), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res=>res.json())
    .then(data => {
      return {
            success: true,
            entities: data.map(x => ProcessListEntity(x.name, x.ordering)),
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
}

// export const getAll = async (apiUrl, accessToken) => {
//   // fetch all projects from database
//   console.log(apiUrl)
//   console.log(urlJoin(apiUrl, names.plurarl))
//   return fetch(urlJoin(apiUrl, names.plurarl), {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then(res=>res.json())
//     .then(data => {
//       return {
//             success: true,
//             entities: data.map(x => ProjectEntity(x.name, x.status, x.clientId)),
//             numTotal: data.length,
//         }
//     })
//     .catch(err => {
//         return {
//             success: false,
//             errors: [`Something went wrong and the list of ${names.plural} could not be read.`],
//         }
//     })
//   .catch(err => {
//     return {
//       success: false,
//       errors: [`Unable to refresh accessToken`],
//   }
//   })
//   return response
// }