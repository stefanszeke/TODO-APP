// i'd expect this file in "tests" folder or similar. not a huge problem really
import supertest from 'supertest';
import 'mocha';
import { expect } from 'chai';
import { app } from '../app'
import { Database } from '../database/database'

const database = Database.getInstance();

describe("test", () => {
  it("should succeed", ()=> {
    // test of a test? :)
    expect(true).to.equal(true);
  })
})

describe("Users", () => {
  it("register new user", async () => {
    const response = await supertest(app).post("/api/users/register")
      .send({
        name: "test",
        email: "test@mail.com",
        password: "password",
        confirm: "password",
      })

    expect(response.body).to.eql({message: 'User created'});
  })

  it("login user", async () => {
    const response = await supertest(app).post("/api/users/login")
      .send({
        email: "test@mail.com",
        password: "password",
      })
    expect(response.body).to.eql({message: "User logged in"})
  })

  
  it("find and delete User", async () => {
    let sqlFind = `SELECT * FROM users_testing WHERE email = ?`;
    // sad that we can't use a type here instead of any, or can we?
    const user: any = await database.useMySql(sqlFind,["test@mail.com"])

    const response = await supertest(app).delete(`/api/users/${user[0].id}`);

    expect(response.body).to.eql({message: 'User deleted'});
  })

})