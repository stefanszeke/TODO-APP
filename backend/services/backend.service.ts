
export default class BackendService {

  public setEnvironment(env:string): any {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production')
      if(env === 'users') return "users";
      if(env === 'todos') return "todos";

    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'debug') 
      if(env === 'users') return "users_testing";
      if(env === 'todos') return "todos_testing";


    throw console.error("No of wrong environment set");
    
    }
   

}