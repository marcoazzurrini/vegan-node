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

// response handlers
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

export default abstract class Controller {
  public router: Router = Router();
  public abstract path: string;
  protected abstract readonly routes: Array<RouteInt>;

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      try {
        const { localMiddlewares, path } = route;
        for (const middleware of localMiddlewares) {
          this.router.use(path, middleware);
        }
        this.router[route.method](route.path, route.handler.bind(this));
      } catch (err) {
        console.error("not a valid method");
      }
    }

    return this.router;
  };

  protected sendSuccess({
    res,
    data,
    message,
    code,
  }: SendSuccessProps): Response {
    return res.status(code || 200).json({
      message: message || "success",
      data: data,
    });
  }

  protected sendError({
    res,
    code,
    message,
  }: Omit<SendSuccessProps, "data">): Response {
    return res.status(code || 500).json({
      message: message || "internal server error",
    });
  }
}
