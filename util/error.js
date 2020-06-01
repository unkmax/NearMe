module.exports = function(error, exception, statusCode) {
    Error.captureStackTrace(this, this.constructor);
    this.error = error || "Application Error";
    if (process.env.DEBUG == "true")
        this.exception = exception;
    this.statusCode = statusCode || 400;
}

module.exports.Code = {
    PAGE_NOT_FOUND: { message: "page not found", code: "PAGE_NOT_FOUND" },

    UNAUTHORIZED: { message: "Unauthorized", code: "UNAUTHORIZED" },

    DATABASE_ERROR: { message: "Database Error", code: "DATABASE_ERROR" },

    FILE_UPLOAD_ERROR: { message: "File Upload Error", code: "FILE_UPLOAD_ERROR" },

    CACHE_ERROR: { message: "Cache Error", code: "CACHE_ERROR" },
};
  