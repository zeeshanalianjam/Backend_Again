export class apiError extends Error {
    constructor(statusCode, data = null, message = "Something went wrong!!", success = false, errors = [], stack){
        super(message)
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = success
        this.errors = errors
     

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}