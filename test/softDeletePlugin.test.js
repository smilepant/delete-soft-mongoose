const { mongoose } = require("mongoose");
const softDeletePlugin = require("../src/softDeletePlugin");

const UserSchema = new mongoose.Schema({
  name: String,
});
UserSchema.plugin(softDeletePlugin);
const userModel = mongoose.model("User", UserSchema);

describe("Soft Delete Plugin Tests", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await userModel.deleteMany();
  });

  test("softDelete should be successed", async () => {
    // create one user
    const user = await new userModel({ name: "hari" }).save();
    expect(user.name).toBe("hari");

    // get this user before we perform soft delete
    const userBeforeDelete = await userModel.find({ _id: user._id });
    expect(userBeforeDelete?.length).toBe(1);

    // perform soft delete
    const softDeleteResp = await userModel.softDelete(
      { _id: user._id },
      {},
      "Test"
    );
    expect(softDeleteResp.deleted).toBe(1);

    // get this user after we performed soft delete
    const userAfterDelete = await userModel.findAll({ _id: user._id });
    expect(userAfterDelete?.length).toBe(0);
  });

  test("softDeleteById should be successed", async () => {
    // create one user
    const user = await new userModel({ name: "hari" }).save();
    expect(user.name).toBe("hari");

    // perform soft delete
    const softDeleteResp = await userModel.softDeleteById(user._id, "Test");
    expect(softDeleteResp.deleted).toBe(1);

    // get this user after we performed soft delete
    const userAfterDelete = await userModel.findAll({ _id: user._id });
    expect(userAfterDelete?.length).toBe(0);

    // get soft deleted user
    const deletedUsers = await userModel.findDeleted();
    expect(deletedUsers.length).toBe(1);
  });

  test("findAll should be successed", async () => {
    // create one user
    const user = await new userModel({ name: "hari" }).save();
    expect(user.name).toBe("hari");
    // perform soft delete
    const softDeleteResp = await userModel.softDelete(
      { _id: user._id },
      {},
      "Test"
    );
    expect(softDeleteResp.deleted).toBe(1);

    // get this user after we performed soft delete
    const usersAfterDelete = await userModel.findAll({ _id: user._id });
    expect(usersAfterDelete.length).toBe(0);
  });

  test("find should be successed", async () => {
    // create one user
    const user = await new userModel({ name: "hari" }).save();
    expect(user.name).toBe("hari");
    // perform soft delete
    const softDeleteResp = await userModel.softDelete(
      { _id: user._id },
      {},
      "Test"
    );
    expect(softDeleteResp.deleted).toBe(1);

    // get this user after we performed soft delete
    const usersAfterDelete = await userModel.find({ _id: user._id });
    expect(usersAfterDelete.length).toBe(1);
  });

  test("restore should be successed", async () => {
    // create one user
    const user = await new userModel({ name: "hari" }).save();
    expect(user.name).toBe("hari");

    // perform soft delete
    const softDeleteResp = await userModel.softDelete({ _id: user._id });
    expect(softDeleteResp.deleted).toBe(1);

    // get this user after we performed soft delete
    const userAfterDelete = await userModel.findAll({ _id: user._id });
    expect(userAfterDelete?.length).toBe(0);

    // restore this user
    const restoreResp = await userModel.restore({ _id: user._id });
    expect(restoreResp.restored).toBe(1);

    // get this user after we perform restore
    const userAfterRestore = await userModel.find({ _id: user._id });
    expect(userAfterRestore?.length).toBe(1);
  });

  test("restoreById should be successed", async () => {
    // create one user
    const user = await new userModel({ name: "hari" }).save();
    expect(user.name).toBe("hari");

    // perform soft delete
    const softDeleteResp = await userModel.softDelete({ _id: user._id });
    expect(softDeleteResp.deleted).toBe(1);

    // get this user after we performed soft delete
    const userAfterDelete = await userModel.findAll({ _id: user._id });
    expect(userAfterDelete?.length).toBe(0);

    // restore this user
    const restoreResp = await userModel.restoreById(user._id);
    expect(restoreResp.restored).toBe(1);

    // get this user after we perform restore
    const userAfterRestore = await userModel.find({ _id: user._id });
    expect(userAfterRestore?.length).toBe(1);
  });

  test("findDeleted should be successed", async () => {
    // create one user
    const user = await new userModel({ name: "hari" }).save();
    expect(user.name).toBe("hari");

    // perform soft delete
    const softDeleteResp = await userModel.softDelete({ _id: user._id });
    expect(softDeleteResp.deleted).toBe(1);

    // get this user after we performed soft delete
    const userAfterDelete = await userModel.findAll({ _id: user._id });
    expect(userAfterDelete?.length).toBe(0);

    // get soft deleted user
    const deletedUsers = await userModel.findDeleted();
    expect(deletedUsers.length).toBe(1);
  });
});
