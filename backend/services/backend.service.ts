
export default class BackendService {

  public setEnvironment(): any {
    if (process.env.NODE_ENV === 'production') return "users";
    if (process.env.NODE_ENV === 'test') return "users_testing";
  }

}