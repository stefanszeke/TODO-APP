
export default class BackendService {

  public setEnvironment(): string | undefined {
    if (process.env.NODE_ENV === 'production') return "users";
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'debug') return "users_testing";
  }

}