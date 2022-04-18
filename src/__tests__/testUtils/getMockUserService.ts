import UserService from "../../services/UserService";

export interface UserServiceMethodsInt {
  login?: unknown;
  register?: unknown;
  updatePassword?: unknown;
  deleteUser?: unknown;
}

const getMockMethod = (response?: unknown) => {
  const method = jest.fn().mockImplementation(() => response);
  return method;
};

const getAllMockMethods = (methodsResponse?: UserServiceMethodsInt) => {
  const login = getMockMethod(methodsResponse?.login);
  const register = getMockMethod(methodsResponse?.register);
  const updatePassword = getMockMethod(methodsResponse?.updatePassword);
  const deleteUser = getMockMethod(methodsResponse?.deleteUser);
  return { login, register, updatePassword, deleteUser };
};

const getUserService = (methods: UserServiceMethodsInt) => {
  return jest
    .fn()
    .mockImplementation(() => methods) as unknown as typeof UserService;
};

const getMockUserService = (methodsResponse?: UserServiceMethodsInt) => {
  const methods = getAllMockMethods(methodsResponse);
  const MockUserService = getUserService(methods);

  return { MockUserService, methods };
};

export default getMockUserService;
