import { Response, Request, NextFunction, Router } from "express";

export enum Methods {
  ALL = "all",
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
  OPTIONS = "options",
  HEAD = "head",
}

type MiddlewareInt = (req: Request, res: Response, next: NextFunction) => void;
type HandlerInt = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

interface RouteInt {
  path: string;
  method: Methods;
  handler: HandlerInt;
  localMiddlewares: Array<MiddlewareInt>;
}
interface SendSuccessProps {
  res: Response;
  code?: number;
  data?: object;
  message?: string;
}

type SendSuccess = (props: SendSuccessProps) => Response;
type SendError = (props: Omit<SendSuccessProps, "data">) => Response;

const sendSuccess: SendSuccess = ({ res, data, message }) => {
  return res.status(200).json({
    message: message || "success",
    data: data,
  });
};

const sendError: SendError = ({ res, code, message }) => {
  return res.status(code || 500).json({
    message: message || "internal server error",
  });
};

const setRouteMiddlewares = (router: Router, route: RouteInt) => {
  const { localMiddlewares, path } = route;
  for (const middleware of localMiddlewares) {
    router.use(path, middleware);
  }
};

const setRouteHandler = (router: Router, route: RouteInt) => {
  router[route.method](route.path, route.handler);
};

function setRoutes(this: Controller): Router {
  for (const route of this.routes) {
    try {
      setRouteMiddlewares(this.router, route);
      setRouteHandler(this.router, route);
    } catch (err) {
      console.error("not a valid method");
    }
  }

  return this.router;
}

export default abstract class Controller {
  public router: Router = Router();
  public abstract path: string;
  protected abstract readonly routes: Array<RouteInt>;

  public setRoutes = setRoutes;

  protected sendSuccess = sendSuccess;

  protected sendError = sendError;
}

// protected sendSuccess({
//   res,
//   code,
//   data,
//   message,
// }: SendSuccessProps): Response {
//   return res.status(code || 200).json({
//     message: message || "success",
//     data: data,
//   });
// }

// protected sendError(
//   res: Response,
//   code?: number,
//   message?: string
// ): Response {
//   return res.status(code || 500).json({
//     message: message || "internal server error",
//   });
// }

// const { localMiddlewares, path, method, handler } = route;
// for (const middleware of localMiddlewares) {
//   this.router.use(path, middleware);
// }
