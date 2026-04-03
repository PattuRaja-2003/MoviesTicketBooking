import { Inngest } from "inngest";
import userModel from "../models/userModel.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to Create user Data in dateBase
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-creation",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await userModel.insertOne(userData);
  },
);

// Inngest Function to Deleted user Data in dateBase

const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-deletion",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const { id } = event.data;
    await userModel.findByIdAndDelete(id);
  },
);

// Inngest Function to Update user Data in dateBase

const syncUserUpdation = inngest.createFunction(
  {
    id: "sync-user-updation",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await userModel.findByIdAndUpdate(id, userData);
  },
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
