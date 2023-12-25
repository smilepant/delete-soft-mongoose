# Mongoose Soft Delete Plugin

This Mongoose plugin provides soft deletion functionality for MongoDB, allowing you to mark documents as deleted without physically removing them from the database.

## Installation

```bash
npm install delete-soft-mongoose
```

## Usage

1. Import the plugin in your Mongoose schema file.

   ```javascript
   const softDeletePlugin = require('delete-soft-mongoose');
   ```

2. Apply the plugin to your schema.

   ```javascript
   const YourSchema = new mongoose.Schema({
     // ... your schema fields
   });

   YourSchema.plugin(softDeletePlugin);
   ```

3. Your schema will now have a `deleted` field with `status`, `at`, and `by` properties.

   ```javascript
   const exampleDocument = new YourModel({
     // ... your document fields
   });

   // Soft delete document
   await exampleDocument.softDelete();
   ```

## Methods

### `softDelete(query, options, deletedBy)`

Soft deletes documents based on the provided query.

- `query`: The query to find documents to soft-delete.
- `options`: Options to pass to the `save` method.
- `deletedBy`: The user or entity performing the soft deletion.

Returns an object with the count of soft-deleted documents.

### `softDeleteById(id, deletedBy)`

Soft deletes a document by its ID.

- `id`: The ID of the document to soft-delete.
- `deletedBy`: The user or entity performing the soft deletion.

Returns an object with the count of soft-deleted documents and a message.

### `restore(query)`

Restores soft-deleted documents based on the provided query.

- `query`: The query to find documents to restore.

Returns an object with the count of restored documents.

### `restoreById(id)`

Restores a soft-deleted document by its ID.

- `id`: The ID of the document to restore.

Returns an object with the count of restored documents and a message.

### `findAll(query)`

Finds all documents that are not marked as deleted.

- `query`: Additional query parameters.

Returns an array of documents.

### `findDeleted(query)`

Finds all documents that are marked as deleted.

- `query`: Additional query parameters.

Returns an array of documents.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Inspired by the need for soft deletion in MongoDB.

## Contributing

Simply fork and send pull request.

## Issues

Please use the [issue tracker](https://github.com/yourusername/your-repository/issues) to report any issues.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/yourusername/your-repository/tags).

## Authors

- Smile Pant

## Acknowledgments
..........................

---
