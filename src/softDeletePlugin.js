const softDeletePlugin = (schema) => {
  schema.add({
    deleted: {
      status: {
        type: Boolean,
        required: true,
        default: false,
      },
      at: {
        type: Date,
        default: null,
      },
      by: {
        type: String,
        default: null,
      },
    },
  });

  schema.set("toJSON", {
    transform: function (doc, ret, options) {
      // If the document has been soft-deleted, include the "deleted" field
      if (doc.deleted && doc.deleted.status) {
        return ret;
      }

      // Otherwise, exclude the "deleted" field
      delete ret.deleted;
      return ret;
    },
  });

  schema.static("findAll", async function (query) {
    return this.find({ "deleted.status": { $ne: true } });
  });

  schema.pre("countDocuments", async function (next) {
    if (this.getFilter().deleted && this.getFilter().deleted.status === true) {
      return next();
    }
    this.setQuery({ ...this.getFilter(), "deleted.status": { $ne: true } });
    next();
  });

  schema.pre("count", async function (next) {
    if (this.getFilter().deleted && this.getFilter().deleted.status === true) {
      return next();
    }
    this.setQuery({ ...this.getFilter(), "deleted.status": { $ne: true } });
    next();
  });

  schema.static("findDeleted", async function () {
    return this.find({ "deleted.status": true });
  });

  schema.static("restore", async function (query) {
    const updatedQuery = {
      ...query,
      "deleted.status": true,
    };
    const deletedTemplates = await this.find(updatedQuery);
    if (!deletedTemplates.length) {
      return new Error("Element not found");
    }
    let restored = 0;
    for (const deletedTemplate of deletedTemplates) {
      if (deletedTemplate.deleted.status) {
        deletedTemplate.deleted.status = false;
        deletedTemplate.deleted.at = null;
        deletedTemplate.deleted.by = null;
        await deletedTemplate
          .save()
          .then(() => restored++)
          .catch((e) => {
            throw new Error(e.name + " " + e.message);
          });
      }
    }
    return { restored };
  });

  schema.static("restoreById", async function (id) {
    const updatedQuery = {
      _id: id,
      "deleted.status": true,
    };
    const deletedTemplates = await this.find(updatedQuery);
    if (!deletedTemplates.length) {
      return new Error("Element not found");
    }
    let restored = 0;
    for (const deletedTemplate of deletedTemplates) {
      if (deletedTemplate.deleted.status) {
        deletedTemplate.deleted.status = false;
        deletedTemplate.deleted.at = null;
        deletedTemplate.deleted.by = null;
        await deletedTemplate
          .save()
          .then(() => restored++)
          .catch((e) => {
            throw new Error(e.name + " " + e.message);
          });
      }
    }
    return { restored };
  });

  schema.static("softDelete", async function (query, options, deletedBy) {
    const templates = await this.find(query);
    if (!templates.length) {
      return new Error("Element not found");
    }
    let deleted = 0;
    for (const template of templates) {
      if (!template.deleted.status) {
        template.deleted.status = true;
        template.deleted.at = new Date();
        template.deleted.by = deletedBy || null;
        await template
          .save(options)
          .then(() => deleted++)
          .catch((e) => {
            throw new Error(e.name + " " + e.message);
          });
      }
    }
    return { deleted };
  });

  schema.static("softDeleteById", async function (id, deletedBy) {
    const template = await this.findById(id);

    if (!template) {
      return new Error("Element not found");
    }
    if (!template.deleted.status) {
      template.deleted.status = true;
      template.deleted.at = new Date();
      template.deleted.by = deletedBy || null;
      await template.save().catch((e) => {
        throw new Error(e.name + " " + e.message);
      });

      return { deleted: 1 };
    } else {
      return { deleted: 0, message: "Element already soft-deleted" };
    }
  });
};

module.exports = softDeletePlugin;
