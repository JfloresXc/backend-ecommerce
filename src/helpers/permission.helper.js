const { Permission: Model } = require('../models/Permission.model')
const ErrorLocal = require('../utils/Error')
const helper = {}

helper.getPermissionsForIdRole = async ({ idRole }) => {
  const permisos = await Model.find({ role: idRole })
  return permisos
}

helper.validatePermissionDuplicate = async ({ permissionsWhithoutRole = [], idRole }) => {
  const permissionsForIdRole = await helper.getPermissionsForIdRole({ idRole })

  permissionsForIdRole.forEach(permission => {
    const { codeModule, codeAction } = permission
    const index = permissionsWhithoutRole.findIndex(permission => {
      const { codeModule: codeModulePermission, codeAction: codeActionPermission } = permission
      return codeModulePermission === codeModule && codeActionPermission === codeAction
    })

    if (index !== -1) {
      throw new ErrorLocal({
        message: '¡Duplicated permission!',
        statusCode: 400
      })
    }
  })
}

helper.deletePermissionsForIdRole = async ({ idRole }) => {
  await Model.deleteMany({ role: idRole })
}

module.exports = helper
