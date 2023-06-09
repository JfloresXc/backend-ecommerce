const { Types: { ObjectId } } = require('mongoose')
const { Permission: Model } = require('../models/Permission.model')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'MODULE'
const { setConfigError } = configError({ module: MODULE })
const { isSomeEmptyFromModel } = require('../helpers/validations')
const ErrorLocal = require('../utils/Error')
const { validatePermissionDuplicate } = require('../helpers/permission.helper')

const controller = {}

controller.postPermission = async (req, res, next) => {
  try {
    const body = req.body
    const { codeModule, codeAction, idRole } = body
    if (isSomeEmptyFromModel([codeModule, codeAction, idRole])) return
    await validatePermissionDuplicate({
      permissionsWhithoutRole: [{ codeModule, codeAction }],
      idRole
    })

    const permissionSave = new Model({
      codeModule, codeAction, role: ObjectId(idRole)
    })
    const response = await permissionSave.save()
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new permission' }, next)
  }
}

controller.postManyPermission = async (req, res, next) => {
  try {
    const body = req.body
    const { permissionsWhithoutRole, idRole } = body

    if (permissionsWhithoutRole.length === 0) {
      throw new ErrorLocal({ message: 'Empty modules and actions', statusCode: 400 })
    }
    if (isSomeEmptyFromModel([idRole])) return
    await validatePermissionDuplicate({ permissionsWhithoutRole, idRole })

    for (const permission of permissionsWhithoutRole) {
      const { codeModule, codeAction } = permission
      if (isSomeEmptyFromModel([codeModule, codeAction])) return

      const permissionSave = new Model({
        codeModule, codeAction, role: ObjectId(idRole)
      })
      await permissionSave.save()
    }

    res.status(200).json({ message: 'Many permissions created successfully' })
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a many permissions' }, next)
  }
}

controller.getAllPermissionss = async (req, res, next) => {
  try {
    const permissions = await Model.find({})
    res.status(200).json(permissions)
  } catch (error) {
    setConfigError(error, { action: 'GET - All permissions' }, next)
  }
}

controller.deletePermissionsForIdRole = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const deletedPermission = await Model.findByIdAndDelete(id)

    if (!deletedPermission) {
      throw new ErrorLocal({
        message: 'Id is not finded, is not deleted',
        statusCode: 400
      })
    }
    res.status(200).json({ message: '¡Deleted successfully!', deletedPermission })
  } catch (error) {
    setConfigError(error, { action: 'DELETE - A product for id' }, next)
  }
}

controller.deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const deletedPermission = await Model.findByIdAndDelete(id)

    if (!deletedPermission) {
      throw new ErrorLocal({
        message: 'Id is not finded, is not deleted',
        statusCode: 400
      })
    }
    res.status(200).json({ message: '¡Deleted successfully!', deletedPermission })
  } catch (error) {
    setConfigError(error, { action: 'DELETE - A product for id' }, next)
  }
}

module.exports = controller
