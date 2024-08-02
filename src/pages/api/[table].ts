import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const table = req.query.table as string;

  switch (req.method) {
    case "PUT":
      try {
        // @ts-expect-error
        const data = await prisma[table].create({data: req.body});
        res.status(200).json(data);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "PATCH":
      try {
        if (!req.query.id) throw "Parameter 'id' is required!";
        // @ts-expect-error
        const data = await prisma[table].update({
          where: {id: req.query.id},
          data: req.body,
        });
        res.status(200).json(data);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "GET":
      try {
        let data = null;
        if (req.query.id) {
          // @ts-expect-error
          data = await prisma[table].findUnique({
            where: {id: req.query.id},
            ...req.body,
          });
        } else {
          // @ts-expect-error
          data = await prisma[table].findMany(req.body);
        }
        if (data !== null) {
          res.status(200).json(data);
        } else {
          res.status(404).send("Not found!");
        }
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    case "DELETE":
      try {
        if (!req.query.id) throw "Parameter 'id' is required!";
        // @ts-expect-error
        const data = await prisma[table].delete({
          where: {id: req.query.id},
        });
        res.status(200).json(data);
      } catch (error) {
        res.status(404).send("Not found!");
      }
      break;
    default:
      res.status(405).json("Method not allowed!");
      break;
  }
}
