const ACTIONS_ADMIN = [
  {
    name: 'Listar',
    code: '0001',
  },
  {
    name: 'Add',
    code: '0002',
  },
  {
    name: 'Update',
    code: '0003',
  },
  {
    name: 'Delete',
    code: '0004',
  },
]

const MODULES_ADMIN = [
  {
    description: 'Producto',
    state: 1,
    name: 'Product',
    code: '0001',
  },
  {
    description: 'Usuario',
    state: 1,
    name: 'User',
    code: '0002',
  },
  {
    description: 'Módulo',
    state: 1,
    name: 'Module',
    code: '0003',
  },
  {
    description: 'Acción',
    state: 1,
    name: 'Action',
    code: '0004',
  },
  {
    description: 'Permiso',
    state: 1,
    name: 'Permission',
    code: '0005',
  },
  {
    description: 'Rol',
    state: 1,
    name: 'Role',
    code: '0006',
  },
  {
    description: 'Categoría',
    state: 1,
    name: 'Category',
    code: '0007',
  },
  {
    description: 'Familia',
    state: 1,
    name: 'Family',
    code: '0008',
  },
]

const DICTIONARY_MODULES = {
  PRODUCT: '0001',
  USER: '0002',
  MODULE: '0003',
  ACTION: '0004',
  PERMISSION: '0005',
  ROLE: '0006',
  CATEGORY: '0007',
  FAMILY: '0008',
  ORDER: '0009',
}

const DICTIONARY_ACTIONS = {
  LIST: '0001',
  ADD: '0002',
  UPDATE: '0003',
  DELETE: '0004',
}

const PERMISSIONS_ADMIN = [
  {
    codeModule: DICTIONARY_MODULES.PERMISSION,
    codeAction: DICTIONARY_ACTIONS.LIST,
  },
  {
    codeModule: DICTIONARY_MODULES.PERMISSION,
    codeAction: DICTIONARY_ACTIONS.ADD,
  },
  {
    codeModule: DICTIONARY_MODULES.ROLE,
    codeAction: DICTIONARY_ACTIONS.LIST,
  },
]

module.exports = {
  DICTIONARY_MODULES,
  DICTIONARY_ACTIONS,
  PERMISSIONS_ADMIN,
  ACTIONS_ADMIN,
  MODULES_ADMIN,
}
