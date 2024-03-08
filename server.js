const http = require("http");
const Koa = require("koa");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const { TicketsStorage } = require("./models");

const ticketStorage = new TicketsStorage();

const app = new Koa();

app.use(cors());

app.use(
  koaBody({
    urlencoded: true,
    multipart: true,
  })
);

app.use(async (ctx) => {
  const requestQuery = ctx.request.query;
  console.log(requestQuery);
  const requestBody = ctx.request.body;
  let method, id, name, description;
  if (requestQuery) {
    method = requestQuery.method;
    id = requestQuery.id;
  }
  if (requestBody) {
    name = requestBody.name;
    description = requestBody.description;
  }

  let ticket;

  switch (method) {

    case "allTickets":
        // http://localhost:7070/?method=allTickets
      ctx.response.body = ticketStorage.allTickets();
      console.log('--GET all Tickets--');
      ctx.response.status = 200;
      return;

    case "ticketById":
        // ?method=ticketById&id=${id}
      ticket = ticketStorage.ticketById(Number(id));
      console.log('--GET Ticket by ID--');
      if (ticket) {
        ctx.response.body = ticket;
        ctx.response.status = 200;
      } else {
        ctx.response.body = "Not found";
        ctx.response.status = 404;
      }
      return;

    case "createTicket":
        // ?method=createTicket
      ctx.response.body = ticketStorage.createTicket(name, description);
      console.log('--Create Ticket--');
      ctx.response.status = 201;
      return;

    case "changeStatus":
        // ?method=changeStatus&id=${id}
      ticket = ticketStorage.ticketById(Number(id));
      console.log('--Change Ticket Status by ID--');
      if (ticket) {
        ticket.toggleStatus();
        ctx.response.body = ticket;
        ctx.response.status = 200;
      } else {
        ctx.response.body = "Not found";
        ctx.response.status = 404;
      }
      return;

    case "editTicket":
        // ?method=editTicket&id=${id}
        console.log('--Edit Ticket by ID--');
      ticket = ticketStorage.editTicket(Number(id), name, description);
      if (ticket) {
        ctx.response.body = ticket;
        ctx.response.status = 204;
      } else {
        ctx.response.body = "Not found";
        ctx.response.status = 404;
      }
      return;

    case "deleteTicket":
        // ?method=deleteTicket&id=${id}
        console.log('--Delete Ticket by ID--');
      if (ticketStorage.deleteTicket(Number(id))) {
        ctx.response.body = "OK";
        ctx.response.status = 204;
      } else {
        ctx.response.body = "Not found";
        ctx.response.status = 404;
      }
      return;
    default:
      ctx.response.status = 404;
  }
});


const server = http.createServer(app.callback());
const port = 7070;
server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Server is listening to " + port);
});
