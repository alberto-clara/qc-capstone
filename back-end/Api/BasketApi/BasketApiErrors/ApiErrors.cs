using System.Net;

namespace BasketApi.BasketApiErrors
{
	public class ApiError
	{
	    public int StatusCode { get; private set; }
        public string StatusDescription { get; private set; }
        public string Message { get; private set; }

        public ApiError(int statusCode, string statusDescription)
        {
            this.StatusCode = statusCode;
            this.StatusDescription = statusDescription;
        }

        public ApiError(int statusCode, string statusDescription, string message) : this(statusCode, statusDescription)
        {
            this.Message = message;
        }
	}

    public class NotFoundError : ApiError
    {
        public NotFoundError() 
            : base(404, HttpStatusCode.NotFound.ToString())
        {

        }

        public NotFoundError(string message)
            : base(404, HttpStatusCode.NotFound.ToString(), message)
        {

        }
    }

    public class BadRequestError : ApiError
    {
        public BadRequestError()
            : base(400, HttpStatusCode.BadRequest.ToString())
        {

        }

        public BadRequestError(string message)
            : base(400, HttpStatusCode.BadRequest.ToString(), message)
        {

        }
    }

    public class ConflictError : ApiError
    {
        public ConflictError()
            : base(409, HttpStatusCode.Conflict.ToString())
        {

        }

        public ConflictError(string message)
            : base(409, HttpStatusCode.Conflict.ToString(), message)
        {

        }
    }

    public class ServiceUnavailableError : ApiError
    {
        public ServiceUnavailableError()
            : base(503, HttpStatusCode.ServiceUnavailable.ToString())
        {

        }

        public ServiceUnavailableError(string message)
            : base(503, HttpStatusCode.ServiceUnavailable.ToString(), message)
        {

        }
    }
}
