const helper = {}

const errorResponse =
    (response, {
      message,
      name,
      stack,
      module = '',
      action = '',
      isSavedLog = true
    }, state = 400) =>
      response.status(state).json({
        message,
        name,
        module,
        action,
        stack,
        isError: true
      })

const ERRORS_HANDLERS = {
  // ----------------- ?
  ValidationError:
  (response, error) => errorResponse(response, error, 406),
  // ----------------- PERSONALIZED
  PersonalError:
  (response, error) => errorResponse(response, error, error.statusCode),
  // ----------------- TYPE
  SyntaxError:
  (response, error) => errorResponse(response, error, 400),
  TypeError:
  (response, error) => errorResponse(response, error, 400),
  ReferenceError:
  (response, error) => errorResponse(response, error, 400),
  // ----------------- JWT
  JsonWebTokenError:
  (response, error) => errorResponse(response, error, 409),
  TokenExpiredError:
  (response, error) => errorResponse(response, error, 498),
  Error:
  (response, error) => errorResponse(response, error, 503),
  // ----------------- DATABASE
  MongooseError:
  (response, { name, message }) =>
    errorResponse(response, { message: 'Error database connection - ' + message, name }, 503),
  CastError:
  (response, error) => errorResponse(response, error),
  MongoError:
    (response, error) => errorResponse(response, error, 502),
  // ----------------- DEFAULT
  default:
  (response, error) => {
    console.error(error.name + ' - ', error)
    errorResponse(response, { ...error, message: 'Default error' })
  }
}

helper.errorHandler = (error, response) => {
  const handler = ERRORS_HANDLERS[error.name] || ERRORS_HANDLERS.default
  handler(response, error)
}

module.exports = helper
