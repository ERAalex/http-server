class Ticket {
    constructor(id, name, description) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.status = false;
      this.created = new Date(Date.now()).toLocaleString();
    }
  
    toggleStatus() {
      this.status = !this.status;
    }
  
    edit(name, description) {
      if (name) {
        this.name = name;
      }
      if (description) {
        this.description = description;
      }
    }
  }
  


//   Ticket storage class

  class TicketsStorage {
    constructor() {
      this.tickets = [];
    }
  
    setId() {
      if (this.tickets.length === 0) {
        return 1;
      } else {
        return this.tickets[this.tickets.length - 1].id + 1;
      }
    }
  
    allTickets() {
      const allTickets = [];
      if (this.tickets.length === 0) {
        return [];
      }
      for (const ticket of this.tickets) {
        const { id, name, status, created } = ticket;
        allTickets.push({ id, name, status, created });
      }
      return allTickets;
    }

    createTicket(name, description) {
        const newTicket = new Ticket(this.setId(), name, description);
        this.tickets.push(newTicket);
        return newTicket;
      }
      
    ticketById(id) {
      return this.tickets.find((el) => el.id === id);
    }
  
    deleteTicket(id) {
        const ticket = this.ticketById(id);
        if (ticket) {
          this.tickets.splice(this.tickets.indexOf(ticket), 1);
          return true;
        } else {
          return false;
        }
      }
    

    editTicket(id, name, description) {
      const ticket = this.ticketById(id);
      if (ticket) {
        ticket.edit(name, description);
        return ticket;
      } else {
        return false;
      }
    }
  }
  
  module.exports = { TicketsStorage };
