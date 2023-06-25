import { PrismaClient } from "@prisma/client";
import UserValidation from "./lib/validations/UserValidation";
import GoodValidation from "./lib/validations/GoodValidation";

export default new PrismaClient({

}).$extends({
  query: {
    user: {
      create({args, query}) {
        args.data = UserValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = UserValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = UserValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = UserValidation.parse(args.create);
        args.update = UserValidation.partial().parse(args.update);
        return query(args);
      },
    },
    good: {
      create({args, query}) {
        args.data = GoodValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = GoodValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = GoodValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = GoodValidation.parse(args.create);
        args.update = GoodValidation.partial().parse(args.update);
        return query(args);
      },
    },
  }
});
