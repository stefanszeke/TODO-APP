import supertest from 'supertest';
import 'mocha';
import { expect } from 'chai';
import {app} from '../app'

describe("test", () => {
  it("should succeed", ()=> {
    expect(true).to.equal(true);
  })
})

describe("Get Todos", () => {
  it("get todo by id", async () => {
    const response = await supertest(app).get("/api/todos/1");
    expect(response.status).to.equal(200);
  })
})