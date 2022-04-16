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

function setRoutes(this: Controller): Router {
  for (const route of this.routes) {
    const { localMiddlewares, path, method, handler } = route;
    for (const middleware of localMiddlewares) {
      this.router.use(path, middleware);
    }
    try {
      this.router[method](path, handler);
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

  protected sendSuccess(
    res: Response,
    data?: object,
    message?: string
  ): Response {
    return res.status(200).json({
      message: message || "success",
      data: data,
    });
  }

  protected sendError(res: Response, message?: string): Response {
    return res.status(500).json({
      message: message || "internal server error",
    });
  }
}

// function sendSuccess(res: Response, data: object, message?: string): Response {
//     return res.status(200).json({
//       message: message || "success",
//       data: data,
//     });
//   }
